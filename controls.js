let music_index = 0;
let artistName = document.querySelector(
  ".container .music-info .artist-name .artist"
);
let songName = document.querySelector(
  ".container .music-info .song-name .song"
);
let musicImg = document.querySelector(".container .img-box img");
let playPauseBtn = document.querySelector(".container .play-pause-btn");
let currentTime = document.querySelector(
  ".container .waveform-box .current-time"
);
let totalTime = document.querySelector(".container .waveform-box .total-time");
let nextSongBtn = document.querySelector(".container .btns-box .next-btn");
let prevSongBtn = document.querySelector(".container .btns-box .prev-btn");
let volumeIcon = document.querySelector(".container .volume-box .volume-icon");
let volumeIncreBtn = document.querySelector(
  ".container .volume-box .volume-incre"
);
let volumeDecreBtn = document.querySelector(
  ".container .volume-box .volume-decre"
);
let volumeInput = document.querySelector(".container .volume-box input");
let repeatBtn = document.querySelector(".container .repeat-btn");
let searchInput = document.querySelector(".song-search");
let songList = document.querySelector(".song-list ul");

var wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "#ddd",
  progressColor: "#5467FF",
  barWidth: 2,
  responsive: true,
  height: 90,
  barRadius: 2,
});

// Function to load music
let loadMusic = (index) => {
  music_index = index;
  wavesurfer.load(`${allmusic[music_index].src}.mp3`);
  artistName.innerHTML = allmusic[music_index].artist;
  songName.innerHTML = allmusic[music_index].name;
  musicImg.src = `${allmusic[music_index].img}.jpeg`;

  wavesurfer.once("ready", () => {
    if (!canAutoPlay) {
      playPauseBtn.classList.remove("play");
      playPauseBtn.classList.add("pause");
      playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      musicImg.classList.add("rotate");
    } else {
      playPauseBtn.classList.remove("pause");
      playPauseBtn.classList.add("play");
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      musicImg.classList.remove("rotate");
    }

    if (!canAutoPlay) {
      wavesurfer.pause();
    }
  });
};

// Initialize song slider
var songSlider = document.getElementById("song-slider");

wavesurfer.on("ready", function () {
  songSlider.max = wavesurfer.getDuration();
});

wavesurfer.on("audioprocess", function () {
  songSlider.value = wavesurfer.getCurrentTime();
});

songSlider.addEventListener("input", function () {
  wavesurfer.seekTo(songSlider.value / wavesurfer.getDuration());
});

// Event listener for DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  // Load initial music
  loadMusic(music_index);

  // Populate the initial song list
  allmusic.forEach((song, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${song.name} - ${song.artist}`;
    listItem.dataset.src = `${song.src}.mp3`;
    listItem.dataset.artist = song.artist;
    listItem.dataset.img = `${song.img}.jpeg`;
    listItem.dataset.index = index;
    listItem.addEventListener("click", () => {
      loadMusic(index);
      wavesurfer.load(`${song.src}.mp3`);
      wavesurfer.setTime(0);
      wavesurfer.once("ready", () => {
        wavesurfer.play();
        updatePlayPauseButton();
      });
    });
    songList.appendChild(listItem);
  });

  // Dynamic search functionality
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredSongs = allmusic.filter((song) => {
      return (
        song.name.toLowerCase().includes(searchTerm)||
        song.artist.toLowerCase().includes(searchTerm)
      );
    });

    // Clear the existing song list
    songList.innerHTML = "";

    // Populate the song list with filtered songs
    filteredSongs.forEach((song, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${song.name} - ${song.artist}`
      listItem.dataset.src = `${song.src}.mp3`;
      listItem.dataset.artist = song.artist;
      listItem.dataset.img = `${song.img}.jpeg`;
      listItem.dataset.index = allmusic.findIndex((item) => item === song);
      listItem.addEventListener("click", () => {
        const clickedIndex = parseInt(listItem.dataset.index); 
        loadMusic(clickedIndex);
        wavesurfer.load(`${song.src}.mp3`);
        wavesurfer.setTime(0);
        wavesurfer.once("ready", () => {
          wavesurfer.play();
          updatePlayPauseButton();
        });
      });
      songList.appendChild(listItem);
    });
  });

  // Initialize the recent streaming list when the page loads
  const recentSongs = JSON.parse(sessionStorage.getItem('recentSongs')) || [];
    recentSongs.forEach(song => {
        addToRecentStreaming(song.artist, song.song);
    });
});

// Event listener for play/pause button
playPauseBtn.addEventListener("click", () => {
  if (wavesurfer.isPlaying()) {
      wavesurfer.pause();
  } else {
      wavesurfer.play();
  }
  updatePlayPauseButton();

  const artist = allmusic[music_index].artist;
  const song = allmusic[music_index].name;

  storeRecentSong(artist, song);
});

// Function to update play/pause button state
function updatePlayPauseButton() {
  if (wavesurfer.isPlaying()) {
    playPauseBtn.classList.remove("play");
    playPauseBtn.classList.add("pause");
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    musicImg.classList.add("rotate");
  } else {
    playPauseBtn.classList.remove("pause");
    playPauseBtn.classList.add("play");
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    musicImg.classList.remove("rotate");
  }
}

// Function to calculate time
let timecalculator = function (value) {
  let second = Math.floor(value % 60);
  let minute = Math.floor(value / 60);

  if (second < 10) {
    second = "0" + second;
  }
  return `${minute}:${second}`;
};

// Get total Time
wavesurfer.on("ready", () => {
  totalTime.innerHTML = timecalculator(wavesurfer.getDuration());
});

// Get Current Time
wavesurfer.on("audioprocess", () => {
  currentTime.innerHTML = timecalculator(wavesurfer.getCurrentTime());
});

let shouldRepeat = false;
let canAutoPlay = true;

wavesurfer.on("finish", () => {
  playPauseBtn.classList.remove("pause");
  playPauseBtn.classList.add("play");
  playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  musicImg.classList.remove("rotate");

  if (shouldRepeat) {
    wavesurfer.play();
  } else {
    playNextSong();
  }
  updatePlayPauseButton();
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === "ArrowRight") {
    // Right arrow key
    nextSongBtn.click();
  } else if (key === "ArrowLeft") {
    // Left arrow key
    prevSongBtn.click();
  } else if (key === "ArrowUp") {
    // Up arrow key
    volumeIncreBtn.click();
  } else if (key === "ArrowDown") {
    // Down arrow key
    volumeDecreBtn.click();
  } else if (key === "Enter") {
    // Enter key
    playPauseBtn.click();
  } else if (event.shiftKey) {
    // Shift key
    volumeIcon.click();
  } else {
    console.log(`Key pressed: ${key}`);
  }
});

nextSongBtn.addEventListener("click", () => {
  playNextSong();
});

prevSongBtn.addEventListener("click", () => {
  music_index--;
  music_index < 0
    ? (music_index = songList.children.length - 1)
    : (music_index = music_index);
  loadMusic(music_index);
  wavesurfer.load(songList.children[music_index].dataset.src);
  wavesurfer.setTime(0);

  wavesurfer.once("ready", () => {
    wavesurfer.play();
    updatePlayPauseButton()
  });
});

volumeInput.addEventListener("input", () => {
  wavesurfer.setVolume(volumeInput.value);
  updateVolumeIcon();
});

volumeIncreBtn.addEventListener("click", () => {
  volumeInput.stepUp();
  wavesurfer.setVolume(volumeInput.value);
  updateVolumeIcon();
});

volumeDecreBtn.addEventListener("click", () => {
  volumeInput.stepDown();
  wavesurfer.setVolume(volumeInput.value);
  updateVolumeIcon();
});

function updateVolumeIcon() {
  if (volumeInput.value == 0) {
    volumeIcon.innerHTML = "volume_off";
  } else {
    volumeIcon.innerHTML = "volume_up";
  }
}

volumeIcon.addEventListener("click", () => {
  if (volumeInput.value == 0) {
    volumeIcon.innerHTML = "volume_up";
    wavesurfer.setVolume((volumeInput.value = 0.2));
  } else {
    volumeIcon.innerHTML = "volume_off";
    wavesurfer.setVolume((volumeInput.value = 0));
  }
});

repeatBtn.addEventListener("click", () => {
  shouldRepeat = !shouldRepeat;
  updateButtonState(".repeat-btn", shouldRepeat);
  if (shouldRepeat) {
    wavesurfer.un("finish");
    wavesurfer.on("finish", () => {
      setTimeout(() => {
        wavesurfer.play();
      }, 500);
    });
  } else {
    wavesurfer.un("finish");
  }
});

function updateButtonState(buttonSelector, isActive) {
  console.log(
    `🎚️ Updating button state for ${buttonSelector}: ${
      isActive ? "Activated" : "Deactivated"
    }`
  );
  const button = document.querySelector(buttonSelector);
  if (isActive) {
    button.classList.add("active");
  } else {
    button.classList.remove("active");
  }
}

function playNextSong() {
  wavesurfer.un("finish", playNextSong); 
  music_index++;
  if (music_index >= allmusic.length) {
    music_index = 0;
  }
  loadAndPlayMusic(music_index);
}

function loadAndPlayMusic(index) {
  loadMusic(index);
  wavesurfer.load(allmusic[index].src + ".mp3");
  wavesurfer.once("ready", () => {
    wavesurfer.play();
    updatePlayPauseButton();
    wavesurfer.on("finish", playNextSong); 
  });
}

let download_music_index = 0;
function downloadMusic() {

  if (download_music_index < 0 || download_music_index >= allmusic.length) {
    console.error('Invalid music index');
    return;
  }

  const currentMusic = allmusic[download_music_index];

  if (!currentMusic || !currentMusic.src) {
    console.error('Invalid music data');
    return;
  }

  const fileURL = currentMusic.src + '.mp3';
  const fileName = `${currentMusic.name} - ${currentMusic.artist}.mp3`;

  const link = document.createElement('a');
  link.href = fileURL;
  link.download = fileName;

  link.click();
}

const downloadButton = document.querySelector('.download-button');
downloadButton.addEventListener('click', downloadMusic);

// Recent song 
const addToRecentStreaming = (artist, song) => {
  const recentList = document.querySelector('.recent-music ul');
  // Remove the song if it already exists in the recent list
  const existingItem = [...recentList.children].find(item => {
    return item.dataset.artist === artist && item.dataset.song === song;
  });
  if (existingItem) {
    recentList.removeChild(existingItem);
  }
  // Add the song to the beginning of the recent list
  const listItem = document.createElement('li');
  listItem.textContent = `${artist} - ${song}`;
  listItem.dataset.artist = artist;
  listItem.dataset.song = song;
  listItem.addEventListener('click', () => {
    const clickedArtist = listItem.dataset.artist;
    const clickedSong = listItem.dataset.song;
    const clickedIndex = allmusic.findIndex(song => song.artist === clickedArtist && song.name === clickedSong);
    if (clickedIndex !== -1) {
      loadAndPlayMusic(clickedIndex);
    }
  });
  recentList.insertBefore(listItem, recentList.firstChild); // Insert at the beginning
}

const storeRecentSong = (artist, song) => {
  if (typeof(Storage) !== 'undefined') {
    let recentSongs = JSON.parse(sessionStorage.getItem('recentSongs')) || [];
    const index = recentSongs.findIndex(item => item.artist === artist && item.song === song);
    if (index !== -1) {
      // If the song already exists, remove it
      recentSongs.splice(index, 1);
    }
    // Add the song to the beginning of the recent songs array
    recentSongs.unshift({ artist, song });
    sessionStorage.setItem('recentSongs', JSON.stringify(recentSongs));
    addToRecentStreaming(artist, song);
  } else {
    console.error('Session storage is not supported.');
  }
}

// Function to play a song at a given index
function playSongAtIndex(index) {
  loadAndPlayMusic(index);

  // Retrieve artist and song name for the current index
  const artist = allmusic[index].artist;
  const song = allmusic[index].name;

  // Store the current song in recent streaming
  storeRecentSong(artist, song);
}

// Event listener for when a song is clicked from the song list
songList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
      const index = parseInt(event.target.dataset.index);
      playSongAtIndex(index);
  }
});

// Event listener for next song button
nextSongBtn.addEventListener("click", () => {
  music_index++;
  if (music_index >= allmusic.length) {
      music_index = 0;
  }
  playSongAtIndex(music_index);
});


// fav songs
const favSongList = document.getElementById('fav-song-list');
// Event listener for double-clicking on a song in the list
songList.addEventListener("dblclick", (event) => {
  if (event.target.tagName === "LI") {
    const index = parseInt(event.target.dataset.index);
    const songItem = event.target;

    // Toggle the favSong property of the clicked song
    allmusic[index].favSong = !allmusic[index].favSong;

    // Add or remove the "FAV" tag based on the favSong property
    if (allmusic[index].favSong) {
      // If the song is marked as favorite, add the "FAV" tag
      const favTag = document.createElement("span");
      favTag.classList.add("fav-tag");
      favTag.textContent = "❣️";
      songItem.appendChild(favTag);

      // Add the song to the "Favourite Songs" list
      const favSongItem = document.createElement("li");
      favSongItem.textContent = `${allmusic[index].name}-${allmusic[index].artist}`;
      favSongItem.dataset.index = index; // Add index to identify the song
      favSongList.appendChild(favSongItem);
    } else {
      // If the song is not marked as favorite, remove the "FAV" tag
      const favTag = songItem.querySelector(".fav-tag");
      if (favTag) {
        songItem.removeChild(favTag);
      }

      // Remove the song from the "Favourite Songs" list
      const favSongItem = favSongList.querySelector(`li[data-index="${index}"]`);
      if (favSongItem) {
        favSongList.removeChild(favSongItem);
      }
    }
  }
});

// Event listener for clicking on the "FAV" tag to remove a song from the fav list
songList.addEventListener("click", (event) => {
  if (event.target.classList.contains("fav-tag")) {
    const listItem = event.target.parentElement;
    const index = parseInt(listItem.dataset.index);

    // Toggle the favSong property of the clicked song
    allmusic[index].favSong = !allmusic[index].favSong;

    // Remove the "FAV" tag from the list item
    listItem.removeChild(event.target);

    // Remove the song from the fav-song list
    const favSongItem = favSongList.querySelector(`li[data-index="${index}"]`);
    if (favSongItem) {
      favSongList.removeChild(favSongItem);
    }
  }
});

// Event listener for clicking on a song in the fav-song list to play it
favSongList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    const index = parseInt(event.target.dataset.index);
    playSongAtIndex(index);

    // Add the played song to the recent streaming list
    const artist = allmusic[index].artist;
    const song = allmusic[index].name;
    storeRecentSong(artist, song);
  }
});