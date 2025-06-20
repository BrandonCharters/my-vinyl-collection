![image](https://github.com/user-attachments/assets/b0a0049b-7a17-402c-8100-802530593e9f)
![image](https://github.com/user-attachments/assets/111ca271-f855-4f5b-b4fc-4acb230f6273)
![image](https://github.com/user-attachments/assets/c17669df-0a5e-4028-a2de-25c1111834c2)
![image](https://github.com/user-attachments/assets/53072325-0606-4134-afa3-b55d34ef929f)


## Prerequisites
- [Node.js & npm](https://nodejs.org/)
- [Python 3.10+](https://www.python.org/)
- A [Spotify Developer Account](https://developer.spotify.com/dashboard/)

---

## 1. Clone the Repository
```sh
git clone https://github.com/BrandonCharters/my-vinyl-collection.git
cd my-vinyl-collection
```

---

## 2. Backend Setup (FastAPI)

1. **Create a Spotify App:**
   - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
   - Create an app and get your **Client ID** and **Client Secret**.
   - Set the Redirect URI to: `http://localhost:8000/callback`

2. **Environment Variables:**
   - Copy `.env.example` to `.env` and fill in your credentials:
     ```sh
     cp .env.example .env
     # Edit .env and set SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI
     ```

3. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

4. **Run the backend:**
   ```sh
   uvicorn main:app --reload
   ```
   The backend runs at `http://localhost:8000/`

---

## 3. Frontend Setup (React + Vite)

1. **Install dependencies:**
   ```sh
   cd vinyl-collection-ui
   npm install
   ```

2. **Run the frontend:**
   ```sh
   npm run dev
   ```
   The frontend runs at `http://localhost:5173/`

---

## 4. Usage
1. Open `http://localhost:5173/` in your browser.
2. Click **Login with Spotify** and authorize the app.

---
