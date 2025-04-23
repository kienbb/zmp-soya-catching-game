// Game Configuration
const config = {
  gameTime: 60, // seconds
  beanSpawnRate: 1000, // ms
  goldenBeanChance: 0.2, // 20% chance
  negativeBeanChance: 0.15, // 15% chance
  beanSpeed: 3, // Speed multiplier
  regularBeanScore: 10,
  goldenBeanScore: 50,
  negativeBeanPenalty: -1, // Changed from -10 to -1 (represents 1 life)
  minSpawnX: 20,
  maxSpawnX: 480,
  spinRewardCost: 50,
  exchangeRate: 10, // 10 points = 1 bean
  initialLives: 5, // Player starts with 5 lives (changed from 3)
  difficultyLevels: [
    { name: "Dễ", beanSpeed: 2, negativeBeanChance: 0.1 },
    { name: "Thường", beanSpeed: 3, negativeBeanChance: 0.15 },
    { name: "Khó", beanSpeed: 4, negativeBeanChance: 0.2 }
  ],
  spinRewards: [
    { name: "10 Đậu", value: 10, chance: 0.30, type: "beans", color: "#FBBF24", icon: "bean.png" },
    { name: "30 Đậu", value: 30, chance: 0.25, type: "beans", color: "#F59E0B", icon: "bean.png" },
    { name: "50 Đậu", value: 50, chance: 0.20, type: "beans", color: "#D97706", icon: "bean.png" },
    { name: "100 Đậu", value: 100, chance: 0.10, type: "beans", color: "#B45309", icon: "bean.png" },
    { name: "Điểm Đôi", value: 2, chance: 0.10, type: "multiplier", color: "#059669", icon: "multiplier.png" },
    { name: "Thêm Thời Gian", value: 10, chance: 0.05, type: "time", color: "#0284C7", icon: "time.png" }
  ],
  streakBonusFactor: 1.5, // Multiplier for streak bonus
  maxStreak: 10, // Maximum streak level
  beanTypes: [
    { 
      type: 'fortune', 
      color: '#7C3AED', // Tím
      fillColor: '#DDD6FE',
      strokeColor: '#6D28D9',
      baseScore: 10 
    },
    { 
      type: 'health', 
      color: '#10B981', // Xanh lá
      fillColor: '#A7F3D0',
      strokeColor: '#059669',
      baseScore: 10 
    },
    { 
      type: 'wealth', 
      color: '#F59E0B', // Vàng
      fillColor: '#FDE68A',
      strokeColor: '#D97706',
      baseScore: 10 
    }
  ]
};

// Positive messages to display when catching beans (Vietnamese) with streak variants up to 10 levels
const positiveMessages = {
  "fortune": {
    base: "Tình duyên tốt",
    streak: [
      "Tình duyên tốt",
      "Tình duyên rực rỡ",
      "Tình duyên như mơ",
      "Tình duyên viên mãn",
      "Tình duyên thăng hoa",
      "Tình duyên nở rộ",
      "Tình duyên đơm hoa",
      "Tình duyên vững bền",
      "Tình duyên mỹ mãn",
      "Tình duyên trọn vẹn"
    ]
  },
  "health": {
    base: "Sức khỏe tốt",
    streak: [
      "Sức khỏe tốt",
      "Sức khỏe dồi dào",
      "Sức khỏe tuyệt vời",
      "Sức khỏe bền vững",
      "Sức khỏe phi thường",
      "Sức khỏe vô địch",
      "Sức khỏe hoàn hảo",
      "Sức khỏe sung mãn",
      "Sức khỏe tràn đầy",
      "Sức khỏe vĩnh cửu"
    ]
  },
  "wealth": {
    base: "Tài lộc dồi dào",
    streak: [
      "Tài lộc dồi dào",
      "Tài lộc rộng mở",
      "Tài lộc phú quý",
      "Tài lộc vô tận",
      "Tài lộc tràn trề",
      "Tài lộc sung túc",
      "Tài lộc đại phát",
      "Tài lộc làm giàu",
      "Tài lộc đại thịnh",
      "Tài lộc bủa vây"
    ]
  }
};

// Game State
const gameState = {
  score: 0,
  timeLeft: config.gameTime,
  beans: 0,
  isPlaying: false,
  playerName: '',
  playerPhone: '',
  playerAge: '',
  gameTimer: null,
  spawnTimer: null,
  leaderboard: [],
  rewards: [
    { name: "Thêm Thời Gian", cost: 100, img: "./assets/svg/timer.svg" },
    { name: "Điểm Đôi", cost: 200, img: "./assets/svg/score-panel.svg" },
    { name: "Quay May Mắn", cost: 50, img: "./assets/svg/lucky-wheel.svg" },
    { name: "Giỏ Vàng", cost: 500, img: "./assets/svg/basket.svg" }
  ],
  spinRewards: config.spinRewards,
  lives: config.initialLives,
  difficulty: 1, // Default to normal difficulty (index 1)
  difficultyName: config.difficultyLevels[1].name,
  currentStreak: 0, // Current streak count
  lastBeanType: null, // Track last bean type for streak
  colorBeans: {} // Track streak per bean color
};

// DOM Elements
let screens = {};
let elements = {};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize DOM references after the DOM is fully loaded
  initDOMReferences();
  
  loadGameData();
  initEventListeners();
  updateBeansDisplay();
  populateRewards();
  populateLeaderboard();
  initLuckyWheel();
});

// Initialize DOM references
function initDOMReferences() {
  screens = {
    home: document.getElementById('home-screen'),
    form: document.getElementById('form-screen'),
    game: document.getElementById('game-screen'),
    gameOver: document.getElementById('game-over-screen'),
    leaderboard: document.getElementById('leaderboard-screen'),
    luckySpin: document.getElementById('lucky-spin-screen'),
    exchange: document.getElementById('exchange-screen')
  };

  elements = {
    startButton: document.getElementById('start-game'),
    leaderboardButton: document.getElementById('leaderboard-btn'),
    luckySpinButton: document.getElementById('lucky-spin-btn'),
    exchangeButton: document.getElementById('exchange-btn'),
    playerForm: document.getElementById('player-form'),
    playerName: document.getElementById('player-name'),
    playerPhone: document.getElementById('player-phone'),
    playerAge: document.getElementById('player-age'),
    scoreText: document.getElementById('score-text'),
    timerText: document.getElementById('timer-text'),
    finalScore: document.getElementById('final-score'),
    playAgain: document.getElementById('play-again'),
    goHome: document.getElementById('go-home'),
    leaderboardEntries: document.getElementById('leaderboard-entries'),
    leaderboardBack: document.getElementById('leaderboard-back'),
    wheel: document.getElementById('wheel'),
    spinBtn: document.getElementById('spin-btn'),
    luckySpinBack: document.getElementById('lucky-spin-back'),
    beansCount: document.getElementById('beans-count'),
    rewardsContainer: document.querySelector('.rewards-container'),
    exchangeBack: document.getElementById('exchange-back'),
    basket: document.getElementById('basket'),
    gameArea: document.getElementById('game-area'),
    basketContainer: document.getElementById('basket-container'),
    livesDisplay: document.getElementById('lives-display'),
    difficultyButtons: document.querySelectorAll('.difficulty-btn')
  };
  
  // Debug check - log if any elements are null
  Object.entries(elements).forEach(([key, value]) => {
    if (!value && key !== 'difficultyButtons') console.warn(`Element not found: ${key}`);
  });
}

// Load saved game data from localStorage
function loadGameData() {
  const savedData = localStorage.getItem('soyaCatchingGame');
  if (savedData) {
    const data = JSON.parse(savedData);
    gameState.beans = data.beans || 0;
    gameState.leaderboard = data.leaderboard || [];
    gameState.playerName = data.playerName || '';
    gameState.playerPhone = data.playerPhone || '';
    gameState.playerAge = data.playerAge || '';
    
    // Pre-fill form if data exists
    if (gameState.playerName && elements.playerName) elements.playerName.value = gameState.playerName;
    if (gameState.playerPhone && elements.playerPhone) elements.playerPhone.value = gameState.playerPhone;
    if (gameState.playerAge && elements.playerAge) elements.playerAge.value = gameState.playerAge;
  }
}

// Save game data to localStorage
function saveGameData() {
  const data = {
    beans: gameState.beans,
    leaderboard: gameState.leaderboard,
    playerName: gameState.playerName,
    playerPhone: gameState.playerPhone,
    playerAge: gameState.playerAge
  };
  localStorage.setItem('soyaCatchingGame', JSON.stringify(data));
}

// Initialize event listeners
function initEventListeners() {
  // Ensure all elements exist before attaching event listeners
  if (elements.startButton) {
    elements.startButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showScreen(screens.form);
    });
  }

  if (elements.leaderboardButton) {
    elements.leaderboardButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      fetchLeaderboard();
      showScreen(screens.leaderboard);
    });
  }

  if (elements.luckySpinButton) {
    elements.luckySpinButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showScreen(screens.luckySpin);
    });
  }

  if (elements.exchangeButton) {
    elements.exchangeButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showScreen(screens.exchange);
      updateBeansBalance();
    });
  }

  if (elements.leaderboardBack) {
    elements.leaderboardBack.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showScreen(screens.home);
    });
  }

  if (elements.luckySpinBack) {
    elements.luckySpinBack.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showScreen(screens.gameOver);
    });
  }

  if (elements.exchangeBack) {
    elements.exchangeBack.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showScreen(screens.home);
    });
  }

  if (elements.goHome) {
    elements.goHome.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showScreen(screens.home);
    });
  }

  if (elements.playAgain) {
    elements.playAgain.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showScreen(screens.game);
      startGame();
    });
  }
  
  // Form submission
  if (elements.playerForm) {
    elements.playerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();
      gameState.playerName = elements.playerName ? elements.playerName.value : '';
      gameState.playerPhone = elements.playerPhone ? elements.playerPhone.value : '';
      gameState.playerAge = elements.playerAge ? elements.playerAge.value : '';
      saveGameData();
      startGame();
    });
  }
  
  // Lucky spin
  if (elements.spinBtn) {
    elements.spinBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      spinWheel();
    });
  }
  
  // Basket movement - touch/mouse
  if (elements.basketContainer) {
    initBasketMovement();
  }
  
  // Window resize event for responsive adjustments
  window.addEventListener('resize', adjustGameArea);
  
  // Debug log
  console.log('Event listeners initialized');
  
  // Difficulty selection
  if (elements.difficultyButtons) {
    elements.difficultyButtons.forEach((button, index) => {
      button.addEventListener('click', function() {
        gameState.difficulty = index;
        gameState.difficultyName = config.difficultyLevels[index].name;
        
        // Update visual selection
        elements.difficultyButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
      });
    });
  }
}

// Basket movement initialization
function initBasketMovement() {
  let isDragging = false;
  let basketRect = elements.basketContainer.getBoundingClientRect();
  let gameAreaRect = elements.gameArea.getBoundingClientRect();
  
  // Mouse events
  elements.basketContainer.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
  
  // Touch events
  elements.basketContainer.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('touchend', endDrag);
  
  // Keyboard events
  document.addEventListener('keydown', moveBasketWithKeys);
  
  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    basketRect = elements.basketContainer.getBoundingClientRect();
    gameAreaRect = elements.gameArea.getBoundingClientRect();
  }
  
  function drag(e) {
    if (!isDragging || !gameState.isPlaying) return;
    e.preventDefault();
    
    const pageX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    let newLeft = pageX - gameAreaRect.left - (basketRect.width / 2);
    
    // Boundary checks
    if (newLeft < 0) newLeft = 0;
    if (newLeft > gameAreaRect.width - basketRect.width) {
      newLeft = gameAreaRect.width - basketRect.width;
    }
    
    elements.basketContainer.style.left = `${newLeft}px`;
    elements.basketContainer.style.transform = 'none';
  }
  
  function endDrag() {
    isDragging = false;
  }
  
  function moveBasketWithKeys(e) {
    if (!gameState.isPlaying) return;
    
    basketRect = elements.basketContainer.getBoundingClientRect();
    gameAreaRect = elements.gameArea.getBoundingClientRect();
    
    const step = 20;
    let currentLeft = basketRect.left - gameAreaRect.left;
    
    if (e.key === 'ArrowLeft') {
      currentLeft = Math.max(0, currentLeft - step);
      elements.basketContainer.style.left = `${currentLeft}px`;
      elements.basketContainer.style.transform = 'none';
    } else if (e.key === 'ArrowRight') {
      currentLeft = Math.min(gameAreaRect.width - basketRect.width, currentLeft + step);
      elements.basketContainer.style.left = `${currentLeft}px`;
      elements.basketContainer.style.transform = 'none';
    }
  }
}

// Adjust game area for different screen sizes
function adjustGameArea() {
  if (gameState.isPlaying && elements.basketContainer) {
    // Reset basket position
    elements.basketContainer.style.left = '50%';
    elements.basketContainer.style.transform = 'translateX(-50%)';
  }
}

// Show a specific screen
function showScreen(screen) {
  if (!screen) {
    console.error('Attempted to show undefined screen');
    return;
  }
  
  // Hide all screens
  Object.values(screens).forEach(s => {
    if (s) s.classList.remove('active');
  });
  
  // Show the selected screen
  screen.classList.add('active');
  
  // Additional actions based on screen
  if (screen === screens.leaderboard) {
    populateLeaderboard();
  } else if (screen === screens.exchange) {
    updateBeansDisplay();
  }
  
  // Debug
  console.log('Showing screen:', screen.id);
}

// Start the game
function startGame() {
  // Reset game state
  gameState.score = 0;
  gameState.timeLeft = config.gameTime;
  gameState.isPlaying = true;
  gameState.lives = config.initialLives;
  gameState.colorBeans = {}; // Reset all color streaks
  
  // Apply difficulty settings
  const diffSettings = config.difficultyLevels[gameState.difficulty];
  config.beanSpeed = diffSettings.beanSpeed;
  config.negativeBeanChance = diffSettings.negativeBeanChance;
  
  // Update display
  if (elements.scoreText) elements.scoreText.textContent = gameState.score;
  if (elements.timerText) elements.timerText.textContent = gameState.timeLeft;
  updateLivesDisplay();
  
  // Clear any existing beans
  clearBeans();
  
  // Reset basket position
  if (elements.basketContainer) {
    elements.basketContainer.style.left = '50%';
    elements.basketContainer.style.transform = 'translateX(-50%)';
  }
  
  // Show game screen
  showScreen(screens.game);
  
  // Start timers
  startGameTimer();
  startBeanSpawner();
}

// Start the game timer
function startGameTimer() {
  if (gameState.gameTimer) clearInterval(gameState.gameTimer);
  
  gameState.gameTimer = setInterval(() => {
    gameState.timeLeft--;
    if (elements.timerText) elements.timerText.textContent = gameState.timeLeft;
    
    if (gameState.timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// Start spawning beans
function startBeanSpawner() {
  if (gameState.spawnTimer) clearInterval(gameState.spawnTimer);
  
  gameState.spawnTimer = setInterval(() => {
    spawnBean();
  }, config.beanSpawnRate);
}

// Clear all beans from the game area
function clearBeans() {
  const beans = document.querySelectorAll('.soybean, .negative-score');
  beans.forEach(bean => bean.remove());
}

// Create colored bean SVG
function createColoredBeanSVG(beanType) {
  const beanTypeInfo = config.beanTypes.find(type => type.type === beanType);
  if (!beanTypeInfo) return null;
  
  const svgContent = `
  <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path fill="${beanTypeInfo.fillColor}" stroke="${beanTypeInfo.strokeColor}" stroke-width="2" d="M20,7 C26,7 32,13 32,21 C32,29 26,33 20,33 C14,33 8,29 8,21 C8,13 14,7 20,7 Z" />
    <path fill="${beanTypeInfo.strokeColor}" d="M20,10 C22,10 24,14 24,18 C24,22 22,24 20,24 C18,24 16,22 16,18 C16,14 18,10 20,10 Z" />
  </svg>`;
  
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
}

// Convert SVG to image
function svgToImage(svgData) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = svgData;
  });
}

// Spawn a new bean
function spawnBean() {
  if (!gameState.isPlaying || !elements.gameArea) return;
  
  const beanType = determineBeanType();
  const beanElement = document.createElement('img');
  
  if (beanType === 'negative') {
    // Negative bean
    beanElement.src = './assets/svg/negative-score.svg';
    beanElement.classList.add('negative-score');
    beanElement.dataset.value = config.negativeBeanPenalty;
    beanElement.dataset.type = 'negative';
  } else if (beanType === 'golden') {
    // Golden bean
    beanElement.src = './assets/svg/golden-soybean.svg';
    beanElement.classList.add('soybean', 'golden-soybean');
    beanElement.dataset.value = config.goldenBeanScore;
    beanElement.dataset.type = 'golden';
    
    // Random message key cho golden bean, chỉ chọn từ 3 loại đậu hiện có
    const beanTypes = ['fortune', 'health', 'wealth'];
    const messageKey = beanTypes[Math.floor(Math.random() * 3)];
    beanElement.dataset.messageKey = messageKey;
  } else {
    // Regular bean with specific type and color - chỉ chọn từ 3 loại được định nghĩa
    const beanTypes = ['fortune', 'health', 'wealth'];
    const specificBeanType = beanTypes[Math.floor(Math.random() * 3)];
    
    // Create colored bean SVG
    const svgData = createColoredBeanSVG(specificBeanType);
    beanElement.src = svgData;
    
    beanElement.classList.add('soybean', `bean-${specificBeanType}`);
    beanElement.dataset.value = config.regularBeanScore;
    beanElement.dataset.type = 'regular';
    beanElement.dataset.beanColor = specificBeanType;
    beanElement.dataset.messageKey = specificBeanType;
  }
  
  // Set random starting position
  const startX = getRandomInt(config.minSpawnX, config.maxSpawnX - 50);
  beanElement.style.left = `${startX}px`;
  beanElement.style.top = '-50px';
  
  // Add to game area
  elements.gameArea.appendChild(beanElement);
  
  // Animate falling
  const fallDuration = getRandomInt(3, 6) * 1000 / config.beanSpeed;
  animateBeanFall(beanElement, fallDuration);
}

// Determine which type of bean to spawn
function determineBeanType() {
  const random = Math.random();
  if (random < config.negativeBeanChance) {
    return 'negative';
  } else if (random < config.negativeBeanChance + config.goldenBeanChance) {
    return 'golden';
  } else {
    return 'regular';
  }
}

// Animate a bean falling
function animateBeanFall(beanElement, duration) {
  if (!elements.gameArea) return;
  
  const gameAreaHeight = elements.gameArea.offsetHeight;
  const startTime = performance.now();
  
  function step(currentTime) {
    if (!gameState.isPlaying) {
      beanElement.remove();
      return;
    }
    
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Update position
    const yPos = progress * gameAreaHeight;
    beanElement.style.top = `${yPos}px`;
    
    // Check for collision with basket
    checkCollision(beanElement);
    
    // Continue animation or remove if finished
    if (progress < 1 && beanElement.parentElement) {
      requestAnimationFrame(step);
    } else {
      beanElement.remove();
    }
  }
  
  requestAnimationFrame(step);
}

// Check if a bean has collided with the basket
function checkCollision(beanElement) {
  if (!beanElement.parentElement || !elements.basket) return;
  
  const beanRect = beanElement.getBoundingClientRect();
  const basketRect = elements.basket.getBoundingClientRect();
  
  // Simple collision detection
  if (
    beanRect.bottom >= basketRect.top &&
    beanRect.top <= basketRect.bottom &&
    beanRect.right >= basketRect.left &&
    beanRect.left <= basketRect.right
  ) {
    // Handle collision
    const scoreValue = parseInt(beanElement.dataset.value);
    const beanType = beanElement.dataset.type;
    const messageKey = beanElement.dataset.messageKey;
    const beanColor = beanElement.dataset.beanColor;
    
    // Negative bean caught
    if (beanType === 'negative') {
      // Reset all color streaks on negative bean
      gameState.colorBeans = {};
      
      // Reduce life instead of ending game immediately
      gameState.lives--;
      updateLivesDisplay();
      
      // Visual feedback
      showNegativeCatch(basketRect);
      
      // Remove bean
      beanElement.remove();
      
      // End game if no lives left
      if (gameState.lives <= 0) {
        setTimeout(() => {
          endGame();
        }, 800);
      }
      
      return;
    }
    
    // Xác định loại đậu và màu sắc khi bắt được đậu vàng
    let effectiveBeanColor = beanColor;
    let effectiveMessageKey = messageKey;
    
    // Nếu là đậu vàng, kiểm tra streak hiện tại để tiếp tục streak
    if (beanType === 'golden') {
      // Tìm loại đậu có streak cao nhất hiện tại
      let maxStreakBean = null;
      let maxStreak = 0;
      
      Object.entries(gameState.colorBeans).forEach(([bean, streak]) => {
        if (streak > maxStreak) {
          maxStreak = streak;
          maxStreakBean = bean;
        }
      });
      
      // Nếu có streak từ trước, sử dụng loại đậu đó
      if (maxStreakBean) {
        effectiveBeanColor = maxStreakBean;
        effectiveMessageKey = maxStreakBean;
      } else {
        // Nếu không có streak nào, chọn ngẫu nhiên 1 trong 3 loại
        const beanTypes = ['fortune', 'health', 'wealth'];
        effectiveBeanColor = beanTypes[Math.floor(Math.random() * 3)];
        effectiveMessageKey = effectiveBeanColor;
      }
    }
    
    // Initialize streak for this color if needed
    if (!gameState.colorBeans[effectiveBeanColor]) {
      gameState.colorBeans[effectiveBeanColor] = 0;
    }
    
    // Check for streak - only count streak for same color beans
    let streakBonus = 0;
    
    if (effectiveBeanColor) {
      // Increment streak for this color
      gameState.colorBeans[effectiveBeanColor]++;
      
      // Calculate streak bonus
      const currentColorStreak = gameState.colorBeans[effectiveBeanColor];
      const streakMultiplier = Math.min(currentColorStreak, config.maxStreak);
      
      // Đậu vàng cho điểm cao hơn và bonus streak cũng cao hơn
      const baseValue = beanType === 'golden' ? scoreValue : config.regularBeanScore;
      streakBonus = Math.floor(baseValue * (config.streakBonusFactor * (streakMultiplier - 1)) / 2);
      
      // Reset streaks for other colors
      Object.keys(gameState.colorBeans).forEach(color => {
        if (color !== effectiveBeanColor) {
          gameState.colorBeans[color] = 0;
        }
      });
    }
    
    // Update score with streak bonus
    updateScore(scoreValue + streakBonus);
    
    // Remove bean
    beanElement.remove();
    
    // Visual feedback for score change with effective bean color
    showScoreChange(scoreValue, streakBonus, basketRect, effectiveMessageKey, effectiveBeanColor, beanType === 'golden');
  }
}

// Show visual feedback when catching a negative bean
function showNegativeCatch(basketRect) {
  // Create flash effect
  const flashElement = document.createElement('div');
  flashElement.style.position = 'fixed';
  flashElement.style.top = '0';
  flashElement.style.left = '0';
  flashElement.style.width = '100%';
  flashElement.style.height = '100%';
  flashElement.style.backgroundColor = '#DC2626';
  flashElement.style.opacity = '0.5';
  flashElement.style.zIndex = '100';
  flashElement.style.pointerEvents = 'none';
  document.body.appendChild(flashElement);
  
  // Create message text based on lives remaining
  let messageText = gameState.lives <= 0 ? 'KẾT THÚC!' : 'MẤT 1 MẠNG!';
  
  // Create message
  const messageElement = document.createElement('div');
  messageElement.textContent = messageText;
  messageElement.style.position = 'absolute';
  messageElement.style.left = '50%';
  messageElement.style.top = '40%';
  messageElement.style.transform = 'translate(-50%, -50%)';
  messageElement.style.color = 'white';
  messageElement.style.fontWeight = 'bold';
  messageElement.style.fontSize = '3rem';
  messageElement.style.zIndex = '101';
  messageElement.style.textShadow = '2px 2px 4px #000000';
  messageElement.style.pointerEvents = 'none';
  document.body.appendChild(messageElement);
  
  // Create sub-message
  const subMessageElement = document.createElement('div');
  subMessageElement.textContent = gameState.lives <= 0 ? 
    'Bạn đã hết mạng!' : 
    `Còn ${gameState.lives} mạng!`;
  subMessageElement.style.position = 'absolute';
  subMessageElement.style.left = '50%';
  subMessageElement.style.top = '50%';
  subMessageElement.style.transform = 'translate(-50%, -50%)';
  subMessageElement.style.color = 'white';
  subMessageElement.style.fontWeight = 'bold';
  subMessageElement.style.fontSize = '1.5rem';
  subMessageElement.style.zIndex = '101';
  subMessageElement.style.textShadow = '2px 2px 4px #000000';
  subMessageElement.style.pointerEvents = 'none';
  document.body.appendChild(subMessageElement);
  
  // Add screen shake effect
  const gameContainer = document.getElementById('game-container');
  let shakeCount = 0;
  const maxShakes = 5;
  const shakeAmount = 10;
  
  const shakeEffect = setInterval(() => {
    if (shakeCount >= maxShakes) {
      clearInterval(shakeEffect);
      gameContainer.style.transform = 'translate(0, 0)';
      return;
    }
    
    // Random offsets for shake
    const xOffset = Math.random() * shakeAmount - shakeAmount / 2;
    const yOffset = Math.random() * shakeAmount - shakeAmount / 2;
    
    gameContainer.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    shakeCount++;
  }, 80);
  
  // Fade out
  let opacity = 0.5;
  const fadeOut = setInterval(() => {
    opacity -= 0.05;
    flashElement.style.opacity = opacity;
    
    if (opacity <= 0) {
      clearInterval(fadeOut);
      flashElement.remove();
      messageElement.remove();
      subMessageElement.remove();
    }
  }, 60);
}

// Show visual feedback for score changes
function showScoreChange(value, streakBonus, basketRect, messageKey, beanColor, isGolden = false) {
  // Score change element
  const scoreChangeElement = document.createElement('div');
  scoreChangeElement.textContent = value > 0 ? `+${value}` : value;
  scoreChangeElement.style.position = 'absolute';
  scoreChangeElement.style.left = `${basketRect.left + basketRect.width / 2}px`;
  scoreChangeElement.style.top = `${basketRect.top - 20}px`;
  scoreChangeElement.style.color = isGolden ? '#F59E0B' : '#16A34A'; // Golden color for golden beans
  scoreChangeElement.style.fontWeight = 'bold';
  scoreChangeElement.style.fontSize = '1.5rem';
  scoreChangeElement.style.zIndex = '20';
  scoreChangeElement.style.textShadow = isGolden ? '0 0 5px #FDE68A' : '0 0 2px white';
  
  document.body.appendChild(scoreChangeElement);
  
  // Show streak bonus if any
  if (streakBonus > 0) {
    const bonusElement = document.createElement('div');
    bonusElement.textContent = `STREAK +${streakBonus}`;
    bonusElement.style.position = 'absolute';
    bonusElement.style.left = `${basketRect.left + basketRect.width / 2 + 50}px`;
    bonusElement.style.top = `${basketRect.top - 20}px`;
    bonusElement.style.color = isGolden ? '#D97706' : '#9333EA';
    bonusElement.style.fontWeight = 'bold';
    bonusElement.style.fontSize = '1.2rem';
    bonusElement.style.zIndex = '20';
    bonusElement.style.textShadow = isGolden ? '0 0 3px #FEF3C7' : '0 0 3px #E9D5FF';
    
    document.body.appendChild(bonusElement);
    
    // Animate and remove bonus
    let bonusOpacity = 1;
    let bonusYPos = basketRect.top - 20;
    
    const animateBonus = setInterval(() => {
      bonusOpacity -= 0.05;
      bonusYPos -= 2;
      
      bonusElement.style.opacity = bonusOpacity;
      bonusElement.style.top = `${bonusYPos}px`;
      
      if (bonusOpacity <= 0) {
        clearInterval(animateBonus);
        bonusElement.remove();
      }
    }, 30);
  }
  
  // Show positive message for good beans
  if (value > 0 && messageKey) {
    // Get the appropriate message based on streak
    let streak = 0;
    
    if (beanColor && gameState.colorBeans[beanColor]) {
      streak = Math.min(gameState.colorBeans[beanColor] - 1, config.maxStreak - 1);
    }
    
    const messages = positiveMessages[messageKey].streak;
    const message = messages[streak];
    
    // Find bean type info for color styling
    let messageColor = '#7C2D12';
    if (beanColor) {
      const beanTypeInfo = config.beanTypes.find(type => type.type === beanColor);
      if (beanTypeInfo) {
        messageColor = beanTypeInfo.strokeColor;
      }
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.position = 'absolute';
    messageElement.style.left = `${basketRect.left + basketRect.width / 2 - 50}px`;
    messageElement.style.top = `${basketRect.top - 50}px`;
    messageElement.style.color = messageColor;
    messageElement.style.fontWeight = 'bold';
    messageElement.style.fontSize = '1.2rem';
    messageElement.style.zIndex = '20';
    
    // Golden glow effect for golden beans
    if (isGolden) {
      messageElement.style.textShadow = '0 0 5px #FBBF24, 0 0 10px #F59E0B';
      messageElement.style.backgroundColor = 'rgba(254, 243, 199, 0.8)';
      messageElement.style.border = '1px solid #F59E0B';
    } else {
      messageElement.style.textShadow = '0 0 3px #FBBF24';
      messageElement.style.backgroundColor = 'rgba(254, 243, 199, 0.7)';
    }
    
    messageElement.style.padding = '5px 10px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.width = 'max-content';
    
    document.body.appendChild(messageElement);
    
    // Show streak indicator if streak > 1
    if (beanColor && gameState.colorBeans[beanColor] > 1) {
      const currentStreak = gameState.colorBeans[beanColor];
      const streakElement = document.createElement('div');
      
      // Show golden indicator for golden bean streaks
      if (isGolden) {
        streakElement.textContent = `✨ Streak x${currentStreak} ✨`;
        streakElement.style.color = '#D97706';
        streakElement.style.textShadow = '0 0 5px #FDE68A';
        streakElement.style.backgroundColor = 'rgba(254, 243, 199, 0.9)';
        streakElement.style.border = '1px solid #F59E0B';
      } else {
        streakElement.textContent = `Streak x${currentStreak}`;
        streakElement.style.color = '#9333EA';
        streakElement.style.textShadow = '0 0 3px #E9D5FF';
        streakElement.style.backgroundColor = 'rgba(233, 213, 255, 0.7)';
      }
      
      streakElement.style.position = 'absolute';
      streakElement.style.left = `${basketRect.left + basketRect.width / 2 - 30}px`;
      streakElement.style.top = `${basketRect.top - 80}px`;
      streakElement.style.fontWeight = 'bold';
      streakElement.style.fontSize = '1.1rem';
      streakElement.style.zIndex = '20';
      streakElement.style.padding = '3px 8px';
      streakElement.style.borderRadius = '5px';
      streakElement.style.width = 'max-content';
      
      // Add glowing effect for high streaks
      if (currentStreak >= 5) {
        streakElement.style.boxShadow = isGolden ? '0 0 15px #F59E0B' : '0 0 10px #9333EA';
        if (currentStreak >= 8) {
          streakElement.style.animation = 'pulse-streak 0.5s infinite alternate';
        }
      }
      
      document.body.appendChild(streakElement);
      
      // Add pulsing animation
      let scale = 1;
      let increasing = true;
      
      const pulseStreak = setInterval(() => {
        if (increasing) {
          scale += 0.03;
          if (scale >= 1.3) increasing = false;
        } else {
          scale -= 0.03;
          if (scale <= 1) increasing = true;
        }
        
        streakElement.style.transform = `scale(${scale})`;
      }, 30);
      
      // Animate and remove streak indicator
      setTimeout(() => {
        clearInterval(pulseStreak);
        
        let streakOpacity = 1;
        const fadeStreak = setInterval(() => {
          streakOpacity -= 0.05;
          streakElement.style.opacity = streakOpacity;
          
          if (streakOpacity <= 0) {
            clearInterval(fadeStreak);
            streakElement.remove();
          }
        }, 30);
      }, 1000);
    }
    
    // Animate and remove message
    let messageOpacity = 1;
    let messageYPos = basketRect.top - 50;
    
    const animateMessage = setInterval(() => {
      messageOpacity -= 0.02;
      messageYPos -= 1;
      
      messageElement.style.opacity = messageOpacity;
      messageElement.style.top = `${messageYPos}px`;
      
      if (messageOpacity <= 0) {
        clearInterval(animateMessage);
        messageElement.remove();
      }
    }, 30);
  }
  
  // Animate and remove score
  let opacity = 1;
  let yPos = basketRect.top - 20;
  
  const animateScore = setInterval(() => {
    opacity -= 0.05;
    yPos -= 2;
    
    scoreChangeElement.style.opacity = opacity;
    scoreChangeElement.style.top = `${yPos}px`;
    
    if (opacity <= 0) {
      clearInterval(animateScore);
      scoreChangeElement.remove();
    }
  }, 30);
}

// Update the game score
function updateScore(value) {
  gameState.score += value;
  if (gameState.score < 0) gameState.score = 0;
  if (elements.scoreText) elements.scoreText.textContent = gameState.score;
}

// End the game
function endGame() {
  gameState.isPlaying = false;
  
  // Clear timers
  clearInterval(gameState.gameTimer);
  clearInterval(gameState.spawnTimer);
  
  // Update beans from score
  const earnedBeans = Math.floor(gameState.score / config.exchangeRate);
  gameState.beans += earnedBeans;
  
  // Update display
  if (elements.finalScore) elements.finalScore.textContent = gameState.score;
  
  // Update leaderboard
  updateLeaderboard();
  
  // Save game data
  saveGameData();
  
  // Show game over screen
  showScreen(screens.gameOver);
}

// Update the leaderboard with current score
function updateLeaderboard() {
  if (gameState.score <= 0) return;
  
  // Create new entry
  const newEntry = {
    name: gameState.playerName,
    score: gameState.score,
    date: new Date().toISOString()
  };
  
  // Add to leaderboard
  gameState.leaderboard.push(newEntry);
  
  // Sort by score (highest first)
  gameState.leaderboard.sort((a, b) => b.score - a.score);
  
  // Keep only top 10
  if (gameState.leaderboard.length > 10) {
    gameState.leaderboard = gameState.leaderboard.slice(0, 10);
  }
}

// Populate the leaderboard screen
function populateLeaderboard() {
  if (!elements.leaderboardEntries) return;
  
  elements.leaderboardEntries.innerHTML = '';
  
  if (gameState.leaderboard.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.textContent = 'Chưa có điểm nào. Hãy chơi để thiết lập kỷ lục!';
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.color = '#7C2D12';
    emptyMessage.style.padding = '20px';
    emptyMessage.style.fontWeight = 'bold';
    elements.leaderboardEntries.appendChild(emptyMessage);
    return;
  }
  
  gameState.leaderboard.forEach((entry, index) => {
    const entryElement = document.createElement('div');
    entryElement.classList.add('leaderboard-entry');
    
    // Rank with medal
    const rankElement = document.createElement('div');
    rankElement.classList.add('rank');
    
    if (index < 3) {
      const medalImg = document.createElement('img');
      medalImg.src = index === 0 
        ? './assets/svg/gold-medal.svg' 
        : index === 1 
          ? './assets/svg/silver-medal.svg' 
          : './assets/svg/bronze-medal.svg';
      rankElement.appendChild(medalImg);
    } else {
      rankElement.textContent = `#${index + 1}`;
    }
    
    // Player name
    const nameElement = document.createElement('div');
    nameElement.classList.add('player-name');
    nameElement.textContent = entry.name;
    
    // Score
    const scoreElement = document.createElement('div');
    scoreElement.classList.add('player-score');
    scoreElement.textContent = entry.score;
    
    // Append all elements
    entryElement.appendChild(rankElement);
    entryElement.appendChild(nameElement);
    entryElement.appendChild(scoreElement);
    
    elements.leaderboardEntries.appendChild(entryElement);
  });
}

// Update beans display
function updateBeansDisplay() {
  if (elements.beansCount) elements.beansCount.textContent = gameState.beans;
}

// Populate rewards in the exchange screen
function populateRewards() {
  if (!elements.rewardsContainer) return;
  
  elements.rewardsContainer.innerHTML = '';
  
  gameState.rewards.forEach(reward => {
    const rewardElement = document.createElement('div');
    rewardElement.classList.add('reward-item');
    
    // Reward image
    const imgElement = document.createElement('img');
    imgElement.src = reward.img;
    rewardElement.appendChild(imgElement);
    
    // Reward name
    const nameElement = document.createElement('div');
    nameElement.classList.add('reward-name');
    nameElement.textContent = reward.name;
    rewardElement.appendChild(nameElement);
    
    // Reward cost
    const costElement = document.createElement('div');
    costElement.classList.add('reward-cost');
    
    const beanIcon = document.createElement('img');
    beanIcon.src = './assets/svg/bean-coin.svg';
    costElement.appendChild(beanIcon);
    
    const costText = document.createElement('span');
    costText.textContent = reward.cost;
    costElement.appendChild(costText);
    
    rewardElement.appendChild(costElement);
    
    // Exchange button
    const exchangeButton = document.createElement('button');
    exchangeButton.classList.add('game-button');
    exchangeButton.style.width = '120px';
    exchangeButton.style.height = '40px';
    exchangeButton.style.marginTop = '10px';
    
    const buttonBg = document.createElement('img');
    buttonBg.src = './assets/svg/button.svg';
    buttonBg.classList.add('button-bg');
    exchangeButton.appendChild(buttonBg);
    
    const buttonText = document.createElement('span');
    buttonText.classList.add('button-text');
    buttonText.textContent = 'Exchange';
    buttonText.style.fontSize = '0.9rem';
    exchangeButton.appendChild(buttonText);
    
    // Add click event
    exchangeButton.addEventListener('click', (e) => {
      e.preventDefault();
      exchangeReward(reward);
    });
    
    rewardElement.appendChild(exchangeButton);
    
    elements.rewardsContainer.appendChild(rewardElement);
  });
}

// Exchange beans for a reward
function exchangeReward(reward) {
  if (gameState.beans < reward.cost) {
    alert('Không đủ đậu!');
    return;
  }
  
  // Deduct beans
  gameState.beans -= reward.cost;
  updateBeansDisplay();
  saveGameData();
  
  // Apply reward effect (in a real game, this would do more)
  alert(`Bạn nhận được: ${reward.name}!`);
  
  // For demo purposes, just show a confirmation
  if (reward.name === "Quay May Mắn") {
    showScreen(screens.luckySpin);
  }
}

// Spin the wheel
function spinWheel() {
  if (gameState.beans < config.spinRewardCost) {
    alert('Bạn cần ít nhất 50 đậu để quay!');
    return;
  }
  
  if (!elements.wheel || !elements.spinBtn) return;
  
  // Deduct beans
  gameState.beans -= config.spinRewardCost;
  updateBeansDisplay();
  saveGameData();
  
  // Disable spin button during animation
  elements.spinBtn.disabled = true;
  
  // Calculate the final position based on probabilities
  const rewardIndex = getRewardBasedOnProbability();
  
  // Calculate the final angle to land on the selected reward
  const segmentAngle = 360 / config.spinRewards.length;
  const segmentOffset = segmentAngle / 2; // Offset to point to middle of segment
  const spinCount = getRandomInt(5, 10); // Spin between 5-10 times for effect
  const finalAngle = spinCount * 360 + (rewardIndex * segmentAngle) + segmentOffset;
  
  // Animate the wheel
  elements.wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
  elements.wheel.style.transform = `rotate(${finalAngle}deg)`;
  
  // Get the reward
  setTimeout(() => {
    const reward = config.spinRewards[rewardIndex];
    applySpinReward(reward);
    
    // Reset wheel after a delay
    setTimeout(() => {
      elements.wheel.style.transition = 'none';
      elements.wheel.style.transform = 'rotate(0deg)';
      elements.spinBtn.disabled = false;
    }, 1000);
  }, 4000);
}

// Get reward index based on probability
function getRewardBasedOnProbability() {
  const random = Math.random();
  let cumulativeProbability = 0;
  
  for (let i = 0; i < config.spinRewards.length; i++) {
    cumulativeProbability += config.spinRewards[i].chance;
    if (random < cumulativeProbability) {
      return i;
    }
  }
  
  // Default to first reward if something goes wrong
  return 0;
}

// Apply the reward from the lucky spin
function applySpinReward(reward) {
  let message = '';
  
  switch (reward.type) {
    case 'beans':
      gameState.beans += reward.value;
      updateBeansDisplay();
      message = `Bạn đã thắng ${reward.value} đậu!`;
      break;
    case 'multiplier':
      message = `Bạn đã thắng bội số điểm ${reward.value}x cho lượt chơi tiếp theo!`;
      break;
    case 'time':
      message = `Bạn đã thắng thêm ${reward.value} giây cho lượt chơi tiếp theo!`;
      break;
    default:
      message = 'Chúc may mắn lần sau!';
  }
  
  saveGameData();
  alert(message);
}

// Helper function: Get random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create and update lives display
function updateLivesDisplay() {
  if (!elements.livesDisplay) return;
  
  // Clear existing hearts
  elements.livesDisplay.innerHTML = '';
  
  // Add baskets based on lives
  for (let i = 0; i < gameState.lives; i++) {
    const basket = document.createElement('img');
    basket.src = './assets/svg/mini-basket.svg';
    basket.alt = 'Mạng';
    basket.classList.add('life-icon');
    elements.livesDisplay.appendChild(basket);
  }
}

// Initialize the lucky wheel with segments
function initLuckyWheel() {
  if (!elements.wheel) return;
  
  const rewards = config.spinRewards;
  const segmentCount = rewards.length;
  const wheelDiameter = 300;
  const wheelRadius = wheelDiameter / 2;
  
  // Clear any existing content
  elements.wheel.innerHTML = '';
  
  // Create fortune wheel style with pegs and segments
  elements.wheel.style.position = 'relative';
  elements.wheel.style.width = `${wheelDiameter}px`;
  elements.wheel.style.height = `${wheelDiameter}px`;
  elements.wheel.style.borderRadius = '50%';
  elements.wheel.style.backgroundColor = '#FEF3C7';
  elements.wheel.style.border = '8px solid #7C2D12';
  elements.wheel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.1)';
  elements.wheel.style.overflow = 'hidden';
  
  // Create center circle
  const centerCircle = document.createElement('div');
  centerCircle.style.position = 'absolute';
  centerCircle.style.top = '50%';
  centerCircle.style.left = '50%';
  centerCircle.style.transform = 'translate(-50%, -50%)';
  centerCircle.style.width = '30px';
  centerCircle.style.height = '30px';
  centerCircle.style.borderRadius = '50%';
  centerCircle.style.backgroundColor = '#7C2D12';
  centerCircle.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
  centerCircle.style.zIndex = '5';
  elements.wheel.appendChild(centerCircle);
  
  // Create segments
  rewards.forEach((reward, index) => {
    const startAngle = (index / segmentCount) * 2 * Math.PI;
    const endAngle = ((index + 1) / segmentCount) * 2 * Math.PI;
    
    // Create segment
    const segment = document.createElement('div');
    segment.className = 'wheel-segment';
    segment.style.position = 'absolute';
    segment.style.top = '0';
    segment.style.left = '0';
    segment.style.width = '100%';
    segment.style.height = '100%';
    segment.style.clipPath = `path('M ${wheelRadius} ${wheelRadius} L ${wheelRadius + wheelRadius * Math.cos(startAngle)} ${wheelRadius + wheelRadius * Math.sin(startAngle)} A ${wheelRadius} ${wheelRadius} 0 0 1 ${wheelRadius + wheelRadius * Math.cos(endAngle)} ${wheelRadius + wheelRadius * Math.sin(endAngle)} Z')`;
    segment.style.backgroundColor = reward.color;
    elements.wheel.appendChild(segment);
    
    // Calculate position for text - middle of segment
    const midAngle = (startAngle + endAngle) / 2;
    const textDistance = wheelRadius * 0.65; // Position text at 65% from center
    const textX = wheelRadius + textDistance * Math.cos(midAngle);
    const textY = wheelRadius + textDistance * Math.sin(midAngle);
    
    // Create label
    const label = document.createElement('div');
    label.className = 'wheel-label';
    label.innerText = reward.name;
    label.style.position = 'absolute';
    label.style.left = `${textX}px`;
    label.style.top = `${textY}px`;
    label.style.transform = `translate(-50%, -50%) rotate(${midAngle + Math.PI/2}rad)`;
    label.style.color = 'white';
    label.style.fontWeight = 'bold';
    label.style.fontSize = '0.8rem';
    label.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.7)';
    label.style.zIndex = '3';
    label.style.width = 'max-content';
    elements.wheel.appendChild(label);
    
    // Add peg at edge of wheel
    const pegAngle = (index / segmentCount) * 2 * Math.PI;
    const pegX = wheelRadius + (wheelRadius - 5) * Math.cos(pegAngle);
    const pegY = wheelRadius + (wheelRadius - 5) * Math.sin(pegAngle);
    
    const peg = document.createElement('div');
    peg.className = 'wheel-peg';
    peg.style.position = 'absolute';
    peg.style.left = `${pegX}px`;
    peg.style.top = `${pegY}px`;
    peg.style.width = '10px';
    peg.style.height = '10px';
    peg.style.borderRadius = '50%';
    peg.style.backgroundColor = '#7C2D12';
    peg.style.transform = 'translate(-50%, -50%)';
    peg.style.zIndex = '4';
    peg.style.boxShadow = '0 0 2px rgba(0, 0, 0, 0.5)';
    elements.wheel.appendChild(peg);
  });
} 