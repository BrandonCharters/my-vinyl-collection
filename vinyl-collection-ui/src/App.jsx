import Search from "./components/Search";
import Collection from "./components/Collection";
import axios from "axios";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    if (token) {
      localStorage.setItem("access_token", token);
      window.history.replaceState({}, document.title, "/"); // clean up URL
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <Search />
      <hr className="my-8 border-gray-300" />
      <Collection />
    </div>
  );
}

