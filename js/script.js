// Toggle class active
const navbarNav = document.querySelector(".navbar-nav");
// ketika humberger menu di klik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

// Klik di luar sidebatr untuk menghilangkan nav
const hamburger = document.querySelector("#hamburger-menu");

document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

// STATUS MEJA BILLIARD

// STATUS MEJA BILLIARD

// ===== DATA DEFAULT =====
const defaultMejaData = {
  1: { status: "available", harga: 30000, pemain: null, endTime: null },
  2: { status: "available", harga: 30000, pemain: null, endTime: null },
  3: { status: "available", harga: 30000, pemain: null, endTime: null },
  4: {
    status: "booked",
    harga: 35000,
    pemain: "Andi",
    endTime: "2024-12-15T14:30:00",
  },
  5: { status: "available", harga: 35000, pemain: null, endTime: null },
};

// ===== FUNGSI LOAD DATA DARI LOCALSTORAGE =====
function loadMejaData() {
  const saved = localStorage.getItem("mejaData");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const merged = { ...defaultMejaData };
      Object.keys(parsed).forEach((key) => {
        if (merged[key]) {
          merged[key] = { ...merged[key], ...parsed[key] };
        }
      });
      return merged;
    } catch (e) {
      return { ...defaultMejaData };
    }
  }
  return { ...defaultMejaData };
}

// ===== FUNGSI SIMPAN KE LOCALSTORAGE =====
function saveMejaData() {
  localStorage.setItem("mejaData", JSON.stringify(mejaData));
}

// ===== INISIALISASI mejaData =====
let mejaData = loadMejaData();

const adminData = [
  {
    id: 1,
    nama: "Admin",
    email: "admin@infinity.com",
    username: "admin",
    password: "infinity123",
    createdAt: new Date().toISOString(),
  },
];

// UPDATE STATS
function updateStats() {
  const total = 5;
  const available = Object.values(mejaData).filter(
    (m) => m.status === "available",
  ).length;
  const occupied = Object.values(mejaData).filter(
    (m) => m.status === "occupied" || m.status === "booked",
  ).length;

  const totalEl = document.getElementById("totalTables");
  const availableEl = document.getElementById("availableTables");
  const occupiedEl = document.getElementById("occupiedTables");

  if (totalEl) totalEl.textContent = total;
  if (availableEl) availableEl.textContent = available;
  if (occupiedEl) occupiedEl.textContent = occupied;
}

// UPDATE CLOCK
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const timeEl = document.getElementById("currentTime");
  if (timeEl) timeEl.textContent = timeString;
}

// ===== UPDATE TIMERS =====
function updateTimers() {
  document.querySelectorAll(".meja-timer").forEach((el) => {
    const card = el.closest(".table-card");
    if (!card) return;

    const mejaId = parseInt(card.dataset.meja);
    const data = mejaData[mejaId];
    if (!data || !data.endTime) return;

    const endTime = new Date(data.endTime);
    const now = new Date();
    const diff = endTime - now;

    if (diff <= 0) {
      el.textContent = "⏰ 00:00:00";
      updateMejaStatus(mejaId, "available");
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    el.textContent = `⏰ ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (minutes < 5 && hours === 0) {
      el.style.color = "#FF6B6B";
    } else {
      el.style.color = "#F44336";
    }
  });
}

// ===== UPDATE STATUS MEJA =====

function updateMejaStatus(mejaId, newStatus) {
  const data = mejaData[mejaId];
  if (!data) return;

  data.status = newStatus;

  const card = document.querySelector(`.table-card[data-meja="${mejaId}"]`);
  if (!card) return;

  card.classList.remove("available", "occupied", "booked");
  card.classList.add(newStatus);

  const badge = card.querySelector(".status-badge");
  if (badge) {
    const statusMap = {
      available: { text: "✅ Tersedia", class: "available-badge" },
      occupied: { text: "🔴 Terpakai", class: "occupied-badge" },
      booked: { text: "🟡 Dipesan", class: "booked-badge" },
    };
    badge.textContent = statusMap[newStatus].text;
    badge.className = `status-badge ${statusMap[newStatus].class}`;
  }

  const btn = card.querySelector(".btn-pesan");
  const timer = card.querySelector(".meja-timer");
  const jam = card.querySelector(".meja-jam");
  const pemain = card.querySelector(".meja-pemain");

  if (newStatus === "available") {
    if (btn) btn.style.display = "inline-block";
    if (timer) timer.style.display = "none";
    if (jam) jam.style.display = "none";
    if (pemain) pemain.style.display = "none";
  } else if (newStatus === "occupied") {
    if (btn) btn.style.display = "none";
    if (timer) timer.style.display = "";
    if (jam) jam.style.display = "none";
    if (pemain) pemain.style.display = "";
    if (pemain) pemain.textContent = `👤 ${data.pemain || "Unknown"}`;
  } else if (newStatus === "booked") {
    if (btn) btn.style.display = "none";
    if (timer) timer.style.display = "none";
    if (jam) jam.style.display = "";
    if (pemain) pemain.style.display = "";
    if (pemain) pemain.textContent = `👤 ${data.pemain || "Unknown"}`;
  }

  updateStats();

  // ✅ TAMBAHKAN INI
  saveMejaData();
}

// ===== PESAN MEJA =====
function pesanMeja(mejaId) {
  const data = mejaData[mejaId];
  if (!data) return;

  if (data.status === "occupied") {
    showToast(`❌ Meja ${mejaId} sedang terpakai!`, "error");
    return;
  }

  if (data.status === "booked") {
    showToast(`❌ Meja ${mejaId} sudah dipesan!`, "warning");
    return;
  }

  const nama = prompt("Masukkan nama Anda:", "Reno");
  if (!nama) return;

  const durasi = prompt("Durasi (jam) - 1, 2, atau 3:", "2");
  if (!durasi) return;

  const jamDurasi = parseInt(durasi);
  if (isNaN(jamDurasi) || jamDurasi < 1 || jamDurasi > 3) {
    showToast("❌ Durasi harus 1-3 jam!", "error");
    return;
  }

  data.status = "booked";
  data.pemain = nama;
  const now = new Date();
  data.endTime = new Date(
    now.getTime() + jamDurasi * 60 * 60 * 1000,
  ).toISOString();

  updateMejaStatus(mejaId, "booked");

  const card = document.querySelector(`.table-card[data-meja="${mejaId}"]`);
  if (card) {
    const jamEl = card.querySelector(".meja-jam");
    if (jamEl) {
      const end = new Date(data.endTime);
      jamEl.textContent = `⏰ ${end.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
    }
    const pemainEl = card.querySelector(".meja-pemain");
    if (pemainEl) {
      pemainEl.textContent = `👤 ${nama}`;
    }
  }

  saveMejaData();

  showToast(`✅ Meja ${mejaId} berhasil dipesan!`, "success");
}

// ===== REFRESH =====
function refreshStatus() {
  updateStats();
  updateTimers();
  updateClock();
  showToast("🔄 Status berhasil diperbarui!", "success");
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = "success") {
  const existing = document.querySelector(".toast-notification");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast-notification toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// BOOKING MODAL - FUNGSIONALITAS

// Elemen Modal
const modalBooking = document.getElementById("modalBooking");
const closeModal = document.getElementById("closeModal");
const bookingForm = document.getElementById("bookingForm");
const pilihMeja = document.getElementById("pilihMeja");
const namaPemesan = document.getElementById("namaPemesan");
const emailPemesan = document.getElementById("emailPemesan");
const hpPemesan = document.getElementById("hpPemesan");
const durasiBtns = document.querySelectorAll(".durasi-btn");
const summaryMeja = document.getElementById("summaryMeja");
const summaryDurasi = document.getElementById("summaryDurasi");
const summaryHarga = document.getElementById("summaryHarga");
const summaryTotal = document.getElementById("summaryTotal");

let selectedDurasi = 2;
let selectedMeja = null;
let hargaPerJam = 30000;

// Harga per meja
const hargaMeja = {
  1: 30000,
  2: 30000,
  3: 30000,
  4: 35000,
  5: 35000,
};

// ===== BUKA MODAL =====
function openBookingModal(mejaId = null) {
  modalBooking.classList.add("active");
  document.body.style.overflow = "hidden";

  // Reset form
  bookingForm.reset();
  selectedMeja = null;
  selectedDurasi = 2;

  // Reset durasi buttons
  durasiBtns.forEach((btn) => {
    btn.classList.remove("active");
    if (parseInt(btn.dataset.durasi) === 2) {
      btn.classList.add("active");
    }
  });

  // Jika ada meja yang dipilih dari tombol
  if (mejaId) {
    const option = pilihMeja.querySelector(`option[value="${mejaId}"]`);
    if (option) {
      pilihMeja.value = mejaId;
      selectedMeja = mejaId;
      updateSummary();
    }
  } else {
    // Reset pilihan meja
    pilihMeja.value = "";
    updateSummary();
  }

  // Update summary
  updateSummary();
}

// ===== TUTUP MODAL =====
function closeBookingModal() {
  modalBooking.classList.remove("active");
  document.body.style.overflow = "";
}

// ===== UPDATE SUMMARY =====
function updateSummary() {
  const mejaId = parseInt(pilihMeja.value);
  const durasi = selectedDurasi;

  if (mejaId && hargaMeja[mejaId]) {
    const harga = hargaMeja[mejaId];
    const total = harga * durasi;
    summaryMeja.textContent = `Meja ${mejaId}`;
    summaryHarga.textContent = `Rp ${harga.toLocaleString("id-ID")}`;
    summaryTotal.textContent = `Rp ${total.toLocaleString("id-ID")}`;
    selectedMeja = mejaId;
  } else {
    summaryMeja.textContent = "-";
    summaryHarga.textContent = "-";
    summaryTotal.textContent = "-";
  }
  summaryDurasi.textContent = `${durasi} Jam`;
}

// ===== SUBMIT BOOKING =====
bookingForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const mejaId = parseInt(pilihMeja.value);
  const nama = namaPemesan.value.trim();
  const hp = hpPemesan.value.trim();
  const durasi = selectedDurasi;

  // Validasi
  if (!mejaId) {
    showToast("❌ Silakan pilih meja terlebih dahulu!", "error");
    return;
  }

  if (!nama) {
    showToast("❌ Silakan masukkan nama Anda!", "error");
    return;
  }

  if (!hp) {
    showToast("❌ Silakan masukkan nomor HP!", "error");
    return;
  }

  // Cek status meja
  const data = mejaData[mejaId];
  if (!data) return;

  if (data.status === "occupied") {
    showToast(`❌ Meja ${mejaId} sedang terpakai!`, "error");
    return;
  }

  if (data.status === "booked") {
    showToast(`❌ Meja ${mejaId} sudah dipesan!`, "warning");
    return;
  }

  // Proses Booking
  data.status = "booked";
  data.pemain = nama;
  const now = new Date();
  data.endTime = new Date(
    now.getTime() + durasi * 60 * 60 * 1000,
  ).toISOString();

  // Update UI meja
  updateMejaStatus(mejaId, "booked");

  saveMejaData();

  const card = document.querySelector(`.table-card[data-meja="${mejaId}"]`);
  if (card) {
    const jamEl = card.querySelector(".meja-jam");
    if (jamEl) {
      const end = new Date(data.endTime);
      jamEl.textContent = `⏰ ${end.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
    }
    const pemainEl = card.querySelector(".meja-pemain");
    if (pemainEl) {
      pemainEl.textContent = `👤 ${nama}`;
    }
  }

  closeBookingModal();

  const totalHarga = hargaMeja[mejaId] * durasi;
  showToast(
    `✅ Meja ${mejaId} berhasil dipesan! Nama: ${nama} | Total: Rp ${totalHarga.toLocaleString("id-ID")}`,
    "success",
  );

  bookingForm.reset();
  pilihMeja.value = "";
  updateSummary();
});

// ===== EVENT LISTENER =====

// Close modal
closeModal.addEventListener("click", closeBookingModal);

// Click luar modal
modalBooking.addEventListener("click", function (e) {
  if (e.target === modalBooking) {
    closeBookingModal();
  }
});

// Pilih meja
pilihMeja.addEventListener("change", updateSummary);

// Pilih durasi
durasiBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    durasiBtns.forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    selectedDurasi = parseInt(this.dataset.durasi);
    updateSummary();
  });
});

// ===== MODIFIKASI TOMBOL "Booking Sekarang!" =====

// Tambahkan event listener ke tombol CTA di Hero
document.addEventListener("DOMContentLoaded", function () {
  // Tombol Booking Sekarang di Hero
  const ctaBtn = document.querySelector(".hero .cta");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openBookingModal();
    });
  }

  // Tombol di info card
  const infoLink = document.querySelector(".info-link");
  if (infoLink) {
    infoLink.addEventListener("click", function (e) {
      e.preventDefault();
      openBookingModal();
    });
  }
});

// ========================================
// LOGIN ADMIN & DASHBOARD
// ========================================

// Data Admin (hardcode - bisa diganti dengan database)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "infinity123",
};

// State
let isAdminLoggedIn = false;

// Elemen
const modalLogin = document.getElementById("modalLogin");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const dashboardAdmin = document.getElementById("dashboardAdmin");
const adminLink = document.getElementById("adminLink");
const btnLogout = document.getElementById("btnLogout");
const adminName = document.getElementById("adminName");

// Dashboard elements
const dashTotal = document.getElementById("dashTotal");
const dashAvailable = document.getElementById("dashAvailable");
const dashOccupied = document.getElementById("dashOccupied");
const dashBooked = document.getElementById("dashBooked");
const bookingTableBody = document.getElementById("bookingTableBody");
const statusUpdateGrid = document.getElementById("statusUpdateGrid");
const btnSaveStatus = document.getElementById("btnSaveStatus");

// ===== BUKA MODAL LOGIN =====
function openLoginModal() {
  modalLogin.classList.add("active");
  loginError.style.display = "none";
  loginForm.reset();
}

// ===== TUTUP MODAL LOGIN =====
function closeLoginModal() {
  modalLogin.classList.remove("active");
}

// ===== LOGIN =====
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    isAdminLoggedIn = true;
    closeLoginModal();
    showDashboard();
    showToast("✅ Login berhasil! Selamat datang Admin!", "success");
  } else {
    loginError.style.display = "block";
    setTimeout(() => {
      loginError.style.display = "none";
    }, 3000);
  }
});

// ===== SHOW DASHBOARD =====
function showDashboard() {
  dashboardAdmin.classList.add("active");
  adminName.textContent = "Admin";
  // Sembunyikan section lain
  document
    .querySelectorAll(".hero, .about, .status-meja-section, .contact")
    .forEach((el) => {
      el.style.display = "none";
    });
  // Update dashboard
  updateDashboard();
}

// ===== HIDE DASHBOARD =====
function hideDashboard() {
  dashboardAdmin.classList.remove("active");
  document
    .querySelectorAll(".hero, .about, .status-meja-section, .contact")
    .forEach((el) => {
      el.style.display = "";
    });
  isAdminLoggedIn = false;
}

// ===== LOGOUT =====
btnLogout.addEventListener("click", function () {
  if (confirm("Yakin ingin logout?")) {
    hideDashboard();
    showToast("👋 Logout berhasil!", "success");
  }
});

// ===== UPDATE DASHBOARD =====
function updateDashboard() {
  // Stats
  const total = 5;
  const available = Object.values(mejaData).filter(
    (m) => m.status === "available",
  ).length;
  const occupied = Object.values(mejaData).filter(
    (m) => m.status === "occupied",
  ).length;
  const booked = Object.values(mejaData).filter(
    (m) => m.status === "booked",
  ).length;

  dashTotal.textContent = total;
  dashAvailable.textContent = available;
  dashOccupied.textContent = occupied;
  dashBooked.textContent = booked;

  // Tabel Booking
  updateBookingTable();

  // Grid Update Status
  updateStatusGrid();
}

// ===== UPDATE BOOKING TABLE =====
function updateBookingTable() {
  let html = "";
  let no = 1;

  Object.keys(mejaData).forEach((key) => {
    const data = mejaData[key];
    if (data.status === "booked" || data.status === "occupied") {
      const statusMap = {
        available: { text: "🟢 Tersedia", class: "available" },
        occupied: { text: "🔴 Terpakai", class: "occupied" },
        booked: { text: "🟡 Dipesan", class: "booked" },
      };
      const statusInfo = statusMap[data.status] || statusMap.available;

      // Hitung durasi jika ada endTime
      let durasi = "-";
      if (data.endTime) {
        const end = new Date(data.endTime);
        const now = new Date();
        const diff = Math.ceil((end - now) / (1000 * 60 * 60));
        durasi = diff > 0 ? `${diff} jam` : "Selesai";
      }

      html += `
        <tr>
          <td>${no}</td>
          <td>Meja ${key}</td>
          <td>${data.pemain || "-"}</td>
          <td>${durasi}</td>
          <td><span class="status-badge-dash ${statusInfo.class}">${statusInfo.text}</span></td>
        </tr>
      `;
      no++;
    }
  });

  if (html === "") {
    html = `<tr><td colspan="5" style="text-align:center; color: rgba(255,255,255,0.5);">Belum ada booking</td></tr>`;
  }

  bookingTableBody.innerHTML = html;
}

// ===== UPDATE STATUS GRID =====
function updateStatusGrid() {
  let html = "";

  Object.keys(mejaData).forEach((key) => {
    const data = mejaData[key];
    const statusMap = {
      available: { text: "🟢 Tersedia", class: "available" },
      occupied: { text: "🔴 Terpakai", class: "occupied" },
      booked: { text: "🟡 Dipesan", class: "booked" },
    };
    const statusInfo = statusMap[data.status] || statusMap.available;

    html += `
      <div class="status-update-item" data-meja="${key}">
        <div class="meja-name">🎱 Meja ${key}</div>
        <span class="status-badge-dash ${statusInfo.class}">${statusInfo.text}</span>
        <div class="btn-group">
          <button class="btn-set-available ${data.status === "available" ? "active" : ""}" onclick="setStatusTemp(${key}, 'available')">🟢 Tersedia</button>
          <button class="btn-set-occupied ${data.status === "occupied" ? "active" : ""}" onclick="setStatusTemp(${key}, 'occupied')">🔴 Terpakai</button>
          <button class="btn-set-booked ${data.status === "booked" ? "active" : ""}" onclick="setStatusTemp(${key}, 'booked')">🟡 Dipesan</button>
        </div>
      </div>
    `;
  });

  statusUpdateGrid.innerHTML = html;
}

// ===== TEMPORARY STATUS (belum disimpan) =====
let tempStatus = {};

function setStatusTemp(mejaId, status) {
  tempStatus[mejaId] = status;

  // Update visual tombol
  const item = document.querySelector(
    `.status-update-item[data-meja="${mejaId}"]`,
  );
  if (!item) return;

  // Update badge
  const badge = item.querySelector(".status-badge-dash");
  const statusMap = {
    available: { text: "🟢 Tersedia", class: "available" },
    occupied: { text: "🔴 Terpakai", class: "occupied" },
    booked: { text: "🟡 Dipesan", class: "booked" },
  };
  const info = statusMap[status];
  badge.textContent = info.text;
  badge.className = `status-badge-dash ${info.class}`;

  // Update tombol
  item.querySelectorAll(".btn-group button").forEach((btn) => {
    btn.classList.remove("active");
  });
  const activeBtn = item.querySelector(`.btn-set-${status}`);
  if (activeBtn) activeBtn.classList.add("active");
}

// ===== SAVE STATUS =====
btnSaveStatus.addEventListener("click", function () {
  if (Object.keys(tempStatus).length === 0) {
    showToast("ℹ️ Tidak ada perubahan status", "warning");
    return;
  }

  // Terapkan perubahan
  Object.keys(tempStatus).forEach((key) => {
    const newStatus = tempStatus[key];
    mejaData[key].status = newStatus;

    // Reset pemain dan endTime jika status berubah ke available
    if (newStatus === "available") {
      mejaData[key].pemain = null;
      mejaData[key].endTime = null;
    }

    // Update tampilan meja di halaman utama
    updateMejaStatus(parseInt(key), newStatus);
  });

  // Reset temp
  tempStatus = {};

  // Update dashboard
  updateDashboard();

  saveMejaData();

  showToast("✅ Status meja berhasil diperbarui!", "success");
});

// ===== EVENT LISTENER ADMIN LINK =====
adminLink.addEventListener("click", function (e) {
  e.preventDefault();

  if (isAdminLoggedIn) {
    showDashboard();
  } else {
    openLoginModal();
  }
});

// ===== CLOSE MODAL KLIK LUAR =====
modalLogin.addEventListener("click", function (e) {
  if (e.target === modalLogin) {
    closeLoginModal();
  }
});

// ===== OVERRIDE FUNGSI UNTUK UPDATE MEJA DI HALAMAN UTAMA =====
// Simpan fungsi asli
const originalUpdateMejaStatusGlobal = window.updateMejaStatus;

// Override agar dashboard ikut update
window.updateMejaStatus = function (mejaId, newStatus) {
  if (originalUpdateMejaStatusGlobal) {
    originalUpdateMejaStatusGlobal(mejaId, newStatus);
  }

  // Update dashboard jika sedang aktif
  if (isAdminLoggedIn && dashboardAdmin.classList.contains("active")) {
    updateDashboard();
  }
};

// ===== TOAST UNTUK DASHBOARD =====
// Gunakan fungsi showToast yang sudah ada

// ========================================
// REGISTER ADMIN - TAMBAHKAN DI PALING BAWAH
// ========================================

// Elemen Register
const modalRegister = document.getElementById("modalRegister");
const goToRegister = document.getElementById("goToRegister");
const backToLogin = document.getElementById("backToLogin");
const goToLoginAfterRegister = document.getElementById(
  "goToLoginAfterRegister",
);
const registerForm = document.getElementById("registerForm");
const registerFormContainer = document.getElementById("registerFormContainer");
const registerSuccess = document.getElementById("registerSuccess");

// Input Register
const regNama = document.getElementById("regNama");
const regEmail = document.getElementById("regEmail");
const regUsername = document.getElementById("regUsername");
const regPassword = document.getElementById("regPassword");
const regConfirmPassword = document.getElementById("regConfirmPassword");
const usernameError = document.getElementById("usernameError");
const passwordMatchError = document.getElementById("passwordMatchError");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

// ===== CEK USERNAME UNIK =====
function isUsernameTaken(username) {
  // Cek di adminData
  return adminData.some((admin) => admin.username === username);
}

// ===== VALIDASI EMAIL =====
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== CEK KEKUATAN PASSWORD =====
function checkPasswordStrength(password) {
  let strength = 0;

  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 1) return { level: "weak", text: "Lemah", class: "weak" };
  if (strength <= 3)
    return { level: "medium", text: "Sedang", class: "medium" };
  return { level: "strong", text: "Kuat", class: "strong" };
}

// ===== REAL-TIME PASSWORD STRENGTH =====
regPassword.addEventListener("input", function () {
  const password = this.value;
  const result = checkPasswordStrength(password);

  strengthBar.className = `strength-bar ${result.class}`;
  strengthText.textContent = `Kekuatan password: ${result.text}`;

  if (password.length === 0) {
    strengthBar.className = "strength-bar";
    strengthText.textContent = "Kekuatan password: -";
  }
});

// ===== REAL-TIME PASSWORD MATCH =====
regConfirmPassword.addEventListener("input", function () {
  const password = regPassword.value;
  const confirm = this.value;

  if (confirm.length > 0 && password !== confirm) {
    this.classList.add("error");
    passwordMatchError.classList.add("show");
  } else {
    this.classList.remove("error");
    passwordMatchError.classList.remove("show");
  }
});

// ===== REAL-TIME USERNAME CHECK =====
regUsername.addEventListener("blur", function () {
  const username = this.value.trim();
  if (username.length > 0 && isUsernameTaken(username)) {
    this.classList.add("error");
    usernameError.classList.add("show");
  } else {
    this.classList.remove("error");
    usernameError.classList.remove("show");
  }
});

// ===== BUKA MODAL REGISTER =====
function openRegisterModal() {
  closeLoginModal();
  modalRegister.classList.add("active");
  registerFormContainer.style.display = "block";
  registerSuccess.style.display = "none";
  registerForm.reset();
  // Reset error
  document
    .querySelectorAll(".register-content .error")
    .forEach((el) => el.classList.remove("error"));
  document
    .querySelectorAll(".register-content .error-message")
    .forEach((el) => el.classList.remove("show"));
  strengthBar.className = "strength-bar";
  strengthText.textContent = "Kekuatan password: -";
}

// ===== TUTUP MODAL REGISTER =====
function closeRegisterModal() {
  modalRegister.classList.remove("active");
}

// ===== EVENT REGISTER LINK =====
goToRegister.addEventListener("click", function (e) {
  e.preventDefault();
  openRegisterModal();
});

// ===== BACK TO LOGIN =====
backToLogin.addEventListener("click", function () {
  closeRegisterModal();
  openLoginModal();
});

goToLoginAfterRegister.addEventListener("click", function () {
  closeRegisterModal();
  openLoginModal();
});

// ===== SUBMIT REGISTER =====
registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Ambil nilai
  const nama = regNama.value.trim();
  const email = regEmail.value.trim();
  const username = regUsername.value.trim();
  const password = regPassword.value;
  const confirmPassword = regConfirmPassword.value;

  // Validasi Nama
  if (nama.length < 2) {
    showToast("❌ Nama minimal 2 karakter!", "error");
    return;
  }

  // Validasi Email
  if (!isValidEmail(email)) {
    showToast("❌ Email tidak valid!", "error");
    return;
  }

  // Validasi Username
  if (username.length < 3) {
    showToast("❌ Username minimal 3 karakter!", "error");
    return;
  }

  if (isUsernameTaken(username)) {
    showToast("❌ Username sudah digunakan!", "error");
    return;
  }

  // Validasi Password
  if (password.length < 6) {
    showToast("❌ Password minimal 6 karakter!", "error");
    return;
  }

  // Validasi Confirm Password
  if (password !== confirmPassword) {
    showToast("❌ Password tidak cocok!", "error");
    return;
  }

  // Simpan Admin Baru
  const newAdmin = {
    id: adminData.length + 1,
    nama: nama,
    email: email,
    username: username,
    password: password,
    createdAt: new Date().toISOString(),
  };

  adminData.push(newAdmin);

  // Tampilkan success
  registerFormContainer.style.display = "none";
  registerSuccess.style.display = "block";

  showToast(`✅ Akun admin "${username}" berhasil dibuat!`, "success");
});

// ===== CLICK LUAR MODAL REGISTER =====
modalRegister.addEventListener("click", function (e) {
  if (e.target === modalRegister) {
    closeRegisterModal();
  }
});

// ===== UPDATE LOGIN VALIDASI (perbaiki) =====
// Override login validation untuk cek semua admin
const originalLoginSubmit = loginForm.onsubmit;
loginForm.onsubmit = function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Cari admin di data
  const foundAdmin = adminData.find(
    (admin) => admin.username === username && admin.password === password,
  );

  if (foundAdmin) {
    isAdminLoggedIn = true;
    closeLoginModal();
    showDashboard();
    showToast(`✅ Selamat datang ${foundAdmin.nama}!`, "success");
  } else {
    loginError.style.display = "block";
    setTimeout(() => {
      loginError.style.display = "none";
    }, 3000);
  }
};

// ===== INIT =====
document.addEventListener("DOMContentLoaded", function () {
  updateClock();
  updateStats();
  updateTimers();

  setInterval(updateClock, 1000);
  setInterval(updateTimers, 1000);

  // Event listener untuk tombol refresh (jika onclick tidak jalan)
  const refreshBtns = document.querySelectorAll(".btn-refresh");
  refreshBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      refreshStatus();
    });
  });
});
