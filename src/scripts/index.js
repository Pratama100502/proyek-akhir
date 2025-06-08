// src/scripts/index.js

import '../styles/styles.css';
import App from './pages/app';



document.addEventListener('DOMContentLoaded', async () => {
  const contentEl = document.querySelector('#main-content');
  const drawerBtn = document.querySelector('#drawer-button');
  const navDrawer = document.querySelector('#navigation-drawer');

  if (!contentEl || !drawerBtn || !navDrawer) {
    console.error('Elemen penting tidak ditemukan di DOM.');
    return;
  }

  const app = new App({
    content: contentEl,
    drawerButton: drawerBtn,
    navigationDrawer: navDrawer,
  });

  await app.renderPage();
  console.log('Halaman pertama dirender.');

 if ('serviceWorker' in navigator) {
  try {
    const registration = await navigator.serviceWorker.register('/sw.bundle.js');

    console.log('SW registered', registration);
    
    await showPushButtonIfLoggedIn(); 
  } catch (error) {
    console.error('SW registration failed:', error);
  }
}


  // Navigasi dengan View Transitions API
  window.addEventListener('hashchange', () => {
    if (document.startViewTransition) {
      try {
        document.startViewTransition(() => {
          app.renderPage();
        });
      } catch (e) {
        console.error('ViewTransition gagal:', e);
        app.renderPage();
      }
    } else {
      app.renderPage();
    }
  });
});
