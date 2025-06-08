import API from '../data/api';

class RegisterPresenter {
  async register(name, email, password) {
    try {
      // Memanggil fungsi register dari API dengan data name, email, dan password
      const response = await API.register({ name, email, password });

      // Mengecek apakah registrasi berhasil
      if (response && response.message === 'success') {
        // Menyimpan token jika ada (jika API mengirimkan token setelah registrasi)
        if (response.loginResult && response.loginResult.token) {
          localStorage.setItem('token', response.loginResult.token); // Simpan token ke localStorage
        }
        
        alert('Registration Berhasil');
        window.location.href = '#/login'; // Arahkan ke halaman login setelah registrasi berhasil
      } else {
        alert('Registration failed: ' + response.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed: ' + error.message);
    }
  }
}

export default RegisterPresenter;
