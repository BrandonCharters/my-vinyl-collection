// src/components/Callback.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    if (accessToken) {
      localStorage.setItem('spotify_access_token', accessToken);
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Logging you in with Spotify...</h2>
      <p className="text-gray-600">Please wait.</p>
    </div>
  );
};

export default Callback;