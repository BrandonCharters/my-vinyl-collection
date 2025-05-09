from fastapi import APIRouter, Header, Path
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, ClassVar
import requests

router = APIRouter()

# In-memory "DB": Maps tokens to album collections
user_collections: dict[str, list[dict]] = {}


def extract_spotify_id(spotify_url: str) -> Optional[str]:
    """Extract Spotify ID from a Spotify URL."""
    try:
        return spotify_url.split('/')[-1]
    except:
        return None


class Album(BaseModel):
    name: str
    artist: str
    release_date: str
    cover_url: Optional[str] = None
    spotify_url: str
    # New fields with default values
    album_type: Optional[str] = "album"  # "album", "single", or "compilation"
    total_tracks: Optional[int] = 0
    id: Optional[str] = None  # Spotify ID
    tracks: List[str] = []  # List of track names
    genres: List[str] = []
    label: Optional[str] = ""
    popularity: Optional[int] = 0
    condition: Optional[str] = "M"
    VALID_CONDITIONS: ClassVar[set[str]] = {"M", "NM", "EX", "VG+", "VG", "G", "F", "P"}


def get_token_user(authorization: str | None) -> str | None:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    return authorization.removeprefix("Bearer ")


@router.get("/collection")
def get_collection(authorization: str = Header(default=None)):
    token = get_token_user(authorization)
    if not token:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})

    return user_collections.get(token, [])


@router.post("/collection")
def add_to_collection(album: Album, authorization: str = Header(default=None)):
    token = get_token_user(authorization)
    if not token:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})

    print(f"Adding album: {album.name}")
    
    # If no ID provided, try to extract it from spotify_url
    album_id = album.id or extract_spotify_id(album.spotify_url)
    
    # Check for duplicates
    collection = user_collections.setdefault(token, [])
    
    # Check if album already exists by ID or spotify_url
    if any(
        (existing.get('id') == album_id) or 
        (existing.get('spotify_url') == album.spotify_url)
        for existing in collection
    ):
        return JSONResponse(
            status_code=400,
            content={"error": "Album already exists in collection"}
        )
    
    if not album_id:
        print("Could not determine Spotify ID, storing basic album info")
        album_condition = album.condition if album.condition in Album.VALID_CONDITIONS else "M"
        album_dict = album.dict()
        album_dict["condition"] = album_condition
        collection.append(album_dict)
        return {"message": "Album added to collection (basic info)", "total": len(collection)}

    print(f"Using Spotify ID: {album_id}")

    # Fetch full album details from Spotify
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Get full album details
        print(f"Fetching album details from Spotify API...")
        album_response = requests.get(
            f"https://api.spotify.com/v1/albums/{album_id}",
            headers=headers
        )
        
        print(f"Spotify API response status: {album_response.status_code}")
        if album_response.status_code != 200:
            print(f"Error response: {album_response.text}")
            # If we can't fetch details, fall back to basic info
            album_condition = album.condition if album.condition in Album.VALID_CONDITIONS else "M"
            album_dict = album.dict()
            album_dict["condition"] = album_condition
            collection.append(album_dict)
            return {"message": "Album added with basic info (API error)", "total": len(collection)}
        
        album_data = album_response.json()
        
        # Get tracks
        print("Fetching tracks...")
        tracks_response = requests.get(
            f"https://api.spotify.com/v1/albums/{album_id}/tracks",
            headers=headers
        )
        
        tracks = []
        if tracks_response.status_code == 200:
            tracks_data = tracks_response.json()
            tracks = [track["name"] for track in tracks_data.get("items", [])]
        else:
            print(f"Failed to fetch tracks: {tracks_response.status_code}")

        # Update album with full details
        album_condition = album.condition if album.condition in Album.VALID_CONDITIONS else "M"
        updated_album = {
            "name": album_data["name"],
            "artist": album_data["artists"][0]["name"],
            "release_date": album_data["release_date"],
            "cover_url": album_data["images"][0]["url"] if album_data["images"] else None,
            "spotify_url": album_data["external_urls"]["spotify"],
            "album_type": album_data["album_type"],
            "total_tracks": album_data["total_tracks"],
            "id": album_data["id"],
            "tracks": tracks,
            "genres": album_data.get("genres", []),
            "label": album_data.get("label", ""),
            "popularity": album_data.get("popularity", 0),
            "condition": album_condition
        }

        album_dict = album.dict()
        album_dict["condition"] = album_condition
        collection.append(album_dict)
        print("Album added successfully with full details")
        return {"message": "Album added to collection", "total": len(collection)}
        
    except Exception as e:
        print(f"Error while fetching album details: {str(e)}")
        # If anything fails, fall back to basic info
        album_condition = album.condition if album.condition in Album.VALID_CONDITIONS else "M"
        album_dict = album.dict()
        album_dict["condition"] = album_condition
        collection.append(album_dict)
        return {"message": "Album added with basic info (error occurred)", "total": len(collection)}


@router.delete("/collection/{index}")
def delete_from_collection(index: int, authorization: str = Header(default=None)):
    token = get_token_user(authorization)
    if not token:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})

    collection = user_collections.get(token, [])
    if 0 <= index < len(collection):
        removed = collection.pop(index)
        return {"message": "Removed", "removed": removed}

    return JSONResponse(status_code=404, content={"error": "Index out of range"})


@router.patch("/collection/{album_id}/condition")
def update_condition(album_id: str = Path(...), condition: str = "M", authorization: str = Header(default=None)):
    token = get_token_user(authorization)
    if not token:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    collection = user_collections.get(token, [])
    for album in collection:
        if album.get("id") == album_id:
            if condition not in Album.VALID_CONDITIONS:
                return JSONResponse(status_code=400, content={"error": "Invalid condition code"})
            album["condition"] = condition
            return {"message": "Condition updated", "album": album}
    return JSONResponse(status_code=404, content={"error": "Album not found in collection"})
