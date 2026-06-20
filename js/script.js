// ========================================
// ONE PAGE NAVIGATION - TAMBAHAN BARU
// ========================================

function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
    page.style.display = "none";
  });

  const activePage = document.querySelector(`.page[data-page="${pageId}"]`);
  if (activePage) {
    activePage.style.display = "flex";
    void activePage.offsetWidth;
    activePage.classList.add("active");
  }

  document.querySelectorAll(".navbar-nav a").forEach((link) => {
    link.classList.remove("active-link");
  });
  const navLinks = document.querySelectorAll(".navbar-nav a");
  const pageMap = { home: 0, about: 1, status: 2, contact: 3 };
  if (pageMap[pageId] !== undefined) {
    navLinks[pageMap[pageId]]?.classList.add("active-link");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ========================================
// TOGGLE HAMBURGER MENU - TETAP SAMA
// ========================================

const navbarNav = document.querySelector(".navbar-nav");
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

const hamburger = document.querySelector("#hamburger-menu");
document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

// ========================================
// STATUS MEJA BILLIARD - TETAP SAMA
// ========================================

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

function saveMejaData() {
  localStorage.setItem("mejaData", JSON.stringify(mejaData));
}

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

function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const timeEl = document.getElementById("currentTime");
  if (timeEl) timeEl.textContent = timeString;
}

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
    el.style.color = minutes < 5 && hours === 0 ? "#FF6B6B" : "#F44336";
  });
}

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
    if (pemain) {
      pemain.style.display = "";
      pemain.textContent = `👤 ${data.pemain || "Unknown"}`;
    }
  } else if (newStatus === "booked") {
    if (btn) btn.style.display = "none";
    if (timer) timer.style.display = "none";
    if (jam) jam.style.display = "";
    if (pemain) {
      pemain.style.display = "";
      pemain.textContent = `👤 ${data.pemain || "Unknown"}`;
    }
  }

  updateStats();
  saveMejaData();
}

function refreshStatus() {
  updateStats();
  updateTimers();
  updateClock();
  showToast("🔄 Status berhasil diperbarui!", "success");
}

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

// ========================================
// BOOKING MODAL - TETAP SAMA
// ========================================

const modalBooking = document.getElementById("modalBooking");
const closeModal = document.getElementById("closeModal");
const bookingForm = document.getElementById("bookingForm");
const pilihMeja = document.getElementById("pilihMeja");
const namaPemesan = document.getElementById("namaPemesan");
const hpPemesan = document.getElementById("hpPemesan");
const durasiBtns = document.querySelectorAll(".durasi-btn");
const summaryMeja = document.getElementById("summaryMeja");
const summaryDurasi = document.getElementById("summaryDurasi");
const summaryHarga = document.getElementById("summaryHarga");
const summaryTotal = document.getElementById("summaryTotal");

let selectedDurasi = 2;
let selectedMeja = null;

const hargaMeja = { 1: 30000, 2: 30000, 3: 30000, 4: 35000, 5: 35000 };

function openBookingModal(mejaId = null) {
  modalBooking.classList.add("active");
  document.body.style.overflow = "hidden";

  bookingForm.reset();
  selectedMeja = null;
  selectedDurasi = 2;

  durasiBtns.forEach((btn) => {
    btn.classList.remove("active");
    if (parseInt(btn.dataset.durasi) === 2) {
      btn.classList.add("active");
    }
  });

  if (mejaId) {
    const option = pilihMeja.querySelector(`option[value="${mejaId}"]`);
    if (option) {
      pilihMeja.value = mejaId;
      selectedMeja = mejaId;
    }
  } else {
    pilihMeja.value = "";
  }

  updateSummary();
}

function closeBookingModal() {
  modalBooking.classList.remove("active");
  document.body.style.overflow = "";
}

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

bookingForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const mejaId = parseInt(pilihMeja.value);
  const nama = namaPemesan.value.trim();
  const hp = hpPemesan.value.trim();
  const durasi = selectedDurasi;

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

  data.status = "booked";
  data.pemain = nama;
  const now = new Date();
  data.endTime = new Date(
    now.getTime() + durasi * 60 * 60 * 1000,
  ).toISOString();

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

closeModal.addEventListener("click", closeBookingModal);

modalBooking.addEventListener("click", function (e) {
  if (e.target === modalBooking) {
    closeBookingModal();
  }
});

pilihMeja.addEventListener("change", updateSummary);

durasiBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    durasiBtns.forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    selectedDurasi = parseInt(this.dataset.durasi);
    updateSummary();
  });
});

// ========================================
// LOGIN ADMIN - TETAP SAMA
// ========================================

const ADMIN_CREDENTIALS = { username: "admin", password: "infinity123" };
let isAdminLoggedIn = false;

const modalLogin = document.getElementById("modalLogin");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const dashboardAdmin = document.getElementById("dashboardAdmin");
const adminLink = document.getElementById("adminLink");
const btnLogout = document.getElementById("btnLogout");
const adminName = document.getElementById("adminName");

const dashTotal = document.getElementById("dashTotal");
const dashAvailable = document.getElementById("dashAvailable");
const dashOccupied = document.getElementById("dashOccupied");
const dashBooked = document.getElementById("dashBooked");
const bookingTableBody = document.getElementById("bookingTableBody");
const statusUpdateGrid = document.getElementById("statusUpdateGrid");
const btnSaveStatus = document.getElementById("btnSaveStatus");

function openLoginModal() {
  modalLogin.classList.add("active");
  loginError.style.display = "none";
  loginForm.reset();
}

function closeLoginModal() {
  modalLogin.classList.remove("active");
}

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

function showDashboard() {
  dashboardAdmin.classList.add("active");
  adminName.textContent = "Admin";

  document.querySelectorAll(".page").forEach((el) => {
    el.style.display = "none";
    el.classList.remove("active");
  });

  updateDashboard();
}

function hideDashboard() {
  dashboardAdmin.classList.remove("active");
  showPage("home");
  isAdminLoggedIn = false;
}

btnLogout.addEventListener("click", function () {
  if (confirm("Yakin ingin logout?")) {
    hideDashboard();
    showToast("👋 Logout berhasil!", "success");
  }
});

function updateDashboard() {
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

  updateBookingTable();
  updateStatusGrid();
}

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

let tempStatus = {};

function setStatusTemp(mejaId, status) {
  tempStatus[mejaId] = status;

  const item = document.querySelector(
    `.status-update-item[data-meja="${mejaId}"]`,
  );
  if (!item) return;

  const badge = item.querySelector(".status-badge-dash");
  const statusMap = {
    available: { text: "🟢 Tersedia", class: "available" },
    occupied: { text: "🔴 Terpakai", class: "occupied" },
    booked: { text: "🟡 Dipesan", class: "booked" },
  };
  const info = statusMap[status];
  badge.textContent = info.text;
  badge.className = `status-badge-dash ${info.class}`;

  item.querySelectorAll(".btn-group button").forEach((btn) => {
    btn.classList.remove("active");
  });
  const activeBtn = item.querySelector(`.btn-set-${status}`);
  if (activeBtn) activeBtn.classList.add("active");
}

btnSaveStatus.addEventListener("click", function () {
  if (Object.keys(tempStatus).length === 0) {
    showToast("ℹ️ Tidak ada perubahan status", "warning");
    return;
  }

  Object.keys(tempStatus).forEach((key) => {
    const newStatus = tempStatus[key];
    mejaData[key].status = newStatus;

    if (newStatus === "available") {
      mejaData[key].pemain = null;
      mejaData[key].endTime = null;
    }

    updateMejaStatus(parseInt(key), newStatus);
  });

  tempStatus = {};
  updateDashboard();
  saveMejaData();

  showToast("✅ Status meja berhasil diperbarui!", "success");
});

adminLink.addEventListener("click", function (e) {
  e.preventDefault();

  if (isAdminLoggedIn) {
    showDashboard();
  } else {
    openLoginModal();
  }
});

modalLogin.addEventListener("click", function (e) {
  if (e.target === modalLogin) {
    closeLoginModal();
  }
});

// ========================================
// REGISTER ADMIN - TETAP SAMA
// ========================================

const modalRegister = document.getElementById("modalRegister");
const goToRegister = document.getElementById("goToRegister");
const backToLogin = document.getElementById("backToLogin");
const goToLoginAfterRegister = document.getElementById(
  "goToLoginAfterRegister",
);
const registerForm = document.getElementById("registerForm");
const registerFormContainer = document.getElementById("registerFormContainer");
const registerSuccess = document.getElementById("registerSuccess");

const regNama = document.getElementById("regNama");
const regEmail = document.getElementById("regEmail");
const regUsername = document.getElementById("regUsername");
const regPassword = document.getElementById("regPassword");
const regConfirmPassword = document.getElementById("regConfirmPassword");
const usernameError = document.getElementById("usernameError");
const passwordMatchError = document.getElementById("passwordMatchError");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

function isUsernameTaken(username) {
  return adminData.some((admin) => admin.username === username);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

regPassword.addEventListener("input", function () {
  const result = checkPasswordStrength(this.value);
  strengthBar.className = `strength-bar ${result.class}`;
  strengthText.textContent = `Kekuatan password: ${result.text}`;
  if (this.value.length === 0) {
    strengthBar.className = "strength-bar";
    strengthText.textContent = "Kekuatan password: -";
  }
});

regConfirmPassword.addEventListener("input", function () {
  if (this.value.length > 0 && regPassword.value !== this.value) {
    this.classList.add("error");
    passwordMatchError.classList.add("show");
  } else {
    this.classList.remove("error");
    passwordMatchError.classList.remove("show");
  }
});

regUsername.addEventListener("blur", function () {
  if (this.value.trim().length > 0 && isUsernameTaken(this.value.trim())) {
    this.classList.add("error");
    usernameError.classList.add("show");
  } else {
    this.classList.remove("error");
    usernameError.classList.remove("show");
  }
});

function openRegisterModal() {
  closeLoginModal();
  modalRegister.classList.add("active");
  registerFormContainer.style.display = "block";
  registerSuccess.style.display = "none";
  registerForm.reset();
  document
    .querySelectorAll(".register-content .error")
    .forEach((el) => el.classList.remove("error"));
  document
    .querySelectorAll(".register-content .error-message")
    .forEach((el) => el.classList.remove("show"));
  strengthBar.className = "strength-bar";
  strengthText.textContent = "Kekuatan password: -";
}

function closeRegisterModal() {
  modalRegister.classList.remove("active");
}

goToRegister.addEventListener("click", function (e) {
  e.preventDefault();
  openRegisterModal();
});

backToLogin.addEventListener("click", function () {
  closeRegisterModal();
  openLoginModal();
});

goToLoginAfterRegister.addEventListener("click", function () {
  closeRegisterModal();
  openLoginModal();
});

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const nama = regNama.value.trim();
  const email = regEmail.value.trim();
  const username = regUsername.value.trim();
  const password = regPassword.value;
  const confirmPassword = regConfirmPassword.value;

  if (nama.length < 2) {
    showToast("❌ Nama minimal 2 karakter!", "error");
    return;
  }
  if (!isValidEmail(email)) {
    showToast("❌ Email tidak valid!", "error");
    return;
  }
  if (username.length < 3) {
    showToast("❌ Username minimal 3 karakter!", "error");
    return;
  }
  if (isUsernameTaken(username)) {
    showToast("❌ Username sudah digunakan!", "error");
    return;
  }
  if (password.length < 6) {
    showToast("❌ Password minimal 6 karakter!", "error");
    return;
  }
  if (password !== confirmPassword) {
    showToast("❌ Password tidak cocok!", "error");
    return;
  }

  adminData.push({
    id: adminData.length + 1,
    nama: nama,
    email: email,
    username: username,
    password: password,
    createdAt: new Date().toISOString(),
  });

  registerFormContainer.style.display = "none";
  registerSuccess.style.display = "block";
  showToast(`✅ Akun admin "${username}" berhasil dibuat!`, "success");
});

modalRegister.addEventListener("click", function (e) {
  if (e.target === modalRegister) {
    closeRegisterModal();
  }
});

// ========================================
// UPDATE LOGIN VALIDASI - TETAP SAMA
// ========================================

const originalLoginSubmit = loginForm.onsubmit;
loginForm.onsubmit = function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

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

// ========================================
// INIT - TETAP SAMA + TAMBAHAN showPage
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  // TAMPILKAN HALAMAN HOME PERTAMA KALI
  showPage("home");

  updateClock();
  updateStats();
  updateTimers();

  setInterval(updateClock, 1000);
  setInterval(updateTimers, 1000);

  const refreshBtns = document.querySelectorAll(".btn-refresh");
  refreshBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      refreshStatus();
    });
  });
});
