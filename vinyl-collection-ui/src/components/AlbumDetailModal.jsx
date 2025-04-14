// src/components/AlbumDetailModal.jsx
import React from 'react';

function AlbumDetailModal({ album, onClose }) {
  if (!album) return null;

  const { name, artist, release_date, cover_url, spotify_url } = album;

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close modal when clicking backdrop
    >
      {/* Modal Content */}
      <div
        className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full text-white relative animate-fade-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl leading-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="flex flex-col sm:flex-row gap-4">
          <img
            src={cover_url || 'https://via.placeholder.com/150?text=No+Cover'}
            alt={`${name} cover`}
            className="w-full sm:w-1/3 h-auto object-cover aspect-square rounded"
          />
          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-1">{name}</h2>
            <h3 className="text-lg text-gray-300 mb-2">{artist}</h3>
            <p className="text-sm text-gray-400 mb-4">Released: {release_date}</p>
            <a
              href={spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Listen on Spotify
            </a>
          </div>
        </div>
      </div>
      {/* Add basic fade-in animation */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default AlbumDetailModal;