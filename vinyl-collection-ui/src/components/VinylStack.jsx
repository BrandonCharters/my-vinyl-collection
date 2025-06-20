import React from 'react';
import { motion } from 'framer-motion';

const VinylStack = ({ albums, onAlbumClick }) => {
  const calculateOffset = (index, total) => {
    const baseOffset = 40;
    return {
      left: `${index * baseOffset}px`,
      zIndex: total - index
    };
  };

  return (
    <div className="w-full flex justify-center">
      {/* Collection Box Container */}
      <div className="card bg-base-200 shadow-xl w-[90%] max-w-[1200px] min-h-[500px]">
        <div className="card-body p-8">
          {/* Stack Container - Provides horizontal scrolling if needed */}
          <div className="relative overflow-x-auto overflow-y-hidden pb-8">
            {/* Actual Stack - Sets minimum width to prevent squishing */}
            <div className="relative h-[300px] min-w-max pl-4">
              {albums.map((album, index) => {
                const offset = calculateOffset(index, albums.length);

                return (
                  <motion.div
                    key={`${album.spotify_url}-${index}`}
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ ...offset }}
                    initial={{ x: 0 }}
                    whileHover={{ x: 40, scale: 1.05, y: "-55%" }}
                    animate={{ x: 0, scale: 1, y: "-50%" }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    {/* Vinyl Container */}
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => onAlbumClick(album)}
                    >
                      {/* Vinyl Sleeve */}
                      <div className="card bg-base-300 shadow-xl w-[250px] h-[250px] overflow-hidden transform transition-transform duration-300 group-hover:shadow-2xl">
                        <img
                          src={album.cover_url || '/default-album.png'}
                          alt={album.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Album Info Tooltip */}
                      <div className="absolute -bottom-12 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="card bg-base-300 shadow-lg text-center">
                          <div className="card-body p-2">
                            <p className="text-base-content text-sm font-medium truncate">{album.name}</p>
                            <p className="text-secondary text-xs truncate">{album.artist}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          {/* Scroll Hint */}
          {albums.length > 8 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-secondary text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Scroll to see more
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VinylStack; 