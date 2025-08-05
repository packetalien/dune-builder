# Dune: Awakening Base Build Calculator

A comprehensive web-based calculator for planning and optimizing base builds in Dune: Awakening. This tool helps players calculate material requirements, power consumption, water production, and storage needs for their base structures.

## 🚀 Features

### Core Functionality
- **Material Calculation**: Automatically calculates total materials needed for your build
- **Power Management**: Tracks power generation vs consumption with real-time balance
- **Enhanced Water Calculator**: Advanced water production and consumption tracking
- **Build Export**: Export your build plans as detailed text reports
- **Search & Filter**: Quick search through all available building components

### Enhanced Water Calculator
- **Faction-Specific Mechanics**: Different water efficiency for Harkonnen, Atreides, Fremen, and Neutral factions
- **Environmental Factors**: Production modifiers for Deep Desert, Oasis, and Standard environments
- **Realistic Consumption**: Player hydration, plant systems, and industrial station water needs
- **Sustainability Analysis**: Calculate how long your water supply will last

### Building Components
- **Comprehensive Database**: 71+ building components with accurate in-game data
- **Faction-Specific Structures**: Walls, doors, foundations, and roofs for each faction
- **Accurate Costs**: Human-validated material requirements from actual gameplay
- **Health & Durability**: Real in-game health values for all structures

### Data Accuracy
- **CSV-Validated Data**: All values sourced from `raw_data.csv` with human-validated in-game numbers
- **Real Production Rates**: Accurate water and power production values
- **Correct Material Costs**: Verified crafting material requirements
- **Updated Health Values**: Actual structure durability from the game

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Data**: JSON-based component database
- **API**: RESTful endpoints for calculations and data retrieval

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd dune-builder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

## 🎮 How to Use

### Basic Usage
1. **Select Components**: Choose building components from the categorized dropdowns
2. **Adjust Quantities**: Use the +/- buttons to set the number of each component
3. **View Totals**: See real-time calculations for materials, power, and water
4. **Export Build**: Save your build plan as a text file

### Enhanced Water Calculator
1. **Open Water Calculator**: Click the "Enhanced Water Calculator" button
2. **Set Parameters**:
   - Choose your faction (affects water efficiency)
   - Select environment (affects production rates)
   - Set player count and system requirements
3. **View Analysis**: See detailed water production, consumption, and sustainability

### Building Components
- **Walls**: Regular and reinforced walls for each faction
- **Doors**: Standard and security doors with faction-specific costs
- **Foundations**: Base structures for different building types
- **Roofs**: Weather protection with varying material requirements

## 📊 API Endpoints

- `GET /api/items` - Retrieve all building components
- `POST /api/calculate` - Calculate totals for a build
- `POST /api/export` - Generate build report
- `GET /` - Serve the main application

## 🏗️ Project Structure

```
dune-builder/
├── public/                 # Static files
│   ├── index.html         # Main application
│   ├── app.js            # Frontend logic
│   ├── enhanced_water_calculator.js  # Water calculator
│   └── style.css         # Styling
├── data/                  # Data files
│   ├── data.json         # Building components database
│   ├── water_mechanics.json  # Water calculation rules
│   └── building_components.json  # Additional components
├── server.js             # Express.js server
├── package.json          # Dependencies and scripts
├── raw_data.csv         # Human-validated game data
└── README.md            # This file
```

## 🔧 Development

### Available Scripts
- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests (when implemented)

### Data Validation
The application uses `raw_data.csv` as the source of truth for all in-game values. This CSV file contains human-validated data collected directly from the game, ensuring accuracy for:
- Health values
- Power consumption/generation
- Water production rates
- Material requirements
- Storage capacities

## 🎯 Key Features

### Real-Time Calculations
- **Material Totals**: Automatic calculation of all required materials
- **Power Balance**: Net power generation vs consumption
- **Water Sustainability**: Production vs consumption analysis
- **Cost Optimization**: Material efficiency recommendations

### Faction-Specific Mechanics
- **Harkonnen**: 20% reduced water consumption
- **Atreides**: 20% increased water production
- **Fremen**: 40% reduced water consumption
- **Neutral**: Standard rates

### Environmental Factors
- **Deep Desert**: Reduced water production
- **Oasis**: Increased water production
- **Standard**: Normal production rates

## 📈 Recent Updates

### v2.0 - Enhanced Water Calculator & Data Validation
- ✅ **CSV Data Integration**: All values now sourced from human-validated game data
- ✅ **Enhanced Water Calculator**: Faction-specific and environmental water mechanics
- ✅ **Building Components**: 16 new faction-specific structures added
- ✅ **Accurate Health Values**: Real in-game durability for all structures
- ✅ **Correct Material Costs**: Verified crafting requirements
- ✅ **Power Generation**: Accurate power output for generators and turbines
- ✅ **Water Production**: Real water production rates for windtraps and death stills

### v1.0 - Initial Release
- ✅ **Node.js Backend**: Express.js server with RESTful API
- ✅ **Material Calculator**: Automatic material requirement calculation
- ✅ **Power Management**: Real-time power balance tracking
- ✅ **Build Export**: Detailed build report generation
- ✅ **Search Functionality**: Quick component filtering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This is a fan-made tool for Dune: Awakening. All game data is sourced from actual gameplay and validated against in-game values. This tool is not affiliated with or endorsed by the official game developers.

---

**Built with ❤️ for the Dune: Awakening community**
