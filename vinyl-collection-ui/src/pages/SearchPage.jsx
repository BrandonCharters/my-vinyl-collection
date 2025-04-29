// src/pages/SearchPage.jsx
import React, { useState, useCallback } from 'react';
import { searchAlbums, addToCollection } from '../api';
import AlbumCard from '../components/AlbumCard';
import AlbumDetailModal from '../components/AlbumDetailModal';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

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

    if (album.in_collection) {
      setError(`"${album.name}" is already in your collection`);
      return;
    }

    try {
      const response = await addToCollection(album);
      console.log("Add response:", response.data);
      setAddSuccess(`"${album.name}" added to your collection!`);
      
      // Update the local state to mark this album as in collection
      setResults(prevResults => 
        prevResults.map(result => 
          result.id === album.id ? { ...result, in_collection: true } : result
        )
      );
      
      // If the modal is open for this album, update the selected album too
      if (selectedAlbum?.id === album.id) {
        setSelectedAlbum(prev => ({ ...prev, in_collection: true }));
      }
      
      setTimeout(() => setAddSuccess(null), 3000);
    } catch (err) {
      console.error("Add to collection error:", err);
      if (err.response?.status === 400 && err.response?.data?.error === "Album already exists in collection") {
        setResults(prevResults => 
          prevResults.map(result => 
            result.id === album.id ? { ...result, in_collection: true } : result
          )
        );
        if (selectedAlbum?.id === album.id) {
          setSelectedAlbum(prev => ({ ...prev, in_collection: true }));
        }
        setError(`"${album.name}" is already in your collection`);
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

  // Check if logged in (simple check for token existence)
  const isLoggedIn = !!localStorage.getItem('spotify_access_token');
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-400">Search for Albums</h1>

      {!isLoggedIn && (
         <div className="text-center mb-6 p-4 bg-yellow-800 border border-yellow-600 rounded-lg">
           <p className="font-semibold">You are not logged in.</p>
           <p className="text-sm mb-3">Please log in via Spotify to search and manage your collection.</p>
           <a
             href={`${backendUrl}/`}
             className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
           >
             Login with Spotify
           </a>
         </div>
      )}

      <form onSubmit={handleSearch} className="mb-8 flex justify-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search album name or artist..."
          className="p-2 rounded-l-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 w-full max-w-md"
          disabled={!isLoggedIn}
        />
        <button
          type="submit"
          className={`p-2 bg-green-600 hover:bg-green-700 text-white rounded-r-md font-semibold transition-colors ${!isLoggedIn || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!isLoggedIn || loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {addSuccess && <p className="text-green-500 text-center mb-4">{addSuccess}</p>}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((album, index) => (
            <AlbumCard
              key={`${album.spotify_url}-${index}`}
              album={album}
              onAdd={handleAddToCollection}
              onClick={() => handleAlbumClick(album)}
            />
          ))}
        </div>
      )}

      {/* Album Detail Modal */}
      <AlbumDetailModal
        album={selectedAlbum}
        isOpen={!!selectedAlbum}
        onClose={handleCloseModal}
        onAdd={handleAddToCollection}
      />
    </div>
  );
}

export default SearchPage;