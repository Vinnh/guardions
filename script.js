document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".menu-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.04)`;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audioPlayer");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const playPauseIcon = document.getElementById("playPauseIcon");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const togglePlaylistBtn = document.getElementById("togglePlaylistBtn");
  const closePlaylistBtn = document.getElementById("closePlaylistBtn");
  const playlistPanel = document.getElementById("playlistPanel");

  const podcastTitle = document.getElementById("podcastTitle");
  const podcastCover = document.getElementById("podcastCover");
  const episodeList = document.getElementById("episodeList");

  const progressBar = document.getElementById("progressBar");
  const progressFill = document.getElementById("progressFill");
  const currentTimeEl = document.getElementById("currentTime");
  const durationEl = document.getElementById("duration");

  if (!audio) return;

  const episodes = [
    {
      title: "Episódio 01",
      src: "audios/ep-1.mp3",
      cover: "imagens/ep-1.jpeg",
      duration: "27:34"
    },
    {
      title: "Episódio 02",
      src: "assets/audio/ep-2.mp3",
      cover: "assets/ep-2.jpeg",
      duration: "30:38"
    },
    {
      title: "Episódio 03",
      src: "assets/audio/ep-3.mp3",
      cover: "assets/ep-3.jpeg",
      duration: "23:54"
    }
  ];

  let currentEpisode = 0;

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function renderEpisodes() {
    episodeList.innerHTML = "";

    episodes.forEach((episode, index) => {
      const item = document.createElement("div");
      item.classList.add("episode-item");

      if (index === currentEpisode) {
        item.classList.add("active");
      }

      item.innerHTML = `
        <div class="episode-info">
          <div class="episode-name">${episode.title}</div>
        </div>
        <div class="episode-duration">${episode.duration}</div>
      `;

      item.addEventListener("click", () => {
        loadEpisode(index, true);
      });

      episodeList.appendChild(item);
    });
  }

  function loadEpisode(index, autoPlay = false) {
    currentEpisode = index;
    const episode = episodes[index];

    audio.src = episode.src;
    podcastTitle.textContent = episode.title;
    podcastCover.src = episode.cover;
    podcastCover.alt = `Capa de ${episode.title}`;

    currentTimeEl.textContent = "0:00";
    durationEl.textContent = episode.duration;
    progressFill.style.width = "0%";

    const thumb = progressBar.querySelector(".progress-thumb");
    if (thumb) thumb.style.left = "0%";

    renderEpisodes();

    if (autoPlay) {
      audio.play();
      playPauseIcon.classList.remove("fa-play");
      playPauseIcon.classList.add("fa-pause");
    } else {
      playPauseIcon.classList.remove("fa-pause");
      playPauseIcon.classList.add("fa-play");
    }
  }

  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playPauseIcon.classList.remove("fa-play");
      playPauseIcon.classList.add("fa-pause");
    } else {
      audio.pause();
      playPauseIcon.classList.remove("fa-pause");
      playPauseIcon.classList.add("fa-play");
    }
  });

  prevBtn.addEventListener("click", () => {
    currentEpisode = currentEpisode === 0 ? episodes.length - 1 : currentEpisode - 1;
    loadEpisode(currentEpisode, true);
  });

  nextBtn.addEventListener("click", () => {
    currentEpisode = currentEpisode === episodes.length - 1 ? 0 : currentEpisode + 1;
    loadEpisode(currentEpisode, true);
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progressPercent}%`;

    const thumb = progressBar.querySelector(".progress-thumb");
    if (thumb) thumb.style.left = `${progressPercent}%`;

    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  });

  progressBar.addEventListener("click", (e) => {
    if (!audio.duration) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    audio.currentTime = percent * audio.duration;
  });

  audio.addEventListener("ended", () => {
    currentEpisode = currentEpisode === episodes.length - 1 ? 0 : currentEpisode + 1;
    loadEpisode(currentEpisode, true);
  });

  audio.addEventListener("pause", () => {
    playPauseIcon.classList.remove("fa-pause");
    playPauseIcon.classList.add("fa-play");
  });

  audio.addEventListener("play", () => {
    playPauseIcon.classList.remove("fa-play");
    playPauseIcon.classList.add("fa-pause");
  });

  togglePlaylistBtn.addEventListener("click", () => {
    playlistPanel.classList.toggle("playlist-hidden");
  });

  closePlaylistBtn.addEventListener("click", () => {
    playlistPanel.classList.add("playlist-hidden");
  });

  loadEpisode(0, false);
});