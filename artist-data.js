const artistContainer = document.querySelector('.artist-list ul');
const allArtistsContainer = document.querySelector('.allArtists');

let artistData = [
  {
    id: 1,
    img: 'artist/Libinca.jpg',
    artistName: 'Libinca',
    songs: [
      'music/High School.mp3',
    ]
  },
  {
    id: 2,
    img: 'artist/Passenger.jpg',
    artistName: 'passenger',
    songs: [
      'music/Let Her Go.mp3',
    ]
  },
  {
    id: 3,
    img: 'artist/Hesham.jpg',
    artistName: 'Hesham',
    songs: [
      'music/Gaaju bomma.mp3',
      'music/Odiyamma.mp3',
    ]
  },
  {
    id: 3,
    img: 'artist/edsheeran.jpg',
    artistName: 'Ed sheeran',
    songs: [
      'music/Bad Habits.mp3',
      'music/shape-of-you.mp3',
      'music/shivers.mp3'
    ]
  },
];

function renderAllArtists() {
  const allArtists = document.querySelector('.allArtists ul');
  allArtists.innerHTML = '';
  artistData.forEach(artist => {
    const listItem = document.createElement('li');
    const image = document.createElement('img');
    const title = document.createElement('h3');

    image.src = artist.img;
    image.alt = artist.artistName;

    title.textContent = artist.artistName;

    image.addEventListener('click', () => {
      // Display songs and apply grayscale filter
      displaySongs(artist);
    });

    listItem.appendChild(title);
    listItem.appendChild(image);
    allArtists.appendChild(listItem);
  });
}

let currentlyPlayingAudio = null;

function displaySongs(artist) {
  const artistList = document.querySelector('.artist-list ul');
  artistList.innerHTML = '';

  // Create an image for the artist
  const artistImage = document.createElement('img');
  artistImage.src = artist.img;
  artistImage.alt = artist.artistName;
  artistImage.classList.add('artist-image');

  // Append the artist image to the artist list
  artistList.appendChild(artistImage);

  artist.songs.forEach(songPath => {
    const audio = document.createElement('audio');
    audio.src = songPath;
    audio.controls = true;

    // Extract the music name from the path
    const musicName = songPath.split('/').pop().split('.mp3')[0];

    const listItem = document.createElement('li');
    // Create a span element to display the music name
    const musicNameSpan = document.createElement('span');
    musicNameSpan.textContent = musicName;

    listItem.appendChild(audio);
    // Append the music name span to the list item
    listItem.appendChild(musicNameSpan);
    artistList.appendChild(listItem);

    // Add drag event listeners to the audio element
    audio.addEventListener('dragstart', () => {
      // Store the current time when dragging starts
      audio.dataset.dragStartTime = audio.currentTime;
    });

    audio.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    audio.addEventListener('drop', (event) => {
      const dropTime = audio.dataset.dragStartTime + event.dataTransfer.getData('text') * 1;
      audio.currentTime = dropTime;
    });

    // Add click event listener to the audio element
    audio.addEventListener('play', () => {
      if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
        currentlyPlayingAudio.pause(); // Pause previously playing audio
        setTimeout(() => {
          currentlyPlayingAudio.parentElement.classList.remove('playing'); // Remove playing class from previous audio's parent
          currentlyPlayingAudio = audio;
          currentlyPlayingAudio.parentElement.classList.add('playing'); // Add playing class to current audio's parent
        }, 50); // Adjust the delay as needed
      } else {
        currentlyPlayingAudio = audio;
        currentlyPlayingAudio.parentElement.classList.add('playing'); // Add playing class to current audio's parent
      }
    });

    // Add event listener to pause event
    audio.addEventListener('pause', () => {
      currentlyPlayingAudio.parentElement.classList.remove('playing'); // Remove playing class when audio is paused
    });
  });
}

renderAllArtists();

function playAllSongs() {
  const artistList = document.querySelector('.artist-list ul');
  const songs = artistList.querySelectorAll('audio');

  if (songs.length === 0) {
    return;
  }

  let currentIndex = 0;

  songs[currentIndex].play();

  songs[currentIndex].addEventListener('ended', () => {
    currentIndex++;
    if (currentIndex < songs.length) {
      songs[currentIndex].play();
    } else {
      currentIndex = 0;
    }
  });
}

const playAndStopAllButton = document.querySelector('.playAndStopAllMusic');
function stopAllSongs() {
  const artistList = document.querySelector('.artist-list ul');
  const songs = artistList.querySelectorAll('audio');

  songs.forEach(song => {
    song.pause();
    song.currentTime = 0;
  });
}

let isPlayingAll = false;

function togglePlayAll() {
  if (isPlayingAll) {
    stopAllSongs();
    isPlayingAll = false;
    playAndStopAllButton.innerHTML = 'Play All';
  } else {
    playAllSongs();
    isPlayingAll = true;
    playAndStopAllButton.innerHTML = 'Stop All';
  }
}

playAndStopAllButton.addEventListener('click', togglePlayAll);
