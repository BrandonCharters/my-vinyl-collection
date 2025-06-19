// src/pages/SearchPage.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { searchAlbums, addToCollection, updateCondition, getCollection } from '../api';
import AlbumCard from '../components/AlbumCard';
import AlbumDetailModal from '../components/AlbumDetailModal';

function SearchPage() {
  // Initialize state from localStorage
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem('searchPageState')) || {};
    } catch { return {}; }
  })();
  const [query, setQuery] = useState(saved.query || '');
  const [results, setResults] = useState(saved.results || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(null);
  const [justAddedAlbumId, setJustAddedAlbumId] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(saved.selectedAlbum || null);

  // Persist state to localStorage on change
  useEffect(() => {
    localStorage.setItem('searchPageState', JSON.stringify({ query, results, selectedAlbum }));
  }, [query, results, selectedAlbum]);

  // Sync collection status on mount
  useEffect(() => {
    async function syncCollectionStatus() {
      try {
        const response = await getCollection();
        const collection = response.data || [];
        setResults(prevResults =>
          prevResults.map(album => ({
            ...album,
            in_collection: collection.some(col => col.id === album.id)
          }))
        );
      } catch (err) {
        // Optionally handle error
      }
    }
    if (results.length > 0) {
      syncCollectionStatus();
    }
  }, []);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setAddSuccess(null);
    setSelectedAlbum(null); // Clear selected album on new search

    try {
      const response = await searchAlbums(query);
      setResults(response.data || []);
      if (response.data.length === 0) {
        setError("No albums found for your query.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err.response?.data?.error || "Failed to search albums. Make sure you are logged in or the backend is running.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleAddToCollection = async (album) => {
    setAddSuccess(null);
    setError(null);
    setJustAddedAlbumId(null);

    // Always open the modal for condition selection
    setSelectedAlbum(album);
  };

  // Add a new handler for confirming add from the modal
  const handleConfirmAddToCollection = async (albumWithCondition) => {
    setAddSuccess(null);
    setError(null);
    setJustAddedAlbumId(null);

    if (albumWithCondition.in_collection) {
      setError(`"${albumWithCondition.name}" is already in your collection`);
      return;
    }

    try {
      const response = await addToCollection(albumWithCondition);
      setResults(prevResults => 
        prevResults.map(result => 
          result.id === albumWithCondition.id 
            ? { ...result, in_collection: true, condition: albumWithCondition.condition } 
            : result
        )
      );
      if (selectedAlbum?.id === albumWithCondition.id) {
        setSelectedAlbum(prev => ({ ...prev, in_collection: true, condition: albumWithCondition.condition }));
      }
      setJustAddedAlbumId(albumWithCondition.id);
      setTimeout(() => setJustAddedAlbumId(null), 1200);
      setSelectedAlbum(null);
    } catch (err) {
      console.error("Add to collection error:", err);
      if (err.response?.status === 400 && err.response?.data?.error === "Album already exists in collection") {
        setResults(prevResults => 
          prevResults.map(result => 
            result.id === albumWithCondition.id ? { ...result, in_collection: true } : result
          )
        );
        if (selectedAlbum?.id === albumWithCondition.id) {
          setSelectedAlbum(prev => ({ ...prev, in_collection: true }));
        }
        setError(`"${albumWithCondition.name}" is already in your collection`);
      } else {
        setError(err.response?.data?.error || "Failed to add album. Are you logged in?");
      }
    }
  };

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
  };

  const handleCloseModal = () => {
    setSelectedAlbum(null);
  };

  const handleUpdateCondition = async (albumId, newCondition) => {
    setResults(prev => prev.map(album => album.id === albumId ? { ...album, condition: newCondition } : album));
    if (selectedAlbum && selectedAlbum.id === albumId) {
      setSelectedAlbum(prev => ({ ...prev, condition: newCondition }));
    }
    await updateCondition(albumId, newCondition);
  };

  // Check if logged in (simple check for token existence)
  const isLoggedIn = !!localStorage.getItem('spotify_access_token');
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl font-bold mb-6 text-center text-primary">Search for Albums</h1>

          {!isLoggedIn && (
            <div className="alert alert-warning mb-6">
              <div>
                <h3 className="font-bold">You are not logged in.</h3>
                <div className="text-sm">Please log in via Spotify to search and manage your collection.</div>
              </div>
              <div className="flex-none">
                <a
                  href={`${backendUrl}/`}
                  className="btn btn-primary"
                >
                  Login with Spotify
                </a>
              </div>
            </div>
          )}

          <form onSubmit={handleSearch} className="mb-8 flex justify-center gap-2">
            <div className="join w-full max-w-md">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search album name or artist..."
                className="input input-bordered join-item w-full"
                disabled={!isLoggedIn}
              />
              <button
                type="submit"
                className={`btn btn-primary join-item ${!isLoggedIn || loading ? 'btn-disabled' : ''}`}
                disabled={!isLoggedIn || loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((album, index) => (
                <AlbumCard
                  key={`${album.spotify_url}-${index}`}
                  album={album}
                  onAdd={handleAddToCollection}
                  onClick={() => handleAlbumClick(album)}
                  justAdded={album.id === justAddedAlbumId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Album Detail Modal */}
      <AlbumDetailModal
        album={selectedAlbum}
        isOpen={!!selectedAlbum}
        onClose={handleCloseModal}
        onAdd={handleConfirmAddToCollection}
        onUpdateCondition={handleUpdateCondition}
      />
    </div>
  );
}

export default SearchPage;