import API from '../data/api';

const AddStoryPresenter = {
  init() {
    // Jika ingin setup lain, bisa dilakukan di sini
  },

  async addStory(description, imageData, latitude, longitude) {
    console.log("Data yang dikirim:", { description, imageData, latitude, longitude });

    if (!description || !imageData || !latitude || !longitude) {
      alert("Semua data harus diisi!");
      return;
    }

    try {
      // Pastikan kamu mengatur token jika perlu (misalnya di localStorage atau context lain)
      const token = localStorage.getItem('token'); // Atur sesuai implementasi kamu
      if (!token) {
        alert("Token tidak ditemukan, silakan login terlebih dahulu.");
        return;
      }

      // Memanggil API untuk menambahkan story
      const response = await API.addStory(
        { description, imageData, latitude, longitude },
        token
      );

      console.log("Response dari API:", response);

      if (response.message === 'success') {
        alert("Story berhasil ditambahkan.");
      } 
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan saat menambahkan cerita.");
    }
  }
};

export default AddStoryPresenter;
