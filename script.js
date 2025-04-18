let bananas = 0;
let cps = 0; // bananas per second
let upgrades = {
 cpsincrease: { cost: 10, cps: 1, count: 0},
 grandma: { cost: 100, cps: 1, count: 0 },
 farm: { cost: 250, cps: 5, count: 0 },
 factory: { cost: 500, cps: 10, count: 0 },
 bakery: { cost: 750, cps: 20, count: 0 },
 mine: { cost: 1000, cps: 40, count: 0 },
 spaceship: { cost: 5000, cps: 100, count: 0 },
 timeMachine: { cost: 20000, cps: 250, count: 0 },
 portal: { cost: 100000, cps: 500, count: 0 },
 dimensionRift: { cost: 500000, cps: 1000, count: 0 },
 bananauniverse: { cost: 750000, cps: 5000, count: 0 }
};


function clickBanana() {
 bananas++;
 updateDisplay();
}


function updateDisplay() {
 document.getElementById("banana-count").textContent = `Bananas: ${bananas.toLocaleString()}`;
 document.getElementById("cps").textContent = `CPS: ${cps}`;
  // Update the upgrade counts
 for (let upgrade in upgrades) {
   document.getElementById(`${upgrade}-count`).textContent = `${upgrades[upgrade].count} Bought`;
 }
}


function buyUpgrade(upgrade, quantity = 1) {
 let totalCost = 0;
 let canAfford = true;


 // Calculate the total cost for the specified quantity
 for (let i = 0; i < quantity; i++) {
   let nextCost = Math.floor(upgrades[upgrade].cost * Math.pow(1.2, upgrades[upgrade].count + i)); // Increase cost by 20% for each upgrade bought
   totalCost += nextCost;
   if (totalCost > bananas) {
     canAfford = false;
     break;
   }
 }


 if (canAfford) {
   bananas -= totalCost;


   // Add the quantity of upgrades and increase CPS
   for (let i = 0; i < quantity; i++) {
     upgrades[upgrade].count += 1;
     cps += upgrades[upgrade].cps;
     upgrades[upgrade].cost = Math.floor(upgrades[upgrade].cost * 1.2); // Update cost for the next purchase (after each upgrade)
   }


   updateDisplay();
   updateUpgradeButtons();  // Update the button text with new cost
 } else {
   alert(`Not enough bananas to buy ${quantity} of ${capitalize(upgrade)}!`);
 }
}


// Function to update upgrade buttons with the latest cost
function updateUpgradeButtons() {
 for (let upgrade in upgrades) {
   let button = document.getElementById(`${upgrade}-button`);
   if (button) {
     button.textContent = `${capitalize(upgrade)} - Cost: ${upgrades[upgrade].cost.toLocaleString()} Bananas`;
   }
 }
}


// Function to capitalize the first letter of an upgrade name
function capitalize(str) {
 return str.charAt(0).toUpperCase() + str.slice(1);
}


function resetGame() {
 bananas = 0;
 cps = 0;
 for (let upgrade in upgrades) {
   upgrades[upgrade].count = 0;
   upgrades[upgrade].cost = 10; // Reset costs to starting values
 }
 updateDisplay();
 updateUpgradeButtons();
}



