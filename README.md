# Dune: Awakening - Base Build Calculator

## Overview

This is a web-based calculator designed to help players of the game *Dune: Awakening* plan their base builds. It allows users to select various building components, see the total required crafting materials, and manage power consumption versus generation. The calculator also displays discounted material costs for building in the Deep Desert.

This tool aims to be a helpful resource for theorycrafting and optimizing base designs before committing resources in-game.

## Features

*   **Component Selection**: Browse and add available in-game building components (structures, crafting stations, utilities, etc.) to your build.
*   **Material Calculation**: Automatically calculates the total raw materials needed to construct all selected components.
*   **Deep Desert Discount**: Shows a separate calculation for material costs assuming the 50% discount (rounded up) for building in the Deep Desert.
*   **Power Management**:
    *   Tracks total power generated by components like wind turbines and generators.
    *   Tracks total power consumed by powered structures.
    *   Displays net power (generated - consumed) and warns if power is negative.
*   **Dynamic Build List**: View your current selection of components with individual costs, power stats, and operational notes.
*   **Quantity Adjustment**: Easily increase or decrease the quantity of each component in your build.
*   **Search Functionality**: Quickly find specific components using a search bar.
*   **Categorized Components**: Items are grouped by type (e.g., Crafting Station, Utility, Power) for easier navigation.
*   **Responsive Design**: Usable on various screen sizes, though primarily designed for desktop.

## How to Use

1.  **Open `index.html`**: Launch the `index.html` file in a web browser.
2.  **Browse Components**:
    *   The left panel ("Available Components") lists all building items categorized by type.
    *   Use the dropdown within each category to see available items.
    *   Selecting an item will display its description and crafting cost per unit below the dropdown.
    *   Use the "Search items..." input field at the top of this panel to filter components by name.
3.  **Add to Build**:
    *   Once an item is selected in a dropdown, click the "Add" button next to it. This will add one unit of the item to the "Current Build" panel.
4.  **Manage Current Build**:
    *   The center panel ("Current Build") displays all items you've added, their quantities, cost per unit, net power per unit, and any operational notes.
    *   Use the `+` and `-` buttons next to each item to adjust its quantity. Setting quantity to 0 or less will remove the item.
5.  **View Totals**:
    *   The right panel ("Totals") shows the aggregated results:
        *   **Required Materials (Original Cost)**: Total raw materials needed for your current build.
        *   **Deep Desert Discount**: Total materials if built with the 50% discount.
        *   **Power Overview**: Total power generated, consumed, and the net power. A warning will appear if your net power is negative.

## Data Structure (`data.json`)

All item data is stored in `data.json`. Each item is an object with the following structure:

```json
{
  "id": "unique_item_identifier", // e.g., "refinery_ore_small_iron"
  "name": "Display Name",         // e.g., "Small Ore Refinery"
  "type": "Category",              // e.g., "Crafting Station", "Utility", "Power"
  "tier": "Item Tier",             // e.g., "Iron", "Steel", "Plastanium"
  "description": "In-game description or relevant info.",
  "crafting_station": "Where it's crafted", // e.g., "Placeables Tab (Construction Tool)"
  "crafting_materials": [          // Array of materials to build one unit
    {
      "item_id": "material_id",    // e.g., "salvaged_metal"
      "quantity": 10
    }
  ],
  "power_consumption_w": 50,      // Power consumed in Watts (null if none)
  "output_production": [           // Array of outputs (e.g., power generation, resource production)
    {
      "item_id": "output_type",    // e.g., "power", "water"
      "quantity": 75,
      "rate_per_hour": "W"       // Unit, e.g., "W", "ml" (null if not applicable)
    }
  ],
  "fuel_type": "Type of fuel if any", // e.g., "Fuel Cell", "Filter" (null if none)
  "operational_notes": "Any important notes about its use."
}
```

## How to Update Data

To add new items, update existing ones, or correct data:

1.  **Edit `data.json`**: Open the `data.json` file in a text editor.
2.  **Modify Entries**:
    *   To add a new item, copy an existing item's structure, paste it as a new object within the main array `[]`, and modify its values accordingly. Ensure the `id` is unique.
    *   To update an item, find its entry by `id` and change the necessary fields.
3.  **Save Changes**: Save the `data.json` file.
4.  **Reload Calculator**: Refresh `index.html` in your browser to see the changes.

**Important Considerations for `data.json`**:
*   `id` values should be unique and preferably use `snake_case`.
*   `item_id` within `crafting_materials` and `output_production` should correspond to existing material names or defined outputs (like "power").
*   `power_consumption_w` should be a number (or `null`).
*   `output_production` an array; for power generators, ensure an entry like `{"item_id": "power", "quantity": X, "rate_per_hour": "W"}`.

## Potential Future Enhancements

*   Saving/Loading builds (e.g., using LocalStorage or exporting/importing JSON).
*   More detailed filtering options for components (e.g., by tier, by resource produced).
*   Visual indicators for item tiers or types.
*   Direct link to external game wikis or data sites for items.
*   User-configurable discount rates.

## Disclaimer

This tool is based on community-gathered data and information available for *Dune: Awakening*. Game balance, crafting recipes, and item statistics can change with game updates. Always verify critical information with the latest in-game data or official sources if precise accuracy is paramount.

The Deep Desert discount is assumed to be 50% rounded up, but this mechanic may also be subject to change.
