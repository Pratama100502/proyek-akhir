import API from '../data/api';

class LoginPresenter {
  async login(email, password) {
    try {
      // Memanggil fungsi login dari API dengan data email dan password
      const response = await API.login({ email, password });

      // Mengecek apakah login berhasil
      if (response && response.token) {
        // Menyimpan token ke localStorage setelah login berhasil
        localStorage.setItem('token', response.token);

        alert('Login berhasil!');  // Notifikasi sukses

        
        // Update navbar
        window.location.href = '#/'; // Arahkan ke halaman utama setelah login berhasil
      } else {
        alert('Login gagal: ' + response.message); // Menampilkan pesan gagal jika login tidak berhasil
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login gagal: ' + error.message);
    }
  }
}

export default LoginPresenter;
