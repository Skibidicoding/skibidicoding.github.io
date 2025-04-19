// Game state
let bananas = 0;
let totalBananas = 0;
let cps = 0; // bananas per second
let clickValue = 1;
let handClicked = 0;
let gameStartTime = Date.now();
let lastSaveTime = Date.now();
let achievements = {};

// Upgrades configuration
let upgrades = {
  cpsincrease: { cost: 10, baseCost: 10, cps: 1, count: 0, description: "Plants that grow bananas slowly." },
  grandma: { cost: 100, baseCost: 100, cps: 1, count: 0, description: "A nice grandma to bake banana bread." },
  farm: { cost: 250, baseCost: 250, cps: 5, count: 0, description: "Grows bananas in large quantities." },
  factory: { cost: 500, baseCost: 500, cps: 10, count: 0, description: "Mass production of bananas." },
  bakery: { cost: 750, baseCost: 750, cps: 20, count: 0, description: "Bakes delicious banana goods." },
  mine: { cost: 1000, baseCost: 1000, cps: 40, count: 0, description: "Dig deep for rare golden bananas." },
  spaceship: { cost: 5000, baseCost: 5000, cps: 100, count: 0, description: "Imports bananas from space." },
  timeMachine: { cost: 20000, baseCost: 20000, cps: 250, count: 0, description: "Brings bananas from the past." },
  portal: { cost: 100000, baseCost: 100000, cps: 500, count: 0, description: "Opens gateways to banana dimensions." },
  dimensionRift: { cost: 500000, baseCost: 500000, cps: 1000, count: 0, description: "Tears in reality that leak banana energy." },
  bananauniverse: { cost: 750000, baseCost: 750000, cps: 5000, count: 0, description: "An entire universe made of bananas." }
};

// Achievement definitions
const achievementList = {
  banana10: { name: "Banana Novice", description: "Collect 10 bananas", requirement: () => totalBananas >= 10, earned: false },
  banana100: { name: "Banana Enthusiast", description: "Collect 100 bananas", requirement: () => totalBananas >= 100, earned: false },
  banana1000: { name: "Banana Expert", description: "Collect 1,000 bananas", requirement: () => totalBananas >= 1000, earned: false },
  banana10000: { name: "Banana Master", description: "Collect 10,000 bananas", requirement: () => totalBananas >= 10000, earned: false },
  banana100000: { name: "Banana Millionaire", description: "Collect 100,000 bananas", requirement: () => totalBananas >= 100000, earned: false },
  banana1000000: { name: "Banana Billionaire", description: "Collect 1,000,000 bananas", requirement: () => totalBananas >= 1000000, earned: false },
  click100: { name: "Clicker", description: "Click the banana 100 times", requirement: () => handClicked >= 100, earned: false },
  click1000: { name: "Click Master", description: "Click the banana 1,000 times", requirement: () => handClicked >= 1000, earned: false },
  cps100: { name: "Banana Factory", description: "Reach 100 bananas per second", requirement: () => cps >= 100, earned: false },
  cps1000: { name: "Banana Empire", description: "Reach 1,000 bananas per second", requirement: () => cps >= 1000, earned: false },
  upgrade10: { name: "Collector", description: "Own 10 of any upgrade", requirement: () => Object.values(upgrades).some(upgrade => upgrade.count >= 10), earned: false },
  upgrade100: { name: "Hoarder", description: "Own 100 of any upgrade", requirement: () => Object.values(upgrades).some(upgrade => upgrade.count >= 100), earned: false }
};

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
  // Load game if saved data exists
  loadGame();
  
  // Add event listener for clicking the banana
  document.getElementById('banana-btn').addEventListener('click', clickBanana);
  
  // Start the game loop
  setInterval(gameLoop, 1000);
  
  // Auto-save every minute
  setInterval(saveGame, 60000);
  
  // Check achievements every 5 seconds
  setInterval(checkAchievements, 5000);
  
  // Update display immediately
  updateDisplay();
});

// Main game loop (runs every second)
function gameLoop() {
  // Add bananas based on CPS
  bananas += cps;
  totalBananas += cps;
  
  // Update playtime
  updatePlayTime();
  
  // Update display
  updateDisplay();
}

// Click the banana
function clickBanana() {
  bananas += clickValue;
  totalBananas += clickValue;
  handClicked++;
  
  // Create a click particle
  createClickParticle(event);
  
  // Pulse effect on the banana
  const bananaImg = document.getElementById('banana-img');
  bananaImg.classList.add('pulse');
  setTimeout(() => {
    bananaImg.classList.remove('pulse');
  }, 500);
  
  updateDisplay();
}

// Create a floating number particle when clicking
function createClickParticle(event) {
  const particles = document.getElementById('click-particles');
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.textContent = '+' + clickValue;
  
  // Calculate position relative to the banana image
  const rect = document.getElementById('banana-img').getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  
  particles.appendChild(particle);
  
  // Remove the particle after animation completes
  setTimeout(() => {
    particles.removeChild(particle);
  }, 1000);
}

// Buy an upgrade
function buyUpgrade(upgrade, quantity = 1) {
  // Check if the upgrade exists
  if (!upgrades[upgrade]) return;
  
  let totalCost = 0;
  let actualQuantity = 0;
  
  // Calculate how many upgrades we can actually afford
  for (let i = 0; i < quantity; i++) {
    const nextCost = Math.floor(upgrades[upgrade].baseCost * Math.pow(1.15, upgrades[upgrade].count + i));
    
    if (bananas >= totalCost + nextCost) {
      totalCost += nextCost;
      actualQuantity++;
    } else {
      break;
    }
  }
  
  // If we can't afford any, show a message
  if (actualQuantity === 0) {
    showMessage(`Not enough bananas to buy ${upgrade}!`);
    return;
  }
  
  // Purchase the upgrades
  bananas -= totalCost;
  upgrades[upgrade].count += actualQuantity;
  cps += upgrades[upgrade].cps * actualQuantity;
  
  // Update the cost for next purchase
  upgrades[upgrade].cost = Math.floor(upgrades[upgrade].baseCost * Math.pow(1.15, upgrades[upgrade].count));
  
  // Show a message if we bought less than requested
  if (actualQuantity < quantity && actualQuantity > 0) {
    showMessage(`Bought ${actualQuantity} ${capitalize(upgrade)}s!`);
  }
  
  updateDisplay();
  checkAchievements();
}

// Update all display elements
function updateDisplay() {
  // Update banana count and CPS
  document.getElementById('banana-count').textContent = formatNumber(Math.floor(bananas));
  document.getElementById('cps').textContent = formatNumber(cps);
  
  // Update statistics
  document.getElementById('total-bananas').textContent = formatNumber(Math.floor(totalBananas));
  document.getElementById('bananas-per-click').textContent = formatNumber(clickValue);
  document.getElementById('hand-clicked').textContent = formatNumber(handClicked);
  
  // Update upgrade counts and costs
  for (const upgrade in upgrades) {
    const countElement = document.getElementById(`${upgrade}-count`);
    const buttonElement = document.getElementById(`${upgrade}-button`);
    
    if (countElement) {
      countElement.textContent = formatNumber(upgrades[upgrade].count);
    }
    
    if (buttonElement) {
      const costSpan = buttonElement.querySelector('.cost');
      if (costSpan) {
        costSpan.textContent = formatNumber(upgrades[upgrade].cost);
      }
      
      // Visual indicator if affordable
      if (bananas >= upgrades[upgrade].cost) {
        buttonElement.classList.add('affordable');
      } else {
        buttonElement.classList.remove('affordable');
      }
    }
  }
}

// Format large numbers with commas
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

// Capitalize the first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Save the game to localStorage
function saveGame() {
  const saveData = {
    bananas: bananas,
    totalBananas: totalBananas,
    cps: cps,
    clickValue: clickValue,
    handClicked: handClicked,
    upgrades: upgrades,
    achievements: achievementList,
    gameStartTime: gameStartTime,
    saveTime: Date.now()
  };
  
  localStorage.setItem('bananaClickerSave', JSON.stringify(saveData));
  showMessage('Game saved!');
  lastSaveTime = Date.now();
}

// Load the game from localStorage
function loadGame() {
  const saveData = localStorage.getItem('bananaClickerSave');
  
  if (saveData) {
    const data = JSON.parse(saveData);
    
    bananas = data.bananas || 0;
    totalBananas = data.totalBananas || 0;
    cps = data.cps || 0;
    clickValue = data.clickValue || 1;
    handClicked = data.handClicked || 0;
    gameStartTime = data.gameStartTime || Date.now();
    
    // Load upgrades
    if (data.upgrades) {
      for (const upgrade in data.upgrades) {
        if (upgrades[upgrade]) {
          upgrades[upgrade].count = data.upgrades[upgrade].count || 0;
          upgrades[upgrade].cost = Math.floor(upgrades[upgrade].baseCost * Math.pow(1.15, upgrades[upgrade].count));
        }
      }
    }
    
    // Load achievements
    if (data.achievements) {
      for (const achievement in data.achievements) {
        if (achievementList[achievement]) {
          achievementList[achievement].earned = data.achievements[achievement].earned || false;
        }
      }
    }
    
    updateDisplay();
    showMessage('Game loaded!');
  }
}

// Confirm reset
function confirmReset() {
  document.getElementById('reset-modal').style.display = 'flex';
}

// Hide reset modal
function hideResetModal() {
  document.getElementById('reset-modal').style.display = 'none';
}

// Reset the game
function resetGame() {
  bananas = 0;
  totalBananas = 0;
  cps = 0;
  clickValue = 1;
  handClicked = 0;
  gameStartTime = Date.now();
  
  // Reset all upgrades
  for (const upgrade in upgrades) {
    upgrades[upgrade].count = 0;
    upgrades[upgrade].cost = upgrades[upgrade].baseCost;
  }
  
  // Reset all achievements
  for (const achievement in achievementList) {
    achievementList[achievement].earned = false;
  }
  
  updateDisplay();
  hideResetModal();
  showMessage('Game reset!');
  
  // Update localStorage
  saveGame();
}

// Check for achievements
function checkAchievements() {
  for (const id in achievementList) {
    const achievement = achievementList[id];
    
    // Check if achievement is not yet earned and its requirement is met
    if (!achievement.earned && achievement.requirement()) {
      achievement.earned = true;
      showAchievement(achievement.name, achievement.description);
    }
  }
}

// Show achievement popup
function showAchievement(name, description) {
  const popup = document.getElementById('achievement-popup');
  const message = document.getElementById('achievement-message');
  
  message.textContent = description;
  popup.classList.add('show');
  
  // Hide popup after 5 seconds
  setTimeout(() => {
    popup.classList.remove('show');
  }, 5000);
}

// Show a temporary message (for future use)
function showMessage(text) {
  console.log(text); // For now, just log to console
}

// Update play time display
function updatePlayTime() {
  const now = Date.now();
  const timePlayed = Math.floor((now - gameStartTime) / 60000); // Convert to minutes
  
  let timeDisplay = '';
  if (timePlayed < 60) {
    timeDisplay = `${timePlayed} minutes`;
  } else {
    const hours = Math.floor(timePlayed / 60);
    const minutes = timePlayed % 60;
    timeDisplay = `${hours} hours, ${minutes} minutes`;
  }
  
  document.getElementById('play-time').textContent = timeDisplay;
}