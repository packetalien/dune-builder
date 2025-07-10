// Dune: Awakening Base Build Calculator
// Main JavaScript file for handling UI interactions, material calculations, power, and water

// Global variables to store data and current build
let buildingData = null; // Stores loaded JSON data
let currentBuild = []; // Tracks selected items, quantities, and net power

// Cache DOM elements on initialization
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Calculator Initializing...");

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

    // Load building data
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

    // Event listeners for water calculator modal
    document.getElementById('open-water-calculator').addEventListener('click', () => {
        document.getElementById('water-calculator-modal').style.display = 'block';
        updateWaterCalculator(currentBuild);
    });
    document.getElementById('close-water-calculator').addEventListener('click', () => {
        document.getElementById('water-calculator-modal').style.display = 'none';
    });

    // Event listener for export build report
    document.getElementById('export-build').addEventListener('click', () => {
        const report = generateBuildReport();
        const blob = new Blob([report], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'build_report.txt';
        link.click();
    });
});

// Load building data from data.json
async function loadBuildingData() {
    try {
        const response = await fetch('data.json');
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
function calculateAndDisplayTotals() {
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
    const { netWater, totalStorage } = calculateWaterTotals(currentBuild);
    summaryDiv.innerHTML = `
        <p><strong>Total Materials:</strong> ${Object.keys(totalMaterials).length}</p>
        <p><strong>Net Power:</strong> ${totalNetPower} W</p>
        <p><strong>Net Water:</strong> ${netWater} ml/hour</p>
        <p><strong>Total Water Storage:</strong> ${totalStorage} ml</p>
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

// NEW: Calculate water production and storage from data.json
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

// NEW: Update water calculator modal with production and storage
function updateWaterCalculator(buildItems) {
    const waterTotalsDiv = document.getElementById('water-totals');
    const { totalWaterProduced, totalWaterConsumed, netWater, totalStorage } = calculateWaterTotals(buildItems);
    
    waterTotalsDiv.innerHTML = totalWaterProduced === 0 && totalStorage === 0
        ? '<p class="warning-message">No water-producing or storage items in your build.</p>'
        : `
            <p>Total Water Produced: ${totalWaterProduced} ml/hour</p>
            <p>Total Water Consumed: ${totalWaterConsumed} ml/hour</p>
            <p class="${netWater >= 0 ? 'net-positive' : 'net-negative'}">Net Water: ${netWater} ml/hour</p>
            <p>Total Water Storage: ${totalStorage} ml</p>
        `;
}

// Generate build report for export
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