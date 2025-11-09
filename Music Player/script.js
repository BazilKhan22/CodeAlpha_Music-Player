class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audio-player');
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.isRepeating = false;
        this.originalPlaylist = [];
        
        this.songs = [
            {
                title: "Sunset Dreams",
                artist: "Lofi Beats",
                album: "Chill Vibes",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                duration: "0:15",
                cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300"
            },
            {
                title: "Urban Nights",
                artist: "City Sounds",
                album: "Metropolitan",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                duration: "0:15", 
                cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300"
            },
            {
                title: "Ocean Breeze",
                artist: "Nature Waves", 
                album: "Natural Sounds",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                duration: "0:15",
                cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300"
            }
        ];

        this.initializePlayer();
        this.setupEventListeners();
        this.loadPlaylist();
        this.loadSong(this.currentSongIndex);
    }

    initializePlayer() {
        this.updateSongInfo();
        this.updatePlaylist();
    }

    setupEventListeners() {
        // Play/Pause
        document.getElementById('play-pause').addEventListener('click', () => {
            this.togglePlay();
        });

        // Next/Previous
        document.getElementById('next').addEventListener('click', () => {
            this.nextSong();
        });

        document.getElementById('prev').addEventListener('click', () => {
            this.previousSong();
        });

        // Shuffle and Repeat
        document.getElementById('shuffle').addEventListener('click', () => {
            this.toggleShuffle();
        });

        document.getElementById('repeat').addEventListener('click', () => {
            this.toggleRepeat();
        });

        // Progress Bar
        document.querySelector('.progress-bar').addEventListener('click', (e) => {
            this.seek(e);
        });

        // Volume Control
        document.querySelector('.volume-bar').addEventListener('click', (e) => {
            this.setVolume(e);
        });

        // Audio Events
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audio.addEventListener('ended', () => {
            this.songEnded();
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });

        // Autoplay
        document.getElementById('autoplay').addEventListener('change', (e) => {
            this.audio.autoplay = e.target.checked;
        });
    }

    togglePlay() {
        const playPauseBtn = document.getElementById('play-pause');
        const albumArt = document.querySelector('.album-art');

        if (this.isPlaying) {
            this.audio.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtn.title = "Play";
            albumArt.classList.remove('playing');
        } else {
            this.audio.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseBtn.title = "Pause";
            albumArt.classList.add('playing');
        }
        this.isPlaying = !this.isPlaying;
    }

    loadSong(index) {
        this.currentSongIndex = index;
        const song = this.songs[index];
        
        this.audio.src = song.src;
        this.updateSongInfo();
        this.updateActivePlaylistItem();
        
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    updateSongInfo() {
        const song = this.songs[this.currentSongIndex];
        
        document.getElementById('song-title').textContent = song.title;
        document.getElementById('song-artist').textContent = song.artist;
        document.getElementById('song-album').textContent = song.album;
        document.getElementById('album-image').src = song.cover;
        document.getElementById('album-image').alt = `${song.title} - ${song.artist}`;
    }

    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.loadSong(this.currentSongIndex);
    }

    previousSong() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.loadSong(this.currentSongIndex);
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        const shuffleBtn = document.getElementById('shuffle');
        
        if (this.isShuffled) {
            shuffleBtn.classList.add('active');
            shuffleBtn.title = "Shuffle: On";
            this.shufflePlaylist();
        } else {
            shuffleBtn.classList.remove('active');
            shuffleBtn.title = "Shuffle: Off";
            this.restorePlaylist();
        }
    }

    toggleRepeat() {
        this.isRepeating = !this.isRepeating;
        const repeatBtn = document.getElementById('repeat');
        
        if (this.isRepeating) {
            repeatBtn.classList.add('active');
            repeatBtn.title = "Repeat: On";
            this.audio.loop = true;
        } else {
            repeatBtn.classList.remove('active');
            repeatBtn.title = "Repeat: Off";
            this.audio.loop = false;
        }
    }

    shufflePlaylist() {
        this.originalPlaylist = [...this.songs];
        this.songs = [...this.songs].sort(() => Math.random() - 0.5);
        this.updatePlaylist();
    }

    restorePlaylist() {
        if (this.originalPlaylist.length > 0) {
            this.songs = [...this.originalPlaylist];
            this.updatePlaylist();
        }
    }

    updateProgress() {
        const progress = document.getElementById('progress');
        const currentTime = document.getElementById('current-time');
        
        if (this.audio.duration) {
            const progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
            progress.style.width = `${progressPercent}%`;
            
            currentTime.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    updateDuration() {
        const duration = document.getElementById('duration');
        duration.textContent = this.formatTime(this.audio.duration);
    }

    seek(e) {
        const progressBar = e.currentTarget;
        const clickPosition = e.offsetX;
        const progressBarWidth = progressBar.clientWidth;
        const seekTime = (clickPosition / progressBarWidth) * this.audio.duration;
        
        this.audio.currentTime = seekTime;
    }

    setVolume(e) {
        const volumeBar = e.currentTarget;
        const clickPosition = e.offsetX;
        const volumeBarWidth = volumeBar.clientWidth;
        const volume = clickPosition / volumeBarWidth;
        
        this.audio.volume = volume;
        document.getElementById('volume-progress').style.width = `${volume * 100}%`;
        
        // Update volume icon
        const volumeIcon = document.querySelector('.volume-icon');
        if (volume === 0) {
            volumeIcon.className = 'fas fa-volume-mute volume-icon';
        } else if (volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down volume-icon';
        } else {
            volumeIcon.className = 'fas fa-volume-up volume-icon';
        }
    }

    songEnded() {
        if (!this.isRepeating) {
            this.nextSong();
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    loadPlaylist() {
        const playlist = document.getElementById('playlist');
        playlist.innerHTML = '';

        this.songs.forEach((song, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.className = `playlist-item ${index === this.currentSongIndex ? 'active' : ''}`;
            playlistItem.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div class="playlist-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                <span class="playlist-duration">${song.duration}</span>
            `;
            
            playlistItem.addEventListener('click', () => {
                this.loadSong(index);
                if (this.isPlaying) {
                    this.audio.play();
                }
            });
            
            playlist.appendChild(playlistItem);
        });

        document.getElementById('playlist-count').textContent = `(${this.songs.length} songs)`;
    }

    updatePlaylist() {
        this.loadPlaylist();
    }

    updateActivePlaylistItem() {
        document.querySelectorAll('.playlist-item').forEach((item, index) => {
            if (index === this.currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// Initialize music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});