// language-switcher.js
function initLanguageSwitcher() {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('l');
    const slParam = params.get('sl');
    
    // اگر sl=false باشد، هیچ کاری نکن
    if (slParam && slParam.toLowerCase() === 'false') {
        return;
    }
    
    // اگر پارامتر زبان وجود نداشته باشد
    if (!langParam) {
        return;
    }
    
    // اگر زبان فارسی باشد (سایت اصلی)
    if (langParam === 'پارسی' || langParam === 'فارسی') {
        return;
    }
    
    // اگر زبان پشتیبانی شده باشد
    if (SUPPORTED_LANGS.includes(langParam)) {
        applyLanguage(langParam);
    } else {
        // اگر زبان پشتیبانی نشده باشد
        showUnsupportedWarning();
    }
}

function applyLanguage(langCode) {
    const translations = LANG_TRANSLATIONS[langCode];
    if (!translations) return;
    
    // ترجمه بخش خوش‌آمدگویی
    const welcomeElem = document.querySelector('.tro');
    if (welcomeElem && welcomeElem.innerHTML.includes('به وب‌سایت ما خوش آمدید')) {
        welcomeElem.innerHTML = welcomeElem.innerHTML.replace(
            'به وب‌سایت ما خوش آمدید', 
            translations.welcome.split('<br>')[0]
        );
    }
    
    // ترجمه متن هدف
    const goalElems = document.querySelectorAll('.p-center');
    goalElems.forEach(elem => {
        if (elem.innerHTML.includes('هدف ما')) {
            elem.innerHTML = translations.goal;
        }
    });
    
    // ترجمه دکمه‌ها
    document.querySelectorAll('.dokme').forEach(btn => {
        if (btn.textContent.includes('پک‌ها')) btn.textContent = translations.packs;
        if (btn.textContent.includes('درباره')) btn.textContent = translations.about;
        if (btn.textContent.includes('مپ‌ها')) btn.textContent = translations.maps;
    });
    
    // ترجمه هشدار دسکتاپ
    const warningElem = document.querySelector('.warning-text');
    if (warningElem) {
        warningElem.textContent = translations.warning;
    }
    
    // ترجمه متن درباره ما
    const aboutTitle = document.querySelector('#about + .tro');
    if (aboutTitle && aboutTitle.innerHTML.includes('درباره ما')) {
        aboutTitle.innerHTML = translations.aboutTitle;
    }
    
    const aboutText = document.getElementById('about');
    if (aboutText) {
        aboutText.innerHTML = translations.aboutText;
    }
    
    // تغییر متن دکمه فوتر
    const footerBtn = document.getElementById('end');
    if (footerBtn && translations.footerAlert) {
        const originalClick = footerBtn.onclick;
        footerBtn.onclick = function() {
            alert(translations.footerAlert);
            if (originalClick) originalClick();
        };
    }
}

function showUnsupportedWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff5500, #ff3300);
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        text-align: center;
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: 0 4px 15px rgba(255, 85, 0, 0.4);
        max-width: 90%;
        font-size: 14px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(5px);
    `;
    
    warningDiv.textContent = 'This language is not fully supported. Some elements may remain in Persian.';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 2px;
        right: 8px;
        background: transparent;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        line-height: 1;
    `;
    
    closeBtn.onclick = () => warningDiv.remove();
    warningDiv.appendChild(closeBtn);
    document.body.appendChild(warningDiv);
    
    setTimeout(() => {
        if (warningDiv.parentNode) {
            warningDiv.remove();
        }
    }, 7000);
}

// اجرای خودکار هنگام لود صفحه
document.addEventListener('DOMContentLoaded', initLanguageSwitcher);

// همچنین برای حالت‌های که DOM قبلاً لود شده
if (document.readyState !== 'loading') {
    initLanguageSwitcher();
}