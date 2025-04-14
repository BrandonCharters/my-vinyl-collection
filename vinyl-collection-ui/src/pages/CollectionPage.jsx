// src/pages/CollectionPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getCollection, deleteFromCollection } from '../api';
import VinylCrateItem from '../components/VinylCrateItem';
import AlbumDetailModal from '../components/AlbumDetailModal'; // Import the modal

function CollectionPage() {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null); // State for modal

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

  const handleRemove = async (indexToRemove) => {
    // Optimistic UI update: Remove immediately
    const originalCollection = [...collection];
    const updatedCollection = collection.filter((_, index) => index !== indexToRemove);
    setCollection(updatedCollection);

    try {
      await deleteFromCollection(indexToRemove);
      // Success - state is already updated
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.error || "Failed to remove album.");
      // Revert UI if delete failed
      setCollection(originalCollection);
    }
  };

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
  };

  const handleCloseModal = () => {
    setSelectedAlbum(null);
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


  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-400">My Vinyl Collection</h1>

      {/* Link to Search Page */}
      <div className="text-center mb-6">
        <Link to="/search" className="text-green-400 hover:text-green-300 hover:underline">
          + Add more albums
        </Link>
      </div>

      {loading && <p className="text-center animate-pulse">Loading collection...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && collection.length === 0 && (
        <p className="text-center text-gray-400">
          Your collection is empty. Go <Link to="/search" className="text-green-400 hover:underline">search</Link> for some vinyls!
        </p>
      )}

      {!loading && !error && collection.length > 0 && (
        // The "Crate" - using grid layout
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
          {collection.map((album, index) => (
            <VinylCrateItem
              key={`${album.spotify_url}-${index}`} // Assuming spotify_url is unique enough with index
              album={album}
              index={index}
              onRemove={handleRemove}
              onClick={handleAlbumClick} // Pass click handler
            />
          ))}
        </div>
      )}

      {/* Modal Component */}
      <AlbumDetailModal album={selectedAlbum} onClose={handleCloseModal} />
    </div>
  );
}

export default CollectionPage;