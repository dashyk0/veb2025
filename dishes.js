// dishes.js — ЛР5: все блюда с kind и новыми категориями
const dishes = [
    // СУПЫ
    { keyword: 'gaspacho', name: 'Гаспачо', price: 195, category: 'soup', count: '350 г', image: 'img/dishes/gazpacho.jpg', kind: 'veg' },
    { keyword: 'mushroom_soup', name: 'Грибной суп-пюре', price: 185, category: 'soup', count: '330 г', image: 'img/dishes/mushroom_soup.jpg', kind: 'veg' },
    { keyword: 'norwegian_soup', name: 'Норвежский суп', price: 270, category: 'soup', count: '330 г', image: 'img/dishes/norwegian_soup.jpg', kind: 'fish' },
    { keyword: 'tom_yum', name: 'Том ям с креветками', price: 650, category: 'soup', count: '500 г', image: 'img/dishes/tomyum.jpg', kind: 'fish' },
    { keyword: 'chicken_soup', name: 'Куриный суп', price: 330, category: 'soup', count: '350 г', image: 'img/dishes/chicken.jpg', kind: 'meat' },
    { keyword: 'ramen', name: 'Рамен', price: 375, category: 'soup', count: '425 г', image: 'img/dishes/ramen.jpg', kind: 'meat' },

    // ГЛАВНЫЕ БЛЮДА
    { keyword: 'fried_potatoes', name: 'Жареная картошка с грибами', price: 150, category: 'main', count: '250 г', image: 'img/dishes/friedpotatoeswithmushrooms1.jpg', kind: 'veg' },
    { keyword: 'lasagna', name: 'Лазанья', price: 385, category: 'main', count: '310 г', image: 'img/dishes/lasagna.jpg', kind: 'meat' },
    { keyword: 'chicken_cutlets', name: 'Котлеты из курицы с пюре', price: 225, category: 'main', count: '280 г', image: 'img/dishes/chickencutletsandmashedpotatoes.jpg', kind: 'meat' },
    { keyword: 'fish_cutlet', name: 'Рыбная котлета с рисом', price: 320, category: 'main', count: '270 г', image: 'img/dishes/fishrice.jpg', kind: 'fish' },
    { keyword: 'pizza_margarita', name: 'Пицца Маргарита', price: 450, category: 'main', count: '470 г', image: 'img/dishes/pizza.jpg', kind: 'veg' },
    { keyword: 'pasta_shrimp', name: 'Паста с креветками', price: 340, category: 'main', count: '280 г', image: 'img/dishes/shrimppasta.jpg', kind: 'fish' },

    // НАПИТКИ
    { keyword: 'apple_juice', name: 'Яблочный сок', price: 90, category: 'drink', count: '300 мл', image: 'img/dishes/applejuice.jpg', kind: 'cold' },
    { keyword: 'orange_juice', name: 'Апельсиновый сок', price: 120, category: 'drink', count: '300 мл', image: 'img/dishes/orangejuice.jpg', kind: 'cold' },
    { keyword: 'carrot_juice', name: 'Морковный сок', price: 110, category: 'drink', count: '300 мл', image: 'img/dishes/carrotjuice.jpg', kind: 'cold' },
    { keyword: 'cappuccino', name: 'Капучино', price: 180, category: 'drink', count: '300 мл', image: 'img/dishes/cappuccino.jpg', kind: 'hot' },
    { keyword: 'green_tea', name: 'Зелёный чай', price: 100, category: 'drink', count: '300 мл', image: 'img/dishes/greentea.jpg', kind: 'hot' },
    { keyword: 'black_tea', name: 'Чёрный чай', price: 90, category: 'drink', count: '300 мл', image: 'img/dishes/tea.jpg', kind: 'hot' },

    // САЛАТЫ / СТАРТЕРЫ
    { keyword: 'caesar_chicken', name: 'Цезарь с цыплёнком', price: 370, category: 'salad', count: '220 г', image: 'img/dishes/caesar.jpg', kind: 'meat' },
    { keyword: 'caprese', name: 'Капрезе с моцареллой', price: 350, category: 'salad', count: '235 г', image: 'img/dishes/caprese.jpg', kind: 'veg' },
    { keyword: 'korean_salad', name: 'Корейский салат с овощами', price: 330, category: 'salad', count: '250 г', image: 'img/dishes/saladwithegg.jpg', kind: 'veg' },
    { keyword: 'tuna_salad', name: 'Салат с тунцом', price: 480, category: 'salad', count: '250 г', image: 'img/dishes/tunasalad.jpg', kind: 'fish' },
    { keyword: 'fries_cheese', name: 'Картофель фри с соусом Цезарь', price: 280, category: 'salad', count: '250 г', image: 'img/dishes/frenchfries1.jpg', kind: 'veg' },
    { keyword: 'fries_ketchup', name: 'Картофель фри с кетчупом', price: 260, category: 'salad', count: '250 г', image: 'img/dishes/frenchfries2.jpg', kind: 'veg' },

    // ДЕСЕРТЫ
    { keyword: 'pahlava', name: 'Пахлава', price: 220, category: 'dessert', count: '300 гр', image: 'img/dishes/baklava.jpg', kind: 'medium' },
    { keyword: 'cheesecake', name: 'Чизкейк', price: 240, category: 'dessert', count: '125 гр', image: 'img/dishes/checheesecake.jpg', kind: 'small' },
    { keyword: 'choco_cheesecake', name: 'Шоколадный чизкейк', price: 260, category: 'dessert', count: '125 гр', image: 'img/dishes/chocolatecheesecake.jpg', kind: 'small' },
    { keyword: 'choco_cake', name: 'Шоколадный торт', price: 270, category: 'dessert', count: '140 гр', image: 'img/dishes/chocolatecake.jpg', kind: 'small' },
    { keyword: 'donuts_3', name: 'Пончики (3 штуки)', price: 410, category: 'dessert', count: '350 гр', image: 'img/dishes/donuts2.jpg', kind: 'medium' },
    { keyword: 'donuts_6', name: 'Пончики (6 штук)', price: 650, category: 'dessert', count: '700 гр', image: 'img/dishes/donuts.jpg', kind: 'large' }
];
