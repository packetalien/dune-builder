// Tool Efficiency Calculator for Dune: Awakening
// Helps players compare tool costs vs gathering rates

class ToolEfficiencyCalculator {
    constructor() {
        // Tool specifications (estimated based on community data)
        this.tools = {
            mk5_cutteray: {
                name: "Mk5 Cutteray",
                repair_cost: {
                    spice_infused_plastanium: 15,
                    other_materials: 25
                },
                gathering_rate: {
                    deep_desert: 1.0, // base rate
                    hagga_basin: 1.2  // 20% faster in basin
                },
                durability: {
                    deep_desert: 0.6, // 40% faster decay
                    hagga_basin: 1.0  // normal decay
                }
            },
            mk6_cutteray: {
                name: "Mk6 Cutteray", 
                repair_cost: {
                    spice_infused_plastanium: 25,
                    other_materials: 40
                },
                gathering_rate: {
                    deep_desert: 1.5, // 50% faster than Mk5
                    hagga_basin: 1.8  // 80% faster than Mk5 base
                },
                durability: {
                    deep_desert: 0.5, // 50% faster decay
                    hagga_basin: 0.8  // 20% faster decay
                }
            }
        };

        // Resource gathering rates (estimated)
        this.resource_rates = {
            spice_infused_plastanium: {
                deep_desert: 8,  // units per hour
                hagga_basin: 12  // units per hour
            }
        };
    }

    // Calculate time to gather repair materials
    calculateRepairTime(tool, environment) {
        const repairCost = tool.repair_cost.spice_infused_plastanium;
        const gatherRate = this.resource_rates.spice_infused_plastanium[environment];
        
        return {
            hours: repairCost / gatherRate,
            minutes: (repairCost / gatherRate) * 60,
            efficiency: `You need ${repairCost} Spice-infused Plastanium, which takes ${(repairCost / gatherRate).toFixed(1)} hours to gather in ${environment}`
        };
    }

    // Calculate gathering efficiency over time
    calculateGatheringEfficiency(tool, environment, hours) {
        const baseRate = tool.gathering_rate[environment];
        const durability = tool.durability[environment];
        const repairTime = this.calculateRepairTime(tool, environment);
        
        // Calculate effective gathering time (total time - repair time)
        const effectiveHours = hours - repairTime.hours;
        const totalGathered = effectiveHours * baseRate;
        
        return {
            totalHours: hours,
            effectiveHours: effectiveHours,
            totalGathered: totalGathered,
            efficiency: totalGathered / hours, // units per hour including repair time
            repairFrequency: hours / (repairTime.hours / durability),
            toolLifespan: repairTime.hours / durability
        };
    }

    // Compare two tools
    compareTools(tool1, tool2, environment, hours) {
        const efficiency1 = this.calculateGatheringEfficiency(tool1, environment, hours);
        const efficiency2 = this.calculateGatheringEfficiency(tool2, environment, hours);
        
        const difference = efficiency2.totalGathered - efficiency1.totalGathered;
        const percentage = ((efficiency2.efficiency - efficiency1.efficiency) / efficiency1.efficiency) * 100;
        
        return {
            tool1: {
                name: tool1.name,
                ...efficiency1
            },
            tool2: {
                name: tool2.name,
                ...efficiency2
            },
            comparison: {
                difference: difference,
                percentage: percentage,
                recommendation: percentage > 0 ? 
                    `${tool2.name} is ${percentage.toFixed(1)}% more efficient` :
                    `${tool1.name} is ${Math.abs(percentage).toFixed(1)}% more efficient`
            }
        };
    }

    // Calculate break-even point
    calculateBreakEven(tool1, tool2, environment) {
        // Find hours where both tools have equal efficiency
        let hours = 1;
        let maxHours = 100;
        
        while (hours <= maxHours) {
            const efficiency1 = this.calculateGatheringEfficiency(tool1, environment, hours);
            const efficiency2 = this.calculateGatheringEfficiency(tool2, environment, hours);
            
            if (Math.abs(efficiency1.efficiency - efficiency2.efficiency) < 0.1) {
                return {
                    breakEvenHours: hours,
                    efficiency1: efficiency1.efficiency,
                    efficiency2: efficiency2.efficiency,
                    recommendation: hours < 24 ? 
                        `${tool2.name} becomes more efficient after ${hours} hours` :
                        `${tool1.name} remains more efficient for sessions under ${hours} hours`
                };
            }
            hours += 0.5;
        }
        
        return {
            breakEvenHours: null,
            recommendation: `${tool1.name} remains more efficient for practical session lengths`
        };
    }

    // Generate comprehensive analysis
    generateAnalysis(environment, sessionHours) {
        const mk5 = this.tools.mk5_cutteray;
        const mk6 = this.tools.mk6_cutteray;
        
        const comparison = this.compareTools(mk5, mk6, environment, sessionHours);
        const breakEven = this.calculateBreakEven(mk5, mk6, environment);
        
        return {
            environment: environment,
            sessionHours: sessionHours,
            comparison: comparison,
            breakEven: breakEven,
            recommendations: this.generateRecommendations(comparison, breakEven, environment)
        };
    }

    generateRecommendations(comparison, breakEven, environment) {
        const recommendations = [];
        
        if (comparison.comparison.percentage > 0) {
            recommendations.push(`✅ ${comparison.tool2.name} is more efficient for ${environment} gathering`);
        } else {
            recommendations.push(`✅ ${comparison.tool1.name} is more efficient for ${environment} gathering`);
        }
        
        if (breakEven.breakEvenHours && breakEven.breakEvenHours < 24) {
            recommendations.push(`⏰ ${breakEven.recommendation}`);
        }
        
        if (environment === 'deep_desert') {
            recommendations.push(`🌵 Deep Desert has faster tool decay - consider repair costs carefully`);
        } else {
            recommendations.push(`🏞️ Hagga Basin has slower decay - Mk6 may be more cost-effective`);
        }
        
        return recommendations;
    }
}

// Example usage and analysis
const calculator = new ToolEfficiencyCalculator();

// Analyze your specific use case
console.log("=== Tool Efficiency Analysis ===");
console.log("Your Mk6 Cutteray in Deep Desert with Assault Thopter");

const analysis = calculator.generateAnalysis('deep_desert', 4); // 4-hour session

console.log("\n📊 Analysis Results:");
console.log(`Environment: ${analysis.environment}`);
console.log(`Session Length: ${analysis.sessionHours} hours`);

console.log("\n🔧 Tool Comparison:");
console.log(`${analysis.comparison.tool1.name}:`);
console.log(`  - Total Gathered: ${analysis.comparison.tool1.totalGathered.toFixed(1)} units`);
console.log(`  - Efficiency: ${analysis.comparison.tool1.efficiency.toFixed(2)} units/hour`);
console.log(`  - Repair Time: ${analysis.comparison.tool1.toolLifespan.toFixed(1)} hours`);

console.log(`\n${analysis.comparison.tool2.name}:`);
console.log(`  - Total Gathered: ${analysis.comparison.tool2.totalGathered.toFixed(1)} units`);
console.log(`  - Efficiency: ${analysis.comparison.tool2.efficiency.toFixed(2)} units/hour`);
console.log(`  - Repair Time: ${analysis.comparison.tool2.toolLifespan.toFixed(1)} hours`);

console.log(`\n📈 Comparison: ${analysis.comparison.comparison.recommendation}`);
console.log(`⏰ Break-even: ${analysis.breakEven.recommendation}`);

console.log("\n💡 Recommendations:");
analysis.recommendations.forEach(rec => console.log(`  ${rec}`));

// Export for use in web interface
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToolEfficiencyCalculator;
} 