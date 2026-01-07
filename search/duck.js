// فایل duck.js - مدیریت جستجو و اعتبارسنجی کاربر

document.addEventListener('DOMContentLoaded', function() {
    // بررسی لاگین کاربر
    checkUserLogin();
    
    // مقداردهی اولیه
    initSearch();
    initQuickButtons();
    
    // تنظیم رویدادهای کیبورد
    setupKeyboardEvents();
});

// تابع بررسی وضعیت کاربر
function checkUserLogin() {
    const user = JSON.parse(localStorage.getItem('pp-user'));
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    
    if (!user || !user.name) {
        // اگر کاربر لاگین نکرده باشد
        searchForm.innerHTML = `
            <div class="guest-warning">
                <h3>⚠️ برای استفاده از جستجو باید وارد شوید</h3>
                <p>لطفاً ابتدا در سایت ثبت‌نام کرده و وارد حساب کاربری خود شوید.</p>
                <a href="https://s786mc.github.io/PvPPacks786/login.html" class="login-btn">
                    ورود / ثبت‌نام
                </a>
            </div>
        `;
        
        if (searchInput) {
            searchInput.disabled = true;
            searchInput.placeholder = "لطفاً ابتدا وارد شوید...";
        }
        
        return false;
    }
    
    return true;
}

// تابع مقداردهی فرم جستجو
function initSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // بررسی لاگین
        if (!checkUserLogin()) {
            alert('لطفاً ابتدا وارد حساب کاربری خود شوید!');
            return;
        }
        
        const query = searchInput.value.trim();
        
        if (!query) {
            alert('لطفاً چیزی برای جستجو وارد کنید!');
            searchInput.focus();
            return;
        }
        
        // انجام جستجو
        performSearch(query);
    });
}

// تابع انجام جستجو
function performSearch(query) {
    // نمایش انیمیشن لودینگ
    const searchBtn = document.querySelector('.search-btn');
    const originalText = searchBtn.innerHTML;
    searchBtn.innerHTML = '⏳ در حال جستجو...';
    searchBtn.classList.add('loading');
    
    // کدگذاری عبارت جستجو برای URL
    const encodedQuery = encodeURIComponent(query);
    
    // ساخت URL جستجوی DuckDuckGo
    const searchUrl = `https://duckduckgo.com/?q=${encodedQuery}&kl=ir-fa&kz=-1&k1=-1&kp=-2`;
    
    // هدایت پس از تاخیر کوتاه برای نمایش انیمیشن
    setTimeout(() => {
        // ذخیره تاریخچه جستجو
        saveSearchHistory(query);
        
        // هدایت به DuckDuckGo
        window.location.href = searchUrl;
    }, 800);
}

// تابع مقداردهی دکمه‌های سریع
function initQuickButtons() {
    const quickButtons = document.querySelectorAll('.quick-btn');
    
    quickButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!checkUserLogin()) {
                alert('لطفاً ابتدا وارد حساب کاربری خود شوید!');
                return;
            }
            
            const searchQuery = this.getAttribute('data-search');
            document.getElementById('searchInput').value = searchQuery;
            
            // جستجوی خودکار
            performSearch(searchQuery);
        });
    });
}

// تابع ذخیره تاریخچه جستجو
function saveSearchHistory(query) {
    const user = JSON.parse(localStorage.getItem('pp-user'));
    
    if (!user || !user.name) return;
    
    // ایجاد یا به‌روزرسانی تاریخچه
    let searchHistory = JSON.parse(localStorage.getItem('pp-search-history')) || [];
    
    // اضافه کردن جستجوی جدید
    const searchRecord = {
        query: query,
        timestamp: new Date().toISOString(),
        user: user.name
    };
    
    searchHistory.unshift(searchRecord); // اضافه به ابتدای آرایه
    
    // محدود کردن تاریخچه به 50 مورد آخر
    if (searchHistory.length > 50) {
        searchHistory = searchHistory.slice(0, 50);
    }
    
    localStorage.setItem('pp-search-history', JSON.stringify(searchHistory));
    
    // ارسال به API (در صورت نیاز)
    logSearchToAPI(query, user.name);
}

// تابع ارسال لاگ جستجو به API (اختیاری)
function logSearchToAPI(query, username) {
    // این بخش اختیاری است و برای ردیابی آماری استفاده می‌شود
    const apiData = {
        query: query,
        user: username,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        source: 'PvPPacks_Search'
    };
    
    // می‌توانید این اطلاعات را به سرور خود ارسال کنید
    // fetch('YOUR_API_ENDPOINT', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(apiData)
    // });
    
    console.log('Search logged:', apiData);
}

// تابع تنظیم رویدادهای کیبورد
function setupKeyboardEvents() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) return;
    
    // فوکوس خودکار روی فیلد جستجو
    setTimeout(() => {
        if (checkUserLogin()) {
            searchInput.focus();
        }
    }, 500);
    
    // جستجو با کلید Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('searchForm').dispatchEvent(new Event('submit'));
        }
    });
    
    // کلیدهای میانبر
    document.addEventListener('keydown', function(e) {
        // Ctrl + K یا Cmd + K برای فوکوس روی جستجو
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (checkUserLogin()) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // Escape برای پاک کردن جستجو
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.focus();
        }
    });
}

// تابع نمایش پیشنهادات جستجو (اختیاری)
function showSearchSuggestions(query) {
    // این تابع می‌تواند با API DuckDuckGo یا خودتان تکمیل شود
    // فعلاً یک نمونه ساده:
    const suggestions = [
        "Minecraft PvP Pack 1.20",
        "Minecraft texture packs",
        "How to install shaders",
        "Best PvP servers",
        "Minecraft mods"
    ];
    
    const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(query.toLowerCase())
    );
    
    // می‌توانید یک dropdown برای نمایش پیشنهادات ایجاد کنید
    console.log('Suggestions:', filtered);
}

// تابع بررسی اتصال اینترنت
function checkInternetConnection() {
    if (!navigator.onLine) {
        alert('⚠️ اتصال اینترنت خود را بررسی کنید!');
        return false;
    }
    return true;
}

// اضافه کردن event listener برای تغییر وضعیت آنلاین/آفلاین
window.addEventListener('online', () => {
    console.log('Internet connection restored');
});

window.addEventListener('offline', () => {
    alert('⚠️ شما آفلاین هستید. لطفاً اتصال اینترنت خود را بررسی کنید.');
});