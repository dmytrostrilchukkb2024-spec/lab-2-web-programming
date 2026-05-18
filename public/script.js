document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Зберігання даних у браузері (localStorage) ---
    function detectSystemInfo() {
        const ua = navigator.userAgent;
        let os = "Невідома ОС";
        let browser = "Невідомий браузер";

        if (ua.indexOf("Win") !== -1) os = "Windows";
        else if (ua.indexOf("Mac") !== -1) os = "MacOS";
        else if (ua.indexOf("Linux") !== -1) os = "Linux";
        else if (ua.indexOf("Android") !== -1) os = "Android";
        else if (ua.indexOf("like Mac") !== -1) os = "iOS";

        if (ua.indexOf("Firefox") > -1) browser = "Mozilla Firefox";
        else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
        else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
        else if (ua.indexOf("Edge") > -1) browser = "Microsoft Edge";
        else if (ua.indexOf("Chrome") > -1) browser = "Google Chrome";
        else if (ua.indexOf("Safari") > -1) browser = "Apple Safari";

        return { os, browser };
    }

    const sysInfo = detectSystemInfo();
    localStorage.setItem('userOS', sysInfo.os);
    localStorage.setItem('userBrowser', sysInfo.browser);

    const footer = document.getElementById('info-footer');
    if (footer) {
        footer.innerHTML = `Ваша ОС: <b>${localStorage.getItem('userOS')}</b> | Браузер: <b>${localStorage.getItem('userBrowser')}</b>`;
    }


    // --- 2. Відображення динамічного вмісту (fetch коментарів) ---
    const variantNumber = 1; 
    const commentsSection = document.getElementById('comments-section');

    if (commentsSection) {
        fetch(`https://jsonplaceholder.typicode.com/posts/${variantNumber}/comments`)
            .then(response => response.json())
            .then(comments => {
                commentsSection.innerHTML = ''; 
                comments.forEach(comment => {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comment';
                    commentDiv.innerHTML = `
                        <strong>${comment.email}</strong>
                        <p>${comment.body}</p>
                    `;
                    commentsSection.appendChild(commentDiv);
                });
            })
            .catch(error => {
                commentsSection.innerHTML = '<p>Помилка завантаження коментарів.</p>';
                console.error('Помилка:', error);
            });
    }


    // --- 3. Модальне вікно форми зворотнього зв'язку ---
    const modal = document.getElementById('feedback-modal');
    const closeBtn = document.querySelector('.close-btn');

    // Форма з'явиться сама через 5 секунд після завантаження сайту
    setTimeout(() => {
        if (modal) modal.style.display = 'block';
    }, 5000); 

    if (closeBtn) {
        closeBtn.onclick = function() {
            if (modal) modal.style.display = 'none';
        }
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }


    // --- 4. Перехід на нічний/денний режим ---
    const themeBtn = document.getElementById('theme-toggle');
    const currentHour = new Date().getHours();
    
    if (themeBtn) {
        if (currentHour >= 7 && currentHour < 21) {
            document.body.classList.remove('dark-theme');
            themeBtn.textContent = '🌙 Темна тема';
        } else {
            document.body.classList.add('dark-theme');
            themeBtn.textContent = '☀️ Світла тема';
        }

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            if (document.body.classList.contains('dark-theme')) {
                themeBtn.textContent = '☀️ Світла тема';
            } else {
                themeBtn.textContent = '🌙 Темна тема';
            }
        });
    }

    // --- 5. ВІДПРАВКА ФОРМИ НА НАШ БЕКЕНД СЕРВЕР ---
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Зупиняємо перезавантаження сайту

            // Збираємо дані
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            // Перетворюємо у формат, який вимагає лаба
            const formData = {
                name: name,
                email: email,
                subject: `Заявка від ${name} (Моб: ${phone})`,
                message: message
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Успішно! ' + result.message);
                    form.reset(); // Очищуємо поля форми
                    if (modal) modal.style.display = 'none'; // Закриваємо модалку
                } else {
                    alert('Помилка сервера: ' + result.error);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                alert('Не вдалося зв’язатися із сервером. Перевір консоль Node.js.');
            }
        });
    }
});