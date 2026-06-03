import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# 1. Konfigurasi Halaman (Membuat Tampilan Melebar)
st.set_page_config(page_title="GlowMinder Dashboard", layout="wide")

# 2. Judul Utama Dashboard
st.title("✨ GlowMinder: Skincare Weather Recommender")
st.write("Selamat datang di dashboard interaktif GlowMinder! Aplikasi ini menganalisis karakteristik produk skincare berdasarkan kebutuhan perlindungan cuaca.")

# 3. Membaca Data Yang Sudah Siap (Cached agar Cepat)
@st.cache_data
def load_data():
    return pd.read_csv('skincare_model_ready.csv')

df = load_data()

# 4. Menampilkan Metrik Ringkasan di Bagian Atas
st.subheader("📊 Ringkasan Dataset")
col1, col2, col3 = st.columns(3)
col1.metric("Total Produk Teranalisis", len(df))
col2.metric("Produk Multifungsi (Hybrid)", int(df['Is_Multifunction'].sum()))
col3.metric("Produk Fungsi Tunggal", len(df) - int(df['Is_Multifunction'].sum()))

st.markdown("---")

# 5. Bagian Visualisasi Grafik (Dibagi Menjadi 2 Kolom Kiri & Kanan)
st.subheader("📈 Insight Hasil Exploratory Data Analysis (EDA)")
graph_col1, graph_col2 = st.columns(2)

with graph_col1:
    st.write("### Proporsi Produk: Single vs Multifunction")
    fig1, ax1 = plt.subplots(figsize=(6, 6))
    
    counts = df['Is_Multifunction'].value_counts()
    # Mengembalikan angka 0 dan 1 menjadi teks label agar mudah dibaca di grafik
    labels = ['Single Function' if x == 0 else 'Multifunction' for x in counts.index]
    
    ax1.pie(counts, autopct='%1.1f%%', labels=labels, colors=['#ff9999', '#66b3ff'], startangle=90)
    ax1.axis('equal')
    st.pyplot(fig1)

with graph_col2:
    st.write("### Distribusi Jumlah Produk Per Kategori")
    fig2, ax2 = plt.subplots(figsize=(7, 6))
    
    # Menghitung total data dari kolom One-Hot Encoding yang sudah kamu buat
    tipe_counts = {
        'Moisturizer': df['Tipe_Moisturizer'].sum() if 'Tipe_Moisturizer' in df.columns else 0,
        'Serum': df['Tipe_Serum'].sum() if 'Tipe_Serum' in df.columns else 0,
        'Sunscreen': df['Tipe_Sunscreen'].sum() if 'Tipe_Sunscreen' in df.columns else 0
    }
    tipe_df = pd.DataFrame(list(tipe_counts.items()), columns=['Kategori', 'Jumlah'])
    
    sns.set_style("whitegrid")
    sns.barplot(data=tipe_df, x='Kategori', y='Jumlah', palette='Blues_d', ax=ax2)
    
    # Menambahkan angka di atas setiap batang grafik
    for p in ax2.patches:
        ax2.annotate(f'{int(p.get_height())}', (p.get_x() + p.get_width() / 2., p.get_height()),
                     ha='center', va='center', xytext=(0, 9), textcoords='offset points')
                     
    ax2.set_ylim(0, max(tipe_df['Jumlah']) + 100)
    ax2.set_xlabel('Kategori Produk')
    ax2.set_ylabel('Jumlah Tipe Skincare')
    st.pyplot(fig2)

st.markdown("---")

# 6. Menampilkan Tabel Data Berisi Preview 10 Baris Pertama
st.subheader("📋 Cuplikan Data Hasil Feature Engineering")
st.dataframe(df.head(10))
