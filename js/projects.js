// ===== ANIMATIONS SYSTEM =====
// 권나현 포트폴리오 - 애니메이션 효과

// ===== 전역 애니메이션 설정 =====
const ANIMATION_CONFIG = {
    duration: {
        fast: 300,
        normal: 600,
        slow: 1000
    },
    easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    delay: {
        short: 100,
        medium: 200,
        long: 400
    }
};

// ===== 페이지 로드 애니메이션 =====
class PageLoadAnimation {
    constructor() {
        this.elements = [];
        this.observer = null;
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.findAnimatableElements();
        this.startObserving();
    }
    
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }
    
    findAnimatableElements() {
        // 애니메이션 대상 요소들 선택
        const selectors = [
            '.fade-in-up',
            '.fade-in-left',
            '.fade-in-right',
            '.scale-in',
            '.slide-in-up',
            '.slide-in-down',
            '.rotate-in',
            '.bounce-in'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                this.prepareElement(el, selector.replace('.', ''));
                this.elements.push(el);
            });
        });
    }
    
    prepareElement(element, animationType) {
        // 초기 상태 설정
        element.style.opacity = '0';
        element.style.transition = `all ${ANIMATION_CONFIG.duration.normal}ms ${ANIMATION_CONFIG.easing.easeOut}`;
        
        switch (animationType) {
            case 'fade-in-up':
                element.style.transform = 'translateY(30px)';
                break;
            case 'fade-in-left':
                element.style.transform = 'translateX(-30px)';
                break;
            case 'fade-in-right':
                element.style.transform = 'translateX(30px)';
                break;
            case 'scale-in':
                element.style.transform = 'scale(0.8)';
                break;
            case 'slide-in-up':
                element.style.transform = 'translateY(50px)';
                break;
            case 'slide-in-down':
                element.style.transform = 'translateY(-50px)';
                break;
            case 'rotate-in':
                element.style.transform = 'rotate(-10deg) scale(0.8)';
                break;
            case 'bounce-in':
                element.style.transform = 'scale(0.3)';
                element.style.transition = `all ${ANIMATION_CONFIG.duration.slow}ms ${ANIMATION_CONFIG.easing.bounce}`;
                break;
        }
        
        element.setAttribute('data-animation', animationType);
    }
    
    animateElement(element) {
        const delay = parseInt(element.getAttribute('data-delay') || '0');
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) translateX(0) scale(1) rotate(0)';
            element.classList.add('animated');
        }, delay);
    }
    
    startObserving() {
        this.elements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// ===== 텍스트 애니메이션 =====
class TextAnimation {
    static typeWriter(element, text, speed = 100, callback = null) {
        element.innerHTML = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        
        type();
    }
    
    static countUp(element, start, end, duration = 2000) {
        const range = end - start;
        const minTimer = 50;
        const stepTime = Math.abs(Math.floor(duration / range));
        const timer = Math.max(stepTime, minTimer);
        
        const startTime = new Date().getTime();
        const endTime = startTime + duration;
        
        function run() {
            const now = new Date().getTime();
            const remaining = Math.max((endTime - now) / duration, 0);
            const value = Math.round(end - (remaining * range));
            
            element.textContent = value;
            
            if (value === end) {
                clearInterval(timer_id);
            }
        }
        
        const timer_id = setInterval(run, timer);
        run();
    }
    
    static fadeInWords(element, delay = 200) {
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = words.map(word => 
            `<span class="word-animate" style="opacity: 0;">${word}</span>`
        ).join(' ');
        
        const wordElements = element.querySelectorAll('.word-animate');
        
        wordElements.forEach((word, index) => {
            setTimeout(() => {
                word.style.transition = 'opacity 0.6s ease';
                word.style.opacity = '1';
            }, index * delay);
        });
    }
}

// ===== 스크롤 기반 애니메이션 =====
class ScrollAnimation {
    constructor() {
        this.parallaxElements = [];
        this.init();
    }
    
    init() {
        this.findParallaxElements();
        this.bindScrollEvents();
    }
    
    findParallaxElements() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
    }
    
    bindScrollEvents() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    this.updateProgressBars();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    updateParallax() {
        const scrollTop = window.pageYOffset;
        
        this.parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    updateProgressBars() {
        const progressBars = document.querySelectorAll('.scroll-progress-bar');
        
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const progress = Math.min(
                    Math.max((window.innerHeight - rect.top) / window.innerHeight, 0),
                    1
                );
                bar.style.width = (progress * 100) + '%';
            }
        });
    }
}

// ===== 마우스 인터랙션 애니메이션 =====
class MouseInteraction {
    constructor() {
        this.cursor = null;
        this.followers = [];
        this.init();
    }
    
    init() {
        this.createCustomCursor();
        this.bindHoverEffects();
        this.bindClickEffects();
    }
    
    createCustomCursor() {
        // 커스텀 커서는 선택사항
        if (window.innerWidth > 768) {
            this.cursor = document.createElement('div');
            this.cursor.className = 'custom-cursor';
            document.body.appendChild(this.cursor);
            
            document.addEventListener('mousemove', (e) => {
                this.cursor.style.left = e.clientX + 'px';
                this.cursor.style.top = e.clientY + 'px';
            });
        }
    }
    
    bindHoverEffects() {
        // 카드 호버 효과
        const cards = document.querySelectorAll('.hover-lift');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            });
        });
        
        // 버튼 호버 효과
        const buttons = document.querySelectorAll('.btn-animate');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }
    
    bindClickEffects() {
        // 리플 효과
        const rippleElements = document.querySelectorAll('.ripple-effect');
        
        rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRipple(e, element);
            });
        });
    }
    
    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// ===== 로딩 애니메이션 =====
class LoadingAnimation {
    static showPageLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p class="loader-text">Loading...</p>
            </div>
        `;
        
        document.body.appendChild(loader);
        return loader;
    }
    
    static hidePageLoader(loader) {
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                if (loader.parentElement) {
                    loader.parentElement.removeChild(loader);
                }
            }, 500);
        }
    }
    
    static showElementLoader(element) {
        const loader = document.createElement('div');
        loader.className = 'element-loader';
        loader.innerHTML = '<div class="mini-spinner"></div>';
        
        element.style.position = 'relative';
        element.appendChild(loader);
        
        return loader;
    }
    
    static hideElementLoader(loader) {
        if (loader && loader.parentElement) {
            loader.parentElement.removeChild(loader);
        }
    }
}

// ===== 파티클 시스템 (선택사항) =====
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.particles = [];
        this.options = {
            count: options.count || 50,
            speed: options.speed || 1,
            size: options.size || 2,
            color: options.color || '#ffffff',
            opacity: options.opacity || 0.6,
            direction: options.direction || 'up'
        };
        this.animationId = null;
        this.init();
    }
    
    init() {
        this.createParticles();
        this.animate();
    }
    
    createParticles() {
        for (let i = 0; i < this.options.count; i++) {
            const particle = {
                x: Math.random() * this.container.offsetWidth,
                y: Math.random() * this.container.offsetHeight,
                vx: (Math.random() - 0.5) * this.options.speed,
                vy: (Math.random() - 0.5) * this.options.speed,
                size: Math.random() * this.options.size + 1,
                opacity: Math.random() * this.options.opacity
            };
            
            this.particles.push(particle);
            this.createParticleElement(particle, i);
        }
    }
    
    createParticleElement(particle, index) {
        const element = document.createElement('div');
        element.className = 'particle';
        element.id = `particle-${index}`;
        element.style.cssText = `
            position: absolute;
            width: ${particle.size}px;
            height: ${particle.size}px;
            background: ${this.options.color};
            border-radius: 50%;
            opacity: ${particle.opacity};
            pointer-events: none;
            left: ${particle.x}px;
            top: ${particle.y}px;
        `;
        
        this.container.appendChild(element);
    }
    
    animate() {
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 경계 체크 및 재배치
            if (particle.x < 0 || particle.x > this.container.offsetWidth) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.container.offsetHeight) {
                particle.vy *= -1;
            }
            
            // DOM 요소 업데이트
            const element = document.getElementById(`particle-${index}`);
            if (element) {
                element.style.left = particle.x + 'px';
                element.style.top = particle.y + 'px';
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.particles.forEach((_, index) => {
            const element = document.getElementById(`particle-${index}`);
            if (element && element.parentElement) {
                element.parentElement.removeChild(element);
            }
        });
        
        this.particles = [];
    }
}

// ===== 스킬 바 애니메이션 클래스 =====
class SkillBarAnimation {
    constructor() {
        this.skillBars = [];
        this.init();
    }
    
    init() {
        this.findSkillBars();
        this.setupObserver();
    }
    
    findSkillBars() {
        this.skillBars = document.querySelectorAll('.skill-progress, .progress-bar');
    }
    
    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBar(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }
    
    animateSkillBar(bar) {
        const percentage = bar.getAttribute('data-percentage') || bar.getAttribute('data-width') || '0';
        const duration = parseInt(bar.getAttribute('data-duration') || '1500');
        const delay = parseInt(bar.getAttribute('data-delay') || '0');
        
        setTimeout(() => {
            bar.style.transition = `width ${duration}ms ${ANIMATION_CONFIG.easing.easeOut}`;
            bar.style.width = percentage + '%';
            
            // 숫자 카운트 애니메이션
            const numberElement = bar.parentElement.querySelector('.skill-percentage, .progress-text');
            if (numberElement) {
                TextAnimation.countUp(numberElement, 0, parseInt(percentage), duration);
            }
        }, delay);
    }
}

// ===== 모달 애니메이션 =====
class ModalAnimation {
    static show(modal, animationType = 'fade') {
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        
        const modalContent = modal.querySelector('.modal-container, .modal-content');
        
        switch (animationType) {
            case 'fade':
                modal.style.transition = `opacity ${ANIMATION_CONFIG.duration.normal}ms ${ANIMATION_CONFIG.easing.easeOut}`;
                modalContent.style.transform = 'scale(0.7)';
                modalContent.style.transition = `transform ${ANIMATION_CONFIG.duration.normal}ms ${ANIMATION_CONFIG.easing.bounce}`;
                break;
                
            case 'slide-up':
                modalContent.style.transform = 'translateY(100px)';
                modalContent.style.transition = `transform ${ANIMATION_CONFIG.duration.normal}ms ${ANIMATION_CONFIG.easing.easeOut}`;
                break;
                
            case 'zoom':
                modalContent.style.transform = 'scale(0.3)';
                modalContent.style.transition = `transform ${ANIMATION_CONFIG.duration.slow}ms ${ANIMATION_CONFIG.easing.bounce}`;
                break;
        }
        
        // 애니메이션 시작
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1) translateY(0)';
        });
    }
    
    static hide(modal, animationType = 'fade') {
        const modalContent = modal.querySelector('.modal-container, .modal-content');
        
        switch (animationType) {
            case 'fade':
                modal.style.opacity = '0';
                modalContent.style.transform = 'scale(0.7)';
                break;
                
            case 'slide-down':
                modalContent.style.transform = 'translateY(100px)';
                break;
                
            case 'zoom':
                modalContent.style.transform = 'scale(0.3)';
                break;
        }
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, ANIMATION_CONFIG.duration.normal);
    }
}

// ===== 페이지 전환 애니메이션 =====
class PageTransition {
    static fadeOut(callback) {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            z-index: 9999;
            opacity: 0;
            transition: opacity ${ANIMATION_CONFIG.duration.normal}ms ${ANIMATION_CONFIG.easing.easeInOut};
        `;
        
        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
        
        setTimeout(() => {
            if (callback) callback();
            
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.parentElement) {
                        overlay.parentElement.removeChild(overlay);
                    }
                }, ANIMATION_CONFIG.duration.normal);
            }, 100);
        }, ANIMATION_CONFIG.duration.normal);
    }
}

// ===== 스크롤 트리거 애니메이션 =====
class ScrollTrigger {
    constructor() {
        this.triggers = [];
        this.init();
    }
    
    init() {
        this.findTriggers();
        this.bindScrollEvents();
    }
    
    findTriggers() {
        const elements = document.querySelectorAll('[data-scroll-trigger]');
        
        elements.forEach(element => {
            const trigger = {
                element: element,
                animation: element.getAttribute('data-scroll-trigger'),
                offset: parseInt(element.getAttribute('data-offset') || '100'),
                duration: parseInt(element.getAttribute('data-duration') || '600'),
                delay: parseInt(element.getAttribute('data-delay') || '0'),
                triggered: false
            };
            
            this.triggers.push(trigger);
        });
    }
    
    bindScrollEvents() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.checkTriggers();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // 초기 체크
        this.checkTriggers();
    }
    
    checkTriggers() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.triggers.forEach(trigger => {
            if (trigger.triggered) return;
            
            const elementTop = trigger.element.offsetTop;
            const triggerPoint = scrollTop + windowHeight - trigger.offset;
            
            if (triggerPoint >= elementTop) {
                this.executeTrigger(trigger);
                trigger.triggered = true;
            }
        });
    }
    
    executeTrigger(trigger) {
        setTimeout(() => {
            switch (trigger.animation) {
                case 'fadeIn':
                    trigger.element.style.transition = `opacity ${trigger.duration}ms ${ANIMATION_CONFIG.easing.easeOut}`;
                    trigger.element.style.opacity = '1';
                    break;
                    
                case 'slideUp':
                    trigger.element.style.transition = `transform ${trigger.duration}ms ${ANIMATION_CONFIG.easing.easeOut}`;
                    trigger.element.style.transform = 'translateY(0)';
                    break;
                    
                case 'scaleIn':
                    trigger.element.style.transition = `transform ${trigger.duration}ms ${ANIMATION_CONFIG.easing.bounce}`;
                    trigger.element.style.transform = 'scale(1)';
                    break;
                    
                case 'rotateIn':
                    trigger.element.style.transition = `transform ${trigger.duration}ms ${ANIMATION_CONFIG.easing.easeOut}`;
                    trigger.element.style.transform = 'rotate(0deg) scale(1)';
                    break;
            }
            
            trigger.element.classList.add('scroll-triggered');
        }, trigger.delay);
    }
}

// ===== 전역 애니메이션 초기화 =====
class AnimationManager {
    constructor() {
        this.pageLoadAnimation = null;
        this.scrollAnimation = null;
        this.mouseInteraction = null;
        this.skillBarAnimation = null;
        this.scrollTrigger = null;
        this.particleSystems = [];
    }
    
    init() {
        // 기본 애니메이션 시스템 초기화
        this.pageLoadAnimation = new PageLoadAnimation();
        this.scrollAnimation = new ScrollAnimation();
        this.mouseInteraction = new MouseInteraction();
        this.skillBarAnimation = new SkillBarAnimation();
        this.scrollTrigger = new ScrollTrigger();
        
        // 히어로 섹션에 파티클 시스템 추가 (선택사항)
        const heroSection = document.querySelector('.hero');
        if (heroSection && window.innerWidth > 768) {
            const particles = new ParticleSystem(heroSection, {
                count: 30,
                speed: 0.5,
                size: 2,
                color: 'rgba(255, 255, 255, 0.1)',
                opacity: 0.3
            });
            this.particleSystems.push(particles);
        }
        
        // 페이지별 특화 애니메이션
        this.initPageSpecificAnimations();
    }
    
    initPageSpecificAnimations() {
        const currentPage = window.location.pathname;
        
        // 메인 페이지 애니메이션
        if (currentPage.includes('index') || currentPage === '/') {
            this.initHeroAnimations();
        }
        
        // 프로젝트 페이지 애니메이션
        if (currentPage.includes('projects')) {
            this.initProjectAnimations();
        }
    }
    
    initHeroAnimations() {
        // 타이핑 효과
        const heroTitle = document.querySelector('.hero-text h1');
        if (heroTitle) {
            const text = heroTitle.textContent;
            setTimeout(() => {
                TextAnimation.typeWriter(heroTitle, text, 50);
            }, 1000);
        }
        
        // 단어별 페이드인 효과
        const heroSubtitle = document.querySelector('.hero-text .subtitle');
        if (heroSubtitle) {
            setTimeout(() => {
                TextAnimation.fadeInWords(heroSubtitle, 150);
            }, 2000);
        }
    }
    
    initProjectAnimations() {
        // 프로젝트 카드 스태거 애니메이션
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200 + 500);
        });
    }
    
    destroy() {
        // 파티클 시스템 정리
        this.particleSystems.forEach(system => {
            system.destroy();
        });
        this.particleSystems = [];
    }
}

// ===== 초기화 및 전역 함수 =====
let animationManager = null;

document.addEventListener('DOMContentLoaded', function() {
    animationManager = new AnimationManager();
    animationManager.init();
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', function() {
    if (animationManager) {
        animationManager.destroy();
    }
});

// 전역 함수들 내보내기
window.TextAnimation = TextAnimation;
window.LoadingAnimation = LoadingAnimation;
window.ModalAnimation = ModalAnimation;
window.PageTransition = PageTransition;
window.ParticleSystem = ParticleSystem;