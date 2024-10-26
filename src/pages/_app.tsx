import ChatAppearProvider from "@/context/chatAppear";
import LoginSuccessProvider from "@/context/loginSuccess";
import MessagesProvider from "@/context/messages";
import NotificationProvider from "@/context/notificationAppear";
import SearchAppearProvider from "@/context/searchAppear";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

// FONTS :
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <LoginSuccessProvider>
        <ChatAppearProvider>
          <SearchAppearProvider>
            <NotificationProvider>
              <MessagesProvider>
                <Component {...pageProps} />
              </MessagesProvider>
            </NotificationProvider>
          </SearchAppearProvider>
        </ChatAppearProvider>
      </LoginSuccessProvider>
    </div>
  );
}
