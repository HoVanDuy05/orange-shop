import { useEffect } from 'react';
import https from '../api/https';

// Thay public key của bạn từ backend (.env) vào đây:
const VAPID_PUBLIC_KEY = 'BKhMChl9eK8G1Ax7_eQyS8p1BVfogCzPAfi98I5w2Gs9R7KGrf_42omoVd4sA_IgAAm2qbMQp60sFPz1ZppNTLQ';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushSubscription(phoneNumber: string | null) {
  useEffect(() => {
    if (!phoneNumber) return;
    
    // Check if service workers and push messaging are supported
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Trình duyệt không hỗ trợ Web Push Notifications');
      return;
    }

    async function subscribeToPush() {
      try {
        // 1. Đăng ký Service Worker
        const register = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker đăng ký thành công');

        // 2. Yêu cầu quyền thông báo
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('❌ Người dùng từ chối nhận thông báo Push!');
          return;
        }

        // 3. Subscription (Lấy Token từ trình duyệt)
        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        // 4. Gửi Subscription và Số điện thoại lên Backend
        await https.post('/push/subscribe', {
          customer_phone: phoneNumber,
          subscription
        });

        console.log('🚀 Đăng ký nhận thông báo Push (Nền) thành công!');
      } catch (error) {
        console.error('Lỗi khi đăng ký Web Push:', error);
      }
    }

    subscribeToPush();
  }, [phoneNumber]);
}
