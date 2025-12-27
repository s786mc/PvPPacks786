// پایگاه دانش PvPPacks786
const knowledgeBase = {
    welcome: `سلام! من PvPPacks786 AI Assistant هستم. می‌تونم در مورد پک‌های ماینکرافت، نحوه نصب، مشکلات و هر سوال دیگه‌ای راهنماییتون کنم!`,

    packs: {
        pvp: "پک‌های PvP برای مبارزه Player vs Player طراحی شدن. بهترین پک‌ها شامل PvP Texture Pack, Ultra PvP Pack, و Warzone Pack هستن.",
        texture: "پک‌های Texture ظاهر بازی رو تغییر می‌دن. پیشنهاد میکنم Texture Packs 16x یا 32x رو امتحان کنید.",
        shader: "برای شیدر پک، Complementary Shaders یا BSL Shaders رو توصیه می‌کنم.",
        utility: "پک‌های Utility شامل مواردی مثل Better UI, Inventory Tweaks, و OptiFine می‌شن.",
        popular: [
            "PvP Texture Pack 16x",
            "Ultimate PvP Pack",
            "Warzone Resource Pack",
            "Combat Utilities Pack",
            "SkyWars Texture Pack"
        ]
    },

    installation: `برای نصب پک:
    1. پک مورد نظر رو از https://s786mc.github.io/PvPPacks786/packs/page دانلود کنید
    2. فایل .zip یا .rar رو اکسترکت کنید
    3. فایل .mcpack یا پوشه رو توی مسیر resourcepacks ماینکرافت قرار بدید
    4. بازی رو اجرا کرده و از Options > Resource Packs پک رو فعال کنید`,

    troubleshooting: {
        notWorking: "اگر پک کار نمی‌کنه:\n- مطمئن شوید ماینکرافت آپدیت هست\n- فایل رو چک کنید که آسیب ندیده باشه\n- از OptiFine استفاده کنید\n- ورژن پک با ورژن بازی سازگار باشه",
        lag: "اگر لگ دارید:\n- پک‌های 16x بجای 32x استفاده کنید\n- OptiFine نصب کنید\n- تنظیمات گرافیکی رو پایین بیارید\n- مودهای غیرضروری رو غیرفعال کنید"
    },

    links: {
        packs: "https://s786mc.github.io/PvPPacks786/packs/page",
        telegram: "t.me/PvPPacks_786",
        website: "https://s786mc.github.io/PvPPacks786",
        github: "https://github.com/s786mc/PvPPacks786"
    },

    capabilities: `من می‌تونم:
    • پک مناسب رو پیشنهاد بدم
    • نحوه نصب رو توضیح بدم
    • مشکلات رو حل کنم
    • درباره ویژگی‌های پک‌ها بگم
    • به سوالات عمومی پاسخ بدم
    
    اما نمی‌تونم:
    • عکس یا ویدیو بسازم
    • پک جدید ایجاد کنم
    • فایل‌ها رو تغییر بدم
    • به دیتابیس خارجی وصل بشم`
};

// سیستم ذخیره‌سازی
class StorageManager {
    constructor() {
        this.settingsKey = 'pvppacks_ai_settings';
        this.chatHistoryKey = 'pvppacks_ai_chat_history';
        this.statsKey = 'pvppacks_ai_stats';
    }

    // ذخیره تنظیمات
    saveSettings(settings) {
        localStorage.setItem(this.settingsKey, JSON.stringify(settings));
        this.updateStorageInfo();
    }

    // بارگذاری تنظیمات
    loadSettings() {
        const saved = localStorage.getItem(this.settingsKey);
        return saved ? JSON.parse(saved) : {
            userName: 'کاربر',
            responseStyle: 'friendly',
            notifications: true
        };
    }

    // ذخیره تاریخچه چت
    saveChatHistory(history) {
        localStorage.setItem(this.chatHistoryKey, JSON.stringify(history));
        this.updateStats();
        this.updateStorageInfo();
    }

    // بارگذاری تاریخچه چت
    loadChatHistory() {
        const saved = localStorage.getItem(this.chatHistoryKey);
        return saved ? JSON.parse(saved) : [];
    }

    // آمار استفاده
    updateStats() {
        const today = new Date().toDateString();
        const stats = JSON.parse(localStorage.getItem(this.statsKey) || '{}');
        
        if (!stats[today]) {
            stats[today] = { messages: 0, questions: 0 };
        }
        
        const history = this.loadChatHistory();
        stats[today].messages = history.length;
        stats[today].questions = history.filter(msg => msg.sender === 'user').length;
        
        localStorage.setItem(this.statsKey, JSON.stringify(stats));
        
        // آپدیت نمایش
        this.displayTodayStats(stats[today]);
    }

    // نمایش آمار امروز
    displayTodayStats(todayStats) {
        const todayMessagesEl = document.getElementById('todayMessages');
        if (todayMessagesEl && todayStats) {
            todayMessagesEl.textContent = todayStats.questions || 0;
        }
    }

    // اطلاعات حافظه
    updateStorageInfo() {
        let totalBytes = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            totalBytes += key.length + value.length;
        }
        
        const storageUsageEl = document.getElementById('storageUsage');
        if (storageUsageEl) {
            const kb = (totalBytes / 1024).toFixed(2);
            storageUsageEl.textContent = `${kb} KB`;
        }
    }

    // پاک کردن چت
    clearChat() {
        if (confirm('آیا مطمئن هستید که می‌خواهید تاریخچه چت را پاک کنید؟')) {
            localStorage.removeItem(this.chatHistoryKey);
            this.updateStorageInfo();
            return true;
        }
        return false;
    }
}

// مدیریت چت
class ChatManager {
    constructor(storageManager) {
        this.storage = storageManager;
        this.chatHistory = [];
        this.currentSettings = {};
        this.initialize();
    }

    initialize() {
        this.loadHistory();
        this.loadSettings();
        this.setupEventListeners();
        this.updateTime();
        setInterval(() => this.updateTime(), 60000); // آپدیت زمان هر دقیقه
    }

    loadHistory() {
        this.chatHistory = this.storage.loadChatHistory();
        this.displayHistory();
    }

    loadSettings() {
        this.currentSettings = this.storage.loadSettings();
        this.applySettings();
    }

    applySettings() {
        // اعمال تنظیمات روی UI
        const userNameInput = document.getElementById('userName');
        const responseStyleSelect = document.getElementById('responseStyle');
        
        if (userNameInput) userNameInput.value = this.currentSettings.userName;
        if (responseStyleSelect) responseStyleSelect.value = this.currentSettings.responseStyle;
    }

    setupEventListeners() {
        // ذخیره تنظیمات
        window.saveSettings = () => {
            this.currentSettings = {
                userName: document.getElementById('userName').value || 'کاربر',
                responseStyle: document.getElementById('responseStyle').value,
                notifications: true
            };
            this.storage.saveSettings(this.currentSettings);
            this.showToast('تنظیمات ذخیره شد!', 'success');
        };

        // پاک کردن چت
        window.clearChat = () => {
            if (this.storage.clearChat()) {
                this.chatHistory = [];
                this.displayHistory();
                this.addSystemMessage('چت پاک شد! می‌تونید سوال جدید بپرسید.');
                this.showToast('تاریخچه چت پاک شد', 'info');
            }
        };

        // سوالات سریع
        window.askQuestion = (question) => {
            document.getElementById('userInput').value = question;
            this.sendMessage();
        };
    }

    updateTime() {
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            timeElement.textContent = timeString;
        }
    }

    displayHistory() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        // پاک کردن پیام‌های فعلی (غیر از پیام خوش‌آمدگویی اولیه)
        chatMessages.innerHTML = '';
        
        // اضافه کردن پیام خوش‌آمدگویی
        this.addWelcomeMessage();
        
        // نمایش تاریخچه
        this.chatHistory.forEach(message => {
            this.displayMessage(message.sender, message.content, false);
        });
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            sender: 'ai',
            content: knowledgeBase.welcome
        };
        this.displayMessage('ai', welcomeMessage.content);
    }

    addSystemMessage(text) {
        const message = {
            sender: 'ai',
            content: text
        };
        this.displayMessage('ai', message.content);
    }

    displayMessage(sender, content, saveToHistory = true) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const senderName = sender === 'user' 
            ? this.currentSettings.userName 
            : 'PvPPacks786 AI Assistant';
        
        const avatarIcon = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="${avatarIcon}"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender">${senderName}</span>
                    <span class="time">${timeString}</span>
                </div>
                <div class="message-text">${this.formatMessage(content)}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        if (saveToHistory) {
            this.chatHistory.push({ sender, content, timestamp: now });
            this.storage.saveChatHistory(this.chatHistory);
        }
    }

    formatMessage(text) {
        // تبدیل لینک‌ها به تگ <a>
        let formatted = text.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener">$1</a>'
        );
        
        // تبدیل خطوط جدید به <br>
        formatted = formatted.replace(/\n/g, '<br>');
        
        // هایلایت کلمات کلیدی
        const keywords = ['پک', 'ماینکرافت', 'PvP', 'Texture', 'نصب', 'خطا'];
        keywords.forEach(keyword => {
            const regex = new RegExp(`(${keyword})`, 'gi');
            formatted = formatted.replace(regex, '<strong>$1</strong>');
        });
        
        return formatted;
    }

    processUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // شناسایی نوع سوال
        if (lowerMessage.includes('سلام') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
            return `سلام ${this.currentSettings.userName}! چطور می‌تونم کمکتون کنم؟ 😊`;
        }
        
        if (lowerMessage.includes('تشکر') || lowerMessage.includes('ممنون')) {
            return `خواهش می‌کنم ${this.currentSettings.userName}! خوشحالم که می‌تونم کمک کنم. اگر سوال دیگه‌ای دارید در خدمتم.`;
        }
        
        if (lowerMessage.includes('پک') && lowerMessage.includes('pvp')) {
            return `${knowledgeBase.packs.pvp}\n\nبرای دیدن لیست کامل پک‌های PvP، به ${knowledgeBase.links.packs} مراجعه کنید.`;
        }
        
        if (lowerMessage.includes('پک') && lowerMessage.includes('texture')) {
            return `${knowledgeBase.packs.texture}\n\nپک‌های Texture رو می‌تونید از ${knowledgeBase.links.packs} دانلود کنید.`;
        }
        
        if (lowerMessage.includes('نصب') || lowerMessage.includes('install')) {
            return `📦 ${knowledgeBase.installation}`;
        }
        
        if (lowerMessage.includes('تلگرام') || lowerMessage.includes('telegram')) {
            return `کانال تلگرام ما:\n${knowledgeBase.links.telegram}\n\nدر این کانال جدیدترین پک‌ها و آپدیت‌ها رو منتشر می‌کنیم.`;
        }
        
        if (lowerMessage.includes('وبسایت') || lowerMessage.includes('website')) {
            return `وبسایت رسمی PvPPacks786:\n${knowledgeBase.links.website}\n\nهمه پک‌ها در ${knowledgeBase.links.packs} قابل دسترسی هستند.`;
        }
        
        if (lowerMessage.includes('مشکل') || lowerMessage.includes('خطا') || lowerMessage.includes('کار نمیکنه')) {
            return `🔧 راه‌حل‌های رایج:\n\n${knowledgeBase.troubleshooting.notWorking}\n\n${knowledgeBase.troubleshooting.lag}`;
        }
        
        if (lowerMessage.includes('چی میتونی') || lowerMessage.includes('توانایی')) {
            return knowledgeBase.capabilities;
        }
        
        if (lowerMessage.includes('محبوب') || lowerMessage.includes('بهترین')) {
            const popularPacks = knowledgeBase.packs.popular.map((pack, index) => 
                `${index + 1}. ${pack}`
            ).join('\n');
            
            return `🎮 محبوب‌ترین پک‌های ما:\n\n${popularPacks}\n\nهمه این پک‌ها رو می‌تونید از ${knowledgeBase.links.packs} دانلود کنید.`;
        }
        
        // پاسخ پیش‌فرض
        return `سوال جالبی پرسیدید! در مورد "${message}"، می‌تونم بگم که:\n\n` +
               `• می‌تونید پک‌های مرتبط رو از ${knowledgeBase.links.packs} پیدا کنید\n` +
               `• اگر مشکل نصب دارید، راهنمای نصب رو مطالعه کنید\n` +
               `• برای پشتیبانی بیشتر به ${knowledgeBase.links.telegram} سر بزنید\n\n` +
               `آیا سوال خاص‌تری در مورد پک‌ها دارید؟`;
    }

    showToast(message, type = 'info') {
        // ایجاد عنصر toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 12px 24px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideDown 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // حذف پس از 3 ثانیه
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    sendMessage() {
        const input = document.getElementById('userInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // غیرفعال کردن دکمه ارسال
        const sendBtn = document.getElementById('sendBtn');
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال پردازش';
        
        // نمایش پیام کاربر
        this.displayMessage('user', message);
        
        // پاک کردن ورودی
        input.value = '';
        this.autoResize(input);
        
        // نمایش ایندیکیتور تایپینگ
        const typingIndicator = document.getElementById('typingIndicator');
        typingIndicator.classList.add('active');
        
        // شبیه‌سازی تاخیر پردازش
        setTimeout(() => {
            // تولید پاسخ
            const response = this.processUserMessage(message);
            
            // مخفی کردن ایندیکیتور تایپینگ
            typingIndicator.classList.remove('active');
            
            // نمایش پاسخ
            this.displayMessage('ai', response);
            
            // فعال کردن دکمه ارسال
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ارسال';
        }, 1500);
    }
}

// توابع کمکی عمومی
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        window.chatManager.sendMessage();
    }
}

// راه‌اندازی برنامه
document.addEventListener('DOMContentLoaded', () => {
    // اضافه کردن استایل برای toast
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translate(-50%, -100%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translate(-50%, 0); opacity: 1; }
            to { transform: translate(-50%, -100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // مقداردهی اولیه
    const storageManager = new StorageManager();
    window.chatManager = new ChatManager(storageManager);
    
    // تنظیم توابع global
    window.autoResize = autoResize;
    window.handleKeyDown = handleKeyDown;
    window.sendMessage = () => window.chatManager.sendMessage();
    
    // آپدیت اطلاعات حافظه
    storageManager.updateStorageInfo();
    storageManager.updateStats();
    
    console.log('🤖 PvPPacks786 AI Assistant راه‌اندازی شد!');
});