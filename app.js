document.addEventListener("DOMContentLoaded", () => {
    const playlistContainer = document.getElementById("playlist-container");
    const moodButtons = document.querySelectorAll("[data-mood]");
  
    function getToken() {
      let token = sessionStorage.getItem("spotifyToken");
      if (!token) {
        token = prompt("Enter your Spotify access token:");
        if (token) {
          sessionStorage.setItem("spotifyToken", token);
        } else {
          alert("Access token is required to use the app.");
        }
      }
      return token;
    }
  
    async function fetchPlaylists(mood) {
      const token = getToken();
      if (!token) return;
  
      playlistContainer.innerHTML = "<p>Loading playlists...</p>";
  
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(mood)}&type=playlist&limit=8`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Invalid or expired token. Please try again.");
        }
  
        const data = await response.json();
        playlistContainer.innerHTML = "";
  
        const playlists = data.playlists.items;
  
        playlists.forEach((playlist) => {
          const div = document.createElement("div");
          div.className = "playlist";
          div.innerHTML = `
            <img src="${playlist.images[0]?.url}" alt="Cover">
            <p><strong>${playlist.name}</strong></p>
            <a href="${playlist.external_urls.spotify}" target="_blank">Open in Spotify</a>
          `;
          playlistContainer.appendChild(div);
        });
      } catch (err) {
        playlistContainer.innerHTML = `<p>Error: ${err.message}</p>`;
        sessionStorage.removeItem("spotifyToken"); // clear invalid token
        setTimeout(() => location.reload(), 2000); // reload to re-prompt
      }
    }
  
    moodButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const mood = button.getAttribute("data-mood");
        fetchPlaylists(mood);
      });
    });
  });