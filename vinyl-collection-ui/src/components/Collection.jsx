import { useEffect, useState } from "react";
import { getCollection, deleteFromCollection } from "../api";
import AlbumCard from "./AlbumCard";

export default function Collection() {
  const [albums, setAlbums] = useState([]);

  const load = async () => {
    const res = await getCollection();
    setAlbums(res.data);
  };

  const handleRemove = async (index) => {
    await deleteFromCollection(index);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Vinyl Collection</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {albums.map((album, index) => (
          <AlbumCard
            key={index}
            album={album}
            showAdd={false}
            onRemove={() => handleRemove(index)}
          />
        ))}
      </div>
    </div>
  );
}
