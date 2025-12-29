// PvPPacks786 AI Assistant با DeepSeek API
// ========================================

const DEEPSEEK_API_KEY = "sk-dd47c77abbd542c39720181ffe2ffc56"; // کلید خودت
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

// پایگاه دانش
const SYSTEM_PROMPT = `تو PvPPacks786 AI Assistant هستی که به فارسی پاسخ می‌دهی.
مشخصات:
- لینک پک‌ها: https://s786mc.github.io/PvPPacks786/packs/page
- تلگرام: t.me/PvPPacks_786
- وبسایت: https://s786mc.github.io/PvPPacks786

قوانین:
1. فقط فارسی پاسخ بده
2. درباره پک‌های ماینکرافت راهنمایی کن
3. لینک بالا را برای پک‌ها بده
4. فقط متن تولید کن (نه عکس/کد)
5. اگر سوال غیرمرتبط بود، بگو فقط در مورد پک‌ها می‌توانی کمک کنی`;

class ChatSystem {
    constructor() {
        this.messages = [];
        this.loadMessages();
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showWelcome();
    }
    
    bindEvents() {
        // دکمه ارسال
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        // اینتر در input
        const input = document.getElementById('userInput');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }
    
    showWelcome() {
        if (this.messages.length === 0) {
            this.addMessage('ai', 'سلام! 👋 من دستیار PvPPacks786 هستم. می‌تونم درباره پک‌های ماینکرافت راهنماییتون کنم!');
        }
    }
    
    async sendMessage() {
        const input = document.getElementById('userInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // نمایش پیام کاربر
        this.addMessage('user', message);
        input.value = '';
        
        // غیرفعال کردن دکمه
        const btn = document.getElementById('sendBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        try {
            // دریافت پاسخ از DeepSeek
            const response = await this.getDeepSeekResponse(message);
            this.addMessage('ai', response);
        } catch (error) {
            console.error('خطا:', error);
            // اگر API جواب نداد، نسخه آفلون
            const offlineResponse = this.getOfflineResponse(message);
            this.addMessage('ai', offlineResponse);
        }
        
        // فعال کردن دکمه
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> ارسال';
    }
    
    async getDeepSeekResponse(userMessage) {
        // اگر API Key نداریم، آفلون پاسخ بده
        if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx") {
            return this.getOfflineResponse(userMessage);
        }
        
        try {
            const response = await fetch(DEEPSEEK_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: userMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000,
                    stream: false
                })
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.choices && data.choices[0]) {
                return data.choices[0].message.content;
            } else {
                throw new Error('پاسخی دریافت نشد');
            }
            
        } catch (error) {
            console.error('خطای DeepSeek:', error);
            // در صورت خطا، پاسخ آفلون بده
            return this.getOfflineResponse(userMessage);
        }
    }
    
    getOfflineResponse(userMessage) {
        const lower = userMessage.toLowerCase();
        
        // پاسخ‌های از پیش تعریف شده
        if (lower.includes('سلام') || lower.includes('hi') || lower.includes('hello')) {
            return 'سلام! 😊 من دستیار PvPPacks786 هستم. چطور می‌تونم در مورد پک‌های ماینکرافت کمکتون کنم؟';
        }
        
        if (lower.includes('پک') && lower.includes('pvp')) {
            return `🎮 **پک‌های PvP پیشنهادی:**\n\n1. **PvP Texture Pack 16x** - برای مبارزات سریع\n2. **Ultimate PvP Pack** - کامل با تمام ابزارها\n3. **Warzone Resource Pack** - گرافیک حماسی\n\n📥 دانلود از: https://s786mc.github.io/PvPPacks786/packs/page`;
        }
        
        if (lower.includes('تلگرام') || lower.includes('telegram')) {
            return `📱 **کانال تلگرام:**\n\nt.me/PvPPacks_786\n\nبرای دریافت جدیدترین پک‌ها عضو شوید!`;
        }
        
        if (lower.includes('نصب') || lower.includes('install') || lower.includes('چطوری')) {
            return `📦 **نحوه نصب پک:**\n\n1. پک را از اینجا دانلود کنید: https://s786mc.github.io/PvPPacks786/packs/page\n2. فایل را در پوشه resourcepacks قرار دهید\n3. بازی را اجرا کنید\n4. به Options → Resource Packs بروید\n5. پک را انتخاب و فعال کنید\n\n💡 برای راهنمایی بیشتر به تلگرام مراجعه کنید.`;
        }
        
        if (lower.includes('مشکل') || lower.includes('خطا') || lower.includes('کار نمیکنه')) {
            return `🔧 **مشکلات رایج:**\n\n• اگر پک لود نمی‌شود: فایل را دوباره دانلود کنید\n• اگر بازی کرش می‌کند: از پک‌های 16x استفاده کنید\n• اگر گرافیک درست نیست: OptiFine نصب کنید\n\n📞 برای پشتیبانی: t.me/PvPPacks_786`;
        }
        
        if (lower.includes('وبسایت') || lower.includes('website')) {
            return `🌐 **وبسایت PvPPacks786:**\n\n• صفحه اصلی: https://s786mc.github.io/PvPPacks786\n• همه پک‌ها: https://s786mc.github.io/PvPPacks786/packs/page\n• تلگرام: t.me/PvPPacks_786`;
        }
        
        // پاسخ پیش‌فرض
        return `سوال جالبی پرسیدید! درباره "${userMessage}"، می‌تونم بگم که:\n\n🔍 **پک‌های مرتبط را از اینجا ببینید:**\nhttps://s786mc.github.io/PvPPacks786/packs/page\n\n💬 **برای سوالات تخصصی:**\nt.me/PvPPacks_786\n\n🎮 **یا از من بپرسید:**\n• بهترین پک PvP کدام است؟\n• چطور پک نصب کنم؟\n• مشکل در اجرای پک دارم`;
    }
    
    addMessage(sender, text) {
        // ذخیره در تاریخچه
        this.messages.push({ sender, text, time: new Date() });
        localStorage.setItem('pvp_chat_history', JSON.stringify(this.messages));
        
        // نمایش در صفحه
        this.displayMessage(sender, text);
    }
    
    displayMessage(sender, text) {
        const chatBox = document.getElementById('chatBox');
        if (!chatBox) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageDiv.innerHTML = `
            <div class="avatar">${sender === 'user' ? '👤' : '🤖'}</div>
            <div class="content">
                <strong>${sender === 'user' ? 'شما' : 'PvPPacks786 AI'}</strong>
                <span class="time">${time}</span>
                <div class="text">${this.formatText(text)}</div>
            </div>
        `;
        
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    formatText(text) {
        return text
            .replace(/\n/g, '<br>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
            .replace(/t\.me\/([^\s]+)/g, '<a href="https://t.me/$1" target="_blank">t.me/$1</a>');
    }
    
    loadMessages() {
        const saved = localStorage.getItem('pvp_chat_history');
        if (saved) {
            this.messages = JSON.parse(saved);
            this.messages.forEach(msg => {
                this.displayMessage(msg.sender, msg.text);
            });
        }
    }
    
    clearChat() {
        if (confirm('آیا مطمئنید که می‌خواهید چت را پاک کنید؟')) {
            localStorage.removeItem('pvp_chat_history');
            this.messages = [];
            const chatBox = document.getElementById('chatBox');
            if (chatBox) {
                chatBox.innerHTML = '';
                this.addMessage('ai', 'چت پاک شد! سوال جدید بپرسید. 😊');
            }
        }
    }
}

// راه‌اندازی
document.addEventListener('DOMContentLoaded', () => {
    window.chatBot = new ChatSystem();
    
    // توابع عمومی
    window.sendMessage = () => window.chatBot.sendMessage();
    window.clearChat = () => window.chatBot.clearChat();
    
    // دکمه‌های سریع
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.textContent;
            document.getElementById('userInput').value = question;
            window.chatBot.sendMessage();
        });
    });
    
    console.log('🤖 PvPPacks786 AI Assistant آماده است!');
});