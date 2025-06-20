import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import CollectionPage from "./pages/CollectionPage";
import Callback from "./components/Callback";

function App() {
  // Basic check if token exists
  const isLoggedIn = !!localStorage.getItem("spotify_access_token");

  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token");
    window.location.href = "/search";
  };

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  const handleLoginWithSpotify = () => {
    window.location.href = "http://localhost:8000/login";
  };

  return (
    <Router>
      <div data-theme="vinyl" className="min-h-screen">
        <div className="navbar bg-base-100/80 backdrop-blur-md shadow-md border-b border-primary/30">
          <div className="container mx-auto">
            <div className="flex-1">
              <Link
                to="/"
                className="btn btn-ghost text-xl text-primary hover:text-secondary"
              >
                VinylHub
              </Link>
            </div>
            <div className="flex-none gap-2">
              <Link to="/search" className="btn btn-ghost btn-sm">
                Search
              </Link>
              <Link to="/collection" className="btn btn-ghost btn-sm">
                Collection
              </Link>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLoginWithSpotify}
                  className="btn btn-primary btn-sm"
                >
                  Login with Spotify
                </button>
              )}
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Navigate replace to="/search" />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/callback" element={<Callback />} />
          <Route
            path="*"
            element={
              <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                  <div className="max-w-md">
                    <h1 className="text-5xl font-bold text-error">404</h1>
                    <p className="py-6">The page you are looking for does not exist.</p>
                    <Link to="/" className="btn btn-primary">
                      Go Home
                    </Link>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
