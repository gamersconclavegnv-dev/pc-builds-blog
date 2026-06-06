import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import Nav from '../components/Nav';

export const metadata = {
  title: "Gamer's Conclave",
  description: "Share your PC build. Show your rig. Join the community.",
  openGraph: {
    title: "Gamer's Conclave",
    description: "Share your PC build. Show your rig. Join the community.",
    url: "https://gamersconclave.com",
    siteName: "Gamer's Conclave",
    images: [
      {
        url: "https://gamersconclave.com/og-image.png",
        width: 1200,
        height: 630,
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gamer's Conclave",
    description: "Share your PC build. Show your rig. Join the community.",
    images: ["https://gamersconclave.com/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Nav />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}