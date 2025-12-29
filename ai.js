// PvPPacks786 AI Assistant با API رایگان
// =====================================

// انتخاب یکی از APIهای رایگان
const FREE_APIS = {
    // گزینه 1: DeepSeek API (رایگان، فارسی خوب)
    DEEPSEEK: {
        url: "https://api.deepseek.com/v1/chat/completions",
        apiKey: "sk-dd47c77abbd542c39720181ffe2ffc56", // نیاز به ثبت‌نام در deepseek.com
        model: "deepseek-chat"
    },
    
    // گزینه 2: OpenRouter (رایگان با محدودیت)
    OPENROUTER: {
        url: "https://openrouter.ai/api/v1/chat/completions",
        apiKey: "", // ثبت‌نام در openrouter.ai
        model: "openai/gpt-3.5-turbo"
    },
    
    // گزینه 3: Groq (خیلی سریع و رایگان)
    GROQ: {
        url: "https://api.groq.com/openai/v1/chat/completions",
        apiKey: "", // ثبت‌نام در groq.com
        model: "llama2-70b-4096"
    }
};

// تنظیم API فعال
const ACTIVE_API = FREE_APIS.DEEPSEEK; // یکی را انتخاب کن

// پایگاه دانش PvPPacks786
const KNOWLEDGE = {
    systemPrompt: `تو PvPPacks786 AI Assistant هستی. فقط به فارسی پاسخ بده.
محدودیت‌ها:
- فقط متن تولید کن (بدون عکس/کد)
- لینک‌های اصلی:
  • پک‌ها: https://s786mc.github.io/PvPPacks786/packs/page
  • تلگرام: t.me/PvPPacks_786
  • وبسایت: https://s786mc.github.io/PvPPacks786

اگر سوال درباره پک بود، راهنمایی کن و لینک صفحه پک‌ها را بده.
اگر سوال درباره تلگرام بود، لینک کانال را بده.`
};

// سیستم ذخیره‌سازی
class ChatStorage {
    constructor() {
        this.history = this.load();
    }
    
    load() {
        return JSON.parse(localStorage.getItem('pvp_ai_chat') || '[]');
    }
    
    save(messages) {
        const limited = messages.slice(-30); // فقط 30 پیام آخر
        localStorage.setItem('pvp_ai_chat', JSON.stringify(limited));
    }
    
    clear() {
        localStorage.removeItem('pvp_ai_chat');
        this.history = [];
    }
}

// کلاس مدیریت AI
class AIAssistant {
    constructor() {
        this.storage = new ChatStorage();
        this.isProcessing = false;
        this.setupEventListeners();
        this.loadHistory();
    }
    
    setupEventListeners() {
        // ارسال با Enter
        document.getElementById('userInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }
    
    loadHistory() {
        const chatBox = document.getElementById('chatBox');
        if (!chatBox) return;
        
        chatBox.innerHTML = '';
        
        // پیام خوش‌آمدگویی
        if (this.storage.history.length === 0) {
            this.addMessage('ai', 'سلام! من دستیار PvPPacks786 هستم. درباره پک‌های ماینکرافت می‌تونم راهنماییتون کنم!');
        }
        
        // نمایش تاریخچه
        this.storage.history.forEach(msg => {
            this.addMessage(msg.role === 'user' ? 'user' : 'ai', msg.content, false);
        });
    }
    
    addMessage(sender, content, save = true) {
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
                <div class="message-header">
                    <strong>${sender === 'user' ? 'شما' : 'PvPPacks786 AI'}</strong>
                    <span class="time">${time}</span>
                </div>
                <div class="message-text">${this.formatContent(content)}</div>
            </div>
        `;
        
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        if (save) {
            this.storage.history.push({
                role: sender === 'user' ? 'user' : 'assistant',
                content: content
            });
            this.storage.save(this.storage.history);
        }
    }
    
    formatContent(text) {
        return text
            .replace(/\n/g, '<br>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="link">$1</a>')
            .replace(/t\.me\/([^\s]+)/g, '<a href="https://t.me/$1" target="_blank" class="link">t.me/$1</a>');
    }
    
    // دریافت پاسخ از API رایگان
    async getAIResponse(userMessage) {
        // اگر API Key تنظیم نشده، از نسخه آفلون استفاده کن
        if (!ACTIVE_API.apiKey) {
            return this.getOfflineResponse(userMessage);
        }
        
        try {
            const response = await fetch(ACTIVE_API.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ACTIVE_API.apiKey}`
                },
                body: JSON.stringify({
                    model: ACTIVE_API.model,
                    messages: [
                        { role: 'system', content: KNOWLEDGE.systemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('خطا در ارتباط با API:', error);
            // اگر API خطا داد، نسخه آفلون را برگردان
            return this.getOfflineResponse(userMessage);
        }
    }
    
    // پاسخ آفلون (همیشه کار می‌کند)
    getOfflineResponse(userMessage) {
        const lowerMsg = userMessage.toLowerCase();
        
        if (lowerMsg.includes('سلام') || lowerMsg.includes('hi')) {
            return 'سلام! 👋 من دستیار PvPPacks786 هستم. چطور می‌تونم کمکتون کنم؟';
        }
        
        if (lowerMsg.includes('پک') && lowerMsg.includes('pvp')) {
            return `🎮 **پک‌های PvP پیشنهادی:**\n\n1. PvP Texture Pack 16x\n2. Ultimate PvP Pack\n3. Warzone Resource Pack\n\n📥 دانلود از: https://s786mc.github.io/PvPPacks786/packs/page`;
        }
        
        if (lowerMsg.includes('تلگرام') || lowerMsg.includes('telegram')) {
            return `📱 **کانال تلگرام:**\n\nt.me/PvPPacks_786\n\nبرای دریافت آخرین پک‌ها عضو شوید!`;
        }
        
        if (lowerMsg.includes('نصب') || lowerMsg.includes('install')) {
            return `📦 **نحوه نصب:**\n1. پک را از سایت دانلود کنید\n2. در پوشه resourcepacks قرار دهید\n3. در بازی: Options → Resource Packs\n4. پک را انتخاب و فعال کنید`;
        }
        
        if (lowerMsg.includes('وبسایت') || lowerMsg.includes('website')) {
            return `🌐 **وبسایت:**\nhttps://s786mc.github.io/PvPPacks786\n\n📚 **صفحه پک‌ها:**\nhttps://s786mc.github.io/PvPPacks786/packs/page`;
        }
        
        return `سوال خوبی پرسیدید! درباره "${userMessage}"، می‌تونید:\n\n🔍 پک‌های مرتبط را از اینجا ببینید: https://s786mc.github.io/PvPPacks786/packs/page\n\n💬 یا در تلگرام بپرسید: t.me/PvPPacks_786`;
    }
    
    async sendMessage() {
        if (this.isProcessing) return;
        
        const input = document.getElementById('userInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // غیرفعال کردن دکمه
        const sendBtn = document.getElementById('sendBtn');
        const originalText = sendBtn.innerHTML;
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        // نمایش پیام کاربر
        this.addMessage('user', message);
        input.value = '';
        
        this.isProcessing = true;
        
        try {
            // دریافت پاسخ AI
            const response = await this.getAIResponse(message);
            
            // نمایش پاسخ
            this.addMessage('ai', response);
            
        } catch (error) {
            console.error('خطا:', error);
            this.addMessage('ai', 'متأسفم! خطایی رخ داد. لطفاً دوباره تلاش کنید.');
        }
        
        // فعال کردن دکمه
        sendBtn.disabled = false;
        sendBtn.innerHTML = originalText;
        this.isProcessing = false;
    }
    
    quickQuestion(question) {
        document.getElementById('userInput').value = question;
        this.sendMessage();
    }
    
    clearChat() {
        if (confirm('آیا مطمئنید که می‌خواهید چت را پاک کنید؟')) {
            this.storage.clear();
            const chatBox = document.getElementById('chatBox');
            if (chatBox) {
                chatBox.innerHTML = '';
                this.addMessage('ai', 'چت پاک شد! سوال جدید بپرسید.');
            }
        }
    }
}

// راه‌اندازی برنامه
document.addEventListener('DOMContentLoaded', () => {
    window.aiAssistant = new AIAssistant();
    
    // توابع عمومی برای HTML
    window.sendMessage = () => window.aiAssistant.sendMessage();
    window.quickQuestion = (q) => window.aiAssistant.quickQuestion(q);
    window.clearChat = () => window.aiAssistant.clearChat();
    
    console.log('✅ PvPPacks786 AI Assistant راه‌اندازی شد!');
    console.log('📱 API فعال:', ACTIVE_API === FREE_APIS.DEEPSEEK ? 'DeepSeek' : 
                ACTIVE_API === FREE_APIS.OPENROUTER ? 'OpenRouter' : 'Groq');
});