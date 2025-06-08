import HomePresenter from '../../presenters/HomePresenter';
import MapHandler from '../../utils/MapHandler';

const HomePage = {
  async render() {
    return `
      <h2>Daftar Story</h2>
      <div id="auth-buttons" class="auth-buttons"></div>
      <div id="story-list"></div>
      <div id="map" style="height: 400px;"></div>
    `;
  },

  async afterRender() {
    const authButtonsContainer = document.getElementById('auth-buttons');
    const storyContainer = document.getElementById('story-list');
    const mapHandler = new MapHandler('map'); // Pastikan ID map sesuai

    // Cek apakah ada token
    const token = localStorage.getItem('token');

    if (!token) {
      // Kalau belum login, tampilkan tombol Login dan Register
      
      storyContainer.innerHTML = '<p>Silakan login untuk melihat cerita.</p>';
      document.getElementById('map').style.display = 'none'; // Map disembunyikan kalau belum login
      return;
    }

    // Kalau sudah login, tampilkan stories
    mapHandler.initMap();

    const homePresenter = new HomePresenter({
      displayStories: (stories) => {
        storyContainer.innerHTML = '';
        stories.forEach((story) => {
          storyContainer.innerHTML += `
            <div class="story-card">
              <img src="${story.photoUrl}" alt="${story.name}" width="100" loading="lazy" />
              <h3>${story.name}</h3>
              <p><strong>Deskripsi:</strong> ${story.description}</p>
              <p><strong>Tanggal dibuat:</strong> ${new Date(story.createdAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <a href="#/detail/${story.id}" class="button">Lihat Detail</a>
            </div>
          `;
        });
        
        // Menambahkan markers ke peta
        mapHandler.addMarkers(stories); // Menambahkan marker berdasarkan stories yang ada
      },
      showError: (error) => {
        storyContainer.innerHTML = `<p>Gagal memuat story: ${error.message || 'Terjadi Kesalahan'}</p>`;
        console.error(error);
      }
    }, mapHandler);

    homePresenter.loadStories(token);
  }
};

export default HomePage;
