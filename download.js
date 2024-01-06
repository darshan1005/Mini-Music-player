let downloadButton = document.querySelector('.container .music-info .download-button');
downloadButton.addEventListener('click', () => {
    let currentMusic = allmusic[music_index - 1];

    let downloadLink = document.createElement('a');
    downloadLink.href = `${currentMusic.src}.mp3`;
    downloadLink.download = `${currentMusic.name} - ${currentMusic.artist}.mp3`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});