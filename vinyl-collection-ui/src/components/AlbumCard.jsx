export default function AlbumCard({ album, onAdd, onRemove, showAdd = true }) {
  return (
    <div className="border p-4 rounded-xl shadow-md">
      <img
        src={album.cover_url}
        alt={album.name}
        className="w-full rounded mb-2"
      />
      <h2 className="text-lg font-bold">{album.name}</h2>
      <p className="text-sm text-gray-600">{album.artist}</p>
      <p className="text-xs text-gray-400">{album.release_date}</p>
      <a
        href={album.spotify_url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 text-sm block mt-2 underline"
      >
        View on Spotify
      </a>
      {showAdd && (
        <button
          onClick={() => onAdd(album)}
          className="mt-2 bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-2 rounded"
        >
          Add to Collection
        </button>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-2 rounded"
        >
          Remove
        </button>
      )}
    </div>
  );
}
