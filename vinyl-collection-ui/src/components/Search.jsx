import { useState } from "react";
import { searchAlbums, addToCollection } from "../api";
import AlbumCard from "./AlbumCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await searchAlbums(query);
      setResults(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("⚠️ Please log in through the main app first.");
      } else {
        console.error("Search failed:", err);
      }
    }
  };

  const handleAdd = async (album) => {
    await addToCollection(album);
    alert("Album added!");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search for Albums</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Search artist or album..."
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((album, index) => (
          <AlbumCard key={index} album={album} onAdd={handleAdd} />
        ))}
      </div>
    </div>
  );
}
