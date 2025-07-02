let audio = new Audio();
let currentIndex = 0;
let playlist = [];
const fileInput = document.getElementById('fileInput');
const playlistEl = document.getElementById('playlist');
const playPauseBtn = document.getElementById('playPause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const speed = document.getElementById('speed');

volume.addEventListener('input', () => {
  audio.volume = volume.value;
  localStorage.setItem('volume', volume.value);
});

speed.addEventListener('change', () => {
  audio.playbackRate = parseFloat(speed.value);
});

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
};

progress.addEventListener('input', () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

fileInput.addEventListener('change', (e) => {
  for (let file of e.target.files) {
    const url = URL.createObjectURL(file);
    playlist.push({ name: file.name, url });
  }
  renderPlaylist();
  savePlaylist();
});

function renderPlaylist() {
  playlistEl.innerHTML = '';
  playlist.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = song.name;
    li.onclick = () => playSong(index);
    playlistEl.appendChild(li);
  });
}

function playSong(index) {
  if (playlist[index]) {
    audio.src = playlist[index].url;
    audio.play();
    currentIndex = index;
  }
}

playPauseBtn.onclick = () => {
  if (audio.paused) audio.play();
  else audio.pause();
};

prevBtn.onclick = () => {
  if (currentIndex > 0) playSong(currentIndex - 1);
};

nextBtn.onclick = () => {
  if (currentIndex < playlist.length - 1) playSong(currentIndex + 1);
};

function savePlaylist() {
  const data = playlist.map(song => ({ name: song.name, url: song.url }));
  localStorage.setItem('playlist', JSON.stringify(data));
}

function loadPlaylist() {
  const data = JSON.parse(localStorage.getItem('playlist') || '[]');
  playlist = data;
  renderPlaylist();
}

audio.volume = parseFloat(localStorage.getItem('volume') || 1);
loadPlaylist();