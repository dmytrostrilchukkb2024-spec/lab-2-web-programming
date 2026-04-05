document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Зберігання даних у браузері (localStorage) ---
    function detectSystemInfo() {
        const ua = navigator.userAgent;
        let os = "Невідома ОС";
        let browser = "Невідомий браузер";

        // Визначення ОС
        if (ua.indexOf("Win") !== -1) os = "Windows";
        else if (ua.indexOf("Mac") !== -1) os = "MacOS";
        else if (ua.indexOf("Linux") !== -1) os = "Linux";
        else if (ua.indexOf("Android") !== -1) os = "Android";
        else if (ua.indexOf("like Mac") !== -1) os = "iOS";

        // Визначення браузера
        if (ua.indexOf("Firefox") > -1) browser = "Mozilla Firefox";
        else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
        else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
        else if (ua.indexOf("Edge") > -1) browser = "Microsoft Edge";
        else if (ua.indexOf("Chrome") > -1) browser = "Google Chrome";
        else if (ua.indexOf("Safari") > -1) browser = "Apple Safari";

        return { os, browser };
    }

    // Зберігаємо в localStorage
    const sysInfo = detectSystemInfo();
    localStorage.setItem('userOS', sysInfo.os);
    localStorage.setItem('userBrowser', sysInfo.browser);

    // Відображаємо у футері
    const footer = document.getElementById('info-footer');
    footer.innerHTML = `Ваша ОС: <b>${localStorage.getItem('userOS')}</b> | Браузер: <b>${localStorage.getItem('userBrowser')}</b>`;


    // --- 2. Відображення динамічного вмісту (fetch) ---
    // Використовуємо варіант 1 за замовчуванням (jsonplaceholder.typicode.com/posts/1/comments)
    const variantNumber = 1; 
    const commentsSection = document.getElementById('comments-section');

    fetch(`https://jsonplaceholder.typicode.com/posts/${variantNumber}/comments`)
        .then(response => response.json())
        .then(comments => {
            commentsSection.innerHTML = ''; // Очищаємо текст "Завантаження..."
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


    // --- 3. Модальне вікно форми зворотнього зв'язку (setTimeout) ---
    const modal = document.getElementById('feedback-modal');
    const closeBtn = document.querySelector('.close-btn');

    // Таймер на 1 хвилину (60000 мілісекунд). 
    // Для тестування під час здачі лаби можеш змінити на 5000 (5 сек)
    setTimeout(() => {
        modal.style.display = 'block';
    }, 60000); 

    // Закриття модального вікна
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // Закриття при кліку поза вікном
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }


    // --- 4. Перехід на нічний/денний режим ---
    const themeBtn = document.getElementById('theme-toggle');
    const currentHour = new Date().getHours();
    
    // Автоматичне перемикання (Денна 07:00 - 21:00, Нічна в інший час)
    // Якщо зараз між 7 ранку та 9 вечора - це день. Якщо ні - додаємо темну тему.
    if (currentHour >= 7 && currentHour < 21) {
        document.body.classList.remove('dark-theme');
        themeBtn.textContent = '🌙 Темна тема';
    } else {
        document.body.classList.add('dark-theme');
        themeBtn.textContent = '☀️ Світла тема';
    }

    // Ручне перемикання кнопкою
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeBtn.textContent = '☀️ Світла тема';
        } else {
            themeBtn.textContent = '🌙 Темна тема';
        }
    });

});