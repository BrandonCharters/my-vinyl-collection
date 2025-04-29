import React, { useState, useEffect } from 'react';
import VinylStack from '../components/VinylStack';
import { motion } from 'framer-motion';

const Collection = () => {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch('/api/collection');
        if (!response.ok) throw new Error('Failed to fetch collection');
        const data = await response.json();
        setCollection(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-vinyl-dark">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-vinyl-accent rounded-full border-t-transparent"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-vinyl-dark text-vinyl-light">
        <h2 className="text-2xl font-bold mb-4">Oops!</h2>
        <p className="text-vinyl-light/80">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vinyl-dark p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-vinyl-light mb-8">Your Vinyl Collection</h1>
        
        {collection.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-vinyl-light/60">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <p className="text-xl">Your collection is empty</p>
            <p className="mt-2">Start adding some vinyl records!</p>
          </div>
        ) : (
          <div className="relative">
            <VinylStack albums={collection} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Collection; 