// src/pages/CollectionPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getCollection, deleteFromCollection, updateCondition } from '../api';
import VinylCrateItem from '../components/VinylCrateItem';
import AlbumDetailModal from '../components/AlbumDetailModal';
import VinylStack from '../components/VinylStack';

function CollectionPage() {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [displayMode, setDisplayMode] = useState(() => 
    localStorage.getItem('vinylDisplayMode') || 'stack'
  );

  const fetchCollection = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCollection();
      setCollection(response.data || []);
    } catch (err) {
      console.error("Fetch collection error:", err);
      setError(err.response?.data?.error || "Failed to load collection. Are you logged in?");
      if (err.response?.status === 401) {
         // Optionally clear token if unauthorized
         // localStorage.removeItem('spotify_access_token');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('spotify_access_token')) {
        fetchCollection();
    } else {
        setError("Please log in to view your collection.");
        setLoading(false);
    }
  }, [fetchCollection]);

  useEffect(() => {
    if (collection.length > 0) {
      setCollection(collection.map(album => ({ ...album, in_collection: true })));
    }
  }, []);

  const handleDisplayModeChange = (mode) => {
    setDisplayMode(mode);
    localStorage.setItem('vinylDisplayMode', mode);
  };

  const handleRemove = async (indexToRemove) => {
    const originalCollection = [...collection];
    const updatedCollection = collection.filter((_, index) => index !== indexToRemove);
    setCollection(updatedCollection);

    try {
      await deleteFromCollection(indexToRemove);
      if (selectedAlbum && collection[indexToRemove].id === selectedAlbum.id) {
        setSelectedAlbum(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.error || "Failed to remove album.");
      setCollection(originalCollection);
    }
  };

  const handleAlbumClick = (album) => {
    setSelectedAlbum({ ...album, in_collection: true });
  };

  const handleCloseModal = () => {
    setSelectedAlbum(null);
  };

  const handleUpdateCondition = async (albumId, newCondition) => {
    await updateCondition(albumId, newCondition);
    setCollection(prev => prev.map(album => album.id === albumId ? { ...album, condition: newCondition } : album));
    if (selectedAlbum && selectedAlbum.id === albumId) {
      setSelectedAlbum(prev => ({ ...prev, condition: newCondition }));
    }
  };

  const isLoggedIn = !!localStorage.getItem('spotify_access_token');
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  if (!isLoggedIn && !loading) {
    return (
      <div className="container mx-auto p-4 min-h-screen">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl font-bold mb-6 text-center text-primary">My Vinyl Collection</h1>
            <div className="alert alert-warning">
              <div>
                <h3 className="font-bold">You need to log in first.</h3>
                <div className="text-sm">Log in via Spotify to see your awesome collection!</div>
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
            <div className="text-center mt-4">
              <p className="text-sm">
                Or go to the <Link to="/search" className="link link-primary">Search Page</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold text-error">Oops!</h2>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div>
            <h1 className="card-title text-3xl font-bold mb-6 text-center text-primary">My Vinyl Collection</h1>

            {/* Display Mode Toggle and Search Link */}
            <div className="flex justify-center items-center gap-6 mb-8">
              <div className="join">
                <button
                  onClick={() => handleDisplayModeChange('stack')}
                  className={`join-item btn ${displayMode === 'stack' ? 'btn-primary' : 'btn-ghost'}`}
                >
                  Stack View
                </button>
                <button
                  onClick={() => handleDisplayModeChange('grid')}
                  className={`join-item btn ${displayMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
                >
                  Grid View
                </button>
              </div>
              <Link
                to="/search"
                className="btn btn-outline btn-primary"
              >
                + Add more albums
              </Link>
            </div>

            {collection.length === 0 ? (
              <div className="hero bg-base-200 rounded-box">
                <div className="hero-content text-center">
                  <div className="max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <h2 className="text-xl font-bold">Your collection is empty</h2>
                    <p className="py-4">Start adding some vinyl records!</p>
                  </div>
                </div>
              </div>
            ) : (
              <div key={displayMode}>
                {displayMode === 'stack' ? (
                  <div className="relative">
                    <VinylStack albums={collection} onAlbumClick={handleAlbumClick} />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {collection.map((album, index) => (
                      <VinylCrateItem
                        key={`${album.spotify_url}-${index}`}
                        album={album}
                        index={index}
                        onRemove={handleRemove}
                        onClick={handleAlbumClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <AlbumDetailModal
        album={selectedAlbum}
        isOpen={!!selectedAlbum}
        onClose={handleCloseModal}
        onRemove={() => {
          const index = collection.findIndex(a => a.id === selectedAlbum.id);
          if (index !== -1) {
            handleRemove(index);
          }
        }}
        onUpdateCondition={handleUpdateCondition}
      />
    </div>
  );
}

export default CollectionPage;