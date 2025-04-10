// js/scripts.js
class EnzymeFactory {
    constructor() {
        this.initNavigation();
        this.initScrollEffects();
        this.initGestures();
    }

    initNavigation() {
        // 动态导航栏效果
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const nav = document.querySelector('.nav-bar');

            if (currentScroll > 100) {
                nav.style.background = 'rgba(255,255,255,0.8)';
                nav.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                // nav.style.borderRadius = '0px 0px 15px 15px';
            } else {
                nav.style.background = 'rgba(255,255,255,0.72)';
                nav.style.boxShadow = 'none';
                // nav.style.borderRadius = '0px';
            }

            lastScroll = currentScroll;
        });
    }

    initScrollEffects() {
        // 视差滚动动画
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            document.querySelector('.liquid-canvas').style.transform =
                `translate(-50%, -50%) rotate(${scrolled * 0.15}deg)`;
        });
    }

    initGestures() {
        // 手势支持
        const hammer = new Hammer(document.body);
        hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });

        hammer.on('swipeleft', () => this.handleSwipe(-1));
        hammer.on('swiperight', () => this.handleSwipe(1));
    }

    handleSwipe(direction) {
        // 卡片切换逻辑
        console.log(`Swipe detected: ${direction > 0 ? 'right' : 'left'}`);
    }
}

class AppleStyleUI {
    constructor() {
        this.initNavbarEffect();
    }

    initNavbarEffect() {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            const theme = document.querySelector('body').classList.contains('theme-light');
            let navbar = theme ? document.querySelector('.theme-light .nav-bar') : document.querySelector('.theme-dark .nav-bar');

            const navbarStyles = {
                light: {
                    aboveThreshold: { background: 'rgba(255,255,255,0.8)', backdropFilter: 'saturate(180%) blur(24px)' },
                    belowThreshold: { background: 'rgba(255,255,255,0.72)', boxShadow: 'none' }
                },
                dark: {
                    aboveThreshold: { background: 'rgba(22, 22, 23, .8)', backdropFilter: 'saturate(180%) blur(24px)' },
                    belowThreshold: { background: 'rgba(22, 22, 23, .72)', boxShadow: 'none' }
                }
            };

            if (currentScroll > 100) {
                Object.assign(navbar.style, navbarStyles[theme ? 'light' : 'dark'].aboveThreshold);
            } else {
                Object.assign(navbar.style, navbarStyles[theme ? 'light' : 'dark'].belowThreshold);
            }

            lastScroll = currentScroll;
        });
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // new EnzymeFactory();
    new AppleStyleUI();
});

document.addEventListener('DOMContentLoaded', function() {
    // 为每个滚动画廊添加箭头控制
    setupGalleryControls('enzyme-gallery', 'enzyme-prev', 'enzyme-next');
    
    // 初始状态检查所有画廊
    checkArrowStatus();
    
    // 窗口调整大小时重新检查箭头状态
    window.addEventListener('resize', checkArrowStatus);
});

// 设置画廊控制功能
function setupGalleryControls(galleryId, prevId, nextId) {
    const gallery = document.getElementById(galleryId);
    const prevButton = document.getElementById(prevId);
    const nextButton = document.getElementById(nextId);
    
    if (!gallery || !prevButton || !nextButton) return;
    
    // 滚动项目宽度（包括间距）
    const getScrollAmount = () => {
        const galleryItem = gallery.querySelector('.gallery-item');
        if (!galleryItem) return 340; // 默认值
        
        // 计算项目宽度 + 间距
        const itemWidth = galleryItem.offsetWidth;
        const computedStyle = window.getComputedStyle(gallery);
        const gap = parseInt(computedStyle.gap) || 20;
        
        return itemWidth + gap;
    };
    
    // 点击前进按钮
    nextButton.addEventListener('click', () => {
        gallery.scrollBy({
            left: getScrollAmount(),
            behavior: 'smooth'
        });
        setTimeout(checkArrowStatus, 400); // 滚动后检查箭头状态
    });
    
    // 点击后退按钮
    prevButton.addEventListener('click', () => {
        gallery.scrollBy({
            left: -getScrollAmount(),
            behavior: 'smooth'
        });
        setTimeout(checkArrowStatus, 400); // 滚动后检查箭头状态
    });
    
    // 监听滚动更新箭头状态
    gallery.addEventListener('scroll', () => {
        checkButtonStatus(gallery, prevButton, nextButton);
    });
}

// 检查所有画廊的箭头状态
function checkArrowStatus() {
    const galleries = document.querySelectorAll('.tv-plus-gallery');
    
    galleries.forEach(section => {
        const gallery = section.querySelector('.gallery-container');
        const prevButton = section.querySelector('.gallery-arrow.prev');
        const nextButton = section.querySelector('.gallery-arrow.next');
        
        if (gallery && prevButton && nextButton) {
            checkButtonStatus(gallery, prevButton, nextButton);
        }
    });
}

// 检查特定画廊的按钮状态
function checkButtonStatus(gallery, prevButton, nextButton) {
    // 检查是否可以向左滚动
    if (gallery.scrollLeft <= 0) {
        prevButton.classList.add('disabled');
    } else {
        prevButton.classList.remove('disabled');
    }
    
    // 检查是否可以向右滚动
    // 1px容差用于解决一些浏览器中的小数点舍入问题
    if (Math.abs(gallery.scrollWidth - gallery.clientWidth - gallery.scrollLeft) <= 1) {
        nextButton.classList.add('disabled');
    } else {
        nextButton.classList.remove('disabled');
    }
}

// 滑块功能
const gallery = document.getElementById('gallery');
const cards = document.querySelectorAll('.gallery-card');

// 首先复制卡片实现无限循环效果
function setupInfiniteScroll() {
  // 复制第一组卡片并添加到末尾
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add('clone');
    gallery.appendChild(clone);
  });
  
  // 计算卡片的总宽度
  const cardWidth = cards[0].offsetWidth;
  const cardMargin = 20;
  const fullCardWidth = cardWidth + cardMargin;
  
  // 设置滚动阈值点
  const resetThreshold = cards.length * fullCardWidth;
  
  return { fullCardWidth, resetThreshold };
}

const { fullCardWidth, resetThreshold } = setupInfiniteScroll();

// 控制滑动行为的变量
let isDown = false;
let startX;
let scrollLeft;
let isHovering = false;
// 原始滚动速度
const normalSpeed = 2;
let currentSpeed = normalSpeed;
let scrollInterval;
let isScrolling = false;
let isProgrammaticScroll = false;

// 开始自动滚动
function startScrolling() {
  if (scrollInterval) clearInterval(scrollInterval);
  
  scrollInterval = setInterval(() => {
    if (!isDown) {
      gallery.scrollLeft += currentSpeed;
      
      // 检查是否需要重置位置以实现无限循环
      if (!isProgrammaticScroll) {
        checkScrollPosition();
      }
    }
  }, 30);
}

// 检查并重置滚动位置
function checkScrollPosition() {
    // 防止重复触发
  if (isProgrammaticScroll) return;
  
  const scrollPosition = gallery.scrollLeft;
  // 如果滚动到克隆卡片区域
  if (scrollPosition >= resetThreshold) {
    isProgrammaticScroll = true;
    // 计算等效位置
    const newPosition = scrollPosition % resetThreshold;
    
    // 使用requestAnimationFrame确保在下一帧执行，更平滑
    requestAnimationFrame(() => {
        // gallery.style.scrollBehavior = 'auto';
      gallery.scrollLeft = newPosition;
    //   gallery.style.scrollBehavior = 'smooth';
      // 延迟重置标志，避免触发新的scroll事件导致抽搐
      setTimeout(() => {
        isProgrammaticScroll = false;
      }, 50);
    });
  }
  // 处理向左滚动到负值或接近零的情况
  else if (scrollPosition <= 0) {
    isProgrammaticScroll = true;
    // 计算等效位置
    const newPosition = resetThreshold + scrollPosition;
    
    requestAnimationFrame(() => {
        // gallery.style.scrollBehavior = 'auto';
    //   gallery.scrollLeft = newPosition;
    //   gallery.style.scrollBehavior = 'smooth';
      setTimeout(() => {
        isProgrammaticScroll = false;
      }, 50);
    });
  }
}

// 初始化自动滚动
startScrolling();

// 鼠标事件用于手动滚动
gallery.addEventListener('mousedown', (e) => {
  isDown = true;
  gallery.classList.add('active');
  startX = e.pageX - gallery.offsetLeft;
  scrollLeft = gallery.scrollLeft;
});

gallery.addEventListener('touchstart', (e) => {
  isDown = true;
  gallery.classList.add('active');
  startX = e.pageX - gallery.offsetLeft;
  scrollLeft = gallery.scrollLeft;
})

gallery.addEventListener('mouseleave', () => {
  isDown = false;
  isHovering = false;
  gallery.classList.remove('active');
  currentSpeed = normalSpeed;
  checkScrollPosition();
});

gallery.addEventListener('touchend', () => {
  isDown = false;
  isHovering = false;
  gallery.classList.remove('active');
  currentSpeed = normalSpeed;
  checkScrollPosition();
});

gallery.addEventListener('mouseup', () => {
  isDown = false;
  gallery.classList.remove('active');
  checkScrollPosition();
});

gallery.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - gallery.offsetLeft;
  const walk = (x - startX) * 2;
  gallery.scrollLeft = scrollLeft - walk;
});

// 悬停时减慢滚动速度
gallery.addEventListener('mouseenter', () => {
  isHovering = true;
  currentSpeed = 0.5;
});