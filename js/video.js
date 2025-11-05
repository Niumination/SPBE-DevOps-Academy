// Video Player Manager for SPBE DevOps Academy
// Handles video playback, progress tracking, and integration with learning modules

class VideoManager {
  constructor() {
    this.currentVideo = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.volume = 0.7;
    this.playbackRate = 1;
    this.progressInterval = null;
    this.isInitialized = false;
  }

  async init() {
    try {
      this.setupEventListeners();
      this.isInitialized = true;
      console.log('Video Manager initialized');
    } catch (error) {
      console.error('Failed to initialize Video Manager:', error);
    }
  }

  setupEventListeners() {
    // Listen for video module events
    document.addEventListener('videomodule:load', (event) => {
      this.loadVideoModule(event.detail);
    });

    // Listen for video control events
    document.addEventListener('videocontrol:play', () => this.play());
    document.addEventListener('videocontrol:pause', () => this.pause());
    document.addEventListener('videocontrol:seek', (event) => this.seek(event.detail.time));
    document.addEventListener('videocontrol:volume', (event) => this.setVolume(event.detail.volume));
    document.addEventListener('videocontrol:fullscreen', () => this.toggleFullscreen());
  }

  async loadVideoModule(moduleData) {
    try {
      const { moduleId, videos } = moduleData;
      
      if (!videos || videos.length === 0) {
        console.log('No videos found for module:', moduleId);
        return;
      }

      this.currentModule = moduleData;
      this.currentVideoIndex = 0;
      this.renderVideoPlayer(videos[0]);
      this.renderVideoPlaylist(videos);
      
      // Track video module start
      if (window.progressManager) {
        await window.progressManager.trackActivity('video_start', {
          moduleId,
          videoTitle: videos[0].title
        });
      }
    } catch (error) {
      console.error('Error loading video module:', error);
      this.showVideoError('Gagal memuat video. Silakan coba lagi.');
    }
  }

  renderVideoPlayer(video) {
    const container = document.getElementById('video-container');
    if (!container) return;

    container.innerHTML = `
      <div class="video-container">
        <div class="video-wrapper">
          ${this.generateVideoEmbed(video)}
          <div class="video-loading" id="video-loading">
            <i class="fas fa-spinner"></i>
            <p>Memuat video...</p>
          </div>
          <div class="video-error" id="video-error" style="display: none;">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Gagal memuat video</p>
          </div>
        </div>
        <div class="video-controls">
          <button class="video-play-btn" id="video-play-btn">
            <i class="fas fa-play"></i>
          </button>
          <div class="video-progress" id="video-progress">
            <div class="video-progress-bar" id="video-progress-bar"></div>
          </div>
          <span class="video-time" id="video-time">0:00 / 0:00</span>
          <div class="video-volume">
            <button class="video-volume-btn" id="video-volume-btn">
              <i class="fas fa-volume-up"></i>
            </button>
            <div class="video-volume-slider" id="video-volume-slider">
              <div class="video-volume-level" id="video-volume-level"></div>
            </div>
          </div>
          <button class="video-fullscreen" id="video-fullscreen-btn">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
    `;

    this.setupVideoControls(video);
    this.hideLoading();
  }

  generateVideoEmbed(video) {
    if (video.type === 'youtube') {
      return this.generateYouTubeEmbed(video);
    } else if (video.type === 'vimeo') {
      return this.generateVimeoEmbed(video);
    } else if (video.type === 'direct') {
      return this.generateDirectVideoEmbed(video);
    } else {
      return this.generateGenericVideoEmbed(video);
    }
  }

  generateYouTubeEmbed(video) {
    const videoId = this.extractYouTubeId(video.url);
    return `
      <iframe 
        id="video-player"
        src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    `;
  }

  generateVimeoEmbed(video) {
    const videoId = this.extractVimeoId(video.url);
    return `
      <iframe 
        id="video-player"
        src="https://player.vimeo.com/video/${videoId}?api=1&byline=0&portrait=0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen>
      </iframe>
    `;
  }

  generateDirectVideoEmbed(video) {
    return `
      <video 
        id="video-player"
        controls
        preload="metadata"
        poster="${video.thumbnail || ''}">
        <source src="${video.url}" type="video/mp4">
        Browser Anda tidak mendukung video tag.
      </video>
    `;
  }

  generateGenericVideoEmbed(video) {
    return `
      <div class="video-placeholder">
        <div class="video-placeholder-content">
          <i class="fas fa-play-circle"></i>
          <h3>${video.title}</h3>
          <p>${video.description || 'Tidak ada deskripsi'}</p>
          <a href="${video.url}" target="_blank" class="btn btn--primary">
            <i class="fas fa-external-link-alt"></i> Tonton di Eksternal
          </a>
        </div>
      </div>
    `;
  }

  renderVideoPlaylist(videos) {
    const playlistContainer = document.getElementById('video-playlist');
    if (!playlistContainer || videos.length <= 1) return;

    playlistContainer.innerHTML = `
      <div class="video-playlist">
        <div class="video-playlist-header">
          <h3>Daftar Video</h3>
        </div>
        <div class="video-playlist-items">
          ${videos.map((video, index) => `
            <div class="video-playlist-item ${index === 0 ? 'active' : ''}" 
                 onclick="videoManager.selectVideo(${index})">
              <div class="video-playlist-thumbnail">
                ${video.thumbnail ? 
                  `<img src="${video.thumbnail}" alt="${video.title}">` : 
                  '<i class="fas fa-play"></i>'
                }
              </div>
              <div class="video-playlist-info">
                <div class="video-playlist-title">${video.title}</div>
                <div class="video-playlist-duration">${video.duration || 'N/A'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  setupVideoControls(video) {
    const playBtn = document.getElementById('video-play-btn');
    const progressBar = document.getElementById('video-progress');
    const volumeSlider = document.getElementById('video-volume-slider');
    const fullscreenBtn = document.getElementById('video-fullscreen-btn');

    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlay());
    }

    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.seek(percent * this.duration);
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('click', (e) => {
        const rect = volumeSlider.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.setVolume(percent);
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }

    // Setup video player events
    this.setupVideoPlayerEvents(video);
  }

  setupVideoPlayerEvents(video) {
    const player = document.getElementById('video-player');
    if (!player) return;

    if (video.type === 'direct' && player.tagName === 'VIDEO') {
      player.addEventListener('loadedmetadata', () => {
        this.duration = player.duration;
        this.updateTimeDisplay();
        this.hideLoading();
      });

      player.addEventListener('timeupdate', () => {
        this.currentTime = player.currentTime;
        this.updateProgress();
        this.updateTimeDisplay();
        this.trackProgress();
      });

      player.addEventListener('ended', () => {
        this.onVideoEnded();
      });

      player.addEventListener('error', () => {
        this.showVideoError('Gagal memuat video. Silakan periksa koneksi internet Anda.');
      });
    } else {
      // For embedded players (YouTube, Vimeo), we'll need to use their APIs
      // For now, simulate basic functionality
      setTimeout(() => {
        this.hideLoading();
        this.duration = video.durationSeconds || 300; // Default 5 minutes
        this.simulateProgress();
      }, 2000);
    }
  }

  simulateProgress() {
    // Simulate progress for embedded videos
    this.progressInterval = setInterval(() => {
      if (this.isPlaying && this.currentTime < this.duration) {
        this.currentTime += 1;
        this.updateProgress();
        this.updateTimeDisplay();
        this.trackProgress();
      } else if (this.currentTime >= this.duration) {
        this.onVideoEnded();
      }
    }, 1000);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    const player = document.getElementById('video-player');
    const playBtn = document.getElementById('video-play-btn');
    
    if (player && player.play) {
      player.play();
    }
    
    this.isPlaying = true;
    if (playBtn) {
      playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
  }

  pause() {
    const player = document.getElementById('video-player');
    const playBtn = document.getElementById('video-play-btn');
    
    if (player && player.pause) {
      player.pause();
    }
    
    this.isPlaying = false;
    if (playBtn) {
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  }

  seek(time) {
    const player = document.getElementById('video-player');
    if (player && player.currentTime !== undefined) {
      player.currentTime = time;
    }
    this.currentTime = time;
    this.updateProgress();
    this.updateTimeDisplay();
  }

  setVolume(volume) {
    const player = document.getElementById('video-player');
    const volumeLevel = document.getElementById('video-volume-level');
    const volumeBtn = document.getElementById('video-volume-btn');
    
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (player && player.volume !== undefined) {
      player.volume = this.volume;
    }
    
    if (volumeLevel) {
      volumeLevel.style.width = `${this.volume * 100}%`;
    }
    
    if (volumeBtn) {
      const icon = this.volume === 0 ? 'fa-volume-mute' : 
                   this.volume < 0.5 ? 'fa-volume-down' : 'fa-volume-up';
      volumeBtn.innerHTML = `<i class="fas ${icon}"></i>`;
    }
  }

  toggleFullscreen() {
    const container = document.querySelector('.video-container');
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  selectVideo(index) {
    if (!this.currentModule || !this.currentModule.videos) return;
    
    this.currentVideoIndex = index;
    const video = this.currentModule.videos[index];
    
    this.renderVideoPlayer(video);
    this.updatePlaylistSelection(index);
    
    // Track video selection
    if (window.progressManager) {
      window.progressManager.trackActivity('video_select', {
        moduleId: this.currentModule.moduleId,
        videoIndex: index,
        videoTitle: video.title
      });
    }
  }

  updatePlaylistSelection(activeIndex) {
    const items = document.querySelectorAll('.video-playlist-item');
    items.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  updateProgress() {
    const progressBar = document.getElementById('video-progress-bar');
    if (progressBar && this.duration > 0) {
      const percent = (this.currentTime / this.duration) * 100;
      progressBar.style.width = `${percent}%`;
    }
  }

  updateTimeDisplay() {
    const timeDisplay = document.getElementById('video-time');
    if (timeDisplay) {
      const current = this.formatTime(this.currentTime);
      const total = this.formatTime(this.duration);
      timeDisplay.textContent = `${current} / ${total}`;
    }
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  trackProgress() {
    if (!this.currentModule) return;
    
    // Track progress every 10 seconds
    if (Math.floor(this.currentTime) % 10 === 0) {
      const progressPercent = (this.currentTime / this.duration) * 100;
      
      if (window.progressManager) {
        window.progressManager.trackVideoProgress(
          this.currentModule.moduleId,
          this.currentVideoIndex,
          this.currentTime,
          progressPercent
        );
      }
    }
  }

  async onVideoEnded() {
    this.isPlaying = false;
    clearInterval(this.progressInterval);
    
    // Mark video as completed
    if (window.progressManager && this.currentModule) {
      await window.progressManager.markVideoCompleted(
        this.currentModule.moduleId,
        this.currentVideoIndex
      );
    }
    
    // Auto-play next video if available
    if (this.currentModule && 
        this.currentModule.videos && 
        this.currentVideoIndex < this.currentModule.videos.length - 1) {
      
      setTimeout(() => {
        this.selectVideo(this.currentVideoIndex + 1);
        this.play();
      }, 2000);
    }
  }

  showVideoError(message) {
    const loading = document.getElementById('video-loading');
    const error = document.getElementById('video-error');
    
    if (loading) loading.style.display = 'none';
    if (error) {
      error.style.display = 'flex';
      error.querySelector('p').textContent = message;
    }
  }

  hideLoading() {
    const loading = document.getElementById('video-loading');
    if (loading) {
      loading.style.display = 'none';
    }
  }

  extractYouTubeId(url) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  extractVimeoId(url) {
    const regex = /vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  // Public methods for external control
  getCurrentTime() {
    return this.currentTime;
  }

  getDuration() {
    return this.duration;
  }

  getProgress() {
    return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
  }

  isVideoPlaying() {
    return this.isPlaying;
  }

  destroy() {
    clearInterval(this.progressInterval);
    this.currentVideo = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
  }
}

// Initialize video manager
window.videoManager = new VideoManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => videoManager.init());
} else {
  videoManager.init();
}