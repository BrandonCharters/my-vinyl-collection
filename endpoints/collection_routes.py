from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

router = APIRouter()


class Album(BaseModel):
    name: str
    artist: str
    release_date: str
    cover_url: str | None
    spotify_url: str


@router.get("/collection")
def get_collection(request: Request):
    collection = request.session.get("vinyl_collection", [])
    return collection


@router.post("/collection")
def add_to_collection(request: Request, album: Album):
    collection = request.session.get("vinyl_collection", [])
    collection.append(album.dict())
    request.session["vinyl_collection"] = collection
    return {"message": "Album added to collection", "total": len(collection)}


@router.delete("/collection/{index}")
def delete_from_collection(request: Request, index: int):
    collection = request.session.get("vinyl_collection", [])
    if 0 <= index < len(collection):
        removed = collection.pop(index)
        request.session["vinyl_collection"] = collection
        return {"message": "Removed", "removed": removed}
    return JSONResponse(status_code=404, content={"error": "Index out of range"})
