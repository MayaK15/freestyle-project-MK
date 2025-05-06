document.addEventListener("DOMContentLoaded", () => {
    let token = sessionStorage.getItem("spotifyToken");
  
    if (!token) {
      token = prompt("Enter your Spotify access token:");
      sessionStorage.setItem("spotifyToken", token);
    }
  
    const moodButtons = document.querySelectorAll("[data-mood]");
    const playlistContainer = document.getElementById("playlist-container");
  
    moodButtons.forEach(button => {
      button.addEventListener("click", () => {
        const mood = button.getAttribute("data-mood");
        fetchPlaylists(mood);
      });
    });
  
    function fetchPlaylists(mood) {
      playlistContainer.innerHTML = "<p>Loading playlists...</p>";
  
      fetch(`https://api.spotify.com/v1/search?q=${mood}&type=playlist&limit=8`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) throw new Error("Invalid token or error fetching data");
        return response.json();
      })
      .then(data => {
        playlistContainer.innerHTML = "";
        const playlists = data.playlists.items;
  
        playlists.forEach(playlist => {
          const div = document.createElement("div");
          div.className = "playlist";
          div.innerHTML = `
            <img src="${playlist.images[0]?.url}" alt="Cover">
            <p><strong>${playlist.name}</strong></p>
            <a href="${playlist.external_urls.spotify}" target="_blank">Open in Spotify</a>
          `;
          playlistContainer.appendChild(div);
        });
      })
      .catch(err => {
        playlistContainer.innerHTML = `<p>Error: ${err.message}</p>`;
      });
    }
  });