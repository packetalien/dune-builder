// Enhanced Water Calculator for Dune: Awakening
// Includes faction-specific mechanics and environmental factors

class EnhancedWaterCalculator {
    constructor() {
        this.faction = 'neutral'; // harkonnen, atreides, fremen, neutral
        this.environment = 'standard'; // deep_desert, oasis, standard
        this.playerCount = 1;
        this.plantSystems = 0;
        this.industrialStations = 0;
    }

    // Set faction for water efficiency calculations
    setFaction(faction) {
        this.faction = faction;
    }

    // Set environment for production modifiers
    setEnvironment(environment) {
        this.environment = environment;
    }

    // Calculate water production from build items
    calculateWaterProduction(buildItems) {
        let totalProduction = 0;
        let productionDetails = [];

        buildItems.forEach(({ item, quantity }) => {
            if (item.output_production) {
                item.output_production.forEach(op => {
                    if (op.item_id === "water" && op.quantity != null) {
                        const baseProduction = Number(op.quantity) * quantity;
                        const environmentalModifier = this.getEnvironmentalModifier();
                        const factionModifier = this.getFactionProductionModifier();
                        
                        const adjustedProduction = baseProduction * environmentalModifier * factionModifier;
                        totalProduction += adjustedProduction;

                        productionDetails.push({
                            item: item.name,
                            quantity: quantity,
                            baseProduction: baseProduction,
                            environmentalModifier: environmentalModifier,
                            factionModifier: factionModifier,
                            adjustedProduction: adjustedProduction
                        });
                    }
                });
            }
        });

        return {
            totalProduction: totalProduction,
            details: productionDetails
        };
    }

    // Calculate water storage capacity
    calculateWaterStorage(buildItems) {
        let totalStorage = 0;
        let storageDetails = [];

        buildItems.forEach(({ item, quantity }) => {
            if (item.water_capacity) {
                const storage = Number(item.water_capacity) * quantity;
                totalStorage += storage;
                storageDetails.push({
                    item: item.name,
                    quantity: quantity,
                    capacity: storage
                });
            }
        });

        return {
            totalStorage: totalStorage,
            details: storageDetails
        };
    }

    // Calculate water consumption
    calculateWaterConsumption(buildItems) {
        const basePlayerConsumption = 100; // ml/hour per player
        const plantConsumption = 50; // ml/hour per plant system
        const industrialConsumption = 200; // ml/hour per industrial station

        let totalConsumption = 0;
        let consumptionDetails = [];

        // Player consumption
        const playerConsumption = basePlayerConsumption * this.playerCount;
        totalConsumption += playerConsumption;
        consumptionDetails.push({
            type: 'Player Hydration',
            quantity: this.playerCount,
            rate: basePlayerConsumption,
            total: playerConsumption
        });

        // Plant system consumption
        const plantTotal = plantConsumption * this.plantSystems;
        totalConsumption += plantTotal;
        if (this.plantSystems > 0) {
            consumptionDetails.push({
                type: 'Plant Growth Systems',
                quantity: this.plantSystems,
                rate: plantConsumption,
                total: plantTotal
            });
        }

        // Industrial station consumption
        const industrialTotal = industrialConsumption * this.industrialStations;
        totalConsumption += industrialTotal;
        if (this.industrialStations > 0) {
            consumptionDetails.push({
                type: 'Industrial Processes',
                quantity: this.industrialStations,
                rate: industrialConsumption,
                total: industrialTotal
            });
        }

        // Apply faction efficiency modifier
        const factionEfficiency = this.getFactionConsumptionModifier();
        const adjustedConsumption = totalConsumption * factionEfficiency;

        return {
            totalConsumption: adjustedConsumption,
            baseConsumption: totalConsumption,
            factionEfficiency: factionEfficiency,
            details: consumptionDetails
        };
    }

    // Get environmental production modifier
    getEnvironmentalModifier() {
        switch (this.environment) {
            case 'deep_desert':
                return 0.7; // 30% reduction in deep desert
            case 'oasis':
                return 1.3; // 30% increase near oasis
            case 'standard':
            default:
                return 1.0; // Normal production
        }
    }

    // Get faction production modifier
    getFactionProductionModifier() {
        switch (this.faction) {
            case 'atreides':
                return 1.2; // 20% production bonus
            case 'fremen':
                return 1.1; // 10% production bonus
            case 'harkonnen':
            case 'neutral':
            default:
                return 1.0; // Normal production
        }
    }

    // Get faction consumption modifier
    getFactionConsumptionModifier() {
        switch (this.faction) {
            case 'harkonnen':
                return 0.8; // 20% less consumption
            case 'fremen':
                return 0.6; // 40% less consumption
            case 'atreides':
                return 1.2; // 20% more consumption
            case 'neutral':
            default:
                return 1.0; // Normal consumption
        }
    }

    // Calculate net water balance
    calculateNetWater(buildItems) {
        const production = this.calculateWaterProduction(buildItems);
        const storage = this.calculateWaterStorage(buildItems);
        const consumption = this.calculateWaterConsumption(buildItems);

        const netWater = production.totalProduction - consumption.totalConsumption;
        const sustainabilityHours = storage.totalStorage / Math.abs(netWater);

        return {
            production: production,
            storage: storage,
            consumption: consumption,
            netWater: netWater,
            sustainabilityHours: netWater > 0 ? Infinity : sustainabilityHours,
            isSustainable: netWater >= 0,
            efficiency: netWater >= 0 ? 'Sustainable' : 'Deficit'
        };
    }

    // Generate detailed water report
    generateWaterReport(buildItems) {
        const waterBalance = this.calculateNetWater(buildItems);
        
        let report = `=== WATER BALANCE REPORT ===\n`;
        report += `Faction: ${this.faction.toUpperCase()}\n`;
        report += `Environment: ${this.environment.replace('_', ' ').toUpperCase()}\n`;
        report += `Players: ${this.playerCount}\n\n`;

        report += `PRODUCTION:\n`;
        waterBalance.production.details.forEach(detail => {
            report += `- ${detail.item} (x${detail.quantity}): ${detail.adjustedProduction.toFixed(0)} ml/hour\n`;
        });
        report += `Total Production: ${waterBalance.production.totalProduction.toFixed(0)} ml/hour\n\n`;

        report += `STORAGE:\n`;
        waterBalance.storage.details.forEach(detail => {
            report += `- ${detail.item} (x${detail.quantity}): ${detail.capacity.toFixed(0)} ml\n`;
        });
        report += `Total Storage: ${waterBalance.storage.totalStorage.toFixed(0)} ml\n\n`;

        report += `CONSUMPTION:\n`;
        waterBalance.consumption.details.forEach(detail => {
            report += `- ${detail.type}: ${detail.total.toFixed(0)} ml/hour\n`;
        });
        report += `Total Consumption: ${waterBalance.consumption.totalConsumption.toFixed(0)} ml/hour\n\n`;

        report += `BALANCE:\n`;
        report += `Net Water: ${waterBalance.netWater.toFixed(0)} ml/hour\n`;
        report += `Status: ${waterBalance.efficiency}\n`;
        
        if (!waterBalance.isSustainable) {
            report += `Sustainability: ${waterBalance.sustainabilityHours.toFixed(1)} hours\n`;
        }

        return report;
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedWaterCalculator;
} 