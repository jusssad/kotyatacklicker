// Инициализация звука клика
const clickSound = new Audio('sounds/click-sound.mp3');

// Функция воспроизведения звука клика
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

// Константы
const INITIAL_CLICK_COUNT = 0;
let clickCount = INITIAL_CLICK_COUNT;

const UPGRADE_CURSOR = { id: 1, name: "Курсор", description: "Гладит кота раз в 5 секунд", cost: 15, interval: 5000, count: 0, rate: 1, image: 'images/cursor.png' };
const UPGRADE_GRANDMA = { id: 2, name: "Бабушка", description: "Собирает котят каждые 15 секунд", cost: 100, interval: 15000, count: 0, rate: 10, image: 'images/grandma.png' };
const UPGRADE_FACTORY = { id: 3, name: "Фабрика", description: "Производит котят каждые 30 секунд", cost: 500, interval: 30000, count: 0, rate: 100, image: 'images/factory.png'};

const upgrades = [UPGRADE_CURSOR, UPGRADE_GRANDMA, UPGRADE_FACTORY];
const ACHIEVEMENTS = [
    { id: 1, description: "Заработать 10 котят", goal: 10, achieved: false },
    { id: 2, description: "Заработать 100 котят", goal: 100, achieved: false },
    { id: 3, description: "Заработать 1000 котят", goal: 1000, achieved: false }
];

let upgradeTimers = {};

// Функция для отображения вкладок
function showTab(tabName) {
    const tabs = ['game', 'shop', 'upgrades-info', 'achievements', 'developer'];
    tabs.forEach(tab => {
        document.getElementById(tab).style.display = tab === tabName ? 'block' : 'none';
    });
}

// Инициализация страницы с игровой вкладкой
window.addEventListener('load', () => {
    showTab('game');
    loadProgress();
    renderUpgrades();
    updateClickCount();
});

function incrementCounter() {
    clickCount++;
    updateClickCount();
    updateAchievements();
    playClickSound(); // Воспроизведение звука клика
}


// Обновление счетчика
function updateClickCount() {
    document.getElementById("clicks").textContent = clickCount;
}

// Отображение улучшений
function renderUpgrades() {
    const container = document.getElementById('upgrades-container');
    container.innerHTML = '';
    upgrades.forEach(upgrade => {
        const item = document.createElement('div');
        item.className = 'upgrade-item';
        item.innerHTML = `
            <img src="${upgrade.image}" alt="${upgrade.name}">
            <h3>${upgrade.name}</h3>
            <p>${upgrade.description}</p>
            <p>Цена: ${upgrade.cost} очков</p>
            <button onclick="buyUpgrade(${upgrade.id})">Купить</button>
        `;
        container.appendChild(item);
    });
}

// Покупка улучшений
function buyUpgrade(id) {
    const upgrade = upgrades.find(u => u.id === id);
    if (clickCount >= upgrade.cost) {
        clickCount -= upgrade.cost;
        upgrade.count++;
        upgrade.cost = Math.floor(upgrade.cost * 2);
        updateClickCount();
        renderUpgrades();
        startUpgradeTimer(upgrade);
    } else {
        alert("Недостаточно очков для покупки!");
    }
}

// Таймер улучшений
function startUpgradeTimer(upgrade) {
    if (upgrade.count > 0 && !upgradeTimers[upgrade.id]) {
        upgradeTimers[upgrade.id] = setInterval(() => {
            clickCount += upgrade.count * upgrade.rate;
            updateClickCount();
        }, upgrade.interval);
    }
}

// Обновление достижений
function updateAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
        if (clickCount >= achievement.goal && !achievement.achieved) {
            achievement.achieved = true;
        }
    });
    renderAchievements();
}

// Отображение достижений
function renderAchievements() {
    const achievementsList = document.getElementById("achievements-list");
    achievementsList.innerHTML = '';
    ACHIEVEMENTS.forEach(achievement => {
        const item = document.createElement("div");
        item.className = "achievement-item";
        item.style.backgroundColor = achievement.achieved ? "white" : "grey";
        item.textContent = achievement.description;
        achievementsList.appendChild(item);
    });
}

// Сохранение и загрузка прогресса
function saveProgress() {
    localStorage.setItem('clickCount', clickCount);
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
}

function loadProgress() {
    clickCount = parseInt(localStorage.getItem('clickCount')) || INITIAL_CLICK_COUNT;
    const savedUpgrades = JSON.parse(localStorage.getItem('upgrades')) || [];
    upgrades.forEach((upgrade, index) => {
        upgrade.count = savedUpgrades[index]?.count || 0;
        upgrade.cost = savedUpgrades[index]?.cost || upgrade.cost;
    });
    updateClickCount();
}

// Обработка кнопок меню
function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');
    if (sideMenu.style.width === '250px') {
        sideMenu.style.width = '0';
        overlay.style.display = 'none';
    } else {
        sideMenu.style.width = '250px';
        overlay.style.display = 'block';
    }
}

function openTab(tabName) {
    showTab(tabName);
    toggleMenu();
}

// Сохранение при закрытии страницы
window.addEventListener('beforeunload', saveProgress);

// Функция для создания падающего изображения
function createFallingImage() {
    const fallingImage = document.createElement('img');
    fallingImage.src = 'images/pikmischet.png'; // Путь к изображению
    fallingImage.className = 'falling-image';
    
    // Установка случайной позиции по горизонтали
    fallingImage.style.left = `${Math.random() * 100}%`;
    
    // Добавление изображения в body
    document.body.appendChild(fallingImage);
    
    // Удаление изображения после завершения анимации
    fallingImage.addEventListener('animationend', () => {
        fallingImage.remove();
    });
}

// Модифицируем функцию incrementCounter для добавления падающего изображения
function incrementCounter() {
    clickCount++;
    updateClickCount();
    updateAchievements();
    playClickSound();
    createFallingImage(); // Добавляем анимацию падающего изображения
}
