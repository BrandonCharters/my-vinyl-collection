// src/components/AlbumDetailModal.jsx
import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { 
  XMarkIcon, 
  ArrowTopRightOnSquareIcon, 
  TrashIcon,
  MusicalNoteIcon,
  TagIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  PlusCircleIcon
} from '@heroicons/react/24/solid';

const AlbumDetailModal = ({ isOpen, onClose, album, onRemove, onAdd }) => {
  if (!album) return null;

  const handleSpotifyClick = () => {
    window.open(album.spotify_url, '_blank');
  };

  const handleRemoveClick = () => {
    onRemove();
    onClose();
  };

  const handleAddClick = () => {
    onAdd(album);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-vinyl-dark/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-vinyl-primary p-6 shadow-xl transition-all">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-vinyl-light/60 hover:text-vinyl-light transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative aspect-square"
                  >
                    <img
                      src={album.cover_url || '/default-album.png'}
                      alt={album.name}
                      className="w-full h-full object-cover rounded-lg shadow-2xl"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div>
                        <Dialog.Title className="text-2xl font-bold text-vinyl-light mb-2">
                          {album.name}
                        </Dialog.Title>
                        <p className="text-xl text-vinyl-light/80 mb-4">{album.artist}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2 text-vinyl-light/80">
                          <TagIcon className="h-5 w-5" />
                          <span>{album.album_type}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-vinyl-light/80">
                          <MusicalNoteIcon className="h-5 w-5" />
                          <span>{album.total_tracks} tracks</span>
                        </div>
                        {album.label && (
                          <div className="flex items-center space-x-2 text-vinyl-light/80">
                            <BuildingLibraryIcon className="h-5 w-5" />
                            <span>{album.label}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-vinyl-light/80">
                          <ChartBarIcon className="h-5 w-5" />
                          <span>Popularity: {album.popularity}%</span>
                        </div>
                      </div>

                      {album.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {album.genres.map((genre, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-vinyl-secondary rounded-full text-sm text-vinyl-light"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="space-y-2">
                        <h3 className="text-vinyl-light/60 text-sm">Tracklist</h3>
                        <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2">
                          {album.tracks?.map((track, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center space-x-3 text-vinyl-light/80 p-2 rounded-lg hover:bg-vinyl-secondary/30"
                            >
                              <span className="text-sm font-medium">{index + 1}</span>
                              <span className="flex-1">{track}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 space-x-4">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSpotifyClick}
                        className="flex items-center space-x-2 px-4 py-2 bg-[#1DB954] rounded-lg text-white font-medium hover:bg-[#1DB954]/80 transition-colors flex-1"
                      >
                        <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                        <span>Open in Spotify</span>
                      </motion.button>
                      
                      {album.in_collection ? (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleRemoveClick}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-500 rounded-lg text-white font-medium hover:bg-red-600 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                          <span>Remove</span>
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddClick}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 transition-colors"
                        >
                          <PlusCircleIcon className="h-5 w-5" />
                          <span>Add to Collection</span>
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AlbumDetailModal;