from fastapi import APIRouter, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel

router = APIRouter()

# In-memory "database"
user_collections = {}  # access_token -> list of albums


class Album(BaseModel):
    name: str
    artist: str
    release_date: str
    cover_url: str | None
    spotify_url: str


def get_token_user(authorization: str | None):
    if not authorization or not authorization.startswith("Bearer "):
        return None
    return authorization.replace("Bearer ", "")


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

    collection = user_collections.get(token, [])
    collection.append(album.dict())
    user_collections[token] = collection
    return {"message": "Album added to collection", "total": len(collection)}


@router.delete("/collection/{index}")
def delete_from_collection(index: int, authorization: str = Header(default=None)):
    token = get_token_user(authorization)
    if not token:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})

    collection = user_collections.get(token, [])
    if 0 <= index < len(collection):
        removed = collection.pop(index)
        user_collections[token] = collection
        return {"message": "Removed", "removed": removed}
    return JSONResponse(status_code=404, content={"error": "Index out of range"})
