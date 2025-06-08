const AboutPage = {
  async render() {
    return `
      <section class="container">
      <h2>Tentang Aplikasi</h2>
    <p>Aplikasi ini dibuat sebagai bagian dari submission proyek pada kelas belajar web intermediate.</p>
  
    <h2>Fitur Utama</h2>
    <ul>
    <li>Menampilkan daftar cerita dari API</li>
    <li>Menambahkan cerita baru dengan foto dan peta lokasi</li>
    <li>Interaktif dengan kamera dan peta</li>
    <li>Transisi halaman halus menggunakan View Transition API</li>
    <li>Menerapkan Akses Ramah aksesibilitas</li>
    </ul>
  
     
    </section>

    `;
  },

  async afterRender() {
    // Do your job here
  }
};

export default AboutPage;
