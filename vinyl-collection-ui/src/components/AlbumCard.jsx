// src/components/AlbumCard.jsx
import React from 'react';

function AlbumCard({ album, onAdd, showAddButton = true }) {
  const { name, artist, release_date, cover_url, spotify_url } = album;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg p-4 flex flex-col text-white transition-shadow hover:shadow-xl">
      <img
        src={cover_url || 'https://via.placeholder.com/150?text=No+Cover'}
        alt={`${name} cover`}
        className="w-full h-auto object-cover aspect-square mb-3 rounded"
      />
      <div className="flex-grow">
        <h3 className="text-lg font-semibold truncate" title={name}>{name}</h3>
        <p className="text-sm text-gray-400 truncate" title={artist}>{artist}</p>
        <p className="text-xs text-gray-500">{release_date}</p>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <a
          href={spotify_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-green-500 hover:text-green-400 hover:underline"
        >
          Listen on Spotify
        </a>
        {showAddButton && onAdd && (
          <button
            onClick={() => onAdd(album)}
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-3 rounded transition-colors"
            aria-label={`Add ${name} to collection`}
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}

export default AlbumCard;