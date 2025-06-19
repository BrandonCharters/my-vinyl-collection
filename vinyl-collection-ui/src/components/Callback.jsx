// src/components/Callback.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Callback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');

    if (accessToken) {
      console.log("Received access token:", accessToken);
      localStorage.setItem('spotify_access_token', accessToken);
      // Redirect to the collection page after storing the token
      navigate('/collection');
    } else {
      console.error("No access token found in callback URL");
      // Redirect to a login/error page or home
      navigate('/'); // Or maybe a dedicated login prompt page
    }
  }, [location, navigate]);

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-4">Processing authentication...</h1>
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    </div>
  );
}

export default Callback;