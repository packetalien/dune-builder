const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
app.use(compression());
app.use(cors());
app.use(morgan('combined'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API Routes
app.get('/api/items', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8');
        const items = JSON.parse(data);
        res.json(items);
    } catch (error) {
        console.error('Error loading items:', error);
        res.status(500).json({ error: 'Failed to load items' });
    }
});

app.get('/api/items/search', async (req, res) => {
    try {
        const { q } = req.query;
        const data = await fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8');
        const items = JSON.parse(data);
        
        if (!q) {
            return res.json(items);
        }
        
        const searchTerm = q.toLowerCase();
        const filteredItems = items.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.type.toLowerCase().includes(searchTerm) ||
            (item.description && item.description.toLowerCase().includes(searchTerm))
        );
        
        res.json(filteredItems);
    } catch (error) {
        console.error('Error searching items:', error);
        res.status(500).json({ error: 'Failed to search items' });
    }
});

app.get('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8');
        const items = JSON.parse(data);
        
        const item = items.find(item => item.id === id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        res.json(item);
    } catch (error) {
        console.error('Error loading item:', error);
        res.status(500).json({ error: 'Failed to load item' });
    }
});

// Calculate build totals
app.post('/api/calculate', (req, res) => {
    try {
        const { buildItems } = req.body;
        
        if (!Array.isArray(buildItems)) {
            return res.status(400).json({ error: 'Invalid build data' });
        }
        
        const totals = calculateBuildTotals(buildItems);
        res.json(totals);
    } catch (error) {
        console.error('Error calculating totals:', error);
        res.status(500).json({ error: 'Failed to calculate totals' });
    }
});

// Generate build report
app.post('/api/export', (req, res) => {
    try {
        const { buildItems, buildName = 'build' } = req.body;
        
        if (!Array.isArray(buildItems)) {
            return res.status(400).json({ error: 'Invalid build data' });
        }
        
        const report = generateBuildReport(buildItems, buildName);
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="${buildName}_report.txt"`);
        res.send(report);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

// Helper functions
function calculateBuildTotals(buildItems) {
    const totalMaterials = {};
    let totalPowerGenerated = 0;
    let totalPowerConsumed = 0;
    let totalWaterProduced = 0;
    let totalWaterStorage = 0;

    buildItems.forEach(({ item, quantity }) => {
        // Calculate materials
        if (item.crafting_materials) {
            item.crafting_materials.forEach(material => {
                totalMaterials[material.item_id] = (totalMaterials[material.item_id] || 0) + (material.quantity * quantity);
            });
        }

        // Calculate power
        if (item.output_production) {
            item.output_production.forEach(op => {
                if (op.item_id === "power" && op.quantity != null) {
                    totalPowerGenerated += Number(op.quantity) * quantity;
                }
                if (op.item_id === "water" && op.quantity != null) {
                    totalWaterProduced += Number(op.quantity) * quantity;
                }
            });
        }
        
        if (item.power_consumption_w != null) {
            totalPowerConsumed += Number(item.power_consumption_w) * quantity;
        }

        // Calculate water storage
        if (item.water_capacity) {
            totalWaterStorage += Number(item.water_capacity) * quantity;
        }
    });

    const totalNetPower = totalPowerGenerated - totalPowerConsumed;
    const discountedTotalMaterials = {};
    
    for (const material in totalMaterials) {
        discountedTotalMaterials[material] = Math.ceil(totalMaterials[material] / 2);
    }

    return {
        materials: totalMaterials,
        discountedMaterials: discountedTotalMaterials,
        power: {
            generated: totalPowerGenerated,
            consumed: totalPowerConsumed,
            net: totalNetPower
        },
        water: {
            produced: totalWaterProduced,
            storage: totalWaterStorage
        }
    };
}

function generateBuildReport(buildItems, buildName) {
    const totals = calculateBuildTotals(buildItems);
    
    let report = `Dune: Awakening - Build Report\n`;
    report += `Build Name: ${buildName}\n`;
    report += `Generated: ${new Date().toISOString()}\n\n`;
    
    report += `SUMMARY:\n`;
    report += `Total Components: ${buildItems.length}\n`;
    report += `Total Materials: ${Object.keys(totals.materials).length}\n`;
    report += `Net Power: ${totals.power.net} W\n`;
    report += `Water Production: ${totals.water.produced} ml/hour\n`;
    report += `Water Storage: ${totals.water.storage} ml\n\n`;
    
    report += `COMPONENTS:\n`;
    buildItems.forEach(({ item, quantity }) => {
        report += `- ${item.name} (x${quantity})\n`;
        if (item.crafting_materials) {
            const materials = item.crafting_materials
                .map(m => `${m.item_id}: ${m.quantity}`)
                .join(', ');
            report += `  Cost: ${materials}\n`;
        }
        if (item.power_consumption_w) {
            report += `  Power: ${item.power_consumption_w} W\n`;
        }
        report += `\n`;
    });
    
    report += `MATERIALS REQUIRED:\n`;
    Object.entries(totals.materials).forEach(([material, quantity]) => {
        report += `${material}: ${quantity}\n`;
    });
    
    report += `\nDEEP DESERT DISCOUNTED MATERIALS:\n`;
    Object.entries(totals.discountedMaterials).forEach(([material, quantity]) => {
        report += `${material}: ${quantity}\n`;
    });
    
    return report;
}

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Dune Builder server running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
}); 