// Dune: Awakening Base Build Calculator - Node.js Edition
// Updated to work with Express.js backend API

// Global variables to store data and current build
let buildingData = null; // Stores loaded JSON data
let currentBuild = []; // Tracks selected items, quantities, and net power
let waterCalculator = null; // Enhanced water calculator instance

// Cache DOM elements on initialization
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Calculator Initializing...");

    // Initialize enhanced water calculator
    waterCalculator = new EnhancedWaterCalculator();

    // Cache critical DOM elements
    const componentListDiv = document.getElementById('component-list');
    const selectedItemsListDiv = document.getElementById('selected-items-list');
    const materialsSummaryListDiv = document.getElementById('materials-summary-list');
    const materialsSummaryDiscountedListDiv = document.getElementById('materials-summary-discounted-list');
    const netPowerSpan = document.getElementById('net-power');
    const totalPowerGeneratedSpan = document.getElementById('total-power-generated');
    const totalPowerConsumedSpan = document.getElementById('total-power-consumed');
    const powerWarningDiv = document.getElementById('power-warning');

    // Validate DOM elements
    if (!componentListDiv || !selectedItemsListDiv || !materialsSummaryListDiv ||
        !materialsSummaryDiscountedListDiv || !netPowerSpan || !totalPowerGeneratedSpan ||
        !totalPowerConsumedSpan || !powerWarningDiv) {
        console.error("Critical DOM elements not found! Check HTML IDs.");
        document.body.innerHTML = '<p class="error-message" style="padding: 20px; text-align: center;">Critical error: UI components missing. Cannot start calculator.</p>';
        return;
    }

    // Load building data from API
    await loadBuildingData();
    updateCurrentBuildPanel();
    updateTotalsPanel({}, {}, 0, 0, 0);

    // Search functionality with debounce
    const itemSearchInput = document.getElementById('item-search');
    if (itemSearchInput) {
        let searchTimeout;
        itemSearchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => filterComponentList(this.value), 300);
        });
    } else {
        console.warn("'item-search' input not found. Search unavailable.");
    }

    // Event listeners for enhanced water calculator modal
    document.getElementById('open-water-calculator').addEventListener('click', () => {
        document.getElementById('water-calculator-modal').style.display = 'block';
        updateEnhancedWaterCalculator(currentBuild);
    });
    document.getElementById('close-water-calculator').addEventListener('click', () => {
        document.getElementById('water-calculator-modal').style.display = 'none';
    });

    // Event listener for export build report
    document.getElementById('export-build').addEventListener('click', () => {
        exportBuildReport();
    });

    // Initialize faction and environment selectors
    initializeWaterCalculatorControls();
});

// Initialize water calculator controls
function initializeWaterCalculatorControls() {
    // Add faction selector to water calculator modal
    const waterModal = document.getElementById('water-calculator-modal');
    if (waterModal) {
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'water-calculator-controls';
        controlsDiv.innerHTML = `
            <div class="control-group">
                <label for="faction-select">Faction:</label>
                <select id="faction-select">
                    <option value="neutral">Neutral</option>
                    <option value="harkonnen">Harkonnen</option>
                    <option value="atreides">Atreides</option>
                    <option value="fremen">Fremen</option>
                </select>
            </div>
            <div class="control-group">
                <label for="environment-select">Environment:</label>
                <select id="environment-select">
                    <option value="standard">Standard</option>
                    <option value="deep_desert">Deep Desert</option>
                    <option value="oasis">Oasis</option>
                </select>
            </div>
            <div class="control-group">
                <label for="player-count">Players:</label>
                <input type="number" id="player-count" value="1" min="1" max="10">
            </div>
            <div class="control-group">
                <label for="plant-systems">Plant Systems:</label>
                <input type="number" id="plant-systems" value="0" min="0" max="20">
            </div>
            <div class="control-group">
                <label for="industrial-stations">Industrial Stations:</label>
                <input type="number" id="industrial-stations" value="0" min="0" max="20">
            </div>
        `;
        
        // Insert controls before the water totals div
        const waterTotalsDiv = document.getElementById('water-totals');
        waterModal.insertBefore(controlsDiv, waterTotalsDiv);

        // Add event listeners for controls
        document.getElementById('faction-select').addEventListener('change', (e) => {
            waterCalculator.setFaction(e.target.value);
            updateEnhancedWaterCalculator(currentBuild);
        });

        document.getElementById('environment-select').addEventListener('change', (e) => {
            waterCalculator.setEnvironment(e.target.value);
            updateEnhancedWaterCalculator(currentBuild);
        });

        document.getElementById('player-count').addEventListener('input', (e) => {
            waterCalculator.playerCount = parseInt(e.target.value) || 1;
            updateEnhancedWaterCalculator(currentBuild);
        });

        document.getElementById('plant-systems').addEventListener('input', (e) => {
            waterCalculator.plantSystems = parseInt(e.target.value) || 0;
            updateEnhancedWaterCalculator(currentBuild);
        });

        document.getElementById('industrial-stations').addEventListener('input', (e) => {
            waterCalculator.industrialStations = parseInt(e.target.value) || 0;
            updateEnhancedWaterCalculator(currentBuild);
        });
    }
}

// Load building data from API
async function loadBuildingData() {
    try {
        const response = await fetch('/api/items');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        buildingData = await response.json();
        console.log("Building data loaded successfully:", buildingData.length, "items.");
        populateItemSelectionPanel();
    } catch (error) {
        console.error("Could not load building data:", error);
        const componentListDiv = document.getElementById('component-list');
        if (componentListDiv) {
            componentListDiv.innerHTML = '<p class="error-message">Error loading building components. Please check console or try again later.</p>';
        }
    }
}

// Populate item selection panel with categorized dropdowns
function populateItemSelectionPanel() {
    const componentListDiv = document.getElementById('component-list');
    if (!buildingData || !componentListDiv) {
        console.error("Cannot populate item selection: data or component list div missing.");
        return;
    }
    componentListDiv.innerHTML = '';

    // Group items by type
    const itemsByType = buildingData.reduce((acc, item) => {
        const type = item.type || "Unknown Type";
        acc[type] = acc[type] || [];
        acc[type].push(item);
        return acc;
    }, {});

    // Create dropdowns for each type
    Object.keys(itemsByType).sort().forEach(type => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'component-category';

        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = type.replace(/_/g, ' ');
        categoryDiv.appendChild(categoryTitle);

        const dropdown = document.createElement('select');
        dropdown.className = 'category-dropdown';
        itemsByType[type].sort((a, b) => a.name.localeCompare(b.name)).forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.tier ? `${item.name} (${item.tier})` : item.name;
            option.dataset.itemName = item.name.toLowerCase();
            dropdown.appendChild(option);
        });
        categoryDiv.appendChild(dropdown);

        const addButton = document.createElement('button');
        addButton.className = 'add-item-btn';
        addButton.textContent = 'Add';
        addButton.onclick = () => {
            const selectedId = dropdown.value;
            const item = buildingData.find(i => i.id === selectedId);
            if (item) {
                handleAddItem(JSON.parse(JSON.stringify(item)));
            }
        };
        categoryDiv.appendChild(addButton);

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'item-details';
        categoryDiv.appendChild(detailsDiv);

        dropdown.addEventListener('change', () => displayItemDetails(dropdown, detailsDiv));

        if (dropdown.options.length > 0) {
            dropdown.selectedIndex = 0;
            dropdown.dispatchEvent(new Event('change'));
        }
        componentListDiv.appendChild(categoryDiv);
    });
}

// Display details for selected item
function displayItemDetails(dropdown, detailsDiv) {
    const selectedId = dropdown.value;
    const item = buildingData.find(i => i.id === selectedId);
    if (item) {
        let detailsHTML = `<p>${item.description || 'No description available.'}</p>`;
        if (item.crafting_materials?.length) {
            const materialsString = item.crafting_materials
                .map(c => `${(c.item_id || "Unknown Material").replace(/_/g, ' ')}: ${c.quantity}`)
                .join(', ');
            detailsHTML += `<p><strong>Cost:</strong> ${materialsString}</p>`;
        }
        if (item.health) detailsHTML += `<p><strong>Health:</strong> ${item.health}</p>`;
        if (item.inventory_slot_capacity) detailsHTML += `<p><strong>Slot Capacity:</strong> ${item.inventory_slot_capacity}</p>`;
        if (item.water_capacity) detailsHTML += `<p><strong>Water Capacity:</strong> ${item.water_capacity} ml</p>`;
        detailsDiv.innerHTML = detailsHTML;
    } else {
        detailsDiv.innerHTML = '<p>Select an item to see details.</p>';
    }
}

// Filter component list based on search term
function filterComponentList(searchTerm) {
    const componentListDiv = document.getElementById('component-list');
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    const categoryDivs = componentListDiv.querySelectorAll('.component-category');

    categoryDivs.forEach(div => {
        const options = div.querySelectorAll('.category-dropdown option');
        let categoryHasMatch = lowerSearchTerm === '';
        options.forEach(option => {
            const itemName = option.dataset.itemName || option.textContent.toLowerCase();
            if (itemName.includes(lowerSearchTerm)) {
                categoryHasMatch = true;
            }
        });
        div.style.display = categoryHasMatch ? '' : 'none';
    });
}

// Add item to current build
function handleAddItem(itemData) {
    const existingItem = currentBuild.find(buildItem => buildItem.item.id === itemData.id);
    let itemNetPower = 0;
    if (itemData.power_consumption_w != null) {
        itemNetPower -= Number(itemData.power_consumption_w);
    }
    if (itemData.output_production) {
        itemData.output_production.forEach(op => {
            if (op.item_id === "power" && op.quantity != null) {
                itemNetPower += Number(op.quantity);
            }
        });
    }
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        currentBuild.push({
            item: itemData,
            quantity: 1,
            net_power_per_item: itemNetPower
        });
    }
    updateCurrentBuildPanel();
    calculateAndDisplayTotals();
}

// Update current build panel
function updateCurrentBuildPanel() {
    const selectedItemsListDiv = document.getElementById('selected-items-list');
    if (!selectedItemsListDiv) return;
    selectedItemsListDiv.innerHTML = '';

    if (currentBuild.length === 0) {
        selectedItemsListDiv.innerHTML = '<p class="empty-build-message">Your build is currently empty. Add components from the left panel.</p>';
        return;
    }

    currentBuild.forEach(buildItem => {
        const item = buildItem.item;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'selected-item';
        itemDiv.dataset.itemId = item.id;

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'selected-item-details';

        const nameEl = document.createElement('p');
        nameEl.textContent = `${item.name} (x${buildItem.quantity})`;
        detailsDiv.appendChild(nameEl);

        if (item.crafting_materials?.length) {
            const costEl = document.createElement('p');
            costEl.className = 'item-crafting-materials';
            const materialsString = item.crafting_materials
                .map(c => `${(c.item_id || "N/A").replace(/_/g, ' ')}: ${c.quantity}`)
                .join(', ');
            costEl.innerHTML = `<strong>Cost per unit:</strong> ${materialsString}`;
            detailsDiv.appendChild(costEl);
        } else {
            const costEl = document.createElement('p');
            costEl.className = 'item-crafting-materials';
            costEl.innerHTML = `<strong>Cost:</strong> N/A`;
            detailsDiv.appendChild(costEl);
        }

        if (buildItem.net_power_per_item !== undefined) {
            const powerEl = document.createElement('p');
            powerEl.className = 'item-power';
            const netPowerDisplay = buildItem.net_power_per_item > 0 ? `+${buildItem.net_power_per_item}` : buildItem.net_power_per_item;
            powerEl.innerHTML = `<strong>Net Power per unit:</strong> ${netPowerDisplay} W`;
            detailsDiv.appendChild(powerEl);
        }

        if (item.operational_notes) {
            const notesEl = document.createElement('p');
            notesEl.className = 'item-operational-notes';
            notesEl.innerHTML = `<strong>Notes:</strong> ${item.operational_notes}`;
            detailsDiv.appendChild(notesEl);
        }
        itemDiv.appendChild(detailsDiv);

        const quantityControls = document.createElement('div');
        quantityControls.className = 'quantity-controls';
        const decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = '-';
        decreaseBtn.onclick = () => handleChangeQuantity(item.id, -1);
        quantityControls.appendChild(decreaseBtn);

        const quantitySpan = document.createElement('span');
        quantitySpan.textContent = buildItem.quantity;
        quantityControls.appendChild(quantitySpan);

        const increaseBtn = document.createElement('button');
        increaseBtn.textContent = '+';
        increaseBtn.onclick = () => handleChangeQuantity(item.id, 1);
        quantityControls.appendChild(increaseBtn);
        itemDiv.appendChild(quantityControls);

        selectedItemsListDiv.appendChild(itemDiv);
    });
}

// Adjust item quantity in build
function handleChangeQuantity(itemId, change) {
    const buildItemIndex = currentBuild.findIndex(bi => bi.item.id === itemId);
    if (buildItemIndex > -1) {
        currentBuild[buildItemIndex].quantity += change;
        if (currentBuild[buildItemIndex].quantity <= 0) {
            currentBuild.splice(buildItemIndex, 1);
        }
        updateCurrentBuildPanel();
        calculateAndDisplayTotals();
    }
}

// Calculate and display totals for materials and power
async function calculateAndDisplayTotals() {
    try {
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ buildItems: currentBuild })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const totals = await response.json();
        updateTotalsPanel(
            totals.materials, 
            totals.discountedMaterials, 
            totals.power.generated, 
            totals.power.consumed, 
            totals.power.net
        );
    } catch (error) {
        console.error("Error calculating totals:", error);
        // Fallback to client-side calculation
        const totalMaterials = {};
        let totalPowerGenerated = 0;
        let totalPowerConsumed = 0;

        currentBuild.forEach(buildItem => {
            const { item, quantity } = buildItem;

            if (item.crafting_materials) {
                item.crafting_materials.forEach(material => {
                    totalMaterials[material.item_id] = (totalMaterials[material.item_id] || 0) + (material.quantity * quantity);
                });
            }

            if (item.output_production) {
                item.output_production.forEach(op => {
                    if (op.item_id === "power" && op.quantity != null) {
                        totalPowerGenerated += Number(op.quantity) * quantity;
                    }
                });
            }
            if (item.power_consumption_w != null) {
                totalPowerConsumed += Number(item.power_consumption_w) * quantity;
            }
        });

        const totalNetPower = totalPowerGenerated - totalPowerConsumed;
        const discountedTotalMaterials = {};
        for (const material in totalMaterials) {
            discountedTotalMaterials[material] = Math.ceil(totalMaterials[material] / 2);
        }

        updateTotalsPanel(totalMaterials, discountedTotalMaterials, totalPowerGenerated, totalPowerConsumed, totalNetPower);
    }
}

// Update totals panel with summary, materials, and power
function updateTotalsPanel(totalMaterials, discountedTotalMaterials, totalPowerGenerated, totalPowerConsumed, totalNetPower) {
    const materialsSummaryListDiv = document.getElementById('materials-summary-list');
    const materialsSummaryDiscountedListDiv = document.getElementById('materials-summary-discounted-list');
    const totalPowerGeneratedSpan = document.getElementById('total-power-generated');
    const totalPowerConsumedSpan = document.getElementById('total-power-consumed');
    const netPowerSpan = document.getElementById('net-power');
    const powerWarningDiv = document.getElementById('power-warning');
    const totalsPanel = document.getElementById('total-materials-panel');

    // Add summary section
    let summaryDiv = totalsPanel.querySelector('.summary');
    if (!summaryDiv) {
        summaryDiv = document.createElement('div');
        summaryDiv.className = 'summary';
        totalsPanel.insertBefore(summaryDiv, totalsPanel.querySelector('.totals-container'));
    }
    
    // Use enhanced water calculator if available
    let waterInfo = { netWater: 0, totalStorage: 0 };
    if (waterCalculator) {
        const waterBalance = waterCalculator.calculateNetWater(currentBuild);
        waterInfo = {
            netWater: waterBalance.netWater,
            totalStorage: waterBalance.storage.totalStorage
        };
    } else {
        waterInfo = calculateWaterTotals(currentBuild);
    }
    
    summaryDiv.innerHTML = `
        <p><strong>Total Materials:</strong> ${Object.keys(totalMaterials).length}</p>
        <p><strong>Net Power:</strong> ${totalNetPower} W</p>
        <p><strong>Net Water:</strong> ${waterInfo.netWater.toFixed(0)} ml/hour</p>
        <p><strong>Total Water Storage:</strong> ${waterInfo.totalStorage.toFixed(0)} ml</p>
    `;

    // Display materials (non-categorized for simplicity)
    materialsSummaryListDiv.innerHTML = Object.keys(totalMaterials).length === 0
        ? '<ul><li class="empty-totals-message">No materials required yet.</li></ul>'
        : '<ul>' + Object.entries(totalMaterials).map(([name, qty]) => `<li title="Farm ${name} in Hagga Rift">${name.replace(/_/g, ' ')}: ${qty}</li>`).join('') + '</ul>';

    materialsSummaryDiscountedListDiv.innerHTML = Object.keys(discountedTotalMaterials).length === 0
        ? '<ul><li class="empty-totals-message">No materials to discount.</li></ul>'
        : '<ul>' + Object.entries(discountedTotalMaterials).map(([name, qty]) => `<li title="Farm ${name} in Hagga Rift">${name.replace(/_/g, ' ')}: ${qty}</li>`).join('') + '</ul>';

    totalPowerGeneratedSpan.textContent = totalPowerGenerated;
    totalPowerConsumedSpan.textContent = totalPowerConsumed;
    netPowerSpan.textContent = totalNetPower;

    netPowerSpan.classList.remove('power-positive', 'power-negative', 'power-neutral');
    if (totalNetPower > 0) {
        netPowerSpan.classList.add('power-positive');
    } else if (totalNetPower < 0) {
        netPowerSpan.classList.add('power-negative');
    } else {
        netPowerSpan.classList.add('power-neutral');
    }

    powerWarningDiv.innerHTML = totalNetPower < 0
        ? '<p class="warning-message">Warning: Insufficient power! Your build consumes more power than it generates.</p>'
        : '';
}

// Calculate water production and storage from data.json (fallback)
function calculateWaterTotals(buildItems) {
    let totalWaterProduced = 0;
    let totalStorage = 0;

    buildItems.forEach(({ item, quantity }) => {
        // Handle water production from output_production
        if (item.output_production) {
            item.output_production.forEach(op => {
                if (op.item_id === "water" && op.quantity != null) {
                    totalWaterProduced += Number(op.quantity) * quantity;
                }
            });
        }
        // Handle water storage from water_capacity
        if (item.water_capacity) {
            totalStorage += Number(item.water_capacity) * quantity;
        }
    });

    // No water consumption data in current data.json, so assume 0
    const totalWaterConsumed = 0;
    const netWater = totalWaterProduced - totalWaterConsumed;
    return { totalWaterProduced, totalWaterConsumed, netWater, totalStorage };
}

// Update enhanced water calculator modal
function updateEnhancedWaterCalculator(buildItems) {
    if (!waterCalculator) {
        console.error("Enhanced water calculator not initialized");
        return;
    }

    const waterTotalsDiv = document.getElementById('water-totals');
    const waterBalance = waterCalculator.calculateNetWater(buildItems);
    
    if (waterBalance.production.totalProduction === 0 && waterBalance.storage.totalStorage === 0) {
        waterTotalsDiv.innerHTML = '<p class="warning-message">No water-producing or storage items in your build.</p>';
        return;
    }

    let html = `
        <div class="water-balance-section">
            <h4>Production</h4>
            ${waterBalance.production.details.map(detail => 
                `<p>- ${detail.item} (x${detail.quantity}): ${detail.adjustedProduction.toFixed(0)} ml/hour</p>`
            ).join('')}
            <p><strong>Total Production:</strong> ${waterBalance.production.totalProduction.toFixed(0)} ml/hour</p>
        </div>

        <div class="water-balance-section">
            <h4>Storage</h4>
            ${waterBalance.storage.details.map(detail => 
                `<p>- ${detail.item} (x${detail.quantity}): ${detail.capacity.toFixed(0)} ml</p>`
            ).join('')}
            <p><strong>Total Storage:</strong> ${waterBalance.storage.totalStorage.toFixed(0)} ml</p>
        </div>

        <div class="water-balance-section">
            <h4>Consumption</h4>
            ${waterBalance.consumption.details.map(detail => 
                `<p>- ${detail.type}: ${detail.total.toFixed(0)} ml/hour</p>`
            ).join('')}
            <p><strong>Total Consumption:</strong> ${waterBalance.consumption.totalConsumption.toFixed(0)} ml/hour</p>
        </div>

        <div class="water-balance-section">
            <h4>Balance</h4>
            <p class="${waterBalance.isSustainable ? 'net-positive' : 'net-negative'}">
                <strong>Net Water:</strong> ${waterBalance.netWater.toFixed(0)} ml/hour
            </p>
            <p><strong>Status:</strong> ${waterBalance.efficiency}</p>
            ${!waterBalance.isSustainable ? 
                `<p><strong>Sustainability:</strong> ${waterBalance.sustainabilityHours.toFixed(1)} hours</p>` : 
                '<p><strong>Sustainability:</strong> Infinite (surplus)</p>'
            }
        </div>
    `;

    waterTotalsDiv.innerHTML = html;
}

// Export build report using API
async function exportBuildReport() {
    try {
        const buildName = prompt('Enter a name for your build (optional):', 'my_build') || 'build';
        
        const response = await fetch('/api/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                buildItems: currentBuild,
                buildName: buildName
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${buildName}_report.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error exporting build report:", error);
        // Fallback to client-side export
        const report = generateBuildReport();
        const blob = new Blob([report], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'build_report.txt';
        link.click();
    }
}

// Generate build report for export (fallback)
function generateBuildReport() {
    const totalMaterials = calculateTotalMaterials(currentBuild);
    const { totalPowerGenerated, totalPowerConsumed, totalNetPower } = calculatePowerTotals(currentBuild);
    const { totalWaterProduced, totalWaterConsumed, netWater, totalStorage } = calculateWaterTotals(currentBuild);

    return `
        Build Summary:
        Total Materials: ${Object.keys(totalMaterials).length}
        Net Power: ${totalNetPower} W
        Net Water: ${netWater} ml/hour
        Total Water Storage: ${totalStorage} ml
        Materials:
        ${Object.entries(totalMaterials).map(([m, q]) => `${m}: ${q}`).join('\n')}
    `;
}

// Calculate total materials for report
function calculateTotalMaterials(buildItems) {
    const totalMaterials = {};
    buildItems.forEach(({ item, quantity }) => {
        if (item.crafting_materials) {
            item.crafting_materials.forEach(material => {
                totalMaterials[material.item_id] = (totalMaterials[material.item_id] || 0) + (material.quantity * quantity);
            });
        }
    });
    return totalMaterials;
}

// Calculate power totals for report
function calculatePowerTotals(buildItems) {
    let totalPowerGenerated = 0;
    let totalPowerConsumed = 0;

    buildItems.forEach(({ item, quantity }) => {
        if (item.output_production) {
            item.output_production.forEach(op => {
                if (op.item_id === "power") {
                    totalPowerGenerated += op.quantity * quantity;
                }
            });
        }
        if (item.power_consumption_w) {
            totalPowerConsumed += item.power_consumption_w * quantity;
        }
    });

    const totalNetPower = totalPowerGenerated - totalPowerConsumed;
    return { totalPowerGenerated, totalPowerConsumed, totalNetPower };
} 