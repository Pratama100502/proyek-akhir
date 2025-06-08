import SavedPagePresenter from '../../presenters/SavePagePresenter';

const SavePage = {
  async render() {
    return `
      <section class="container">
        <h2>Laporan Tersimpan</h2>
        <div id="saved-stories" class="story-list"></div>
      </section>
    `;
  },

  async afterRender() {
    const container = document.getElementById('saved-stories');

    const presenter = new SavedPagePresenter({
      displayStories: (stories) => {
        if (stories.length === 0) {
          container.innerHTML = '<p>Tidak ada laporan yang disimpan.</p>';
          return;
        }

        container.innerHTML = stories.map((story) => `
          <div class="story-card" style="margin-bottom: 40px;">
            <img src="${story.photoUrl}" alt="${story.name}" width="100%" style="border-radius: 8px;" loading="lazy" />
            <h3>${story.name}</h3>
            <p><strong>Deskripsi:</strong> ${story.description}</p>
            <p><strong>Dibuat:</strong> ${new Date(story.createdAt).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>

            <div class="story-actions">
              <a href="#/detail/${story.id}" class="button">Lihat Detail</a>
            </div>
          </div>
        `).join('');
      }
    });

    await presenter.loadSavedStories();
  }
};

export default SavePage;
