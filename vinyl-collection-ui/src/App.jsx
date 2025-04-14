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
    // Force re-render or navigate to make sure UI updates
    window.location.href = "/search"; // Redirect to search after logout
  };

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  return (
    <Router>
      <div className="bg-gray-900 min-h-screen">
        {/* Optional Simple Navbar */}
        <nav className="bg-gray-800 p-4 text-white mb-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link
              to="/"
              className="text-xl font-bold text-green-400 hover:text-green-300"
            >
              VinylHub
            </Link>
            <div>
              <Link to="/search" className="mr-4 hover:text-gray-300">
                Search
              </Link>
              <Link to="/collection" className="mr-4 hover:text-gray-300">
                Collection
              </Link>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                >
                  Logout
                </button>
              ) : (
                <a
                  href={`${backendUrl}/`} // Link to backend login
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </nav>

        <Routes>
          {/* Redirect base path to search page */}
          <Route path="/" element={<Navigate replace to="/search" />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          {/* The route your backend redirects TO */}
          <Route path="/callback" element={<Callback />} />
          {/* Optional: Add a 404 Not Found route */}
          <Route
            path="*"
            element={
              <div className="text-center text-white p-10">
                <h1 className="text-3xl font-bold text-red-500">
                  404 - Not Found
                </h1>
                <p className="mt-4">
                  The page you are looking for does not exist.
                </p>
                <Link
                  to="/"
                  className="text-green-400 hover:underline mt-6 inline-block"
                >
                  Go Home
                </Link>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
