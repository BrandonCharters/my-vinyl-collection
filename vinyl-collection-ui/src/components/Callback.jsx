import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");

    if (token) {
      localStorage.setItem("access_token", token);
      console.log("✅ Stored access token:", token);
    } else {
      console.warn("⚠️ No access_token in URL.");
    }

    // Clean up and go home
    navigate("/");
  }, []);

  return <p>Logging you in...</p>;
}
