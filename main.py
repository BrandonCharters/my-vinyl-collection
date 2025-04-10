from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import requests

from endpoints.spotify_routes import router as spotify_router
from endpoints.collection_routes import router as collection_router

load_dotenv()

app = FastAPI()

# ✅ Add middleware after app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(spotify_router)
app.include_router(collection_router)


CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")
SCOPE = "user-read-private"


@app.get("/")
def login():
    auth_url = (
        "https://accounts.spotify.com/authorize"
        f"?client_id={CLIENT_ID}"
        f"&response_type=code"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope={SCOPE}"
    )

    print("🔗 Redirecting to:", auth_url)
    return RedirectResponse(auth_url)

@app.get("/ping")
def ping():
    return {"message": "pong"}


@app.get("/callback")
def callback(request: Request):
    code = request.query_params.get("code")
    if not code:
        return HTMLResponse("<h1>Authorization failed</h1>")

    token_url = "https://accounts.spotify.com/api/token"
    response = requests.post(
        token_url,
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": REDIRECT_URI,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        },
    )

    if response.status_code != 200:
        return HTMLResponse("<h1>Failed to get token</h1>")

    tokens = response.json()
    access_token = tokens["access_token"]

    # 🔁 Redirect with token in URL
    redirect_url = f"http://localhost:5173/callback?access_token={access_token}"
    return RedirectResponse(redirect_url)
