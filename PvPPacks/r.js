// r.js - مدیریت نمایش کاربر و هدایت هوشمند
document.addEventListener("DOMContentLoaded", () => {
    const box = document.getElementById("pp-user-mini");
    if (!box) return;

    // بررسی و نمایش وضعیت کاربر
    updateUserDisplay(box);
    
    // تنظیم کلیک برای هدایت هوشمند
    setupUserClickHandler(box);
});

// تابع بروزرسانی نمایش کاربر
function updateUserDisplay(container) {
    const user = getUserFromStorage();
    
    if (user && user.name) {
        // حالت: کاربر لاگین کرده
        container.innerHTML = `
            <div class="icon">👤</div>
            <div class="name">${user.name}</div>
        `;
        container.title = `${user.name} - کلیک برای خدمات`;
    } else {
        // حالت: کاربر مهمان
        container.innerHTML = `
            <div class="icon">👤</div>
            <div class="name">ورود</div>
        `;
        container.title = "کلیک برای ورود/ثبت‌نام";
    }
}

// تابع دریافت کاربر از localStorage
function getUserFromStorage() {
    try {
        const userData = localStorage.getItem("pp-user");
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error("خطا در خواندن اطلاعات کاربر:", error);
        return null;
    }
}

// تابع تنظیم کلیک هوشمند
function setupUserClickHandler(container) {
    container.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const user = getUserFromStorage();
        
        if (user && user.name) {
            // حالت ۱: کاربر اکانت دارد → هدایت به صفحه خدمات
            window.location.href = "https://s786mc.github.io/PvPPacks786/service/start.html";
        } else {
            // حالت ۲: کاربر اکانت ندارد → هدایت به صفحه لاگین
            window.location.href = "https://s786mc.github.io/PvPPacks786/login.html";
        }
    };
}

// تابع کمکی برای چک کردن لاگین در جاهای دیگر
function isUserLoggedIn() {
    const user = getUserFromStorage();
    return !!(user && user.name);
}

// تابع برای گرفتن نام کاربر
function getUsername() {
    const user = getUserFromStorage();
    return user ? user.name : "مهمان";
}

// تابع لاگ‌آوت (در صورت نیاز)
function logoutUser() {
    localStorage.removeItem("pp-user");
    localStorage.removeItem("pp-token");
    
    // بروزرسانی نمایش
    const box = document.getElementById("pp-user-mini");
    if (box) {
        updateUserDisplay(box);
    }
    
    // هدایت به صفحه اصلی
    window.location.href = "https://s786mc.github.io/PvPPacks786";
}

// تابع بروزرسانی اطلاعات کاربر
function updateUserInfo(newUserData) {
    const currentUser = getUserFromStorage() || {};
    const updatedUser = { ...currentUser, ...newUserData };
    
    try {
        localStorage.setItem("pp-user", JSON.stringify(updatedUser));
        
        // بروزرسانی نمایش
        const box = document.getElementById("pp-user-mini");
        if (box) {
            updateUserDisplay(box);
        }
        
        return true;
    } catch (error) {
        console.error("خطا در بروزرسانی اطلاعات کاربر:", error);
        return false;
    }
}

// ========================
// استایل‌های ضروری که باید در CSS اصلی اضافه بشن
// ========================

/*
اگر استایل نمایش کاربر درست کار نمی‌کنه، این استایل‌ها رو به فایل styles.css اضافه کنید:

#pp-user-mini {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 9999;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* فاصله بین آیکون و نام */
  padding: 4px 8px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

#pp-user-mini:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  background: white;
}

#pp-user-mini .icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff7e00, #ff5500);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

#pp-user-mini .name {
  color: #ff5500;
  font-weight: bold;
  font-size: 14px;
  font-family: 'Mikhak', sans-serif;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* برای حالت موبایل */
@media (max-width: 768px) {
  #pp-user-mini {
    top: 10px;
    right: 10px;
  }
  
  #pp-user-mini .name {
    max-width: 80px;
    font-size: 12px;
  }
}
*/

// ========================
// API برای استفاده در صفحات دیگر
// ========================

// اکسپورت توابع برای استفاده در اسکریپت‌های دیگر
window.UserManager = {
    isLoggedIn: isUserLoggedIn,
    getUsername: getUsername,
    logout: logoutUser,
    updateInfo: updateUserInfo,
    getUser: getUserFromStorage,
    
    // تابع برای چک کردن اجباری لاگین
    requireLogin: function(redirectTo = "login.html") {
        if (!this.isLoggedIn()) {
            alert("برای دسترسی به این صفحه باید وارد شوید.");
            window.location.href = redirectTo;
            return false;
        }
        return true;
    },
    
    // تابع برای نمایش وضعیت کاربر در المان‌های دیگر
    updateAllUserDisplays: function() {
        const boxes = document.querySelectorAll(".pp-user-display");
        boxes.forEach(box => {
            const user = getUserFromStorage();
            if (user && user.name) {
                box.textContent = user.name;
                box.style.color = "#ff5500";
            } else {
                box.textContent = "مهمان";
                box.style.color = "#999";
            }
        });
    }
};

// اجرای اولیه
document.addEventListener("DOMContentLoaded", function() {
    // به‌روزرسانی همه نمایش‌های کاربر
    if (window.UserManager) {
        window.UserManager.updateAllUserDisplays();
    }
    
    // لاگ وضعیت کاربر در کنسول (برای دیباگ)
    console.log("وضعیت کاربر:", getUserFromStorage() ? "لاگین کرده" : "مهمان");
});