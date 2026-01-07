// r.js - آپدیت شده برای پشتیبانی از صفحه جستجو
document.addEventListener("DOMContentLoaded", () => {
    const box = document.getElementById("pp-user-mini");
    if (!box) return;

    const user = JSON.parse(localStorage.getItem("pp-user"));

    if (user && user.name) {
        box.innerHTML = `
            <div class="name" title="${user.name}">
                👤 ${user.name}
            </div>
        `;
        
        // اضافه کردن منوی کاربر (اختیاری)
        addUserMenu(box, user);
    } else {
        box.innerHTML = `
            <div class="icon" title="ورود به حساب کاربری">
                👤
            </div>
        `;
    }

    box.onclick = () => location.href = "https://s786mc.github.io/PvPPacks786/login.html";
});

// تابع اضافه کردن منوی کاربر (اختیاری)
function addUserMenu(container, user) {
    // می‌توانید یک منوی dropdown برای کاربران لاگین کرده ایجاد کنید
    container.style.position = 'relative';
    
    container.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) { // فقط در دسکتاپ
            showUserMenu(container, user);
        }
    });
    
    container.addEventListener('mouseleave', () => {
        setTimeout(() => {
            const menu = document.querySelector('.user-menu');
            if (menu && !menu.matches(':hover')) {
                menu.remove();
            }
        }, 300);
    });
}

function showUserMenu(container, user) {
    // حذف منوی قبلی اگر وجود دارد
    const oldMenu = document.querySelector('.user-menu');
    if (oldMenu) oldMenu.remove();
    
    // ایجاد منوی جدید
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        padding: 10px;
        min-width: 200px;
        z-index: 10000;
        border: 1px solid #ff7e00;
    `;
    
    menu.innerHTML = `
        <div style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${user.name}</strong>
        </div>
        <a href="https://s786mc.github.io/PvPPacks786/profile.html" 
           style="display: block; padding: 8px 10px; text-decoration: none; color: #333;">
           👤 پروفایل من
        </a>
        <a href="https://s786mc.github.io/PvPPacks786/search/start.d.html" 
           style="display: block; padding: 8px 10px; text-decoration: none; color: #333;">
           🔍 جستجوی امن
        </a>
        <a href="https://s786mc.github.io/PvPPacks786/history.html" 
           style="display: block; padding: 8px 10px; text-decoration: none; color: #333;">
           📜 تاریخچه جستجو
        </a>
        <button onclick="logoutUser()" 
                style="width: 100%; margin-top: 10px; padding: 8px; 
                       background: #ff5500; color: white; border: none; 
                       border-radius: 5px; cursor: pointer;">
            خروج
        </button>
    `;
    
    container.appendChild(menu);
}

// تابع خروج کاربر
function logoutUser() {
    localStorage.removeItem('pp-user');
    alert('با موفقیت خارج شدید!');
    location.reload();
}