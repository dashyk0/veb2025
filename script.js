let dishes = []; // Теперь глобальный массив будет заполняться с сервера
let selectedDishes = {
    soup: null,
    main: null,
    drink: null,
    salad: null,
    dessert: null
};

let currentFilters = {};

const categoryNames = {
    soup: 'Суп',
    main: 'Главное блюдо',
    drink: 'Напиток',
    salad: 'Салат/Закуски',
    dessert: 'Десерт'
};

const kindNames = {
    veg: 'Вегетарианское',
    meat: 'Мясное',
    fish: 'Рыбное',
    hot: 'Горячее',
    cold: 'Холодное',
    small: 'Маленькая порция',
    medium: 'Средняя порция',
    large: 'Большая порция'
};

// === ФУНКЦИЯ ЗАГРУЗКИ БЛЮД С API ===
async function loadDishes() {
    try {
        const response = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Приводим данные к нужному формату 
        dishes = data.map(dish => ({
            keyword: dish.keyword,
            name: dish.name,
            price: dish.price,
            category: dish.category,
            count: dish.count || '—',
            image: dish.image || 'img/no-photo.jpg', // на случай, если нет фото
            kind: dish.kind
        }));

        console.log('Блюда успешно загружены:', dishes.length);
        displayDishes(); // Перерисовываем всё после загрузки
        updateOrderSection();
    } catch (error) {
        console.error('Ошибка загрузки блюд:', error);
        showNotification('Не удалось загрузить меню. Проверьте подключение к интернету.');
    }
}



function displayDishes() {
    const categories = ['soup', 'main', 'drink', 'salad', 'dessert'];

    categories.forEach(cat => {
        const grid = document.getElementById(cat + '-grid');
        const filterBar = document.getElementById(cat + '-filters');

        if (!grid) return;

        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">Загрузка блюд...</p>';
        if (filterBar) filterBar.innerHTML = '';

        // Создаём фильтры
        const kindsInCategory = [...new Set(
            dishes.filter(d => d.category === cat).map(d => d.kind)
        )];

        if (filterBar && kindsInCategory.length > 0) {
            const allBtn = document.createElement('button');
            allBtn.textContent = 'Все';
            allBtn.className = 'filter-btn active';
            allBtn.dataset.kind = 'all';
            filterBar.appendChild(allBtn);

            kindsInCategory.forEach(kind => {
                const btn = document.createElement('button');
                btn.textContent = kindNames[kind] || kind;
                btn.className = 'filter-btn';
                btn.dataset.kind = kind;
                filterBar.appendChild(btn);
            });

            filterBar.addEventListener('click', e => {
                const btn = e.target.closest('.filter-btn');
                if (!btn) return;

                filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const kind = btn.dataset.kind;
                currentFilters[cat] = kind === 'all' ? null : kind;
                renderCategory(cat);
            });
        }

        renderCategory(cat);
    });

    // Обработчик добавления/удаления блюд
    document.body.addEventListener('click', e => {
        if (e.target.classList.contains('add-btn')) {
            const dishEl = e.target.closest('.dish');
            if (!dishEl) return;

            const keyword = dishEl.dataset.dish;
            const dish = dishes.find(d => d.keyword === keyword);
            if (!dish) return;

            const category = dish.category;

            if (selectedDishes[category]?.keyword === dish.keyword) {
                // Убираем
                selectedDishes[category] = null;
            } else {
                // Добавляем (заменяем старое в категории)
                selectedDishes[category] = dish;
            }

            updateOrderSection();
            renderCategory(category); // обновляем кнопки в категории
        }
    });
}

function renderCategory(cat) {
    const grid = document.getElementById(cat + '-grid');
    if (!grid) return;

    let filtered = dishes.filter(d => d.category === cat);

    if (currentFilters[cat]) {
        filtered = filtered.filter(d => d.kind === currentFilters[cat]);
    }

    filtered.sort((a, b) => a.name.localeCompare(b.name));

    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px 20px;">Нет блюд в этой категории или по выбранному фильтру</p>';
        return;
    }

    filtered.forEach(dish => {
        const isSelected = selectedDishes[dish.category]?.keyword === dish.keyword;

        const el = document.createElement('div');
        el.className = 'dish';
        el.dataset.dish = dish.keyword;
        el.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}" onerror="this.src='img/no-photo.jpg'">
            <p class="price">${dish.price} ₽</p>
            <p class="title">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <button class="add-btn ${isSelected ? 'remove' : ''}">
                ${isSelected ? 'Убрать' : 'Добавить'}
            </button>
        `;
        grid.appendChild(el);
    });
}

function updateOrderSection() {
    const container = document.getElementById('order-dishes');
    const totalEl = document.getElementById('order-total');
    if (!container || !totalEl) return;

    container.innerHTML = '';
    let total = 0;
    let hasAny = false;

    Object.keys(categoryNames).forEach(cat => {
        const dish = selectedDishes[cat];
        const div = document.createElement('div');
        div.style.marginBottom = '15px';
        div.style.padding = '10px';
        div.style.borderBottom = '1px solid #eee';

        if (dish) {
            hasAny = true;
            total += dish.price;
            div.innerHTML = `<strong>${categoryNames[cat]}:</strong> ${dish.name} — ${dish.price} ₽`;
        } else {
            div.innerHTML = `<strong>${categoryNames[cat]}:</strong> <span style="color:#888;">не выбрано</span>`;
        }
        container.appendChild(div);
    });

    if (!hasAny) {
        container.innerHTML = '<p style="text-align: center; color: #888; padding: 30px;">Корзина пуста</p>';
        totalEl.innerHTML = '';
    } else {
        totalEl.innerHTML = `<p style="color: #ff6b35; font-size: 26px;"><strong>Итого: ${total} ₽</strong></p>`;
    }
}

function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
            <button class="notification-btn">Понятно</button>
        </div>
    `;
    document.body.appendChild(notification);

    notification.addEventListener('click', e => {
        if (e.target === notification || e.target.classList.contains('notification-btn')) {
            notification.remove();
        }
    });
}

// Валидация заказа (без изменений)
const validCombos = [
    ['soup', 'main', 'salad', 'drink'],
    ['soup', 'main', 'drink'],
    ['soup', 'salad', 'drink'],
    ['main', 'salad', 'drink'],
    ['main', 'drink']
];

function validateLunch() {
    const selected = Object.keys(selectedDishes).filter(cat => selectedDishes[cat] !== null && cat !== 'dessert');

    if (selected.length === 0) {
        showNotification('Вы ничего не выбрали');
        return false;
    }

    if (!selected.includes('drink')) {
        showNotification('Обязательно выберите напиток');
        return false;
    }

    const hasMain = selected.includes('main');
    const hasSoup = selected.includes('soup');
    const hasSalad = selected.includes('salad');

    if (!hasMain && !hasSoup) {
        showNotification('Выберите суп или главное блюдо');
        return false;
    }

    return true;
}

// Запуск загрузки при открытии страницы
document.addEventListener('DOMContentLoaded', () => {
    loadDishes(); // ← Главное — запускаем загрузку с API

    document.querySelector('.order-form')?.addEventListener('submit', function(e) {
        if (!validateLunch()) {
            e.preventDefault();
        }
    });
});

