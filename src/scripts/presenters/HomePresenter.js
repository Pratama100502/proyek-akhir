import API from '../data/api';

class HomePresenter {
  constructor({ displayStories, showError }, mapHandler) {
    this.displayStories = displayStories;
    this.showError = showError;
    this.mapHandler = mapHandler;
  }

  async loadStories(token) {
    try {
      const stories = await API.getAllStories(token);

      // Pastikan stories adalah array yang valid sebelum menjalankan forEach
      if (Array.isArray(stories) && stories.length > 0) {
        this.displayStories(stories);
      } else {
        throw new Error('Tidak ada cerita yang ditemukan.');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      this.showError(error);
    }
  }
}

export default HomePresenter;
