'use client';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function NotificationManager() {
  useEffect(() => {
    // 1. Request Permission on Mount
    if ('Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                toast.success('Notifications Enabled!');
                new Notification('Welcome to ShivSagar Tours!', {
                    body: 'We will notify you about the latest packages.',
                    icon: '/icons/icon-192x192.png'
                });
            }
        });
      }
    }

    // 2. Set Interval for 1 Hour (3600000 ms)
    const interval = setInterval(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        // Randomly pick a message
        const messages = [
            "New packages available in Goa! Check them out.",
            "Special discount on Rajasthan tours! Book now.",
            "Have you seen the Rann of Kutch lately? It's beautiful.",
            "Download our brochures to plan your next trip."
        ];
        const msg = messages[Math.floor(Math.random() * messages.length)];
        
        // Show Notification
        try {
            // Note: On mobile, service workers are usually required for background,
            // but while the app is "active" or in background (depending on OS battery opt), this might fire.
            // True background push requires VAPID server setup which is complex.
            // This meets the user's request for "every 1 hour" while the app is running.
            new Notification('ShivSagar Tours Alert', {
                body: msg,
                icon: '/icons/icon-192x192.png'
            });
        } catch (e) {
            console.error("Notification Error:", e);
        }
      }
    }, 3600000); // 1 Hour

    return () => clearInterval(interval);
  }, []);

  return null;
}
