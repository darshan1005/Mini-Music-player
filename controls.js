let music_index = 1;
let artistName = document.querySelector('.container .music-info .artist-name .artist');
let songName = document.querySelector('.container .music-info .song-name .song');
let musicImg = document.querySelector('.container .img-box img');
let playPauseBtn = document.querySelector('.container .play-pause-btn');
let currentTime = document.querySelector('.container .waveform-box .current-time');
let totalTime = document.querySelector('.container .waveform-box .total-time');
let nextSongBtn = document.querySelector('.container .btns-box .next-btn');
let prevSongBtn = document.querySelector('.container .btns-box .prev-btn');
let volumeIcon = document.querySelector('.container .volume-box .volume-icon');
let volumeIncreBtn = document.querySelector('.container .volume-box .volume-incre');
let volumeDecreBtn = document.querySelector('.container .volume-box .volume-decre');
let volumeInput = document.querySelector('.container .volume-box input');
let repeatBtn = document.querySelector('.container .repeat-btn');
let autoPlayBtn = document.querySelector('.container .autoplay-btn');

var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#ddd',
    progressColor: '#5467FF',
    barWidth: 2,
    responsive: true,
    height: 90,
    barRadius: 2
});

wavesurfer.load(`${allmusic[music_index - 1].src}.mp3`);

window.addEventListener('DOMContentLoaded', () => {
    loadMusic(music_index);
});

let loadMusic = () => {
    artistName.innerHTML = `${allmusic[music_index - 1].artist}`;
    songName.innerHTML = `${allmusic[music_index - 1].name}`;
    musicImg.src = `${allmusic[music_index - 1].img}.jpeg`;
};

playPauseBtn.addEventListener('click', () => {
    if (wavesurfer.isPlaying()) {
        wavesurfer.pause();
    } else {
        wavesurfer.play();
    }
    updatePlayPauseButton();
});

function updatePlayPauseButton() {
    if (wavesurfer.isPlaying()) {
        playPauseBtn.classList.remove('play');
        playPauseBtn.classList.add('pause');
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        musicImg.classList.add('rotate');
    } else {
        playPauseBtn.classList.remove('pause');
        playPauseBtn.classList.add('play');
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        musicImg.classList.remove('rotate');
    }
}

//time calculate
let timecalculator = function (value) {
    let second = Math.floor(value % 60);
    let minute = Math.floor(value / 60);

    if (second < 10) {
        second = "0" + second;
    }
    return `${minute}:${second}`;
}

//get total Time
wavesurfer.on("ready", () => {
    totalTime.innerHTML = timecalculator(wavesurfer.getDuration());
});

//Get Current Time
wavesurfer.on("audioprocess", () => {
    currentTime.innerHTML = timecalculator(wavesurfer.getCurrentTime());
});

let shouldRepeat = false;
let canAutoPlay = true;

wavesurfer.on('finish', () => {
    playPauseBtn.classList.remove('pause');
    playPauseBtn.classList.add('play');
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    musicImg.classList.remove('rotate');

    if (shouldRepeat) {
        wavesurfer.play();
        updatePlayPauseButton()
    } else {
        playNextSong();
        updatePlayPauseButton()
    }
});

nextSongBtn.addEventListener('click', () => {
    playNextSong();
});

prevSongBtn.addEventListener('click', () => {
    music_index--;
    music_index < 1 ? music_index = allmusic.length : music_index = music_index;
    loadMusic(music_index);
    wavesurfer.load(`${allmusic[music_index - 1].src}.mp3`);
    wavesurfer.setTime(0);

    if (playPauseBtn.classList.contains('play')) {
        playPauseBtn.classList.remove('play');
        playPauseBtn.classList.add('pause');
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        musicImg.classList.add('rotate');
    }
    wavesurfer.play();
});

volumeInput.addEventListener('input', () => {
    wavesurfer.setVolume(volumeInput.value);
    updateVolumeIcon();
});

volumeIncreBtn.addEventListener('click', () => {
    volumeInput.stepUp();
    wavesurfer.setVolume(volumeInput.value);
    updateVolumeIcon();
});

volumeDecreBtn.addEventListener('click', () => {
    volumeInput.stepDown();
    wavesurfer.setVolume(volumeInput.value);
    updateVolumeIcon();
});

function updateVolumeIcon() {
    if (volumeInput.value == 0) {
        volumeIcon.innerHTML = 'volume_off';
    } else {
        volumeIcon.innerHTML = 'volume_up';
    }
}

volumeIcon.addEventListener('click', () => {
    if (volumeInput.value == 0) {
        volumeIcon.innerHTML = 'volume_up';
        wavesurfer.setVolume(volumeInput.value = .2);
    } else {
        volumeIcon.innerHTML = 'volume_off';
        wavesurfer.setVolume(volumeInput.value = 0);
    }
});

repeatBtn.addEventListener('click', () => {
    shouldRepeat = !shouldRepeat;
    updateButtonState('.repeat-btn', shouldRepeat);
    if (shouldRepeat) {
        wavesurfer.un('finish'); // Remove previous finish event listener
        wavesurfer.on('finish', () => {
            setTimeout(() => {
                console.log("🔂 Replaying song after finish");
                wavesurfer.play();
            }, 500);
        });
    } else {
        console.log("🛑 Removing 'finish' event listener for repeat");
        wavesurfer.un('finish');
    }
});

autoPlayBtn.addEventListener('click', () => {
    canAutoPlay = !canAutoPlay;
    updateButtonState('.autoplay-btn', canAutoPlay);
});

function playNextSong() {
    music_index++;
    music_index > allmusic.length ? music_index = 1 : music_index = music_index;
    loadMusic(music_index);
    wavesurfer.load(`${allmusic[music_index - 1].src}.mp3`);
    wavesurfer.setTime(0);

    if (playPauseBtn.classList.contains('play')) {
        playPauseBtn.classList.remove('play');
        playPauseBtn.classList.add('pause');
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        musicImg.classList.add('rotate');
    }

    if (canAutoPlay) {
        wavesurfer.once('ready', () => {
            wavesurfer.play();
        });
    }
}

function updateButtonState(buttonSelector, isActive) {
    console.log(`🎚️ Updating button state for ${buttonSelector}: ${isActive ? 'Activated' : 'Deactivated'}`);
    const button = document.querySelector(buttonSelector);
    if (isActive) {
        button.classList.add('active');
    } else {
        button.classList.remove('active');
    }
}

function resetPlaylistOrder() {
    console.log("🔄 Resetting playlist order");
    allmusic.sort((a, b) => a.index - b.index);
    music_index = 1;
    loadMusic(music_index);
    wavesurfer.load(`${allmusic[music_index - 1].src}.mp3`);
}

wavesurfer.on('finish', playNextSong);

// suffle

let shuffle = false;

function toggleShuffle() {
    shuffle = !shuffle;
    updateButtonState('.shuffle-btn', shuffle);

    if (shuffle) {
        shufflePlaylist();
    } else {
        resetPlaylistOrder();
    }
}

function shufflePlaylist() {
    console.log("🔀 Shuffling playlist");
    for (let i = allmusic.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allmusic[i], allmusic[j]] = [allmusic[j], allmusic[i]];
    }
}

function playShuffledSong() {
    console.log("Playing shuffled song");
    music_index = 1;
    loadMusic(music_index);
    wavesurfer.load(`${allmusic[music_index - 1].src}.mp3`);

    wavesurfer.on('finish', () => {
        if (shuffle) {
            playNextShuffledSong();
        }
    });

    updatePlayPauseButton();
    wavesurfer.play();
}

function playNextShuffledSong() {
    music_index++;
    music_index > allmusic.length ? music_index = 1 : music_index = music_index;
    loadMusic(music_index);
    wavesurfer.load(`${allmusic[music_index - 1].src}.mp3`);
    wavesurfer.setTime(0);

    if (playPauseBtn.classList.contains('play')) {
        playPauseBtn.classList.remove('play');
        playPauseBtn.classList.add('pause');
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        musicImg.classList.add('rotate');
    }

    if (canAutoPlay) {
        wavesurfer.once('ready', () => {
            wavesurfer.play();
        });
    }
}

document.querySelector('.shuffle-btn').addEventListener('click', toggleShuffle);

// Keyboard event listener for 'Enter' key
document.addEventListener('keyup', (event) => {
    const keyCode = event.keyCode || event.which;

    if (keyCode === 13) { // Enter key
        console.log('Enter key pressed');
        playPauseBtn.click();
    }
});

