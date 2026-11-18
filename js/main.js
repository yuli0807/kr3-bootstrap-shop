document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 1. ЛОГИКА ЧАТА
    // ==========================================
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatWindow = document.getElementById('chatWindow');
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');

    if (chatToggleBtn && chatWindow) {
        chatToggleBtn.addEventListener('click', () => {
            chatWindow.style.display = (chatWindow.style.display === 'flex') ? 'none' : 'flex';
        });

        chatCloseBtn.addEventListener('click', () => {
            chatWindow.style.display = 'none';
        });

        function sendMessage() {
            const text = chatInput.value.trim();
            if (text === '') return;

            const userMsg = document.createElement('div');
            userMsg.className = 'chat-message right';
            userMsg.textContent = text;
            chatBody.appendChild(userMsg);
            
            chatInput.value = '';
            chatBody.scrollTop = chatBody.scrollHeight;

            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.className = 'chat-message left';
                const lowerText = text.toLowerCase();
                
                if (lowerText.includes('цена') || lowerText.includes('стоимость') || lowerText.includes('сколько') || lowerText.includes('стоит')) {
                    botMsg.innerHTML = 'Цены зависят от формата. Портретная — от 6000 ₽, семейная — от 10000 ₽, свадебная — от 20000 ₽. <br><br>Посмотреть все варианты можно в разделе <a href="catalog.html">«Услуги»</a>.';
                } 
                else if (lowerText.includes('зал') || lowerText.includes('бронь') || lowerText.includes('свободно')) {
                    botMsg.innerHTML = 'У нас 15 уникальных залов! Посмотреть фото и цены можно в разделе <a href="studios.html">«Залы»</a>. Оставьте заявку на сайте, и мы согласуем время.';
                } 
                else if (lowerText.includes('где') || lowerText.includes('адрес') || lowerText.includes('находит')) {
                    botMsg.innerHTML = 'Мы находимся по адресу: г. Москва, ул. Арбат, д. 10. <br><br>Работаем ежедневно с 09:00 до 23:00. Ждем вас!';
                }
                else if (lowerText.includes('привет') || lowerText.includes('здравствуй')) {
                    botMsg.textContent = 'И вам здравствуйте! 😊 Подскажите, вас интересует аренда зала или фотосессия?';
                }
                else {
                    botMsg.innerHTML = 'Я записала ваш вопрос! Уточню детали у наших специалистов и вернусь с ответом в ближайшее время. <br><br>Если вам удобнее пообщаться голосом, звоните нам: <a href="tel:+79067874323">+7 (906) 787-43-23</a>.';
                }
                
                chatBody.appendChild(botMsg);
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 1000);
        }

        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // ==========================================
    // 2. ЛОГИКА СМЕНЫ ТЕМЫ
    // ==========================================
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIconLight = document.getElementById('themeIconLight');
    const themeIconDark = document.getElementById('themeIconDark');

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);

    function updateThemeIcon(theme) {
        if (!themeIconLight || !themeIconDark) return;
        if (theme === 'dark') {
            themeIconLight.style.display = 'none';
            themeIconDark.style.display = 'inline-block';
        } else {
            themeIconLight.style.display = 'inline-block';
            themeIconDark.style.display = 'none';
        }
    }

    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTheme = document.documentElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // ==========================================
    // 3. ЛОГИКА ИЗБРАННОГО
    // ==========================================
    
    // Функция для получения данных
    function getFavoritesData() {
        const favs = localStorage.getItem('favoritesData');
        return favs ? JSON.parse(favs) : [];
    }

    // Функция для обновления внешнего вида кнопок (красное/серое сердечко)
    function updateFavoriteButtons() {
        const favsData = getFavoritesData();
        const favIds = favsData.map(item => item.id);
        const buttons = document.querySelectorAll('.btn-favorite');
        
        buttons.forEach(btn => {
            const id = btn.getAttribute('data-id');
            if (!id) return; 
            if (favIds.includes(id)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Обработчик клика по сердечку
    const favoriteButtons = document.querySelectorAll('.btn-favorite');
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Чтобы страница не прыгала вверх
            const id = this.getAttribute('data-id');
            const type = this.getAttribute('data-type'); // Услуга, Зал или Фотограф
            const title = this.getAttribute('data-title');
            const price = this.getAttribute('data-price');
            const img = this.getAttribute('data-img');
            const link = this.getAttribute('data-link');
            
            let favsData = getFavoritesData();
            
            // Проверяем, есть ли уже этот товар
            const existingIndex = favsData.findIndex(item => item.id === id);
            
            if (existingIndex > -1) {
                // Если есть — удаляем
                favsData.splice(existingIndex, 1);
                this.classList.remove('active');
            } else {
                // Если нет — добавляем
                favsData.push({ id, type, title, price, img, link });
                this.classList.add('active');
            }
            
            // Сохраняем обратно в память
            localStorage.setItem('favoritesData', JSON.stringify(favsData));
        });
    });

        // Отрисовка страницы favorites.html (если мы находимся на ней)
    const favoritesContainer = document.getElementById('favoritesContainer');
    if (favoritesContainer) {
        const favsData = getFavoritesData();
        const emptyState = document.getElementById('emptyFavorites');
        
        if (favsData.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
        } else {
            if (emptyState) emptyState.style.display = 'none';
            
            favsData.forEach(item => {
                // Бейдж с типом (Зал, Фотограф, Услуга)
                const typeBadge = item.type ? `<span class="badge bg-dark mb-2">${item.type}</span>` : '';
                
                const cardHTML = `
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="card h-100 shadow-sm border-0">
                            <button class="btn-favorite active" onclick="removeFavorite('${item.id}')" title="Удалить из избранного">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                                </svg>
                            </button>
                            <img src="${item.img}" class="card-img-top" alt="${item.title}" style="height: 250px; object-fit: cover;">
                            <div class="card-body d-flex flex-column">
                                ${typeBadge}
                                <h2 class="card-title h5">${item.title}</h2>
                                <p class="fw-bold fs-6 mt-auto text-muted">${item.price}</p>
                                <a class="btn btn-book w-100" href="${item.link}">Подробнее</a>
                            </div>
                        </div>
                    </div>
                `;
                favoritesContainer.insertAdjacentHTML('beforeend', cardHTML);
            });
        }
    }

    // ⚠️ ВАЖНО: Запускаем проверку кнопок ВНЕ блока if, 
    // чтобы сердечки зажигались на ВСЕХ страницах (каталог, залы, фотографы)
    updateFavoriteButtons(); 

});

// ==========================================
// 4. ГЛОБАЛЬНАЯ ФУНКЦИЯ УДАЛЕНИЯ (для страницы Избранное)
// ==========================================
window.removeFavorite = function(id) {
    let favsData = JSON.parse(localStorage.getItem('favoritesData')) || [];
    favsData = favsData.filter(item => item.id !== id);
    localStorage.setItem('favoritesData', JSON.stringify(favsData));
    location.reload(); // Перезагружаем, чтобы карточка исчезла
};