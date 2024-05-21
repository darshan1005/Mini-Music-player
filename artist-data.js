document.addEventListener("DOMContentLoaded", () => {
  const artistContainer = document.querySelector(".artist-list ul");
  const allArtistsContainer = document.querySelector(".allArtists ul");
  const playAndStopAllButton = document.querySelector(".playAndStopAllMusic");
  const searchInput = document.querySelector(".artist-search");

  let artistData = [
    {
      id: 1,
      img: "artist/Libinca.jpg",
      artistName: "Libinca",
      songs: ["music/High School.mp3"],
    },
    {
      id: 2,
      img: "artist/Passenger.jpg",
      artistName: "Passenger",
      songs: ["music/Let Her Go.mp3"],
    },
    {
      id: 3,
      img: "artist/Hesham.jpg",
      artistName: "Hesham",
      songs: ["music/Gaaju bomma.mp3", "music/Odiyamma.mp3"],
    },
    {
      id: 4,
      img: "artist/edsheeran.jpg",
      artistName: "Ed Sheeran",
      songs: [
        "music/Bad Habits.mp3",
        "music/shape-of-you.mp3",
        "music/shivers.mp3",
      ],
    },
  ];

  function renderArtists(artists) {
    allArtistsContainer.innerHTML = "";
    artists.forEach((artist) => {
      const listItem = document.createElement("li");
      const image = document.createElement("img");
      const title = document.createElement("h3");

      image.src = artist.img;
      image.alt = artist.artistName;

      title.textContent = artist.artistName;

      image.addEventListener("click", () => {
        displaySongs(artist);
      });

      listItem.appendChild(title);
      listItem.appendChild(image);
      allArtistsContainer.appendChild(listItem);
    });
  }

  function renderAllArtists() {
    renderArtists(artistData);
  }

  let currentlyPlayingAudio = null;

  function displaySongs(artist) {
    artistContainer.innerHTML = "";

    // Create an image for the artist
    const artistImage = document.createElement("img");
    artistImage.src = artist.img;
    artistImage.alt = artist.artistName;
    artistImage.classList.add("artist-image");

    // Append the artist image to the artist list
    artistContainer.appendChild(artistImage);

    artist.songs.forEach((songPath) => {
      const audio = document.createElement("audio");
      audio.src = songPath;
      audio.controls = true;

      // Extract the music name from the path
      const musicName = songPath.split("/").pop().split(".mp3")[0];

      const listItem = document.createElement("li");
      // Create a span element to display the music name
      const musicNameSpan = document.createElement("span");
      musicNameSpan.textContent = musicName;

      listItem.appendChild(audio);
      // Append the music name span to the list item
      listItem.appendChild(musicNameSpan);
      artistContainer.appendChild(listItem);

      // Add click event listener to the audio element
      audio.addEventListener("play", () => {
        if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
          currentlyPlayingAudio.pause(); // Pause previously playing audio
          setTimeout(() => {
            currentlyPlayingAudio.parentElement.classList.remove("playing"); // Remove playing class from previous audio's parent
            currentlyPlayingAudio = audio;
            currentlyPlayingAudio.parentElement.classList.add("playing"); // Add playing class to current audio's parent
          }, 50); // Adjust the delay as needed
        } else {
          currentlyPlayingAudio = audio;
          currentlyPlayingAudio.parentElement.classList.add("playing"); // Add playing class to current audio's parent
        }
        // Update Media Session metadata
        updateMediaSession(artist.artistName, musicName, artist.img);
      });

      // Add event listener to pause event
      audio.addEventListener("pause", () => {
        if (currentlyPlayingAudio) {
          currentlyPlayingAudio.parentElement.classList.remove("playing"); // Remove playing class when audio is paused
        }
      });
    });
    // Reset the Play All Songs button
    isPlayingAll = false;
    playAndStopAllButton.innerHTML = "PlayAll Songs";
    navigator.mediaSession.playbackState = "none";
  }

  function updateMediaSession(artist, title, image) {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title,
        artist: artist,
        artwork: [{ src: image, sizes: "512x512", type: "image/jpeg" }],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        if (currentlyPlayingAudio) {
          currentlyPlayingAudio.play();
          navigator.mediaSession.playbackState = "playing";
        }
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        if (currentlyPlayingAudio) {
          currentlyPlayingAudio.pause();
          navigator.mediaSession.playbackState = "paused";
        }
      });

      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
    }
  }

  function playAllSongs() {
    const songs = artistContainer.querySelectorAll("audio");

    if (songs.length === 0) {
      return;
    }

    let currentIndex = 0;

    const playNextSong = () => {
      if (currentIndex < songs.length) {
        songs[currentIndex].play();
        songs[currentIndex].addEventListener("ended", playNextSong, {
          once: true,
        });
        currentIndex++;
      } else {
        currentIndex = 0;
        isPlayingAll = false;
        playAndStopAllButton.innerHTML = "PlayAll Songs";
        navigator.mediaSession.playbackState = "none";
      }
    };

    playNextSong();
  }

  function stopAllSongs() {
    const songs = artistContainer.querySelectorAll("audio");

    songs.forEach((song) => {
      song.pause();
      song.currentTime = 0;
    });
  }

  let isPlayingAll = false;

  function togglePlayAll() {
    if (isPlayingAll) {
      stopAllSongs();
      isPlayingAll = false;
      playAndStopAllButton.innerHTML = "PlayAll Songs";
    } else {
      playAllSongs();
      isPlayingAll = true;
      playAndStopAllButton.innerHTML = "StopAll Songs";
    }
  }

  playAndStopAllButton.addEventListener("click", togglePlayAll);

  // Search functionality for artists
  function searchArtists(query) {
    const searchTerm = query.toLowerCase();
    const filteredArtists = artistData.filter((artist) => {
      return artist.artistName.toLowerCase().includes(searchTerm);
    });
    return filteredArtists;
  }

  // Function to performSearch for the artist
  function performSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
      const filteredArtists = searchArtists(searchTerm);
      if (filteredArtists.length > 0) {
        renderArtists(filteredArtists);
      } else {
        // Display a message indicating no matching artists found
        allArtistsContainer.innerHTML = "<p>No matching artists found.</p>";
      }
    } else {
      // If the search input is empty, render all artists
      renderAllArtists();
    }
    stopAllSongs(); // Ensure all songs are stopped when a new search is made
    isPlayingAll = false; // Reset playAll state
    playAndStopAllButton.innerHTML = "PlayAll Songs"; // Reset button text
  }

  // Event listener for the search input keyup to trigger search on key press
  searchInput.addEventListener("keyup", performSearch);

  renderAllArtists();
});
