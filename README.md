# ABSENSI-API
REST API untuk Sistem Absensi Karyawan menggunakan:
-JavaScript (Bahasa Pemrograman)
-Express.js (FrameWork)
-MongoDB (Non-SQL Database)

## Cara Instalasi
1. Lakukan Clone dari Project ini pada Direktori Project Kalian
2. Pastikan "nodemon" sudah terinstal dan dapat berjalan. Jika belum terinstall, lakukan instalasi nodemon dengan perintah
...
npm install-g nodemon
...
3. Pastikan MongoDB Service sudah berjalan
4. Buatlah file .env di dalam root project, lalu tambahkan:
...
PROJECT_KEY = <project-key-kalian>
PROJECT_PORT =3001
MONGO_URI = <mongo-uri-kalian>
...
5. Install semua dependensi yang dibutuhkan oleh project ini menggunakan perintah:
...
npm install
...
6. Jalankan server dengan menggunakan perintah:
...
npm start
...
7. Server sudah berjalan, silahkan mencoba menjalankan absensi-api ini