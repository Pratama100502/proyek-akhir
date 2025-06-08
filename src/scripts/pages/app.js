import { getActiveRoute } from '../routes/url-parser';
import routes from '../routes/routes';
import { subscribePushNotification, unsubscribePushNotification } from '../utils/notification-helper'; // Import helper untuk push notification

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];
    const token = localStorage.getItem('token');
    const protectedRoutes = ['/', '/about', '/add-story'];

    if (!token && protectedRoutes.includes(url)) {
      window.location.href = '#/login';
      return;
    }

    if (!page) {
      this.#content.innerHTML = '<h2>Halaman tidak ditemukan</h2>';
      return;
    }

    this.#content.innerHTML = await page.render();
    if (typeof page.afterRender === 'function') {
      await page.afterRender();
    }

    this._updateNavigation();
    this.showPushButtonIfLoggedIn(); // Pastikan tombol push muncul setelah login
  }

  _updateNavigation() {
    const token = localStorage.getItem('token');
    const navList = document.getElementById('nav-list');

    navList.innerHTML = token
      ? ` 
        <li><a href="#/">Beranda</a></li>
        <li><a href="#/about">About</a></li>
        <li><a href="#/add-story">Tambah Cerita</a></li>
        <li><a href="#/saved">Laporan Tersimpan</a></li>
        <li><a href="#/logout" id="logout">Logout</a></li>
        <li><button id="push-toggle" class="notif-button">Subscribe</button></li>
      `
      : ` 
        <li><a href="#/login">Login</a></li>
        <li><a href="#/register">Register</a></li>
      `;
    
    // Menangani aksi tombol push-notification
    const pushToggleBtn = document.getElementById('push-toggle');
    if (pushToggleBtn) {
      pushToggleBtn.addEventListener('click', async () => {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        try {
          if (subscription) {
            await unsubscribePushNotification(); // Unsubscribe
            pushToggleBtn.textContent = 'Subscribe'; // Update button text
          } else {
            await subscribePushNotification(); // Subscribe
            pushToggleBtn.textContent = 'Unsubscribe'; // Update button text
          }
        } catch (err) {
          console.error('Toggle push notification failed', err);
        }
      });
    }

    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
      logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = '#/login';
      });
    }
  }

  // Fungsi untuk menampilkan tombol subscribe hanya setelah login
  async showPushButtonIfLoggedIn() {
    const token = localStorage.getItem('token');
    const pushToggleBtn = document.getElementById('push-toggle');
    if (!token) return;

    pushToggleBtn.hidden = false; // Menampilkan tombol push toggle jika sudah login
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      pushToggleBtn.textContent = 'Unsubscribe'; // Jika sudah subscribe, tampilkan 'Unsubscribe'
    } else {
      pushToggleBtn.textContent = 'Subscribe'; // Jika belum subscribe, tampilkan 'Subscribe'
    }
  }
}

export default App;