import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import NotificationManager from '@/components/NotificationManager';
import SWRegister from '@/components/SWRegister';

export const metadata = {
  title: 'ShivSagar Tours',
  description: 'Premium Travel Packages in India',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#EAB308" />
      </head>
      <body className="flex flex-col min-h-screen">
        <SWRegister />
        <NotificationManager />
        <Toaster position="top-center" />
        <Navbar />
        <main className="grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
