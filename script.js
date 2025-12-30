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
        this.timeUnit = document.getElementById('timeUnit');
        this.progressBar = document.getElementById('progressBar');
        
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
        const savedUnit = localStorage.getItem('pomodoroUnit') || 'minutes';
        
        if (savedTime) {
            // 如果之前保存的是秒为单位的时间，需要转换回分钟显示
            const timeValue = parseInt(savedTime);
            if (savedUnit === 'seconds') {
                this.timeInput.value = timeValue;
            } else {
                // 如果是分钟为单位，转换为分钟显示
                this.timeInput.value = timeValue / 60;
            }
        } else {
            this.timeInput.value = 25; // 默认25分钟
        }
        
        // 设置单位选择器
        document.getElementById('timeUnit').value = savedUnit;
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
        
        const timeValue = parseInt(this.timeInput.value);
        const timeUnit = document.getElementById('timeUnit').value;
        
        if (isNaN(timeValue) || timeValue <= 0) {
            alert('请输入有效的时间');
            return;
        }
        
        // 根据选择的单位计算总秒数
        if (timeUnit === 'minutes') {
            this.totalSeconds = timeValue * 60;
        } else { // seconds
            this.totalSeconds = timeValue;
        }
        
        this.remainingSeconds = this.totalSeconds;
        this.isRunning = true;
        this.isPaused = false;
        
        // 保存设置到本地存储
        localStorage.setItem('pomodoroTime', timeValue);
        localStorage.setItem('pomodoroUnit', timeUnit);
        
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
        this.statusText.classList.remove('blinking'); // 移除闪烁类
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
        this.statusText.classList.remove('blinking'); // 移除闪烁类
        this.timerDisplay.classList.remove('running', 'finished');
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        // 重置计时器相关变量
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        
        this.updateDisplay();
        this.updateProgress(); // 重置进度条
    }
    
    countdown() {
        this.intervalId = setInterval(() => {
            if (this.remainingSeconds <= 0) {
                this.finish();
                return;
            }
            
            this.remainingSeconds--;
            this.updateDisplay();
            this.updateProgress();
        }, 1000);
    }
    
    finish() {
        this.isRunning = false;
        this.isPaused = false;
        
        this.startBtn.disabled = false;
        this.startBtn.textContent = '开始计时';
        this.pauseBtn.disabled = true;
        this.timeInput.disabled = false;
        this.statusText.textContent = '休息一下吧';
        this.statusText.classList.add('blinking'); // 添加闪烁类
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
        // 连续播放三次提示音
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
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
            }, i * 600); // 每次间隔600毫秒
        }
        
        // 播放HTML audio元素三次作为备选
        setTimeout(() => this.alarmSound.play().catch(() => {}), 0);
        setTimeout(() => this.alarmSound.play().catch(() => {}), 600);
        setTimeout(() => this.alarmSound.play().catch(() => {}), 1200);
    }
    
    showNotification() {
        // 浏览器通知
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('番茄闹钟', {
                body: '休息一下吧！',
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
            // 如果计时器未运行，根据选择的单位显示时间
            const inputTime = parseInt(this.timeInput.value) || 25;
            const timeUnit = document.getElementById('timeUnit').value;
            
            if (timeUnit === 'minutes') {
                // 如果是分钟单位，转换为分钟和秒
                minutes = inputTime;
                seconds = 0;
            } else { // seconds
                // 如果是秒单位，计算分钟和秒
                minutes = Math.floor(inputTime / 60);
                seconds = inputTime % 60;
            }
        }
        
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateProgress() {
        if (this.totalSeconds > 0) {
            const progressPercent = ((this.totalSeconds - this.remainingSeconds) / this.totalSeconds) * 100;
            this.progressBar.style.width = progressPercent + '%';
        } else {
            this.progressBar.style.width = '0%';
        }
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