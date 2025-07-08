// Dune: Awakening Base Build Calculator
// Main JavaScript file

let buildingData = null; // To store the loaded JSON data
let currentBuild = []; // Array to store items with their quantities and calculated net power per unit

// --- DOM Elements Cache ---
// It's good practice to cache DOM elements that are frequently accessed or critical for the application.
let componentListDiv,
    selectedItemsListDiv,
    materialsSummaryListDiv,
    materialsSummaryDiscountedListDiv,
    netPowerSpan,
    totalPowerGeneratedSpan, // Added for caching
    totalPowerConsumedSpan,  // Added for caching
    powerWarningDiv;         // Added for caching

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Calculator Initializing...");

    // Cache all critical DOM elements
    componentListDiv = document.getElementById('component-list');
    selectedItemsListDiv = document.getElementById('selected-items-list');
    materialsSummaryListDiv = document.getElementById('materials-summary-list');
    materialsSummaryDiscountedListDiv = document.getElementById('materials-summary-discounted-list');
    netPowerSpan = document.getElementById('net-power');
    totalPowerGeneratedSpan = document.getElementById('total-power-generated');
    totalPowerConsumedSpan = document.getElementById('total-power-consumed');
    powerWarningDiv = document.getElementById('power-warning');

    // Validate that all critical DOM elements are found
    if (!componentListDiv || !selectedItemsListDiv || !materialsSummaryListDiv ||
        !materialsSummaryDiscountedListDiv || !netPowerSpan || !totalPowerGeneratedSpan ||
        !totalPowerConsumedSpan || !powerWarningDiv) {
        console.error("Critical DOM elements not found! Check your HTML IDs. Initialization halted.");
        // Optionally, display a user-friendly error message in the UI
        document.body.innerHTML = '<p class="error-message" style="padding: 20px; text-align: center;">Critical error: UI components missing. Cannot start calculator.</p>';
        return;
    }

    await loadBuildingData(); // Load data from JSON
    updateCurrentBuildPanel(); // Initial render of the (empty) build panel
    updateTotalsPanel({}, {}, 0, 0, 0); // Initial render of the (empty) totals panel

    // Setup search functionality
    const itemSearchInput = document.getElementById('item-search');
    if (itemSearchInput) {
        itemSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterComponentList(searchTerm);
        });
    } else {
        console.warn("'item-search' input not found. Search functionality will be unavailable.");
    }
});

// --- Data Loading ---
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
        if (componentListDiv) { // Check if componentListDiv exists before modifying
            componentListDiv.innerHTML = '<p class="error-message">Error loading building components. Please check console or try again later.</p>';
        }
    }
}

// --- UI Population and Filtering ---
/**
 * Populates the item selection panel with categories and items from buildingData.
 */
function populateItemSelectionPanel() {
    if (!buildingData || !componentListDiv) {
        console.error("Cannot populate item selection: data or component list div is missing.");
        return;
    }
    componentListDiv.innerHTML = ''; // Clear previous content

    // Group items by type
    const itemsByType = buildingData.reduce((acc, item) => {
        const type = item.type || "Unknown Type"; // Default type if missing
        acc[type] = acc[type] || [];
        acc[type].push(item);
        return acc;
    }, {});

    // Create UI for each type category
    Object.keys(itemsByType).sort().forEach(type => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'component-category';

        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = type.replace(/_/g, ' ');
        categoryDiv.appendChild(categoryTitle);

        const dropdown = document.createElement('select');
        dropdown.className = 'category-dropdown';
        // Sort items within the category by name
        itemsByType[type].sort((a, b) => a.name.localeCompare(b.name)).forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.tier ? `${item.name} (${item.tier})` : item.name;
            option.dataset.itemName = item.name.toLowerCase(); // For search
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
                // Deep clone item data to prevent modification of original buildingData
                handleAddItem(JSON.parse(JSON.stringify(item)));
            }
        };
        categoryDiv.appendChild(addButton);

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'item-details';
        categoryDiv.appendChild(detailsDiv);

        // Event listener to show item details when dropdown selection changes
        dropdown.addEventListener('change', () => displayItemDetails(dropdown, detailsDiv));

        // Trigger change event initially to show details of the first item if available
        if (dropdown.options.length > 0) {
            dropdown.selectedIndex = 0;
            dropdown.dispatchEvent(new Event('change'));
        }
        componentListDiv.appendChild(categoryDiv);
    });
}

/**
 * Displays details of the selected item from a dropdown in the provided detailsDiv.
 * @param {HTMLSelectElement} dropdown The dropdown element.
 * @param {HTMLDivElement} detailsDiv The div to display details in.
 */
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
        detailsDiv.innerHTML = detailsHTML;
    } else {
        detailsDiv.innerHTML = '<p>Select an item to see details.</p>';
    }
}

/**
 * Filters the component list based on the search term.
 * Hides/shows categories based on whether they contain matching items.
 * @param {string} searchTerm The term to filter by.
 */
function filterComponentList(searchTerm) {
    if (!componentListDiv) return;
    const categoryDivs = componentListDiv.querySelectorAll('.component-category');
    categoryDivs.forEach(div => {
        const options = div.querySelectorAll('.category-dropdown option');
        let categoryHasMatch = false;
        if (searchTerm === '') {
            categoryHasMatch = true; // Show all if search is empty
        } else {
            options.forEach(option => {
                // Use pre-stored dataset.itemName for search if available, otherwise textContent
                const itemName = option.dataset.itemName || option.textContent.toLowerCase();
                if (itemName.includes(searchTerm)) {
                    categoryHasMatch = true;
                }
            });
        }
        div.style.display = categoryHasMatch ? '' : 'none';
    });
}

// --- Build Management ---
/**
 * Adds an item to the current build or increments its quantity if already present.
 * @param {object} itemData The data of the item to add (should be a clone).
 */
function handleAddItem(itemData) {
    const existingItem = currentBuild.find(buildItem => buildItem.item.id === itemData.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Calculate net power for this specific item type once
        let itemNetPower = 0;
        if (itemData.power_consumption_w != null) { // Check for null or undefined
            itemNetPower -= Number(itemData.power_consumption_w);
        }
        if (itemData.output_production) {
            itemData.output_production.forEach(op => {
                if (op.item_id === "power" && op.quantity != null) { // Ensure quantity is valid
                    itemNetPower += Number(op.quantity);
                }
            });
        }
        currentBuild.push({
            item: itemData,
            quantity: 1,
            net_power_per_item: itemNetPower // Store pre-calculated net power per unit
        });
    }
    updateCurrentBuildPanel();
    calculateAndDisplayTotals();
}

/**
 * Updates the display of the current build panel.
 */
function updateCurrentBuildPanel() {
    if (!selectedItemsListDiv) return;
    selectedItemsListDiv.innerHTML = ''; // Clear previous content

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

        // Quantity Controls
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

/**
 * Changes the quantity of an item in the build, or removes it if quantity reaches zero or less.
 * @param {string} itemId The ID of the item to change.
 * @param {number} change The amount to change the quantity by (e.g., 1 or -1).
 */
function handleChangeQuantity(itemId, change) {
    const buildItemIndex = currentBuild.findIndex(bi => bi.item.id === itemId);
    if (buildItemIndex > -1) {
        currentBuild[buildItemIndex].quantity += change;
        if (currentBuild[buildItemIndex].quantity <= 0) {
            currentBuild.splice(buildItemIndex, 1); // Remove item from array
        }
        updateCurrentBuildPanel();
        calculateAndDisplayTotals();
    }
}

// --- Totals Calculation and Display ---
/**
 * Calculates total materials, power, and discounted costs, then updates the totals panel.
 */
function calculateAndDisplayTotals() {
    const totalMaterials = {};
    let totalPowerGenerated = 0;
    let totalPowerConsumed = 0;

    currentBuild.forEach(buildItem => {
        const { item, quantity, net_power_per_item } = buildItem; // Use pre-calculated net_power_per_item

        // Aggregate crafting materials
        if (item.crafting_materials) {
            item.crafting_materials.forEach(material => {
                totalMaterials[material.item_id] = (totalMaterials[material.item_id] || 0) + (material.quantity * quantity);
            });
        }

        // Aggregate power based on pre-calculated net_power_per_item
        // This simplifies logic here as power generation/consumption is already factored per unit
        // For total generated/consumed breakdown, we still need original data:
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

    // Calculate discounted materials
    const discountedTotalMaterials = {};
    for (const material in totalMaterials) {
        discountedTotalMaterials[material] = Math.ceil(totalMaterials[material] / 2);
    }

    updateTotalsPanel(totalMaterials, discountedTotalMaterials, totalPowerGenerated, totalPowerConsumed, totalNetPower);
}

/**
 * Updates the totals panel display with calculated values.
 * @param {object} totalMaterials Original total materials.
 * @param {object} discountedTotalMaterials Discounted total materials.
 * @param {number} totalPowerGenerated Total power generated.
 * @param {number} totalPowerConsumed Total power consumed.
 * @param {number} totalNetPower Net power.
 */
function updateTotalsPanel(totalMaterials, discountedTotalMaterials, totalPowerGenerated, totalPowerConsumed, totalNetPower) {
    // All DOM elements used here are already cached and checked in DOMContentLoaded

    // Display original materials
    materialsSummaryListDiv.innerHTML = Object.keys(totalMaterials).length === 0
        ? '<ul><li class="empty-totals-message">No materials required yet.</li></ul>'
        : '<ul>' + Object.entries(totalMaterials).map(([name, qty]) => `<li>${name.replace(/_/g, ' ')}: ${qty}</li>`).join('') + '</ul>';

    // Display discounted materials
    materialsSummaryDiscountedListDiv.innerHTML = Object.keys(discountedTotalMaterials).length === 0
        ? '<ul><li class="empty-totals-message">No materials to discount.</li></ul>'
        : '<ul>' + Object.entries(discountedTotalMaterials).map(([name, qty]) => `<li>${name.replace(/_/g, ' ')}: ${qty}</li>`).join('') + '</ul>';

    // Display power statistics
    totalPowerGeneratedSpan.textContent = totalPowerGenerated;
    totalPowerConsumedSpan.textContent = totalPowerConsumed;
    netPowerSpan.textContent = totalNetPower;

    // Update net power styling using CSS classes
    netPowerSpan.classList.remove('power-positive', 'power-negative', 'power-neutral');
    if (totalNetPower > 0) {
        netPowerSpan.classList.add('power-positive');
    } else if (totalNetPower < 0) {
        netPowerSpan.classList.add('power-negative');
    } else {
        netPowerSpan.classList.add('power-neutral');
    }

    // Display power warning message
    powerWarningDiv.innerHTML = totalNetPower < 0
        ? '<p class="warning-message">Warning: Insufficient power! Your build consumes more power than it generates.</p>'
        : '';
}
=======
// Dune: Awakening Base Build Calculator
// Main JavaScript file

let buildingData = null; // To store the loaded JSON data
let currentBuild = []; // Array to store items with quantities

// DOM Elements
let componentListDiv, selectedItemsListDiv, materialsSummaryListDiv, materialsSummaryDiscountedListDiv, netPowerSpan;

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Calculator Initializing...");
    componentListDiv = document.getElementById('component-list');
    selectedItemsListDiv = document.getElementById('selected-items-list');
    materialsSummaryListDiv = document.getElementById('materials-summary-list');
    materialsSummaryDiscountedListDiv = document.getElementById('materials-summary-discounted-list');
    netPowerSpan = document.getElementById('net-power');

    if (!componentListDiv || !selectedItemsListDiv || !materialsSummaryListDiv || !materialsSummaryDiscountedListDiv || !netPowerSpan) {
        console.error("Critical DOM elements not found! Check your HTML IDs.");
        return;
    }

    await loadBuildingData();
    updateCurrentBuildPanel();
    updateTotalsPanel({}, {}, 0, 0, 0);

    document.getElementById('item-search').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const categoryDivs = componentListDiv.querySelectorAll('.component-category');
        categoryDivs.forEach(div => {
            const options = div.querySelectorAll('.category-dropdown option');
            let hasMatch = false;
            options.forEach(option => {
                const itemName = option.textContent.toLowerCase();
                if (itemName.includes(searchTerm)) hasMatch = true;
            });
            div.style.display = hasMatch || searchTerm === '' ? '' : 'none';
        });
    });
});

async function loadBuildingData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        buildingData = await response.json();
        console.log("Building data loaded successfully:", buildingData);
        populateItemSelectionPanel();
    } catch (error) {
        console.error("Could not load building data:", error);
        componentListDiv.innerHTML = '<p class="error-message">Error loading building components. Please try again later.</p>';
    }
}

function populateItemSelectionPanel() {
    if (!buildingData || !componentListDiv) return;
    componentListDiv.innerHTML = '';
    const itemsByType = buildingData.reduce((acc, item) => {
        const type = item.type || "Unknown";
        acc[type] = acc[type] || [];
        acc[type].push(item);
        return acc;
    }, {});
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
            dropdown.appendChild(option);
        });
        categoryDiv.appendChild(dropdown);

        const addButton = document.createElement('button');
        addButton.className = 'add-item-btn';
        addButton.textContent = 'Add';
        addButton.onclick = () => {
            const selectedId = dropdown.value;
            const item = buildingData.find(i => i.id === selectedId);
            if (item) handleAddItem(JSON.parse(JSON.stringify(item)));
        };
        categoryDiv.appendChild(addButton);

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'item-details';
        categoryDiv.appendChild(detailsDiv);

        dropdown.addEventListener('change', () => {
            const selectedId = dropdown.value;
            const item = buildingData.find(i => i.id === selectedId);
            if (item) {
                detailsDiv.innerHTML = `<p>${item.description || 'No description available'}</p>`;
                if (item.crafting_materials?.length) {
                    detailsDiv.innerHTML += `<p><strong>Cost:</strong> ${item.crafting_materials.map(c => `${c.item_id.replace(/_/g, ' ')}: ${c.quantity}`).join(', ')}</p>`;
                }
            } else {
                detailsDiv.innerHTML = '';
            }
        });

        // Trigger change event initially to show details of the first item
        if (dropdown.options.length > 0) {
            dropdown.selectedIndex = 0;
            dropdown.dispatchEvent(new Event('change'));
        }

        componentListDiv.appendChild(categoryDiv);
    });
}

function handleAddItem(itemData) {
    const existingItem = currentBuild.find(buildItem => buildItem.item.id === itemData.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        let itemNetPower = 0;
        if (itemData.power_consumption_w !== null && itemData.power_consumption_w !== undefined) {
            itemNetPower -= itemData.power_consumption_w;
        }
        if (itemData.output_production) {
            itemData.output_production.forEach(op => {
                if (op.item_id === "power" && op.quantity) itemNetPower += op.quantity;
            });
        }
        currentBuild.push({
            item: itemData,
            quantity: 1,
            net_power_per_item: itemNetPower
        });
    }
    updateCurrentBuildPanel();
    calculateAndDisplayTotals();
}

function updateCurrentBuildPanel() {
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
            costEl.innerHTML = `<strong>Cost per unit:</strong> ${item.crafting_materials.map(c => `${c.item_id.replace(/_/g, ' ')}: ${c.quantity}`).join(', ')}`;
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
            powerEl.innerHTML = `<strong>Net Power per unit:</strong> ${buildItem.net_power_per_item > 0 ? '+' : ''}${buildItem.net_power_per_item} W`;
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

function handleChangeQuantity(itemId, change) {
    const buildItem = currentBuild.find(bi => bi.item.id === itemId);
    if (buildItem) {
        buildItem.quantity += change;
        if (buildItem.quantity <= 0) {
            currentBuild = currentBuild.filter(bi => bi.item.id !== itemId);
        }
        updateCurrentBuildPanel();
        calculateAndDisplayTotals();
    }
}

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
                if (op.item_id === "power") totalPowerGenerated += op.quantity * quantity;
            });
        }
        if (item.power_consumption_w !== null && item.power_consumption_w !== undefined) {
            totalPowerConsumed += item.power_consumption_w * quantity;
        }
    });
    const totalNetPower = totalPowerGenerated - totalPowerConsumed;
    const discountedTotalMaterials = {};
    for (const material in totalMaterials) {
        discountedTotalMaterials[material] = Math.ceil(totalMaterials[material] / 2);
    }
    updateTotalsPanel(totalMaterials, discountedTotalMaterials, totalPowerGenerated, totalPowerConsumed, totalNetPower);
}

function updateTotalsPanel(totalMaterials, discountedTotalMaterials, totalPowerGenerated, totalPowerConsumed, totalNetPower) {
    if (!materialsSummaryListDiv || !materialsSummaryDiscountedListDiv || !netPowerSpan) return;
    materialsSummaryListDiv.innerHTML = Object.keys(totalMaterials).length === 0
        ? '<ul><li class="empty-totals-message">No materials required yet.</li></ul>'
        : '<ul>' + Object.entries(totalMaterials).map(([name, qty]) => `<li>${name}: ${qty}</li>`).join('') + '</ul>';
    materialsSummaryDiscountedListDiv.innerHTML = Object.keys(discountedTotalMaterials).length === 0
        ? '<ul><li class="empty-totals-message">No materials to discount.</li></ul>'
        : '<ul>' + Object.entries(discountedTotalMaterials).map(([name, qty]) => `<li>${name}: ${qty}</li>`).join('') + '</ul>';
    const totalPowerGenEl = document.getElementById('total-power-generated');
    const totalPowerConEl = document.getElementById('total-power-consumed');
    const warningDiv = document.getElementById('power-warning');
    if (totalPowerGenEl) totalPowerGenEl.textContent = totalPowerGenerated;
    else console.error("'total-power-generated' element not found.");
    if (totalPowerConEl) totalPowerConEl.textContent = totalPowerConsumed;
    else console.error("'total-power-consumed' element not found.");
    netPowerSpan.textContent = totalNetPower;
    netPowerSpan.style.color = totalNetPower < 0 ? 'red' : totalNetPower > 0 ? 'green' : '';
    if (warningDiv) {
        warningDiv.innerHTML = totalNetPower < 0
            ? '<p class="warning-message">Warning: Insufficient power! Your build consumes more power than it generates.</p>'
            : '';
    } else {
        console.error("'power-warning' element not found.");
    }
}
