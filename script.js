class PomodoroTimer {
    constructor() {
        this.timeInput = document.getElementById('timeInput');
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.statusText = document.getElementById('statusText');
        this.alarmSound = document.getElementById('alarmSound');
        this.timerDisplay = document.querySelector('.timer-display');
        
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.intervalId = null;
        
        this.init();
    }
    
    init() {
        this.loadSavedTime();
        this.updateDisplay();
        this.bindEvents();
    }
    
    loadSavedTime() {
        const savedTime = localStorage.getItem('pomodoroTime');
        if (savedTime) {
            this.timeInput.value = savedTime;
        } else {
            this.timeInput.value = 40; // 默认40分钟
        }
    }
    
    saveTime() {
        localStorage.setItem('pomodoroTime', this.timeInput.value);
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.timeInput.addEventListener('change', () => {
            this.saveTime();
            if (!this.isRunning) {
                this.updateDisplay();
            }
        });
    }
    
    start() {
        if (this.isPaused) {
            this.resume();
            return;
        }
        
        const minutes = parseInt(this.timeInput.value);
        if (isNaN(minutes) || minutes <= 0) {
            alert('请输入有效的时间（分钟）');
            return;
        }
        
        this.totalSeconds = minutes * 60;
        this.remainingSeconds = this.totalSeconds;
        this.isRunning = true;
        this.isPaused = false;
        
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.timeInput.disabled = true;
        this.statusText.textContent = '计时中...';
        this.timerDisplay.classList.add('running');
        
        this.countdown();
    }
    
    pause() {
        this.isRunning = false;
        this.isPaused = true;
        
        this.startBtn.disabled = false;
        this.startBtn.textContent = '继续';
        this.pauseBtn.disabled = true;
        this.statusText.textContent = '已暂停';
        this.timerDisplay.classList.remove('running');
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    resume() {
        this.isRunning = true;
        this.isPaused = false;
        
        this.startBtn.disabled = true;
        this.startBtn.textContent = '开始计时';
        this.pauseBtn.disabled = false;
        this.statusText.textContent = '计时中...';
        this.timerDisplay.classList.add('running');
        
        this.countdown();
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        
        this.startBtn.disabled = false;
        this.startBtn.textContent = '开始计时';
        this.pauseBtn.disabled = true;
        this.timeInput.disabled = false;
        this.statusText.textContent = '准备开始';
        this.timerDisplay.classList.remove('running', 'finished');
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        this.updateDisplay();
    }
    
    countdown() {
        this.intervalId = setInterval(() => {
            if (this.remainingSeconds <= 0) {
                this.finish();
                return;
            }
            
            this.remainingSeconds--;
            this.updateDisplay();
        }, 1000);
    }
    
    finish() {
        this.isRunning = false;
        this.isPaused = false;
        
        this.startBtn.disabled = false;
        this.startBtn.textContent = '开始计时';
        this.pauseBtn.disabled = true;
        this.timeInput.disabled = false;
        this.statusText.textContent = '时间到！';
        this.timerDisplay.classList.remove('running');
        this.timerDisplay.classList.add('finished');
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        // 播放提示音
        this.playAlarm();
        
        // 显示完成通知
        this.showNotification();
    }
    
    playAlarm() {
        // 创建简单的提示音
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        // 播放HTML audio元素作为备选
        this.alarmSound.play().catch(() => {
            // 如果音频播放失败，使用Web Audio API的提示音
        });
    }
    
    showNotification() {
        // 浏览器通知
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('番茄闹钟', {
                body: '时间到了！休息一下吧！',
                icon: '🍅'
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('番茄闹钟', {
                        body: '时间到了！休息一下吧！',
                        icon: '🍅'
                    });
                }
            });
        }
        
        // 视觉提醒
        document.title = '⏰ 时间到了！ - 番茄闹钟';
        setTimeout(() => {
            document.title = '番茄闹钟';
        }, 3000);
    }
    
    updateDisplay() {
        let minutes, seconds;
        
        if (this.isRunning || this.isPaused) {
            minutes = Math.floor(this.remainingSeconds / 60);
            seconds = this.remainingSeconds % 60;
        } else {
            const inputMinutes = parseInt(this.timeInput.value) || 40;
            minutes = inputMinutes;
            seconds = 0;
        }
        
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});

// 请求通知权限
document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});