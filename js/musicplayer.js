const songs = [
    { name: "CN Tower", artist: "Drake", path: "audio/cn-tower-drake.mp3", img: "images/artists/cn-tower.jpg" },
    { name: "Hotline Bling", artist: "Drake", path: "audio/hotline-drake.mp3", img: "images/artists/hotline.jpg" },
    { name: "Passionfruit", artist: "Drake", path: "audio/passionfruit-drake.mp3", img: "images/artists/passionfruit.jpg" },
    { name: "Laugh Now Cry Later", artist: "Drake", path: "audio/laughnow-crylater-drake.mp3", img: "images/artists/laughnow.jpg" },
    { name: "Nokia", artist: "Drake", path: "audio/nokia-drake.mp3", img: "images/artists/nokia.jpg" }


];

let songIndex = parseInt(localStorage.getItem('musicIndex')) || 0;
const audio = document.getElementById('bg-music');
const playBtn = document.getElementById('play-btn');
const progress = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

function loadSong(index) {
    const song = songs[index];
    document.getElementById('track-name').innerText = song.name;
    document.getElementById('artist-name').innerText = song.artist;
    document.getElementById('artist-img').src = song.img;
    audio.src = song.path;
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2);
    currTimeEl.innerText = formatTime(currentTime);
    if(duration) durationEl.innerText = formatTime(duration);
    
    localStorage.setItem('musicTime', currentTime);
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

loadSong(songIndex);

audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerText = "⏸";
        localStorage.setItem('musicPlaying', 'true');
    } else {
        audio.pause();
        playBtn.innerText = "▶";
        localStorage.setItem('musicPlaying', 'false');
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songIndex);
    audio.play();
    playBtn.innerText = "⏸";
});

window.addEventListener('load', () => {
    const savedTime = localStorage.getItem('musicTime');
    const isPlaying = localStorage.getItem('musicPlaying') === 'true';
    if (savedTime) audio.currentTime = parseFloat(savedTime);
    if (isPlaying) {
        audio.play().catch(() => {
            document.addEventListener('click', () => audio.play(), { once: true });
        });
        playBtn.innerText = "⏸";
    }
});