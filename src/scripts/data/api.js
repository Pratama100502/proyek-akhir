import CONFIG from '../config';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  STORY_GUEST: `${CONFIG.BASE_URL}/stories/guest`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/unsubscribe`,
};

// Fungsi untuk menangani response API dan error
async function handleApiResponse(response) {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Terjadi kesalahan saat memproses request');
  }
  return result;
}

// Fungsi untuk mengonversi data URI menjadi Blob
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

// Fungsi pembantu untuk mengelola subscribe/unsubscribe push notification
async function managePushNotification(endpoint, method, data, token) {
  const response = await fetch(endpoint, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return await handleApiResponse(response);
}

const API = {
  async register({ name, email, password }) {
    console.log('Data yang dikirimkan ke API:', { name, email, password });

    const response = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await handleApiResponse(response);
    console.log('Hasil Response API:', result);
    return result;
  },

  async login({ email, password }) {
    console.log('Data login yang dikirim:', { email, password });

    const response = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await handleApiResponse(response);
    console.log('Hasil Response API:', result);
    return result.loginResult;
  },

  async getAllStories(token) {
    const response = await fetch(`${ENDPOINTS.STORIES}?location=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await handleApiResponse(response);
    return result.listStory;
  },

  async getStoryById(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${ENDPOINTS.STORIES}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await handleApiResponse(response);
    return result.story;
  },

  async addStory({ description, imageData, latitude, longitude }, token) {
    const formData = new FormData();
    formData.append('description', description);
    if (latitude) formData.append('lat', latitude);
    if (longitude) formData.append('lon', longitude);
    const photoBlob = dataURItoBlob(imageData);
    formData.append('photo', photoBlob, 'story.jpg');

    const response = await fetch(ENDPOINTS.STORIES, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const result = await handleApiResponse(response);
    return result;
  },

  async subscribePushNotification({ endpoint, keys }, token) {
    const data = { endpoint, keys };
    return await managePushNotification(ENDPOINTS.SUBSCRIBE, 'POST', data, token);
  },

  async unsubscribePushNotification({ endpoint }, token) {
    const data = { endpoint };
    return await managePushNotification(ENDPOINTS.UNSUBSCRIBE, 'DELETE', data, token);
  },
};

export default API;
