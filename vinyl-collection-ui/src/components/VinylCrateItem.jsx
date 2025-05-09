// src/components/VinylCrateItem.jsx
import React from 'react';

function VinylCrateItem({ album, index, onRemove, onClick }) {
  const { name, artist, cover_url } = album;

  return (
    <div
      className="bg-gray-800 rounded shadow-md p-2 cursor-pointer group transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:z-10 relative"
      onClick={() => onClick(album)}
      title={`View details for ${name} by ${artist}`}
    >
      <div className="relative">
        <img
          src={cover_url || 'https://via.placeholder.com/150?text=No+Cover'}
          alt={`${name} cover`}
          className="w-full h-auto object-cover aspect-square rounded-sm"
          loading="lazy" // Lazy load images
        />
      </div>
      {album.condition && (
        <div className="mt-1 text-center">
          <span className="inline-block px-2 py-0.5 bg-vinyl-secondary rounded-full text-xs text-vinyl-light font-semibold">{album.condition}</span>
        </div>
      )}
      {/* Subtle overlay on hover maybe? */}
      {/* <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div> */}

      {/* Remove button - positioned top-right */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click when clicking button
          onRemove(index);
        }}
        className="absolute top-1 right-1 bg-red-600 hover:bg-red-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
        aria-label={`Remove ${name} from collection`}
        title="Remove from collection"
      >
        X
      </button>

      {/* Optional: Show minimal info below image if needed */}
      {/* <div className="mt-1 text-center">
        <p className="text-xs text-white truncate">{name}</p>
        <p className="text-xxs text-gray-400 truncate">{artist}</p>
      </div> */}
    </div>
  );
}

export default VinylCrateItem;