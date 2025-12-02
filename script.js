// script.js — ЛР5: Полностью рабочая версия с фильтрами и 5 категориями

let selectedDishes = {
    soup: null,
    main: null,
    drink: null,
    salad: null,
    dessert: null
};

let currentFilters = {}; // { soup: 'veg', drink: 'hot', ... }

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

function displayDishes() {
    const categories = ['soup', 'main', 'drink', 'salad', 'dessert'];

    categories.forEach(cat => {
        const grid = document.getElementById(cat + '-grid');
        const filterBar = document.getElementById(cat + '-filters');

        if (!grid) return;

        // Очищаем
        grid.innerHTML = '';
        if (filterBar) filterBar.innerHTML = '';

        // === Создаём фильтры ===
        const kindsInCategory = [...new Set(
            dishes.filter(d => d.category === cat).map(d => d.kind)
        )];

        if (filterBar && kindsInCategory.length > 0) {
            // Кнопка "Все"
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

            // Обработчик клика по фильтрам (одновременно только один активен)
            filterBar.addEventListener('click', e => {
                const btn = e.target.closest('.filter-btn');
                if (!btn) return;

                filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const kind = btn.dataset.kind;
                if (kind === 'all') {
                    delete currentFilters[cat];
                } else {
                    currentFilters[cat] = kind;
                }
                renderCategory(cat);
            });
        }

        // Первичная отрисовка
        renderCategory(cat);
    });

    // Делегируем клики по кнопкам "Добавить" один раз
    document.body.addEventListener('click', e => {
        if (e.target.classList.contains('add-btn')) {
            const dishEl = e.target.closest('.dish');
            if (!dishEl) return;
            const keyword = dishEl.dataset.dish;
            const dish = dishes.find(d => d.keyword === keyword);
            if (dish) {
                selectedDishes[dish.category] = dish;
                updateOrderSection();

                // Визуальная обратная связь
                e.target.textContent = 'Добавлено!';
                e.target.disabled = true;
                setTimeout(() => {
                    if (e.target.isConnected) {
                        e.target.textContent = 'Добавить';
                        e.target.disabled = false;
                    }
                }, 800);
            }
        }
    });
}

function renderCategory(cat) {
    const grid = document.getElementById(cat + '-grid');
    if (!grid) return;

    let filtered = dishes.filter(d => d.category === cat);

    // Применяем фильтр
    if (currentFilters[cat]) {
        filtered = filtered.filter(d => d.kind === currentFilters[cat]);
    }

    // Сортировка по названию
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 20px;">Нет блюд по этому фильтру</p>';
        return;
    }

    filtered.forEach(dish => {
        const el = document.createElement('div');
        el.className = 'dish';
        el.dataset.dish = dish.keyword;
        el.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}">
            <p class="price">${dish.price} ₽</p>
            <p class="title">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <button class="add-btn">Добавить</button>
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
        div.className = 'order-category';

        if (dish) {
            hasAny = true;
            total += dish.price;
            div.innerHTML = `<h4>${categoryNames[cat]}</h4><p>${dish.name} — ${dish.price} ₽</p>`;
        } else {
            div.innerHTML = `<h4>${categoryNames[cat]}</h4><p style="color: #888;">Блюдо не выбрано</p>`;
        }
        container.appendChild(div);
    });

    if (!hasAny) {
        container.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">Ничего не выбрано</p>';
        totalEl.innerHTML = '';
    } else {
        totalEl.innerHTML = `<p><strong>Стоимость заказа: ${total} ₽</strong></p>`;
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    displayDishes();
    updateOrderSection();
});
