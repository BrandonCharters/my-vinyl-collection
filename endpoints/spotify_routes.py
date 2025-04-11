from fastapi import APIRouter, Header, Query
from fastapi.responses import JSONResponse
import requests

router = APIRouter()


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
    print("🧠 Access token from header:", access_token)

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
        }
        for item in response.json().get("albums", {}).get("items", [])
    ]

    return albums
