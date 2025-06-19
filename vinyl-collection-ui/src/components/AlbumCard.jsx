// src/components/AlbumCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const AlbumCard = ({ album, onAdd, onClick, showAddButton = true, justAdded = false }) => {
  const { name, artist, release_date, cover_url, spotify_url, in_collection } = album;
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const handleClick = () => {
    if (onClick) {
      onClick(album);
    }
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
    >
      <div className="card-body p-0">
        <div className="aspect-square overflow-hidden relative">
          <motion.img
            src={cover_url || 'https://via.placeholder.com/150?text=No+Cover'}
            alt={`${name} cover`}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-200/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 
                        group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <h3 className="text-base-content font-bold text-lg truncate" title={name}>{name}</h3>
            <p className="text-secondary text-sm truncate" title={artist}>{artist}</p>
            <div className="flex items-center mt-2 space-x-2">
              <span className="badge badge-primary">
                {release_date}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-base-200 border-t border-base-300">
          <div className="flex justify-between items-center">
            <a
              href={spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              Listen on Spotify
            </a>
            {showAddButton && (
              in_collection ? (
                <motion.div
                  className="flex items-center space-x-1 text-secondary text-xs"
                  initial={justAdded ? { scale: 1.3, opacity: 0 } : false}
                  animate={justAdded ? { scale: [1.3, 1], opacity: [0, 1] } : {}}
                  transition={{ duration: 0.6, type: 'spring' }}
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>In Collection</span>
                </motion.div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(album);
                  }}
                  className="btn btn-primary btn-sm"
                  aria-label={`Add ${name} to collection`}
                >
                  Add to Collection
                </button>
              )
            )}
          </div>
        </div>
      </div>
      
      {album.is_favorite && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 badge badge-secondary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </div>
  );
};

export default AlbumCard;