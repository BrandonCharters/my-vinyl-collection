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
    if (onAdd && !album.in_collection) {
      setCondition('M');
    } else {
      setCondition(album?.condition || CONDITION_OPTIONS[0].code);
    }
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
    <Transition.Root show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-base-300/80 backdrop-blur-sm" />
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
              <Dialog.Panel className="relative w-full max-w-5xl min-w-[350px] md:min-w-[700px] lg:min-w-[900px] transform overflow-hidden rounded-2xl bg-base-200 p-6 shadow-2xl border border-base-300">
                <button
                  onClick={onClose}
                  className="btn btn-ghost btn-circle absolute right-4 top-4"
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
                        <Dialog.Title className="text-2xl font-bold text-base-content mb-2">
                          {album.name}
                        </Dialog.Title>
                        <p className="text-xl text-secondary mb-4">{album.artist}</p>
                        {album.in_collection && !editingCondition && (
                          <div className="mt-2">
                            <span className="badge badge-secondary mr-2">Condition: {album.condition}</span>
                            
                          </div>
                        )}
                        {album.in_collection && editingCondition && (
                          <div className="mt-2">
                            <Dropdown
                              id="condition-edit"
                              label="Condition / Rating"
                              options={CONDITION_OPTIONS}
                              value={condition}
                              onChange={e => setCondition(e.target.value)}
                            />
                          </div>
                        )}
                        {onAdd && !album.in_collection && (
                          <div className="mt-2">
                            <Dropdown
                              id="condition-add"
                              label="Condition / Rating"
                              options={CONDITION_OPTIONS}
                              value={condition}
                              onChange={e => setCondition(e.target.value)}
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2 text-secondary">
                          <TagIcon className="h-5 w-5" />
                          <span>{album.album_type}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-secondary">
                          <MusicalNoteIcon className="h-5 w-5" />
                          <span>{album.total_tracks} tracks</span>
                        </div>
                        {album.label && (
                          <div className="flex items-center space-x-2 text-secondary">
                            <BuildingLibraryIcon className="h-5 w-5" />
                            <span>{album.label}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-secondary">
                          <ChartBarIcon className="h-5 w-5" />
                          <span>Popularity: {album.popularity}%</span>
                        </div>
                      </div>

                      {album.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {album.genres.map((genre, index) => (
                            <span 
                              key={index}
                              className="badge badge-secondary"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="space-y-2">
                        <h3 className="text-base-content text-sm">Tracklist</h3>
                        <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2">
                          {album.tracks?.map((track, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center space-x-3 text-base-content p-2 rounded-lg hover:bg-base-300"
                            >
                              <span className="text-sm font-medium">{index + 1}</span>
                              <span className="flex-1">{track}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      {onAdd && !album.in_collection && (
                        <button
                          onClick={handleAddClick}
                          className="btn btn-primary"
                        >
                          Add to Collection
                        </button>
                      )}
                      {onRemove && album.in_collection && (
                        <button
                          onClick={handleRemoveClick}
                          className="btn btn-secondary"
                        >
                          Remove from Collection
                        </button>
                      )}
                      <button
                        onClick={handleSpotifyClick}
                        className="btn btn-outline btn-primary"
                      >
                        Open in Spotify
                      </button>
                      {album.in_collection && !editingCondition && (
                        <button
                          className="btn btn-primary"
                          onClick={() => setEditingCondition(true)}
                        >
                          Edit
                        </button>
                      )}
                      {album.in_collection && editingCondition && (
                        <>
                          <button
                            onClick={handleSaveCondition}
                            className="btn btn-primary"
                            disabled={saving || condition === album.condition}
                          >
                            Save Condition
                          </button>
                          <button
                            className="btn btn-outline btn-secondary"
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
                  </motion.div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AlbumDetailModal;