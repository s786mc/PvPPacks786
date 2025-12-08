document.addEventListener('DOMContentLoaded', function() {
    const warningContainer = document.getElementById('desktop-warning');
    const countdownElement = document.getElementById('countdown');
    
    // بررسی آیا دستگاه عرض صفحه بیشتر از 768px دارد (دسکتاپ)
    if (window.innerWidth >= 769) {
        let secondsLeft = 10;
        
        // آپدیت تایمر هر ثانیه
        const countdownInterval = setInterval(() => {
            secondsLeft--;
            countdownElement.textContent = secondsLeft;
            
            if (secondsLeft <= 0) {
                clearInterval(countdownInterval);
                warningContainer.style.display = 'none';
            }
        }, 1000);
        
        // مخفی کردن هشدار پس از 5 ثانیه به صورت خودکار
        setTimeout(() => {
            warningContainer.style.display = 'none';
        }, 10000);
    } else {
        // اگر موبایل است، هشدار را اصلا نمایش نده
        warningContainer.style.display = 'none';
    }
});