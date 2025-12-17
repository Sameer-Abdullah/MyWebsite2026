const songs = [
  { name: "CN Tower", artist: "Drake", path: "/audio/cn-tower-drake.mp3", img: "/images/artists/cn-tower.jpg" },
  { name: "Hotline Bling", artist: "Drake", path: "/audio/hotline-drake.mp3", img: "/images/artists/hotline.jpg" },
  { name: "Laugh Now", artist: "Drake", path: "/audio/laughnow-crylater-drake.mp3", img: "/images/artists/laughnow.jpg" },
  { name: "Nokia", artist: "Drake", path: "/audio/nokia-drake.mp3", img: "/images/artists/nokia.jpg" },
  { name: "Passionfruit", artist: "Drake", path: "/audio/passionfruit-drake.mp3", img: "/images/artists/passionfruit.jpg" },
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
    localStorage.setItem('musicIndex', index);
}

loadSong(songIndex);

audio.addEventListener('timeupdate', (e) => {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2);
    currTimeEl.innerText = formatTime(currentTime);
    if(duration) durationEl.innerText = formatTime(duration);
    
    localStorage.setItem('musicTime', currentTime);
});

progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
});

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
    localStorage.setItem('musicPlaying', 'true');
});

document.getElementById('prev-btn').addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songIndex);
    audio.play();
    playBtn.innerText = "⏸";
    localStorage.setItem('musicPlaying', 'true');
});

const resumeAudio = () => {
    const isPlaying = localStorage.getItem('musicPlaying') === 'true';
    const savedTime = localStorage.getItem('musicTime');

    if (isPlaying && audio.paused) {
        if (savedTime) audio.currentTime = parseFloat(savedTime);
        audio.play().then(() => {
            playBtn.innerText = "⏸";
        }).catch(err => console.log("Auto-play blocked"));
    }
};

window.addEventListener('load', resumeAudio);
document.addEventListener('touchstart', resumeAudio, { once: true });
document.addEventListener('click', resumeAudio, { once: true });