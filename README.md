# 🗨️ ERChat - Chatting App

ERChat adalah aplikasi chatting modern berbasis web yang memungkinkan pengguna untuk berkomunikasi secara real-time dengan pengguna lain. Aplikasi ini dirancang agar mudah digunakan dan memberikan pengalaman chatting yang responsif.

---

## 🛠️ Teknologi Utama

- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)  
  Framework React untuk aplikasi web yang cepat dan scalable.  

- ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)  
  Backend untuk autentikasi dan database real-time.  

- ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)  
  Framework CSS untuk desain yang responsif dan modern.  

- ![SweetAlert2](https://img.shields.io/badge/SweetAlert2-48C9B0?style=for-the-badge&logo=javascript&logoColor=white)  
  Notifikasi dan dialog interaktif.

---

## 🌟 Fitur Utama

- **🔒 Authentication:** Pengguna harus mendaftar dan login untuk menggunakan aplikasi.  
- **📱 Chat Real-time:** Pesan yang dikirimkan akan langsung diterima pengguna lain tanpa refresh.  
- **🎨 UI Responsif:** Tampilan yang menarik di berbagai perangkat.  

---

## 🚀 Langkah Instalasi

Ikuti langkah-langkah berikut untuk menjalankan ERChat secara lokal.

### ⚙️ Prasyarat

- [Node.js](https://nodejs.org/) (versi terbaru).  
- [Git](https://git-scm.com/).  
- Akun Firebase dengan proyek yang sudah dikonfigurasi.  

### 📦 Instalasi dan Konfigurasi

1. **Clone repositori ini:**

   ```bash
   git clone https://github.com/username/erchat-chatting-app.git
   cd erchat-chatting-app
Instal dependensi:

bash
Copy code
npm install

Konfigurasi Firebase:

Masuk ke Firebase Console dan buat proyek baru.
Aktifkan Authentication (gunakan metode Email & Password).
Aktifkan Cloud Firestore untuk menyimpan pesan secara real-time.
Salin konfigurasi Firebase (Settings -> General -> Firebase SDK snippet).
Buat file .env.local di root folder proyek:

env
Copy code
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
Jalankan aplikasi:

bash
Copy code
npm run dev
Akses di browser:
Buka http://localhost:3000.


🎉 Mulai Chatting!
ERChat memberikan pengalaman chatting real-time yang mudah dan nyaman. Jelajahi fitur-fiturnya dan nikmati desain yang responsif. 🚀

Dibuat dengan 💙 oleh Rio
