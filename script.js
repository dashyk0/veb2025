
let dishes = [];                     // сюда загрузятся блюда с сервера
let selectedDishes = {
    soup: null,
    main: null,
    drink: null,
    salad: null,
    dessert: null
};

let currentFilters = {};             // текущие активные фильтры по категориям

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


async function loadDishes() {
    try {
        const response = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        dishes = data.map(d => ({
            keyword: d.keyword,
            name: d.name,
            price: d.price,
            category: d.category,
            count: d.count || '—',
            image: d.image || 'img/no-photo.jpg',
            kind: d.kind
        }));

        console.log('Блюда загружены:', dishes.length);
        displayDishes();
        updateOrderSection();
    } catch (err) {
        console.error('Ошибка загрузки меню:', err);
        showNotification('Не удалось загрузить меню. Проверьте интернет-соединение.');
    }
}

/* Отрисовка всех категорий и фильтров */
function displayDishes() {
    const categories = ['soup', 'main', 'drink', 'salad', 'dessert'];

    categories.forEach(cat => {
        const grid = document.getElementById(cat + '-grid');
        const filterBar = document.getElementById(cat + '-filters');
        if (!grid) return;

        // пока блюда ещё не отрисованы – показываем «загрузка»
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888;">Загрузка...</p>';
        if (filterBar) filterBar.innerHTML = '';

        //ФИЛЬТРЫ
        const kinds = [...new Set(dishes.filter(d => d.category === cat).map(d => d.kind))];

        if (filterBar && kinds.length > 0) {
            // кнопка «Все»
            const allBtn = document.createElement('button');
            allBtn.textContent = 'Все';
            allBtn.className = 'filter-btn active';
            allBtn.dataset.kind = 'all';
            filterBar.appendChild(allBtn);

            kinds.forEach(k => {
                const btn = document.createElement('button');
                btn.textContent = kindNames[k] || k;
                btn.className = 'filter-btn';
                btn.dataset.kind = k;
                filterBar.appendChild(btn);
            });

            filterBar.addEventListener('click', e => {
                const btn = e.target.closest('.filter-btn');
                if (!btn) return;
                filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const kind = btn.dataset.kind;
                currentFilters[cat] = (kind === 'all') ? null : kind;
                renderCategory(cat);
            });
        }

        renderCategory(cat);
    });
}

/* Отрисовка одной категории*/
function renderCategory(cat) {
    const grid = document.getElementById(cat + '-grid');
    if (!grid) return;

    let list = dishes.filter(d => d.category === cat);

    if (currentFilters[cat]) {
        list = list.filter(d => d.kind === currentFilters[cat]);
    }

    list.sort((a, b) => a.name.localeCompare(b.name));

    grid.innerHTML = '';

    if (list.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888;padding:40px 20px;">Нет блюд по выбранному фильтру</p>';
        return;
    }

    list.forEach(dish => {
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

/* Обработчик добавления / удаления блюда*/
document.body.addEventListener('click', e => {
    if (!e.target.classList.contains('add-btn')) return;

    const dishEl = e.target.closest('.dish');
    if (!dishEl) return;

    const keyword = dishEl.dataset.dish;
    const dish = dishes.find(d => d.keyword === keyword);
    if (!dish) return;

    const cat = dish.category;

    if (selectedDishes[cat]?.keyword === dish.keyword) {
        // уже выбрано → убираем
        selectedDishes[cat] = null;
    } else {
        // выбираем (заменяем предыдущее в категории)
        selectedDishes[cat] = dish;
    }

    updateOrderSection();
    renderCategory(cat);          // обновляем кнопки в категории
});

/* Обновление блока «Ваш заказ»*/
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
        container.innerHTML = '<p style="text-align:center;color:#888;padding:30px;">Корзина пуста</p>';
        totalEl.innerHTML = '';
    } else {
        totalEl.innerHTML = `<p style="color:#ff6b35;font-size:26px;"><strong>Итого: ${total} ₽</strong></p>`;
    }
}

/* Уведомления */
function showNotification(message) {
    const old = document.querySelector('.notification');
    if (old) old.remove();

    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
            <button class="notification-btn">Понятно</button>
        </div>
    `;
    document.body.appendChild(notif);

    notif.addEventListener('click', e => {
        if (e.target === notif || e.target.classList.contains('notification-btn')) {
            notif.remove();
        }
    });
}

/*Валидация состава ланча*/
function validateLunch() {
    const selected = Object.keys(selectedDishes)
        .filter(cat => selectedDishes[cat] !== null && cat !== 'dessert');

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
    if (!hasMain && !hasSoup) {
        showNotification('Выберите суп или главное блюдо');
        return false;
    }
    return true;
}

/* Запуск всего после загрузки страницы*/
document.addEventListener('DOMContentLoaded', () => {
    loadDishes();                       // загружаем блюда с сервера

    const form = document.querySelector('.order-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            if (!validateLunch()) {
                e.preventDefault();
                return;
            }

            //  Добавляем выбранные блюда в форму как hidden-поля
            this.querySelectorAll('input[type="hidden"][name^="dish_"], input[name="total_price"]')
                .forEach(el => el.remove());

            Object.keys(selectedDishes).forEach(cat => {
                const dish = selectedDishes[cat];
                if (dish) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = `dish_${cat}`;
                    input.value = `${dish.name} (${dish.price} ₽)`;
                    this.appendChild(input);
                }
            });

            const total = Object.values(selectedDishes)
                .filter(Boolean)
                .reduce((sum, d) => sum + d.price, 0);

            const totalInput = document.createElement('input');
            totalInput.type = 'hidden';
            totalInput.name = 'total_price';
            totalInput.value = total;
            this.appendChild(totalInput);

            //форма отправится со всем заказом
        });
    }
});
