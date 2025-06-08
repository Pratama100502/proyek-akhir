import Camera from '../../views/components/Camera';
import Map from '../../views/components/Map';
import AddStoryPresenter from '../../presenters/AddStoryPresenter';
import '../../../styles/add.css';

const AddStoryPage = {
  async render() {
    return `
      <section class="container">
        <h1>Tambah Cerita</h1>
        
        <section class="camera-section">
          <video id="camera" autoplay></video>
          <button id="capture-btn">Ambil Foto</button>
          <canvas id="canvas" style="display: none;"></canvas>
          <img id="photo-preview" alt="Preview" />
          <input type="hidden" id="image-data">
        </section>

        <section class="map-section">
          <div id="map" style="height: 400px;"></div>
        </section>

        <section class="location-section">
          <input type="text" id="latitude" placeholder="Latitude" readonly />
          <input type="text" id="longitude" placeholder="Longitude" readonly />
        </section>

        <section class="description-section">
          <textarea id="description" placeholder="Deskripsi cerita"></textarea>
        </section>

        <button id="submit-btn">Tambah Cerita</button>
      </section>
    `;
  },

  async afterRender() {
    // Inisialisasi komponen Camera dan Map
    Camera.initialize();
    Map.init();

    // Inisialisasi presenter
    AddStoryPresenter.init();

    // Event listener untuk tombol submit
    document.getElementById('submit-btn').addEventListener('click', () => {
      const description = document.getElementById('description').value;
      const imageData = document.getElementById('image-data').value;
      const latitude = document.getElementById('latitude').value;
      const longitude = document.getElementById('longitude').value;

      // Validasi input
      if (description && imageData && latitude && longitude) {
        AddStoryPresenter.addStory(description, imageData, latitude, longitude)
          .then(() => {
            // Hentikan stream kamera setelah cerita berhasil disimpan
            Camera.stopStream();

            alert('Cerita berhasil ditambahkan!');
            window.location.hash = '/'; // Redirect ke halaman utama
          })
          .catch((error) => {
            console.error('Gagal menyimpan cerita:', error);
            alert('Terjadi kesalahan, coba lagi.');
          });
      } else {
        alert('Harap lengkapi semua kolom!');
      }
    });
     const handleHashChange = () => {
      Camera.stopStream();
      window.removeEventListener('hashchange', handleHashChange);
    };
    window.addEventListener('hashchange', handleHashChange);
  }
};

export default AddStoryPage;
