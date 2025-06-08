import API from '../data/api';

class DetailPresenter {
  constructor({ displayStory, showError, handleCommentSuccess, handleCommentError }) {
    this.displayStory = displayStory;
    this.showError = showError;
    this.handleCommentSuccess = handleCommentSuccess;
    this.handleCommentError = handleCommentError;
  }

  async loadStory(id) {
    try {
      const token = localStorage.getItem('token');
      const story = await API.getStoryById(id, token);
      this.displayStory(story);
    } catch (error) {
      this.showError(error);
    }
  }

  async submitComment(storyId, commentText) {
    try {
      const token = localStorage.getItem('token');
      // Misal API komentar POST /stories/:id/comments
      const response = await API.addComment(storyId, commentText, token);
      this.handleCommentSuccess(response.message || 'Komentar berhasil dikirim.');
    } catch (error) {
      this.handleCommentError(error);
    }
  }
}

export default DetailPresenter;
