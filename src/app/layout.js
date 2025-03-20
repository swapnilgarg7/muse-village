import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/Navbar";
import { AuthUserProvider } from "../../firebase/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Muse Village",
  description: "Collaborate with musicians worldwide",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white`}>
        <AuthUserProvider>
          <ToastContainer />
          <Navbar />
          {children}
        </AuthUserProvider>
      </body>
    </html>
  );
}
