import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import Nav from '../components/Nav';

export const metadata = {
  title: "Gamer's Conclave",
  description: "Share your PC build. Show your rig. Join the community.",
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