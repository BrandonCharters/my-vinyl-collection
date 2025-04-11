from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import requests

from config import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SCOPE, FRONTEND_URL
from endpoints.spotify_routes import router as spotify_router
from endpoints.collection_routes import router as collection_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(spotify_router)
app.include_router(collection_router)


@app.get("/")
def login() -> RedirectResponse:
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
def ping() -> dict:
    return {"message": "pong"}


@app.get("/callback", response_model=None)
def callback(request: Request) -> RedirectResponse | HTMLResponse:
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
    access_token = tokens.get("access_token")

    redirect_url = f"{FRONTEND_URL}/callback?access_token={access_token}"
    return RedirectResponse(redirect_url)
