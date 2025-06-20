// src/components/VinylCrateItem.jsx
import React from 'react';

function VinylCrateItem({ album, index, onRemove, onClick }) {
  const { name, artist, cover_url } = album;

  return (
    <div
      className="card bg-base-200 shadow-xl hover:shadow-2xl cursor-pointer group transition-all duration-300 hover:-translate-y-2 hover:z-10 relative"
      onClick={() => onClick(album)}
      title={`View details for ${name} by ${artist}`}
    >
      <div className="card-body p-2">
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
            <span className="badge badge-secondary">{album.condition}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default VinylCrateItem;