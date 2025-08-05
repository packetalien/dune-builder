# Changelog

All notable changes to the Dune: Awakening Base Build Calculator project will be documented in this file.

## [2.0.0] - 2025-08-05

### 🎉 Major Release - Enhanced Water Calculator & Data Validation

#### ✨ New Features
- **Enhanced Water Calculator**: Advanced water production and consumption tracking with faction-specific mechanics
- **CSV Data Integration**: All game values now sourced from human-validated `raw_data.csv`
- **Building Components**: 16 new faction-specific structures (walls, doors, foundations, roofs)
- **Faction-Specific Mechanics**: Different water efficiency for Harkonnen, Atreides, Fremen, and Neutral
- **Environmental Factors**: Production modifiers for Deep Desert, Oasis, and Standard environments
- **Realistic Consumption**: Player hydration, plant systems, and industrial station water needs
- **Sustainability Analysis**: Calculate how long your water supply will last

#### 🔧 Technical Improvements
- **Data Accuracy**: All values now match actual in-game numbers from CSV validation
- **Water Production**: Accurate rates for windtraps (750 ml/hour, 1,750 ml/hour) and death stills (25,000 ml/hour, 45,000 ml/hour)
- **Power Generation**: Real power output values for generators and turbines
- **Material Costs**: Verified crafting requirements for all components
- **Health Values**: Actual structure durability from the game

#### 📊 Data Updates
- **71 Total Items**: Comprehensive database with accurate in-game data
- **6 Water Production Items**: Including windtraps and death stills
- **5 Water Storage Items**: Cisterns with correct capacities
- **10 Power Generation Items**: Generators and turbines with accurate output
- **66 Items with Materials**: Complete crafting material requirements

#### 🎮 Game Mechanics
- **Harkonnen Faction**: 20% reduced water consumption
- **Atreides Faction**: 20% increased water production
- **Fremen Faction**: 40% reduced water consumption
- **Neutral Faction**: Standard rates
- **Deep Desert Environment**: Reduced water production
- **Oasis Environment**: Increased water production
- **Standard Environment**: Normal production rates

#### 🏗️ New Building Components
- **Walls**: Regular and reinforced walls for Harkonnen, Atreides, and Fremen
- **Doors**: Standard and security doors with faction-specific costs
- **Foundations**: Base structures for different building types
- **Roofs**: Weather protection with varying material requirements

#### 📁 File Changes
- **Added**: `enhanced_water_calculator.js` - Advanced water calculation logic
- **Added**: `data/water_mechanics.json` - Water calculation rules and faction bonuses
- **Added**: `data/building_components.json` - Additional building components
- **Updated**: `data/data.json` - 39 items updated with CSV-validated data
- **Updated**: `public/app.js` - Integration with enhanced water calculator
- **Updated**: `public/index.html` - Enhanced water calculator UI
- **Updated**: `public/style.css` - Styling for new water calculator features
- **Added**: `raw_data.csv` - Human-validated game data source
- **Added**: `update_data_from_csv.js` - CSV parsing and data update script
- **Added**: `update_data_from_csv_v2.js` - Improved CSV parser with header support
- **Added**: `check_updated_data.js` - Data validation script
- **Added**: `validate_water_data.js` - Water production validation script

#### 🔍 Validation Results
- **Water Production**: 6 items with accurate production rates
- **Water Storage**: 5 items with correct capacities
- **Power Production**: 10 items with real generation values
- **Materials**: 66 items with verified crafting requirements
- **Health Values**: All items updated with in-game durability

## [1.0.0] - 2025-08-05

### 🚀 Initial Release - Node.js Backend Conversion

#### ✨ Core Features
- **Node.js Backend**: Express.js server with RESTful API
- **Material Calculator**: Automatic calculation of all required materials
- **Power Management**: Real-time power generation vs consumption tracking
- **Build Export**: Detailed build report generation
- **Search Functionality**: Quick component filtering and search

#### 🔧 Technical Implementation
- **RESTful API**: Backend endpoints for data retrieval and calculations
- **Server-side Processing**: Calculations performed on server for better performance
- **Enhanced Security**: Helmet.js for security headers and input validation
- **Compression**: Gzip compression for faster loading
- **Logging**: Morgan for request logging
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error handling and fallbacks

#### 📊 API Endpoints
- `GET /api/items` - Retrieve all building components
- `POST /api/calculate` - Calculate totals for a build
- `POST /api/export` - Generate build report
- `GET /` - Serve the main application

#### 📁 Project Structure
- **Backend**: `server.js` - Express.js server
- **Frontend**: `public/app.js` - API-enabled frontend logic
- **Data**: `data/data.json` - Building components database
- **Styling**: `public/style.css` - Dune-themed CSS styles
- **Configuration**: `package.json` - Dependencies and scripts

#### 🎮 Features
- **Component Selection**: Browse and add building components
- **Material Calculation**: Total raw materials needed
- **Deep Desert Discount**: 50% material cost reduction
- **Power Management**: Track generation vs consumption
- **Dynamic Build List**: View current selection with costs and stats
- **Quantity Adjustment**: Increase/decrease component quantities
- **Search Functionality**: Quick component filtering
- **Categorized Components**: Items grouped by type
- **Responsive Design**: Usable on various screen sizes

---

## Version History Summary

### v2.0.0 (Current)
- Enhanced water calculator with faction mechanics
- CSV data validation and integration
- 16 new building components
- Accurate in-game values for all items

### v1.0.0
- Initial Node.js backend conversion
- Basic material and power calculations
- RESTful API implementation
- Core calculator functionality

---

## Data Validation Process

### CSV Integration
1. **Source**: `raw_data.csv` contains human-validated in-game data
2. **Parsing**: Custom scripts parse CSV format with varying column structures
3. **Validation**: Multiple validation scripts confirm data accuracy
4. **Integration**: 39 items updated with verified game values

### Validation Results
- ✅ **Health Values**: All structures have correct in-game durability
- ✅ **Power Consumption**: Accurate power requirements
- ✅ **Power Generation**: Real output values for generators
- ✅ **Water Production**: Correct rates for windtraps and death stills
- ✅ **Material Costs**: Verified crafting requirements
- ✅ **Storage Capacities**: Accurate inventory and water storage values

---

## Future Enhancements

### Planned Features
- **Database Integration**: MongoDB or PostgreSQL for persistent data
- **User Authentication**: User accounts and saved builds
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Filtering**: More sophisticated search and filter options
- **Build Sharing**: Share builds via URLs or social media
- **Mobile App**: React Native or PWA version
- **API Rate Limiting**: Protect against abuse
- **Caching**: Redis for improved performance
- **Testing**: Comprehensive test suite
- **Docker Support**: Containerized deployment

### Technical Improvements
- **Performance Optimization**: Caching and query optimization
- **Security Enhancements**: Additional security measures
- **Error Handling**: More comprehensive error management
- **Documentation**: Enhanced API documentation
- **Testing**: Unit and integration tests 