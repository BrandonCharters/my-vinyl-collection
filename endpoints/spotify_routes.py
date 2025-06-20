from fastapi import APIRouter, Header, Query, Request
from fastapi.responses import JSONResponse, RedirectResponse
import requests
from .collection_routes import user_collections, get_token_user
import os
from dotenv import load_dotenv

router = APIRouter()

load_dotenv()
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")

@router.get("/search")
def search_album(
    query: str = Query(..., description="Search query for albums"),
    authorization: str = Header(default=None),
):
    if not authorization or not authorization.startswith("Bearer "):
        return JSONResponse(
            status_code=401,
            content={"error": "Not authenticated — missing or invalid access token."},
        )

    access_token = authorization.removeprefix("Bearer ")
    print("Access token from header:", access_token)

    # Get user's collection to check for duplicates
    token = get_token_user(authorization)
    user_collection = user_collections.get(token, [])
    collection_ids = {album.get('id') for album in user_collection}
    collection_urls = {album.get('spotify_url') for album in user_collection}

    headers = {"Authorization": f"Bearer {access_token}"}
    params = {
        "q": query.title(),
        "type": "album",
        "limit": 20,
        "market": "AF",
    }

    response = requests.get(
        "https://api.spotify.com/v1/search", headers=headers, params=params
    )

    if response.status_code != 200:
        return JSONResponse(status_code=response.status_code, content=response.json())

    albums = [
        {
            "name": item["name"],
            "artist": item["artists"][0]["name"],
            "release_date": item["release_date"],
            "cover_url": item["images"][0]["url"] if item["images"] else None,
            "spotify_url": item["external_urls"]["spotify"],
            "album_type": item["album_type"],
            "total_tracks": item["total_tracks"],
            "id": item["id"],
            "tracks": [],
            "genres": item.get("genres", []),
            "label": item.get("label", ""),
            "popularity": item.get("popularity", 0),
            "in_collection": (
                item["id"] in collection_ids or 
                item["external_urls"]["spotify"] in collection_urls
            )
        }
        for item in response.json().get("albums", {}).get("items", [])
    ]

    # Fetch tracks for each album
    for album in albums:
        tracks_response = requests.get(
            f"https://api.spotify.com/v1/albums/{album['id']}/tracks",
            headers=headers
        )
        if tracks_response.status_code == 200:
            tracks_data = tracks_response.json()
            album["tracks"] = [track["name"] for track in tracks_data.get("items", [])]

    return albums

@router.get("/login")
def login():
    scope = "user-read-private user-read-email"
    authorize_url = (
        "https://accounts.spotify.com/authorize?"
        f"client_id={SPOTIFY_CLIENT_ID}"
        f"&response_type=code"
        f"&redirect_uri={SPOTIFY_REDIRECT_URI}"
        f"&scope={scope}"
    )
    return RedirectResponse(authorize_url)

@router.get("/callback")
def callback(request: Request):
    code = request.query_params.get("code")
    if not code:
        return JSONResponse(status_code=400, content={"error": "Missing code in callback."})

    token_url = "https://accounts.spotify.com/api/token"
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": SPOTIFY_REDIRECT_URI,
        "client_id": SPOTIFY_CLIENT_ID,
        "client_secret": SPOTIFY_CLIENT_SECRET,
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = requests.post(token_url, data=data, headers=headers)
    if response.status_code != 200:
        return JSONResponse(status_code=response.status_code, content=response.json())
    token_data = response.json()
    access_token = token_data.get("access_token")
    if not access_token:
        return JSONResponse(status_code=400, content={"error": "No access token returned from Spotify."})
    # Redirect to frontend with access_token in query params
    frontend_url = os.getenv("FRONTEND_REDIRECT_URI", "http://localhost:5173/callback")
    redirect_url = f"{frontend_url}?access_token={access_token}"
    return RedirectResponse(redirect_url)
