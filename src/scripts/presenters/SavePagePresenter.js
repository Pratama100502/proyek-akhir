import SavedStoryDB from '../data/database';

class SavedPagePresenter {
  constructor({ displayStories }) {
    this.displayStories = displayStories;
  }

  async loadSavedStories() {
    try {
      const stories = await SavedStoryDB.getAllReports();
      this.displayStories(stories);
    } catch (error) {
      console.error('Gagal memuat laporan tersimpan:', error);
      this.displayStories([]); // fallback untuk menghindari crash
    }
  }

  async removeStory(id) {
    try {
      await SavedStoryDB.removeReport(id);
    } catch (error) {
      console.error(`Gagal menghapus laporan dengan id ${id}:`, error);
    }
  }
}

export default SavedPagePresenter;
