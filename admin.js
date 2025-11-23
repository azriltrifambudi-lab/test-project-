// admin.js - upload ke localStorage key 'projects'; setelah sukses redirect ke visitor.html

(function(){
  const uploadBtn = document.getElementById('uploadBtn');
  const projectNameEl = document.getElementById('projectName');
  const purchaseLinkEl = document.getElementById('purchaseLink');
  const videoFileEl = document.getElementById('videoFile');
  const uploadStatusEl = document.getElementById('uploadStatus');

  uploadBtn.addEventListener('click', () => {
    uploadStatusEl.style.color = '#333';
    uploadStatusEl.textContent = '';

    const name = (projectNameEl.value || '').trim();
    const buyLink = (purchaseLinkEl.value || '').trim();
    const file = videoFileEl.files && videoFileEl.files[0];

    if (!name || !buyLink || !file) {
      uploadStatusEl.style.color = 'red';
      uploadStatusEl.textContent = 'Isi semua data (nama, link, dan file).';
      return;
    }

    uploadStatusEl.style.color = '#333';
    uploadStatusEl.textContent = 'Mengunggah... tunggu sebentar.';

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const storageKey = 'projects';
        const prev = JSON.parse(localStorage.getItem(storageKey) || '[]');

        prev.push({
          name: name,
          buyLink: buyLink,
          video: e.target.result,
          uploadedAt: Date.now()
        });

        localStorage.setItem(storageKey, JSON.stringify(prev));

        uploadStatusEl.style.color = 'green';
        uploadStatusEl.textContent = 'Upload berhasil — mengalihkan ke halaman pengunjung...';

        // Delay singkat supaya user lihat pesan lalu redirect
        setTimeout(() => {
          window.location.href = 'visitor.html';
        }, 700);

      } catch (err) {
        console.error('Error saat menyimpan:', err);
        uploadStatusEl.style.color = 'red';
        uploadStatusEl.textContent = 'Terjadi kesalahan saat menyimpan. Cek console.';
      }
    };

    reader.onerror = () => {
      uploadStatusEl.style.color = 'red';
      uploadStatusEl.textContent = 'Gagal membaca file. Coba lagi.';
    };

    reader.readAsDataURL(file);
  });
})();
