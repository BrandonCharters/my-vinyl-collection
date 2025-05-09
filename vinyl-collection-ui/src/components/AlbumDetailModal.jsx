// src/components/AlbumDetailModal.jsx
import React, { Fragment, useState } from 'react';
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
import Dropdown from './Dropdown';

const AlbumDetailModal = ({ isOpen, onClose, album, onRemove, onAdd, onUpdateCondition }) => {
  if (!album) return null;

  const CONDITION_OPTIONS = [
    { code: 'M', label: 'Mint (M): Unplayed, factory sealed, or in perfect condition.' },
    { code: 'NM', label: 'Near Mint (NM): Very minor signs of wear or play, essentially perfect.' },
    { code: 'EX', label: 'Excellent (EX): Minor signs of wear, plays perfectly with minimal surface noise.' },
    { code: 'VG+', label: 'Very Good Plus (VG+): Some signs of wear, light surface noise, but still a pleasurable listen.' },
    { code: 'VG', label: 'Very Good (VG): Noticeable wear and noise, but still enjoyable.' },
    { code: 'G', label: 'Good (G): Significant wear and noise, may include skips or repeats, but still playable.' },
    { code: 'F', label: 'Fair (F): Heavy wear, often with skips or other playback issues, more for collectors than listeners.' },
    { code: 'P', label: 'Poor (P): Essentially unplayable, may have value due to rarity, often in bargain bins.' }
  ];
  const [condition, setCondition] = useState(album?.condition || CONDITION_OPTIONS[0].code);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingCondition, setEditingCondition] = useState(false);

  React.useEffect(() => {
    setCondition(album?.condition || CONDITION_OPTIONS[0].code);
    setSaveSuccess(false);
    setEditingCondition(false);
  }, [album]);

  const handleSpotifyClick = () => {
    window.open(album.spotify_url, '_blank');
  };

  const handleRemoveClick = () => {
    onRemove();
    onClose();
  };

  const handleAddClick = () => {
    onAdd({ ...album, condition });
  };

  const handleSaveCondition = async () => {
    if (!album || !album.id) return;
    setSaving(true);
    try {
      await onUpdateCondition(album.id, condition);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1200);
    } finally {
      setSaving(false);
    }
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
              <Dialog.Panel className="relative w-full max-w-5xl min-w-[350px] md:min-w-[700px] lg:min-w-[900px] transform overflow-hidden rounded-2xl bg-vinyl-primary p-6 shadow-xl transition-all">
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
                        {album.in_collection && (
                          <div className="mt-2">
                            {!editingCondition ? (
                              <>
                                <span className="inline-block px-3 py-1 bg-vinyl-secondary rounded-full text-sm text-vinyl-light font-semibold mr-2">Condition: {album.condition}</span>
                                <span className="text-xs text-vinyl-light/60">
                                  {CONDITION_OPTIONS.find(opt => opt.code === album.condition)?.label}
                                </span>
                                <button
                                  className="ml-3 px-3 py-1 bg-vinyl-accent rounded text-white text-xs font-semibold hover:bg-vinyl-accent/80 transition-colors"
                                  onClick={() => setEditingCondition(true)}
                                >
                                  Edit
                                </button>
                              </>
                            ) : (
                              <>
                                <Dropdown
                                  id="condition-edit"
                                  label="Condition / Rating"
                                  options={CONDITION_OPTIONS}
                                  value={condition}
                                  onChange={e => setCondition(e.target.value)}
                                />
                                <span className="text-xs text-vinyl-light/60 block mb-2">
                                  {CONDITION_OPTIONS.find(opt => opt.code === condition)?.label}
                                </span>
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={handleSaveCondition}
                                  className="px-4 py-2 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 transition-colors mt-1"
                                  disabled={saving || condition === album.condition}
                                >
                                  {saveSuccess ? 'Saved!' : saving ? 'Saving...' : 'Save Condition'}
                                </motion.button>
                                <button
                                  className="ml-2 px-3 py-2 bg-gray-600 rounded text-white text-xs font-semibold hover:bg-gray-500 transition-colors mt-1"
                                  onClick={() => {
                                    setEditingCondition(false);
                                    setCondition(album.condition);
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        )}
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

                    <div className="flex flex-row flex-nowrap items-center justify-between mt-6 gap-4">
                      {!album.in_collection && (
                        <Dropdown
                          id="condition"
                          label="Condition / Rating"
                          options={CONDITION_OPTIONS}
                          value={condition}
                          onChange={e => setCondition(e.target.value)}
                        />
                      )}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSpotifyClick}
                        className="min-w-[170px] px-4 py-2 bg-[#1DB954] rounded-lg text-white font-medium hover:bg-[#1DB954]/80 transition-colors text-center"
                      >
                        Open in Spotify
                      </motion.button>
                      
                      {album.in_collection ? (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleRemoveClick}
                          className="px-4 py-2 bg-red-500 rounded-lg text-white font-medium hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </motion.button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddClick}
                          className="px-4 py-2 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 transition-colors"
                        >
                          Add to Collection
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