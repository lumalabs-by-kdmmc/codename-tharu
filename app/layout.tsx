import './globals.css';

export const metadata = {
  title: 'Tharā — AI Vedic Astrology, Palmistry & Dreams for Sri Lanka',
  description:
    'Authentic Sri Lankan Vedic astrology (handahana), palm reading, porondam matching, dream meanings and nekath — guided by AI, in Sinhala, Tamil and English.',
};

export const viewport = {
  themeColor: '#080816',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Noto+Sans+Sinhala:wght@400;600;700&family=Noto+Sans+Tamil:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
