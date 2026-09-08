let currentMode = 'lpm'; // Mode awal 'lpm' atau 'lpfp'
let currentFreq = 1;     // Frekuensi awal 1x sebar
let currentHari = 1;     // Durasi awal 1 hari

// Status awal semua Add-on (false = Off)
let addonsState = {
    inrush: false,
    store: false,
    berfoto: false,
    bervideo: false
};

// Biaya tambahan dari masing-masing add-on
const addonFees = {
    inrush: 100,
    store: 100,
    berfoto: 25,
    bervideo: 50
};

// Daftar pilihan grup dari 50 sampai 1000
const grupList = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000];

// Inisialisasi opsi pada elemen dropdown Grup
const selectGrup = document.getElementById('select-grup');
grupList.forEach(g => {
    let opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    selectGrup.appendChild(opt);
});

// Inisialisasi tombol pilihan Hari (1 sampai 7)
const hariContainer = document.getElementById('hari-container');
for(let i = 1; i <= 7; i++) {
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.id = `btn-hari-${i}`;
    btn.className = `hari-btn py-2 px-1 rounded-xl border border-slate-600 bg-slate-700 text-xs font-semibold transition hover:border-indigo-500 focus:outline-none`;
    btn.textContent = `${i} H`;
    btn.onclick = () => setHari(i);
    hariContainer.appendChild(btn);
}

// Fungsi untuk mengganti mode (LPM / LPFP)
function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('bg-indigo-600', 'border-indigo-500'));
    document.getElementById(`btn-mode-${mode}`).classList.add('bg-indigo-600', 'border-indigo-500');
    hitungHarga();
}

// Fungsi untuk mengganti frekuensi sebar per hari
function setFrekuensi(freq) {
    currentFreq = freq;
    document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('bg-indigo-600', 'border-indigo-500'));
    document.getElementById(`btn-freq-${freq}`).classList.add('bg-indigo-600', 'border-indigo-500');
    hitungHarga();
}

// Fungsi untuk memilih durasi hari
function setHari(h) {
    currentHari = h;
    document.querySelectorAll('.hari-btn').forEach(b => b.classList.remove('bg-indigo-600', 'border-indigo-500'));
    document.getElementById(`btn-hari-${h}`).classList.add('bg-indigo-600', 'border-indigo-500');
    hitungHarga();
}

// Fungsi untuk mengaktifkan/menonaktifkan Add-on (On/Off)
function toggleAddon(name) {
    addonsState[name] = !addonsState[name];
    const btn = document.getElementById(`addon-${name}`);
    const toggle = document.getElementById(`toggle-${name}`);
    
    if (addonsState[name]) {
        btn.classList.remove('bg-slate-600');
        btn.classList.add('bg-indigo-600');
        toggle.classList.add('translate-x-6');
    } else {
        btn.classList.remove('bg-indigo-600');
        btn.classList.add('bg-slate-600');
        toggle.classList.remove('translate-x-6');
    }
    hitungHarga();
}

// Rumus perhitungan nilai dasar sesuai tabel tarif asli
function getBaseValue(grup, hari, mode) {
    let base1Hari = 0;
    if (mode === 'lpm') {
        // LPM: Nilai dasar untuk 1 hari sesuai screenshot pertama (misal grup 50 = 50)
        base1Hari = grup; 
    } else {
        // LPFP: Nilai dasar untuk 1 hari sesuai screenshot kedua (misal grup 50 = 75)
        base1Hari = grup + 25;
    }
    return (base1Hari + ((hari - 1) * base1Hari));
}

// Fungsi utama menghitung total harga akhir
function hitungHarga() {
    const grup = parseInt(selectGrup.value);
    const hari = currentHari;
    const freq = currentFreq;

    let hargaDasarPerHari = getBaseValue(grup, hari, currentMode);
    let totalNilai = hargaDasarPerHari * freq;

    // Tambahkan fee add-on jika saklar aktif (On)
    let totalAddonFee = 0;
    let activeAddonsList = [];
    for (let key in addonsState) {
        if (addonsState[key]) {
            totalAddonFee += addonFees[key];
            activeAddonsList.push(key.charAt(0).toUpperCase() + key.slice(1));
        }
    }

    let hargaFinal = totalNilai + totalAddonFee;

    // Tampilkan hasil format angka ke dalam elemen HTML
    document.getElementById('result-price').textContent = hargaFinal.toLocaleString('id-ID');
    
    let detailText = `${currentMode.toUpperCase()} • ${freq}× Sebar • Grup ${grup} • ${hari} Hari`;
    if (activeAddonsList.length > 0) {
        detailText += ` • Add-on: ${activeAddonsList.join(', ')}`;
    }
    document.getElementById('result-detail').textContent = detailText;
}

// Membuka atau menutup modal tabel referensi
function toggleTable() {
    const modal = document.getElementById('modal-table');
    modal.classList.toggle('hidden');
    if(!modal.classList.contains('hidden')) {
        document.getElementById('modal-title-text').textContent = `Tabel Tarif Referensi (${currentMode.toUpperCase()} - ${currentFreq}× Sebar)`;
        populasiTabel();
    }
}

// Mengisi data tabel referensi secara dinamis
function populasiTabel() {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';
    grupList.forEach(g => {
        let tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-700/50';
        let html = `<td class="p-3 font-semibold text-slate-200">${g}</td>`;

        for(let h = 1; h <= 7; h++) {
            let val = getBaseValue(g, h, currentMode) * currentFreq;
            html += `<td class="p-3">${val.toLocaleString('id-ID')}</td>`;
        }
        tr.innerHTML = html;
        tbody.appendChild(tr);
    });
}

// Jalankan pengaturan default saat halaman pertama kali dimuat
setMode('lpm');
setFrekuensi(1);
setHari(1);