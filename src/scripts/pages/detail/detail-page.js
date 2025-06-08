import '../../../styles/detail-page.css'; // Pastikan Anda mengimpor file CSS yang sesuai
import DetailPresenter from '../../presenters/DetailPresenter';
import MapHandler from '../../utils/MapHandler';
import SavedStoryDB from '../../data/database';

const DetailPage = {
  async render() {
    return `
      <section class="container">
        <h2>Detail Cerita</h2>
        <div id="story-detail" class="story-detail"></div>
        <div id="story-map" class="story-map" style="height: 300px; margin-top: 20px;"></div>

        <section class="comment-section">
          <h3>Berikan Komentar</h3>
          <div class="comment-input-area">
            <form id="comment-form">
              <textarea id="comment-input" rows="4" placeholder="Tulis tanggapan Anda di sini..." required></textarea>
              <button type="submit" class="btn">Kirim</button>
            </form>
            <button id="save-story-btn" class="btn"></button>
          </div>
          <div id="comment-feedback"></div>
        </section>
      </section>
    `;
  },

  async afterRender() {
    const storyDetailContainer = document.getElementById('story-detail');
    const mapContainer = document.getElementById('story-map');
    const commentForm = document.getElementById('comment-form');
    const commentFeedback = document.getElementById('comment-feedback');
    const saveStoryButton = document.getElementById('save-story-btn');
    const storyId = window.location.hash.split('/')[2];
    let currentStory = null;

    const presenter = new DetailPresenter({
      displayStory: async (story) => {
        currentStory = story;

        // Render detail cerita
        storyDetailContainer.innerHTML = `
          <img src="${story.photoUrl}" alt="${story.name}" width="100%" style="border-radius: 8px; margin-bottom: 20px;" />
          <h3>${story.name}</h3>
          <p><strong>Deskripsi:</strong> ${story.description}</p>
          <p><strong>Waktu Dibuat:</strong> ${new Date(story.createdAt).toLocaleString('id-ID')}</p>
        `;

        // Render map jika ada koordinat
        const mapHandler = new MapHandler(mapContainer);
        mapHandler.initMap();

        if (story.lat && story.lon) {
          mapHandler.addMarkers([story]);
        } else {
          mapContainer.innerHTML = '<p>Lokasi tidak tersedia</p>';
        }

        // Cek apakah cerita sudah disimpan
        const isSaved = await SavedStoryDB.getReport(story.id);
        saveStoryButton.textContent = isSaved ? 'Hapus dari Simpanan' : 'Simpan Story';
        // Tambahkan atau hapus atribut data-action berdasarkan status simpan
        if (isSaved) {
          saveStoryButton.setAttribute('data-action', 'delete');
        } else {
          saveStoryButton.removeAttribute('data-action');
        }
      },

      showError: (error) => {
        storyDetailContainer.innerHTML = `<p>Gagal memuat detail: ${error.message || 'Terjadi kesalahan.'}</p>`;
        console.error(error);
      },

      handleCommentSuccess: (message) => {
        commentFeedback.innerHTML = `<p class="success-message">${message}</p>`;
        commentForm.reset();
      },

      handleCommentError: (error) => {
        commentFeedback.innerHTML = `<p class="error-message">${error.message || 'Gagal mengirim komentar.'}</p>`;
      }
    });

    await presenter.loadStory(storyId);

    // Kirim komentar
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const commentText = document.getElementById('comment-input').value.trim();
      if (commentText) {
        await presenter.submitComment(storyId, commentText);
      }
    });

    // Simpan atau hapus dari simpanan
    saveStoryButton.addEventListener('click', async () => {
      if (!currentStory) return;

      const saved = await SavedStoryDB.getReport(currentStory.id);
      if (saved) {
        await SavedStoryDB.removeReport(currentStory.id);
        alert('Cerita dihapus dari simpanan.');
        saveStoryButton.textContent = 'Simpan Story';
        saveStoryButton.removeAttribute('data-action'); // Hapus atribut data-action saat dihapus
      } else {
        await SavedStoryDB.putReport(currentStory);
        alert('Cerita berhasil disimpan!');
        saveStoryButton.textContent = 'Hapus dari Simpanan';
        saveStoryButton.setAttribute('data-action', 'delete'); // Tambahkan atribut data-action saat disimpan
      }
    });
  }
};

export default DetailPage;