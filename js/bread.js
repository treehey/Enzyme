class AppleStyle {
    constructor() {
        this.initScrollEffects();
    }

    initScrollEffects() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.asp-card').forEach(card => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(30px)';
            observer.observe(card);
        });
    }
}

// 初始化
new AppleStyle();
// 进度条动画
document.querySelectorAll('.progress-ring').forEach(ring => {
    const percent = ring.dataset.percent;
    ring.style.setProperty('--progress', `${percent}%`);
});

// 卡片入场动画
const specCards = document.querySelectorAll('.spec-card');
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

specCards.forEach(card => {
    cardObserver.observe(card);
});

// 时间轴交互逻辑
const timeline = document.querySelector('.timeline-track');
const dots = document.querySelectorAll('.indicator-dot');

// 滚动同步指示器
timeline.addEventListener('scroll', () => {
    const scrollPos = timeline.scrollLeft;
    const stepWidth = timeline.children[0].children[0].offsetWidth + 40;
    const activeIndex = Math.round(scrollPos / stepWidth);
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
    });
});

// 优化后的卡片入场动画逻辑
let isAutoScrolling = false;

// 卡片入场动画
let scrolling = false;
const steps = document.querySelectorAll('.timeline-step');
const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.5 });

steps.forEach(step => {
    stepObserver.observe(step);
});

// 优化后的自动滚动逻辑
let currentStep = 0;
function autoScroll() {
  isAutoScrolling = true;
  
  timeline.scrollTo({
    left: currentStep * (steps[0].offsetWidth + 40),
    behavior: 'smooth'
  });

  // 在滚动结束后更新状态
  setTimeout(() => {
    isAutoScrolling = false;
    currentStep = (currentStep >= steps.length - 1) ? 0 : currentStep + 1;
    // steps[currentStep].classList.add('active');
  }, 5000); // 与滚动动画时间匹配
}

// 使用requestAnimationFrame优化定时器
let autoScrollTimer;
function scheduleAutoScroll() {
  autoScrollTimer = setTimeout(() => {
    autoScroll();
    requestAnimationFrame(scheduleAutoScroll);
  }, 5000);
}

// 启动自动滚动
scheduleAutoScroll();

// 触摸设备暂停自动滚动
timeline.addEventListener('touchstart', () => {
  clearTimeout(autoScrollTimer);
  isAutoScrolling = false;
});

// 切换交互逻辑
const toggleOptions = document.querySelectorAll('.toggle-option');
const toggleHighlight = document.querySelector('.toggle-highlight');
const compareCards = document.querySelectorAll('.compare-card');

toggleOptions.forEach((option, index) => {
    option.addEventListener('click', () => {
        // 切换按钮状态
        toggleOptions.forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        
        // 移动高亮条
        toggleHighlight.style.transform = `translateX(${index * 100}%)`;
        
        // 切换对比内容
        compareCards.forEach(card => card.classList.remove('active'));
        compareCards[index].classList.add('active');
    });
});

// 3D模型初始化（示例）
const init3DViewer = () => {
    // 此处可集成Three.js代码
    // 创建发酵罐3D模型
    // 添加旋转控制逻辑
};
window.addEventListener('load', init3DViewer);