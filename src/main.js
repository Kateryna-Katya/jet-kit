/**
 * Jet-Kit.blog - Final Consolidated Script
 * Version: 1.0.0
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК (Lucide) ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. АНИМАЦИЯ ПРИ СКРОЛЛЕ (AOS) ---
    // Инициализируем AOS для всех секций, кроме Hero (там Anime.js)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 120,
            easing: 'ease-in-out'
        });
    }

    // --- 3. МОБИЛЬНОЕ МЕНЮ (БУРГЕР) ---
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const navLinks = document.querySelectorAll('.nav__link');

    const toggleMenu = () => {
        burger.classList.toggle('header__burger--active');
        nav.classList.toggle('header__nav--active');
        // Блокируем прокрутку страницы при открытом меню
        document.body.style.overflow = nav.classList.contains('header__nav--active') ? 'hidden' : '';
    };

    if (burger && nav) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Закрытие меню при клике на ссылки или вне меню
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('header__nav--active')) toggleMenu();
        });
    });

    // --- 4. ЭФФЕКТ ХЕДЕРА ПРИ СКРОЛЛЕ ---
    const header = document.querySelector('.header');
    const handleHeaderScroll = () => {
        if (window.scrollY > 40) {
            header.style.padding = '12px 0';
            header.style.backgroundColor = 'rgba(5, 7, 10, 0.96)';
            header.style.borderBottom = '1px solid rgba(0, 209, 255, 0.2)';
        } else {
            header.style.padding = '0';
            header.style.backgroundColor = 'rgba(5, 7, 10, 0.8)';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
        }
    };
    window.addEventListener('scroll', handleHeaderScroll);

    // --- 5. ГЕРОЙ-АНИМАЦИЯ (Anime.js) ---
    if (typeof anime !== 'undefined' && document.querySelector('.hero')) {
        const heroTimeline = anime.timeline({
            easing: 'easeOutQuart',
        });

        heroTimeline
            .add({
                targets: '.animate-item',
                opacity: [0, 1],
                translateY: [40, 0],
                delay: anime.stagger(120),
                duration: 1200
            })
            .add({
                targets: '.hero__bg-glow',
                scale: [0.5, 1],
                opacity: [0, 0.4],
                duration: 2000,
                offset: '-=1000'
            });
    }

    // --- 6. СТРОГАЯ ВАЛИДАЦИЯ ТЕЛЕФОНА (ТОЛЬКО ЦИФРЫ) ---
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        // Запрет ввода любых символов кроме цифр
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        // Запрет вставки не-цифровых данных
        phoneInput.addEventListener('paste', (e) => {
            const pasteData = (e.clipboardData || window.clipboardData).getData('text');
            if (!/^\d+$/.test(pasteData)) {
                e.preventDefault();
                const cleanedData = pasteData.replace(/\D/g, '');
                // Вставляем только очищенные цифры
                document.execCommand("insertText", false, cleanedData);
            }
        });
    }

    // --- 7. МАТЕМАТИЧЕСКАЯ КАПЧА ---
    const captchaLabel = document.getElementById('captchaLabel');
    const captchaInput = document.getElementById('captchaInput');
    let solution;

    const refreshCaptcha = () => {
        const a = Math.floor(Math.random() * 9) + 1;
        const b = Math.floor(Math.random() * 9) + 1;
        solution = a + b;
        if (captchaLabel) {
            captchaLabel.textContent = `Подтвердите, что вы человек: ${a} + ${b} = ?`;
        }
    };

    refreshCaptcha();

    // --- 8. ОБРАБОТКА ФОРМЫ (БЕЗ ПЕРЕЗАГРУЗКИ) ---
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Проверка капчи
            if (parseInt(captchaInput.value) !== solution) {
                alert('Неправильный ответ на проверочный вопрос. Попробуйте снова.');
                refreshCaptcha();
                captchaInput.value = '';
                return;
            }

            const submitBtn = this.querySelector('.form__submit');
            const originalBtnHtml = submitBtn.innerHTML;

            // Состояние загрузки
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Обработка...</span>';

            // Имитация задержки сети
            setTimeout(() => {
                this.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                
                // Успешное сообщение (Маркетинговые фразы из ТЗ)
                formMessage.textContent = 'Спасибо! Ваша регистрация прошла успешно. Предложение активно только в странах ЕС. Мы свяжемся с вами в ближайшее время.';
                formMessage.classList.add('form__message--success');
                
                // Обновляем капчу для следующего раза
                refreshCaptcha();

                // Скрыть сообщение через 8 секунд
                setTimeout(() => {
                    formMessage.classList.remove('form__message--success');
                    formMessage.textContent = '';
                }, 8000);

            }, 1800);
        });
    }

    // --- 9. COOKIE POP-UP (LocalStorage) ---
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptCookiesBtn = document.getElementById('acceptCookies');

    const handleCookies = () => {
        if (!localStorage.getItem('jetkit_cookie_consent')) {
            setTimeout(() => {
                if (cookiePopup) cookiePopup.classList.add('cookie-popup--active');
            }, 2500);
        }
    };

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('jetkit_cookie_consent', 'true');
            cookiePopup.classList.remove('cookie-popup--active');
        });
    }

    handleCookies();

    // --- 10. ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('Jet-Kit logic: Ready.');
});