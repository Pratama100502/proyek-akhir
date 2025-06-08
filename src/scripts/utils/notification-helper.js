// push-notification.js

// Public key VAPID dari dokumentasi API
const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

// Fungsi untuk mengonversi public key dari format base64 ke Uint8Array
const convertBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const formattedBase64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(formattedBase64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

// Fungsi untuk menampilkan notifikasi lokal sebagai feedback kepada pengguna
const showNotificationSample = (message = 'Notifikasi percobaan') => {
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(message, {
        body: 'Notifikasi ini berasal dari StoryApp',
        icon: '/icons/icon-192x192.png',
      });
    });
  }
};

// Fungsi untuk mengaktifkan fitur push notification
export const subscribePushNotification = async () => {
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token tidak ditemukan. Tidak bisa melanjutkan pendaftaran push notification.');
    return;
  }

  const requestBody = JSON.stringify({
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.toJSON().keys.p256dh,
      auth: subscription.toJSON().keys.auth,
    },
  });

  try {
    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gagal melakukan langganan:', errorData);
    } else {
      console.log('Langganan push notification berhasil.');
      showNotificationSample('Anda berhasil  notifikasi');
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat mendaftar notifikasi:', error);
  }
};

// Fungsi untuk berhenti menerima push notification
export const unsubscribePushNotification = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) return;

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token tidak tersedia. Tidak bisa membatalkan langganan.');
    return;
  }

  try {
    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gagal membatalkan langganan:', errorData);
    } else {
      await subscription.unsubscribe();
      console.log('Berhasil berhenti dari push notification.');
      showNotificationSample('Anda telah berhenti notifikasi');
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat membatalkan langganan:', error);
  }
};

export { showNotificationSample };
