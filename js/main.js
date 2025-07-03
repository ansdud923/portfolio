// ===== MAIN JAVASCRIPT FILE =====
// 권나현 포트폴리오 - 메인 스크립트

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('권나현 포트폴리오 로드 완료');
    // 자격증 이미지 업로드 기능
document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('cert-upload');
  const uploadArea = document.querySelector('.upload-area-compact');
  
  if (fileInput && uploadArea) {
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
          uploadArea.innerHTML = `<img src="${e.target.result}" alt="AWS 자격증" style="width: 100%; height: 100%; object-fit: cover; border-radius: 13px;">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }
});

    // 초기화 함수들 실행
    initializeAOS();
    initializeNavigation();
    initializeScrollEffects();
    initializeSkillBars();
    initializeMobileMenu();
    initializeTypingEffect();
    initializeTheme();
    initializeCardEffects();
    initializeContactForm();
    initializeScrollSnap(); // 추가
    
    // 페이지별 특화 기능 초기화
    initializePageSpecific();
});

// ===== AOS (Animate On Scroll) 초기화 =====
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-in-out',
            delay: 100
        });
        
        // 페이지 로드 후 AOS 새로고침
        window.addEventListener('load', function() {
            AOS.refresh();
        });
    }
}

// ===== 네비게이션 관련 기능 =====
function initializeNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 스크롤 시 헤더 스타일 변경
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // 부드러운 스크롤 네비게이션
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // 내부 앵커 링크인 경우에만 부드러운 스크롤 적용
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 모바일 메뉴 닫기
                closeMobileMenu();
            }
        }
    });
});
    
    // 현재 섹션 하이라이트
    highlightCurrentSection();
}

// ===== 현재 섹션 하이라이트 =====
function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ===== 스크롤 관련 효과 =====
function initializeScrollEffects() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    // 스크롤 투 탑 버튼
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
        
        // 스크롤 진행률 표시 (선택사항)
        updateScrollProgress();
    });
    
    // 스크롤 투 탑 버튼 클릭
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== 스크롤 진행률 업데이트 =====
function updateScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = progress + '%';
    }
}

// ===== 스킬 바 애니메이션 =====
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const percentage = skillBar.getAttribute('data-percentage') || '0';
                
                // 애니메이션 시작
                setTimeout(() => {
                    skillBar.style.width = percentage + '%';
                    
                    // 숫자 카운트 애니메이션
                    const numberElement = skillBar.parentElement.querySelector('.skill-percentage');
                    if (numberElement) {
                        animateNumber(numberElement, 0, parseInt(percentage), 1500);
                    }
                }, 300);
                
                observer.unobserve(skillBar);
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillBars.forEach(bar => {
        // 초기 상태 설정
        bar.style.width = '0%';
        observer.observe(bar);
    });
}

// ===== 숫자 애니메이션 =====
// function animateNumber(element, start, end, duration) {
//     const range = end - start;
//     const minTimer = 50;
//     const stepTime = Math.abs(Math.floor(duration / range));
//     const timer = Math.max(stepTime, minTimer);
    
//     const startTime = new Date().getTime();
//     const endTime = startTime + duration;
    
//     function run() {
//         const now = new Date().getTime();
//         const remaining = Math.max((endTime - now) / duration, 0);
//         const value = Math.round(end - (remaining * range));
        
//         element.textContent = value + '%';
        
//         if (value === end) {
//             clearInterval(timer);
//         }
//     }
    
//     const timer_id = setInterval(run, timer);
//     run();
// }

function animateNumber(element, start, end, duration) {
    // 점수 애니메이션 완전 제거 - 빈 함수로 변경
    return;
}

// ===== 모바일 메뉴 =====
function initializeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isActive = navMenu.classList.contains('active');
            
            if (!isActive) {
                openMobileMenu();
            } else {
                closeMobileMenu();
            }
        });
        
        // 메뉴 링크 클릭 시 메뉴 닫기
        const mobileLinks = navMenu.querySelectorAll('.nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                setTimeout(() => {
                    closeMobileMenu();
                }, 100);
            });
        });
        
        // 메뉴 외부 클릭 시 닫기
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // ESC 키로 메뉴 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }
}

function openMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.classList.add('active');
    navMenu.classList.add('active');
    document.body.classList.add('menu-open');
}

function closeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// ===== 타이핑 효과 =====
function initializeTypingEffect() {
    const heroTitle = document.querySelector('.hero-text h1');
    
    if (heroTitle && window.location.pathname.includes('index') || window.location.pathname === '/') {
        const originalText = heroTitle.innerHTML;
        const lines = originalText.split('<br>');
        
        heroTitle.innerHTML = '';
        
        lines.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.className = 'title-line';
            lineElement.style.opacity = '0';
            heroTitle.appendChild(lineElement);
            
            setTimeout(() => {
                lineElement.style.opacity = '1';
                typeWriter(lineElement, line.trim(), 80);
            }, index * 1200);
        });
    }
}

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== 테마 시스템 =====
function initializeTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    
    // 테마 토글 버튼이 있다면 초기화
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        updateThemeIcon(savedTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ===== 카드 호버 효과 =====
function initializeCardEffects() {
    const cards = document.querySelectorAll('.card, .project-card, .skill-card, .quick-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 프로젝트 카드 클릭 이벤트
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            if (projectId) {
                openProjectModal(projectId);
            }
        });
    });
}

// ===== 연락처 폼 처리 =====
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // TODO: 실제 폼 제출 로직 구현 (이메일 서비스 연동)
            console.log('연락처 폼 데이터:', data);
            
            // 성공 메시지 표시
            showNotification('메시지가 성공적으로 전송되었습니다!', 'success');
            
            // 폼 초기화
            this.reset();
        });
        
        // 실시간 유효성 검사
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

// ===== 필드 유효성 검사 =====
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let message = '';
    
    // 필수 필드 검사
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = '이 필드는 필수입니다.';
    }
    
    // 이메일 형식 검사
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = '올바른 이메일 형식을 입력해주세요.';
        }
    }
    
    // 에러 메시지 표시/숨김
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            field.classList.add('error');
        } else {
            errorElement.style.display = 'none';
            field.classList.remove('error');
        }
    }
    
    return isValid;
}

// ===== 알림 메시지 표시 =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // 페이지에 추가
    document.body.appendChild(notification);
    
    // 애니메이션으로 표시
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // 닫기 버튼 이벤트
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        removeNotification(notification);
    });
    
    // 5초 후 자동 제거
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        info: 'info-circle',
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle'
    };
    return icons[type] || icons.info;
}

// ===== 페이지별 특화 기능 =====
function initializePageSpecific() {
    const currentPage = window.location.pathname;
    
    // 메인 페이지
    if (currentPage.includes('index') || currentPage === '/') {
        initializeHeroEffects();
    }
    
    // 프로젝트 페이지
    if (currentPage.includes('projects')) {
        initializeProjectFilters();
    }
    
    // 기술 페이지
    if (currentPage.includes('skills')) {
        initializeSkillFilters();
    }
}

// ===== 히어로 섹션 효과 =====
function initializeHeroEffects() {
    // 배경 애니메이션
    createFloatingShapes();
    
    // 스크롤 인디케이터
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const nextSection = document.querySelector('#about');
            if (nextSection) {
                nextSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// ===== 플로팅 도형 생성 =====
function createFloatingShapes() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'floating-shapes';
    
    for (let i = 0; i < 5; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        shape.style.animationDelay = Math.random() * 5 + 's';
        shape.style.animationDuration = (Math.random() * 3 + 4) + 's';
        
        shapesContainer.appendChild(shape);
    }
    
    hero.appendChild(shapesContainer);
}

// ===== 유틸리티 함수들 =====

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 스로틀 함수
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 요소가 뷰포트에 있는지 확인
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 부드러운 스크롤 (polyfill)
function smoothScrollTo(targetPosition, duration = 1000) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// 로딩 스크린 제거
function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }
}

// 페이지 로드 완료 시 로딩 스크린 숨기기
window.addEventListener('load', function() {
    hideLoadingScreen();
});

// ===== 에러 핸들링 =====
window.addEventListener('error', function(e) {
    console.error('JavaScript 에러:', e.error);
    // TODO: 에러 로깅 서비스 연동
});

// ===== 성능 모니터링 =====
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('페이지 로드 시간:', pageLoadTime + 'ms');
        }, 0);
    });
}
function initializeScrollSnap() {
    let isScrolling = false;
    
    window.addEventListener('wheel', function(e) {
        if (isScrolling) return;
        
        if (Math.abs(e.deltaY) > 50) {
            isScrolling = true;
            setTimeout(() => { isScrolling = false; }, 1000);
        }
    });
}

// 프로젝트 모달 기능
function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalTech = modal.querySelector('.modal-tech-stack');
    const modalBody = modal.querySelector('.modal-body');
    
    const projectData = {
        'streamlit-dashboard': {
            title: 'STREAMLIT 마케팅데이터 대시보드',
            tech: ['Python', 'Streamlit', 'Pandas', 'Plotly'],
            content: `
                <h3>프로젝트 개요</h3>
                <p>마케팅 데이터를 효과적으로 시각화하고 분석하기 위한 대시보드 애플리케이션입니다.</p>
                
                <h3>주요 기능</h3>
                <ul>
                    <li>실시간 데이터 시각화</li>
                    <li>인터랙티브 차트 및 그래프</li>
                    <li>고급 필터링 기능</li>
                    <li>데이터 내보내기 기능</li>
                </ul>
                
                <h3>기술적 성과</h3>
                <p>Python과 Streamlit을 활용하여 직관적인 UI/UX를 제공하며, 복잡한 데이터를 쉽게 이해할 수 있도록 구현했습니다.</p>
            `
        },
        'ai-storybook-app': {
            title: 'AI 동화 제작 모바일 앱',
            tech: ['Flutter', 'Spring Boot', 'OpenAI API', 'AWS'],
            content: `
                <h3>프로젝트 개요</h3>
                <p>AI 기술을 활용하여 맞춤형 동화를 생성하고 삽화와 음성을 제공하는 모바일 애플리케이션입니다.</p>
                
                <h3>주요 기능</h3>
                <ul>
                    <li>OpenAI API를 활용한 동화 생성</li>
                    <li>AI 기반 삽화 생성</li>
                    <li>텍스트-음성 변환 기능</li>
                    <li>사용자 맞춤 설정</li>
                </ul>
                
                <h3>AWS 인프라</h3>
                <p>EC2, RDS, S3를 활용한 안정적인 백엔드 시스템을 구축했습니다.</p>
            `
        },
        'portfolio-website': {
            title: '개인 포트폴리오 웹사이트',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'AWS Lambda', 'AWS S3'],
            content: `
                <h3>프로젝트 개요</h3>
                <p>서버리스 아키텍처를 활용한 개인 포트폴리오 웹사이트입니다.</p>
                
                <h3>주요 특징</h3>
                <ul>
                    <li>반응형 웹 디자인</li>
                    <li>부드러운 애니메이션 효과</li>
                    <li>모바일 최적화</li>
                    <li>SEO 최적화</li>
                </ul>
                
                <h3>AWS 서버리스 구조</h3>
                <p>Lambda와 S3를 활용하여 비용 효율적이고 확장 가능한 웹사이트를 구현했습니다.</p>
            `
        }
    };
    
    const project = projectData[projectId];
    if (project) {
        modalTitle.textContent = project.title;
        modalTech.innerHTML = project.tech.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
        modalBody.innerHTML = project.content;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 모달 외부 클릭 시 닫기
document.addEventListener('click', function(e) {
    const modal = document.getElementById('projectModal');
    if (e.target === modal) {
        closeProjectModal();
    }
});
