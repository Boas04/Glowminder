# ✨ GlowMinder: Skincare Weather Recommender

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge.svg)](https://glowminder-dashboard.streamlit.app/)
[![Python Version](https://img.shields.io/badge/python-3.9%20%7C%203.10-blue.svg)](https://www.python.org/)
[![GitHub License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**GlowMinder** adalah sebuah platform dashboard interaktif berbasis data yang dirancang untuk merekomendasikan produk perawatan kulit (*skincare*) berdasarkan perubahan kondisi cuaca secara *real-time*. Proyek ini menganalisis karakteristik produk (seperti *Hydrator*, *Sebum Controller*, dan *Weather Protector*) berdasarkan kecocokan bahan aktif (*chemical signature*) yang terkandung di dalamnya.

🚀 **Live Dashboard:** [GlowMinder Dashboard](https://glowminder-dashboard.streamlit.app/)

---

## 📌 Latar Belakang & Permasalahan

* **Masalah:** Banyak pengguna mengalami ketidakkonsistenan hasil atau bahkan kerusakan *skin barrier* akibat salah memilih produk saat terjadi perubahan cuaca ekstrem (misalnya dari panas terik yang memicu minyak berlebih ke cuaca dingin/hujan yang membuat kulit kering).
* **Solusi:** GlowMinder mengintegrasikan data produk *skincare* dan mengekstrak bahan aktifnya untuk memberikan rekomendasi adaptif. Pendekatan ini mendukung tren **Skinimalism**, yaitu menyederhanakan tahapan perawatan dengan memanfaatkan produk multifungsi (*hybrid*) yang efisien secara tepat sasaran.

---

## 🛠️ Alur Proyek (End-to-End Data Science)

1. **Data Gathering:** Menggabungkan dataset internal (`product.xlsx`) dengan data publik penunjang (`skincare_products_clean.csv` & `product_info.csv`) dengan total **1.327 produk**.
2. **Data Assessing & Cleaning:** Menangani *missing values*, menghapus data duplikat, serta melakukan normalisasi teks dan *regex cleaning* pada daftar bahan (*ingredients list*).
3. **Feature Engineering:** * Ekstraksi bahan aktif kunci (*Ceramide*, *Hyaluronic Acid*, *Zinc Oxide*, *Salicylic Acid*, dll).
   * Pelabelan otomatis kategori fungsional cuaca.
   * Transformasi data kategori menggunakan *One-Hot Encoding* untuk kesiapan pemodelan.
4. **Exploratory Data Analysis (EDA):** Menemukan pola distribusi produk dan tren fungsionalitas di pasar.
5. **Statistical Testing (A/B Testing):** Membuktikan secara ilmiah perbedaan inovasi fungsional antar kategori produk.
6. **Deployment:** Membangun aplikasi web menggunakan Streamlit dan mempublikasikannya secara luas melalui Streamlit Cloud.

---

## 📊 Temuan Utama & Insight Bisnis (EDA)

* **Dominasi Hidrasi:** Kebutuhan dasar pasar sangat berpusat pada hidrasi, di mana **52,07%** produk dalam dataset diklasifikasikan sebagai *Hydrator* murni.
* **Tren Produk Hybrid:** Sebanyak **36,40% (483 produk)** dari keseluruhan dataset merupakan produk **Multifungsi** (memiliki lebih dari satu kemampuan proteksi cuaca, dominan pada kombinasi *Hydrator & Sebum Controller*).
* **Sunscreen sebagai Garde Terdepan:** Sebanyak **71,43%** produk *Sunscreen* yang tersedia sudah dilengkapi dengan agen hidrasi aktif, menjadikannya produk paling adaptif saat cuaca berubah mendadak.

---

## 🧪 Hasil A/B Testing (Uji Statistik)

Kami melakukan uji hipotesis menggunakan **Chi-Square Kontingensi** untuk melihat apakah terdapat perbedaan proporsi produk multifungsi yang signifikan antara kategori **Serum** dan **Moisturizer**.

* **Kelompok A (Moisturizer):** 195 dari 652 produk bersifat multifungsi (**29.91%**).
* **Kelompok B (Serum):** 211 dari 570 produk bersifat multifungsi (**37.02%**).
* **Nilai P-Value:** `0.01013` (Di bawah tingkat signifikansi $\alpha = 0.05$).

**Kesimpulan:** **Tolak H₀**. Terdapat perbedaan proporsi yang signifikan secara statistik. Industri *skincare* saat ini terbukti jauh lebih inovatif dalam menyematkan fungsi ganda ke dalam produk *Serum* dibandingkan *Moisturizer*.

---

## 💻 Struktur Repositori

```text
├── app.py                           # Kode utama dashboard Streamlit
├── requirements.txt                 # Daftar library Python yang dibutuhkan
├── skincare_model_ready.csv         # Dataset final hasil Feature Engineering
├── Data_Skincare.ipynb              # Notebook proses Wrangling, EDA, & A/B Testing
└── README.md                        # Dokumentasi proyek
