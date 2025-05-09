// src/pages/CollectionPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getCollection, deleteFromCollection, updateCondition } from '../api';
import VinylCrateItem from '../components/VinylCrateItem';
import AlbumDetailModal from '../components/AlbumDetailModal'; // Import the modal
import VinylStack from '../components/VinylStack';
import { motion } from 'framer-motion';

function CollectionPage() {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null); // State for modal
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
    // Check if logged in before fetching
    if (localStorage.getItem('spotify_access_token')) {
        fetchCollection();
    } else {
        setError("Please log in to view your collection.");
        setLoading(false);
    }
  }, [fetchCollection]);

  // Add in_collection flag to all albums in collection
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
    // Optimistic UI update: Remove immediately
    const originalCollection = [...collection];
    const updatedCollection = collection.filter((_, index) => index !== indexToRemove);
    setCollection(updatedCollection);

    try {
      await deleteFromCollection(indexToRemove);
      // Success - state is already updated
      // Close modal if the removed album was selected
      if (selectedAlbum && collection[indexToRemove].id === selectedAlbum.id) {
        setSelectedAlbum(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.error || "Failed to remove album.");
      // Revert UI if delete failed
      setCollection(originalCollection);
    }
  };

  const handleAlbumClick = (album) => {
    // Ensure in_collection is set when opening modal
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

  // Simple check for login status
  const isLoggedIn = !!localStorage.getItem('spotify_access_token');
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  if (!isLoggedIn && !loading) {
    return (
      <div className="container mx-auto p-4 min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
         <h1 className="text-3xl font-bold mb-6 text-center text-green-400">My Vinyl Collection</h1>
         <div className="text-center mb-6 p-4 bg-yellow-800 border border-yellow-600 rounded-lg max-w-md">
           <p className="font-semibold">You need to log in first.</p>
           <p className="text-sm mb-3">Log in via Spotify to see your awesome collection!</p>
           <a
             href={`${backendUrl}/`} // Link to your backend's login route
             className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
           >
             Login with Spotify
           </a>
           <p className="mt-4 text-sm">
            Or go to the <Link to="/search" className="text-green-400 hover:underline">Search Page</Link>.
           </p>
         </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-vinyl-dark">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-vinyl-accent rounded-full border-t-transparent"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-vinyl-dark text-vinyl-light">
        <h2 className="text-2xl font-bold mb-4">Oops!</h2>
        <p className="text-vinyl-light/80">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-green-400">My Vinyl Collection</h1>

        {/* Display Mode Toggle and Search Link */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <div className="flex items-center bg-vinyl-primary rounded-lg p-1">
            <button
              onClick={() => handleDisplayModeChange('stack')}
              className={`px-4 py-2 rounded-md transition-colors ${
                displayMode === 'stack'
                  ? 'bg-vinyl-accent text-white'
                  : 'text-vinyl-light/60 hover:text-vinyl-light'
              }`}
            >
              Stack View
            </button>
            <button
              onClick={() => handleDisplayModeChange('grid')}
              className={`px-4 py-2 rounded-md transition-colors ${
                displayMode === 'grid'
                  ? 'bg-vinyl-accent text-white'
                  : 'text-vinyl-light/60 hover:text-vinyl-light'
              }`}
            >
              Grid View
            </button>
          </div>
          <Link
            to="/search"
            className="text-vinyl-accent hover:text-vinyl-light transition-colors"
          >
            + Add more albums
          </Link>
        </div>

        {collection.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-vinyl-light/60">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <p className="text-xl">Your collection is empty</p>
            <p className="mt-2">Start adding some vinyl records!</p>
          </div>
        ) : (
          <motion.div
            key={displayMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        )}
      </motion.div>

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