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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="group relative bg-vinyl-primary rounded-lg overflow-hidden shadow-xl 
                 transition-all duration-300 hover:shadow-2xl hover:shadow-vinyl-accent/20
                 cursor-pointer"
    >
      <div className="aspect-square overflow-hidden relative">
        <motion.img
          src={cover_url || 'https://via.placeholder.com/150?text=No+Cover'}
          alt={`${name} cover`}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vinyl-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 
                      group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-white font-bold text-lg truncate" title={name}>{name}</h3>
          <p className="text-vinyl-light/80 text-sm truncate" title={artist}>{artist}</p>
          <div className="flex items-center mt-2 space-x-2">
            <span className="px-2 py-1 bg-vinyl-accent/20 rounded-full text-xs text-vinyl-light">
              {release_date}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-vinyl-primary border-t border-vinyl-secondary">
        <div className="flex justify-between items-center">
          <a
            href={spotify_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-500 hover:text-green-400 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Listen on Spotify
          </a>
          {showAddButton && (
            in_collection ? (
              <motion.div
                className="flex items-center space-x-1 text-gray-400 text-xs"
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
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-4 rounded transition-colors"
                aria-label={`Add ${name} to collection`}
              >
                Add to Collection
              </button>
            )
          )}
        </div>
      </div>
      
      {album.is_favorite && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 p-1 bg-vinyl-accent rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AlbumCard;