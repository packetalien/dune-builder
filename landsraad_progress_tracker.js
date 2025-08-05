// Landsraad Progress Tracker for Dune: Awakening
// Tracks individual progress and provides strategic insights

class LandsraadProgressTracker {
    constructor() {
        // Landsraad system data (based on community research)
        this.minorHouses = {
            torvold: {
                name: "House Torvold",
                objectives: [
                    "Kill 100 Scavengers",
                    "Deliver 500 Leap Suspensors", 
                    "Capture 10 Control Points",
                    "Craft 50 Advanced Weapons"
                ],
                rewards: {
                    700: "Basic Crafting Components",
                    2100: "Mk5 Schematics",
                    4200: "Advanced Materials",
                    7000: "Mk6 Schematics", 
                    14000: "Exclusive Armor Colors"
                }
            },
            harkonnen: {
                name: "House Harkonnen", 
                objectives: [
                    "Kill 150 Enemy Players",
                    "Deliver 750 Industrial Components",
                    "Control 15 Deep Desert Points",
                    "Craft 75 Heavy Weapons"
                ],
                rewards: {
                    700: "Harkonnen Materials",
                    2100: "Harkonnen Mk5 Schematics",
                    4200: "Harkonnen Advanced Components",
                    7000: "Harkonnen Mk6 Schematics",
                    14000: "Harkonnen Exclusive Colors"
                }
            },
            atreides: {
                name: "House Atreides",
                objectives: [
                    "Complete 200 Exploration Tasks",
                    "Deliver 600 Diplomatic Items",
                    "Establish 20 Trade Routes",
                    "Craft 60 Precision Weapons"
                ],
                rewards: {
                    700: "Atreides Materials",
                    2100: "Atreides Mk5 Schematics", 
                    4200: "Atreides Advanced Components",
                    7000: "Atreides Mk6 Schematics",
                    14000: "Atreides Exclusive Colors"
                }
            }
        };

        // Known decrees and their effects
        this.decrees = {
            choam_production: {
                name: "CHOAM Production Contract",
                effect: "Reduces crafting costs by 25%",
                impact: { crafting_cost_reduction: 0.25 }
            },
            melee_damage: {
                name: "+33% Melee Damage",
                effect: "Increases melee damage by 33%",
                impact: { melee_damage_boost: 0.33 }
            },
            landsraad_vendor: {
                name: "Access to Landsraad Armor Vendor",
                effect: "Unlocks exclusive armor vendor",
                impact: { vendor_access: true }
            },
            right_of_salvage: {
                name: "The Right of Salvage",
                effect: "Increases salvage yields by 50%",
                impact: { salvage_boost: 0.50 }
            },
            deep_desert_pvp: {
                name: "Deep Desert PvP Loss Penalty",
                effect: "Lose everything when defeated in Deep Desert PvP",
                impact: { pvp_loss_penalty: true }
            }
        };

        this.currentWeek = 1;
        this.userProgress = {};
    }

    // Parse game logs for progress data
    parseGameLogs(logData) {
        const progress = {};
        
        // Look for Landsraad-related log entries
        const landsraadPatterns = {
            objective_complete: /Landsraad objective completed: (.+)/,
            contribution_added: /Contribution points added: (\d+) to (.+)/,
            decree_voted: /Voted for decree: (.+)/,
            reward_claimed: /Claimed reward tier: (\d+) from (.+)/
        };

        logData.forEach(logEntry => {
            // Parse objective completions
            const objectiveMatch = logEntry.match(landsraadPatterns.objective_complete);
            if (objectiveMatch) {
                const objective = objectiveMatch[1];
                this.addObjectiveProgress(objective, 1);
            }

            // Parse contribution points
            const contributionMatch = logEntry.match(landsraadPatterns.contribution_added);
            if (contributionMatch) {
                const points = parseInt(contributionMatch[1]);
                const house = contributionMatch[2];
                this.addContributionPoints(house, points);
            }

            // Parse decree votes
            const decreeMatch = logEntry.match(landsraadPatterns.decree_voted);
            if (decreeMatch) {
                const decree = decreeMatch[1];
                this.recordDecreeVote(decree);
            }

            // Parse reward claims
            const rewardMatch = logEntry.match(landsraadPatterns.reward_claimed);
            if (rewardMatch) {
                const tier = parseInt(rewardMatch[1]);
                const house = rewardMatch[2];
                this.recordRewardClaim(house, tier);
            }
        });

        return progress;
    }

    // Add objective progress
    addObjectiveProgress(objective, amount = 1) {
        if (!this.userProgress.objectives) {
            this.userProgress.objectives = {};
        }
        
        if (!this.userProgress.objectives[objective]) {
            this.userProgress.objectives[objective] = 0;
        }
        
        this.userProgress.objectives[objective] += amount;
    }

    // Add contribution points to a house
    addContributionPoints(house, points) {
        if (!this.userProgress.houses) {
            this.userProgress.houses = {};
        }
        
        if (!this.userProgress.houses[house]) {
            this.userProgress.houses[house] = 0;
        }
        
        this.userProgress.houses[house] += points;
    }

    // Record decree vote
    recordDecreeVote(decree) {
        if (!this.userProgress.decreeVotes) {
            this.userProgress.decreeVotes = [];
        }
        
        this.userProgress.decreeVotes.push({
            decree: decree,
            timestamp: new Date().toISOString(),
            week: this.currentWeek
        });
    }

    // Record reward claim
    recordRewardClaim(house, tier) {
        if (!this.userProgress.claimedRewards) {
            this.userProgress.claimedRewards = {};
        }
        
        if (!this.userProgress.claimedRewards[house]) {
            this.userProgress.claimedRewards[house] = [];
        }
        
        this.userProgress.claimedRewards[house].push({
            tier: tier,
            timestamp: new Date().toISOString(),
            week: this.currentWeek
        });
    }

    // Get current progress summary
    getProgressSummary() {
        const summary = {
            week: this.currentWeek,
            houses: {},
            objectives: this.userProgress.objectives || {},
            decreeVotes: this.userProgress.decreeVotes || [],
            claimedRewards: this.userProgress.claimedRewards || {}
        };

        // Calculate house progress
        Object.keys(this.minorHouses).forEach(houseKey => {
            const house = this.minorHouses[houseKey];
            const points = this.userProgress.houses?.[houseKey] || 0;
            
            // Find current tier
            let currentTier = 0;
            let nextTier = null;
            
            Object.keys(house.rewards).forEach(tierPoints => {
                const tier = parseInt(tierPoints);
                if (points >= tier) {
                    currentTier = tier;
                } else if (!nextTier || tier < nextTier) {
                    nextTier = tier;
                }
            });

            summary.houses[houseKey] = {
                name: house.name,
                points: points,
                currentTier: currentTier,
                nextTier: nextTier,
                progressToNext: nextTier ? ((points - currentTier) / (nextTier - currentTier) * 100) : 100,
                availableRewards: this.getAvailableRewards(houseKey, points),
                claimedRewards: this.userProgress.claimedRewards?.[houseKey] || []
            };
        });

        return summary;
    }

    // Get available rewards for a house
    getAvailableRewards(houseKey, points) {
        const house = this.minorHouses[houseKey];
        const available = [];
        
        Object.keys(house.rewards).forEach(tierPoints => {
            const tier = parseInt(tierPoints);
            if (points >= tier) {
                available.push({
                    tier: tier,
                    reward: house.rewards[tierPoints],
                    claimed: this.isRewardClaimed(houseKey, tier)
                });
            }
        });
        
        return available;
    }

    // Check if reward is claimed
    isRewardClaimed(houseKey, tier) {
        const claimed = this.userProgress.claimedRewards?.[houseKey] || [];
        return claimed.some(claim => claim.tier === tier);
    }

    // Calculate efficiency metrics
    calculateEfficiency() {
        const summary = this.getProgressSummary();
        const efficiency = {
            totalPoints: 0,
            averagePointsPerDay: 0,
            mostEfficientHouse: null,
            recommendedFocus: null
        };

        // Calculate total points and find most efficient house
        let maxPoints = 0;
        Object.keys(summary.houses).forEach(houseKey => {
            const house = summary.houses[houseKey];
            efficiency.totalPoints += house.points;
            
            if (house.points > maxPoints) {
                maxPoints = house.points;
                efficiency.mostEfficientHouse = houseKey;
            }
        });

        // Calculate daily average (assuming 7 days per week)
        efficiency.averagePointsPerDay = efficiency.totalPoints / 7;

        // Recommend focus based on progress
        const recommendations = [];
        Object.keys(summary.houses).forEach(houseKey => {
            const house = summary.houses[houseKey];
            
            if (house.progressToNext < 50) {
                recommendations.push(`Focus on ${house.name} - ${house.progressToNext.toFixed(1)}% to next tier`);
            }
            
            if (house.points >= 14000) {
                recommendations.push(`${house.name} is maxed out - focus on other houses`);
            }
        });

        efficiency.recommendedFocus = recommendations;

        return efficiency;
    }

    // Simulate decree impact
    simulateDecreeImpact(decreeKey, currentState) {
        const decree = this.decrees[decreeKey];
        if (!decree) return null;

        const simulation = {
            decree: decree,
            currentState: currentState,
            impact: decree.impact,
            recommendations: []
        };

        // Generate recommendations based on decree impact
        if (decree.impact.crafting_cost_reduction) {
            simulation.recommendations.push(
                `Focus on expensive crafting projects during this decree`
            );
        }

        if (decree.impact.melee_damage_boost) {
            simulation.recommendations.push(
                `Prioritize melee combat objectives and PvP activities`
            );
        }

        if (decree.impact.salvage_boost) {
            simulation.recommendations.push(
                `Focus on salvage-heavy objectives and resource gathering`
            );
        }

        if (decree.impact.pvp_loss_penalty) {
            simulation.recommendations.push(
                `⚠️ Be extra careful in Deep Desert PvP - losses are permanent`
            );
        }

        return simulation;
    }

    // Export progress data for backup/sharing
    exportProgress() {
        return {
            timestamp: new Date().toISOString(),
            week: this.currentWeek,
            progress: this.userProgress,
            summary: this.getProgressSummary(),
            efficiency: this.calculateEfficiency()
        };
    }

    // Import progress data
    importProgress(data) {
        this.currentWeek = data.week || 1;
        this.userProgress = data.progress || {};
        return this.getProgressSummary();
    }
}

// Example usage
const tracker = new LandsraadProgressTracker();

// Simulate some progress
tracker.addContributionPoints('torvold', 1500);
tracker.addContributionPoints('harkonnen', 800);
tracker.addContributionPoints('atreides', 2200);

tracker.addObjectiveProgress('Kill 100 Scavengers', 25);
tracker.addObjectiveProgress('Deliver 500 Leap Suspensors', 100);

tracker.recordDecreeVote('choam_production');
tracker.recordRewardClaim('torvold', 700);

// Get analysis
const summary = tracker.getProgressSummary();
const efficiency = tracker.calculateEfficiency();

console.log("=== Landsraad Progress Analysis ===");
console.log(`Week: ${summary.week}`);

console.log("\n📊 House Progress:");
Object.keys(summary.houses).forEach(houseKey => {
    const house = summary.houses[houseKey];
    console.log(`${house.name}:`);
    console.log(`  Points: ${house.points}`);
    console.log(`  Current Tier: ${house.currentTier}`);
    console.log(`  Progress to Next: ${house.progressToNext.toFixed(1)}%`);
    console.log(`  Available Rewards: ${house.availableRewards.length}`);
});

console.log("\n📈 Efficiency Analysis:");
console.log(`Total Points: ${efficiency.totalPoints}`);
console.log(`Average per Day: ${efficiency.averagePointsPerDay.toFixed(1)}`);
console.log(`Most Efficient House: ${efficiency.mostEfficientHouse}`);

console.log("\n💡 Recommendations:");
efficiency.recommendedFocus.forEach(rec => console.log(`  ${rec}`));

// Export for use in web interface
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LandsraadProgressTracker;
} 