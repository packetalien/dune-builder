# Arrakis Command: A Strategic Analysis and Development Roadmap for a Unified Dune: Awakening Companion Tool

## Section 1: The State of the Arrakis Infosphere - An Analysis of the Current Fan Tool Ecosystem

The emergence of a dedicated player base for a new massively multiplayer online (MMO) game is invariably followed by the development of community-driven tools designed to demystify its complex systems. Dune: Awakening, with its intricate blend of survival, crafting, combat, and political mechanics, is no exception. An analysis of the current landscape reveals a burgeoning ecosystem of fan-made resources. However, while these tools are functional and address specific player needs, they operate in isolated silos. This systemic fragmentation creates significant user friction and fails to capture the interdependent nature of the game's core systems, representing the single largest opportunity for a truly comprehensive and indispensable companion platform.

### 1.1. Overview of Existing Tool Categories

The current fan-tool ecosystem for Dune: Awakening can be categorized into four primary types, each serving a distinct but narrow purpose.

#### Wikis and Databases
Foundational to any game community, resources such as awakening.wiki and dune.gaming.tools serve as essential, albeit static, repositories of information. These platforms meticulously catalog in-game items, schematics, crafting recipes, questlines, and NPC details. They are invaluable for players seeking specific data points, such as the materials required for an "Adept Disruptor Pistol" or the location of a particular quest-giver. Their primary limitation, however, is their static nature. They function as digital encyclopedias, presenting data without interactive or personalized context. A player can look up a schematic, but the wiki cannot integrate that information into a dynamic crafting queue, track the player's personal progress toward acquiring it, or calculate its economic viability based on live market data.

#### Interactive Maps
A significant step beyond static wikis, interactive maps provided by platforms like IGN, openworld.gg, and duneawakening.th.gl offer a geographical visualization of Arrakis. Users can filter the map to display the locations of resource nodes, trainers, unique schematic chests, and other points of interest. This is a critical function for planning resource gathering expeditions and exploration routes. The most advanced of these, th.gl, has begun to address the game's dynamic nature by including a timer that tracks the weekly reset of the Deep Desert, a region that is reshaped by Coriolis storms. Despite this, their utility remains fundamentally isolated. A player can use the map to find Iron Ore, but this information is disconnected from any tool that calculates how much iron is needed for a specific base build or armor set.

#### Specialized Calculators
This category represents the most targeted form of fan tool, designed to solve specific, high-friction planning challenges. The user's own "deep desert build planner" and the publicly available Base Cost Calculator from tools.tcno.co are prime examples. These tools address the complex task of planning a temporary base in the Deep Desert, where building costs are halved. They allow players to select various fabricators, refineries, and utilities, and in return, they output a precise bill of materials, power requirements, and even the number of transport trips required. While extremely valuable for this specific endgame activity, their scope is intentionally narrow. The base plan is not connected to a guild's shared resource inventory, the character builds of the players who will operate it, or the current market cost of the materials required.

#### Build Planners
Character progression is a central pillar of the MMO experience, and tools like the skill tree viewer at gamingwithdaopa.ellatha.com cater to this need. These planners allow users to simulate the allocation of Skill Points across the game's five primary archetypes: Swordmaster, Bene Gesserit, Mentat, Trooper, and the unlockable Planetologist. Players can experiment with different ability and technique combinations and share their theoretical builds with others via a unique URL. The fundamental flaw of these existing planners is their incompleteness. The game's progression system is explicitly designed around three equally weighted pillars: gear (33%), skills (33%), and player expertise (33%). By focusing solely on skill point allocation, current build planners ignore two-thirds of what determines a character's actual power and effectiveness on Arrakis.

### 1.2. The Core Deficiency: Systemic Fragmentation

The common thread running through the analysis of all existing tools is their isolation. The current ecosystem forces players to engage in what can be termed "swivel-chair integration"—the manual process of collecting and cross-referencing information from multiple, disconnected browser tabs to make a single strategic decision.

Consider a moderately advanced player who wishes to craft a new build centered around a unique, high-tier weapon like the "Replica Pulse-sword". Their workflow would be a study in inefficiency:

1. They would first consult a build planner to map out a complementary skill tree, perhaps focusing on the Swordmaster's "The Blade" branch to maximize offensive output.
2. Next, they would navigate to a wiki or database to look up the stats of the Replica Pulse-sword and the full armor set they plan to pair with it, comparing damage values, mitigation stats, and unique effects.
3. Upon deciding on the gear, they would need to find the location of the required unique schematics, again using the wiki or a dedicated guide.
4. With the schematic locations identified, they would switch to an interactive map to plot a route to find them and to locate the nodes for the raw materials needed for crafting (e.g., Plastanium, Spice-infused Dust).
5. Finally, they might attempt to find market data on a Discord server or forum to determine if it is more cost-effective to buy the refined materials from the CHOAM Exchange rather than gathering and processing them all.

This fractured process is not only cumbersome but also fails to model the reality of the game's design, where character progression, crafting, survival, and economic activity are deeply intertwined systems. A change in one system has cascading effects on all others. For instance, a weekly server-wide decree from the Landsraad political system might reduce crafting costs by 25%. This critical piece of information should dynamically update the profitability calculations in a market tool and the resource requirements in a crafting planner. No current tool offers this level of real-time, cross-system integration.

### 1.3. The Opportunity for a "Single Source of Truth"

The analysis of the current tool landscape reveals a clear and compelling strategic direction. The most significant unmet need in the Dune: Awakening community is not for more individual tools, but for a unified platform that integrates these disparate functions into a cohesive whole. The existing ecosystem is a collection of valuable but disconnected parts; a "great" tool, as per the user's objective, will be one that assembles these parts into a single, powerful engine for strategic planning—a central hub or "single source of truth."

Furthermore, the analysis highlights a second major gap: the predominantly static nature of existing tools. Dune: Awakening is a live-service game, defined by systems that are intentionally dynamic and time-sensitive. The weekly Coriolis storms that reshape the Deep Desert and the weekly cycle of political objectives in the Landsraad are core endgame loops that demand proactive planning, not reactive data lookup. While the th.gl map's reset timer is a nascent acknowledgment of this need, it only scratches the surface. A truly superior tool must be architected to track, analyze, and present this temporal information, transforming it into actionable intelligence that helps players and guilds optimize their strategies for the current week. The opportunity, therefore, is not merely for data integration, but for dynamic, temporal data integration that mirrors the living world of Arrakis.

## Section 2: Uncovering Desert Power - Identifying High-Value Gaps in the Tooling Landscape

Building upon the foundational analysis of the existing tool ecosystem, this section provides a detailed examination of specific, high-value opportunities. These opportunities are presented as distinct but interconnected "modules" that could be integrated into a unified platform, evolving the user's current deep desert planner into a comprehensive command center for all aspects of life on Arrakis. Each proposed module addresses a core gameplay loop that is currently underserved by the fragmented tool landscape.

### 2.1. The Complete Survivor: A Holistic Character Planner

The cornerstone of any successful companion tool for an MMO is a robust character planner. However, to surpass existing offerings, this module must evolve beyond a simple skill tree viewer into a comprehensive character simulator. It must be built upon the game's "three pillars" of progression—skills, gear, and player skill—to provide a complete and actionable picture of a character's capabilities.

#### Feature: Integrated Skill & Gear Database

The foundation of this module would be a dual database that allows users to theorycraft their entire loadout. Users would begin by selecting their permanent Mentor choice (e.g., Trooper), which defines their starting class and skill tree. They could then allocate up to 200 Skill Points across all available archetypes, reflecting the in-game ability to find trainers and learn skills from other schools, enabling hybrid builds.

Simultaneously, the planner would feature a complete, filterable database of all equippable gear. This includes weapons categorized by type (Short Blades, Rifles, Heavy Weapons, etc.), armor (Light, Heavy, and Stillsuits), Holtzman shields, and utility tools. The critical element is that this database must contain not just base stats like damage and armor values, but also the unique special effects that define high-tier gear. This includes properties such as "applies poison on hit" from weapons like Halleck's Pick, the "+50 Maximum Power" bonus from the Power Harness chest piece, or the crucial "Worm Threat: -45.0%" reduction from Softstep Boots. The interface would allow users to equip items into every slot, as well as select up to three active abilities and three techniques, mirroring the in-game character screen.

#### Feature: Combat Effectiveness Simulation

This is the module's key differentiator. By combining the data from the selected skills and gear, the tool would calculate and display a suite of critical derived stats that are not immediately obvious in-game. This transforms the planner from a simple list of items into a powerful analytical engine.

**Defensive Analysis**: The simulator would calculate the total Armor Value from all equipped pieces and apply the game's damage mitigation formulas. It would provide a clear breakdown of a build's resilience against different damage profiles: Blade Mitigation (boosted by Light Armor), Dart and Concussive Mitigation (boosted by Heavy Armor), and elemental resistances like Poison and Fire. By using the community-verified damage calculation formulas, which appear to involve multiplicative stacking, the tool can output a reliable Effective Health Pool (EHP) figure, showing a player their total survivability against specific threats. This allows for direct, quantitative comparison between different gear sets.

**Offensive Analysis**: The tool would calculate a theoretical Damage Per Second (DPS) for equipped weapons, factoring in base damage, attack speed, and any damage-amplifying skills or passive traits selected. For weapons with unique properties, these would be calculated separately. For example, the Static Needle, which drains an additional 25 Power (shield) on hit, would have its "Shield DPS" calculated as a distinct value from its health DPS. This helps players understand a weapon's role, such as shield-breaking versus raw damage.

**Sustain & Mobility Analysis**: The simulation would extend beyond pure combat metrics. It would integrate with the user's existing water calculator logic to show a character's water consumption rate based on their equipped stillsuit and selected skills from the Planetologist tree. It would also calculate stamina efficiency, a critical resource in combat for dodging and attacking. This calculation would factor in the stamina cost modifiers from armor (Light Armor reduces dash cost, Heavy Armor increases it) and relevant skills from trees like the Swordmaster's "The Way" branch.

#### Feature: "Player Skill" Tactical Readout

While player expertise itself cannot be quantified, the tool can provide a tactical summary that helps a player understand the playstyle their build facilitates. Instead of just numbers, this readout would provide a qualitative analysis. For example, it could list the number and type of crowd control abilities equipped (e.g., "2x Stun, 1x Area Slow"), the available methods for penetrating Holtzman shields (e.g., "Slow Blade Attack, Disruptor Sidearm"), and the number of mobility skills available (e.g., "Knee Charge, Mid-air Dash"). This helps a player evaluate if their build aligns with their intended role, whether it be a mobile skirmisher, a fortified ranged combatant, or a crowd-controlling support character.

### 2.2. The CHOAM Mentat: An Economic Intelligence Dashboard

The CHOAM Exchange is the heart of Dune: Awakening's player-driven economy, yet its in-game interface provides limited data for strategic decision-making. This module would address this gap by providing a suite of market intelligence tools, empowering players to engage with the economy as savvy traders and producers rather than speculative participants.

#### The Data Collection Challenge and Proposed Solutions

The primary obstacle to creating a market tracker is the apparent lack of a public developer API for real-time data access, a feature the community has actively requested. Therefore, the tool's success hinges on solving the data collection problem through community-driven methods.

**Method 1: Manual Crowdsourcing**: The initial version of the tracker would rely on a simple, web-based form. Users could manually input item prices, available quantities, and their server name directly from the in-game CHOAM Exchange terminals located in Arrakeen and Harko Village. While labor-intensive, this approach establishes the foundational database and demonstrates the tool's utility.

**Method 2: OCR-Assisted Data Entry**: A more sophisticated and user-friendly solution would be an optional desktop companion app, potentially built on a platform like Overwolf, which allows for in-game overlays. This app would enable a user to press a hotkey to take a screenshot of the in-game market screen. The app would then use Optical Character Recognition (OCR) to automatically parse the item names, prices, and quantities, and submit this structured data to the central database. This dramatically reduces user friction, increases the volume and accuracy of data submissions, and is a key step toward building a robust, live dataset.

#### Feature: Market Price Tracker

The core of the module would be a dashboard displaying aggregated market data. Users could search for any tradable item—from raw resources like Iron Ore to unique schematics and fully crafted vehicles—and view its current price and available volume. Crucially, the data would be filterable by server ("Sietch") and, if possible, by social hub, as evidence suggests the markets may be fragmented. The dashboard would also display historical price trends through interactive charts, allowing players to identify pricing patterns, seasonal demands, and market manipulation.

#### Feature: Crafting Profitability Calculator

This feature represents a powerful integration between the Market Tracker and a comprehensive crafting database. A user could select any craftable item, from a simple Steel Ingot to a complex Ornithopter. The tool would then perform the following calculation in real-time:

1. It would pull the complete, multi-level crafting recipe for the item.
2. It would query the Market Tracker for the current lowest price of every required raw and refined material.
3. It would sum these costs to produce a "Total Material Cost."
4. It would then compare this cost to the current lowest selling price of the final crafted item.
5. The result would be a clear "Profit/Loss" calculation, instantly telling the player whether it is profitable to craft and sell that item.

This calculation would also be dynamic, capable of factoring in the effects of active Landsraad Decrees, such as the "CHOAM Production Contract," which reduces crafting costs by 25%.

#### Feature: Inter-Server Arbitrage Finder

Given that the game's economy is segmented by server, this advanced feature would scan the aggregated price data across all servers. It would identify significant price discrepancies for the same item, highlighting opportunities for dedicated traders to buy an item cheaply on one server, transfer, and sell it for a substantial profit on another. This is a high-value feature that would attract a dedicated user base of economic players.

### 2.3. The Landsraad Strategist: A Political & Mission Command Center

The Landsraad system is the political heart of Dune: Awakening's endgame, a weekly cycle of competition between guilds aligned with House Atreides and House Harkonnen. Success requires coordination, resource management, and timely information—all of which are currently difficult to track. This module would serve as a command center for this critical system.

#### Feature: Weekly Task & Decree Tracker

The module's main dashboard would provide a live, at-a-glance view of the current Landsraad week. It would display:

- The active tasks for each of the minor houses, such as "Kill 100 Scavengers" or "Deliver 500 Leap Suspensors".
- A progress bar for both major factions (Atreides and Harkonnen) on each task, updated via community-reported data.
- The three potential server-wide Decrees that are up for a vote by the winning faction for that week (e.g., "+33% Melee Damage," "Access to Landsraad Armor Vendor," "The Right of Salvage").
- The current status of the PvP control points in the Deep Desert, which passively generate points for the controlling faction.

#### Feature: Personal & Faction Contribution Ledger

This feature would allow individual players to log their contributions to the weekly tasks. The tool would then track their cumulative "Personal Contribution" points for each minor house. It would clearly show their progress toward the five personal reward tiers, which range from 700 to 14,000 points. The tool would display exactly which rewards they have unlocked at each tier, such as high-end crafting components, unique Mk5 and Mk6 schematics, or exclusive armor color swatches. This removes the guesswork and helps players efficiently target the rewards they want most.

#### Feature: Interactive Rewards Database

To complement the ledger, this feature would be a searchable and filterable database of all possible Landsraad rewards. The key integration here is its link to the Character Planner. A player could see that House Torvold is offering the "Jolt-sword" schematic as a 10,500-point reward. They could then click on the item, and it would immediately open in the Character Planner, allowing them to simulate its impact on their build's DPS and other stats. This direct link between a potential reward and its practical application is a powerful motivator and planning tool.

#### Feature: Decree Impact Simulator

This is a high-level strategic tool designed for guild leaders and faction strategists. It would allow them to perform "what-if" analysis on the week's potential Decrees. For example, a guild leader could select the "CHOAM Refining Contract" decree, which reduces refining times by 75%. The tool would then simulate this effect across its other modules, instantly updating the time and cost calculations in the Crafting Profitability Calculator. This provides direct, actionable intelligence that can inform how a faction's leaders cast their votes, allowing them to choose the decree that provides the maximum strategic benefit for the coming week.

### 2.4. The Guild Imperium: A Collaborative Operations Suite

While individual players are the foundation of the game, organized guilds are the primary drivers of the endgame. This module would integrate all other modules into a shared, collaborative space, providing the tools necessary to manage the complex logistics of a successful guild.

#### Feature: Integrated Deep Desert Base Planner

This feature is the logical evolution of the user's existing tool. It would allow guild members to collaboratively design a Deep Desert base layout. The planner would calculate the halved resource costs, total power requirements, and the transport volume needed to ferry the materials. The crucial integration point is its connection to the Shared Guild Bank feature; the planner would check the virtual inventory and display how many of the required resources the guild already has in stock, generating a clear "shopping list" of what is still needed.

#### Feature: Shared Guild Bank & Resource Tracker

This would function as a virtual ledger or inventory management system for the guild. Designated members could log major deposits and withdrawals of resources, schematics, and valuable items. This provides guild leadership with a clear overview of their collective assets, which is essential for planning large-scale crafting projects, fulfilling massive Landsraad delivery contracts, or equipping members for PvP operations.

#### Feature: Landsraad Objective Coordination

This would be a simple, lightweight project management interface integrated with the Landsraad Strategist module. Guild leaders could view the week's active tasks and assign specific members or squads to focus on them. For example, the PvP squad could be assigned to capture and hold the Deep Desert control point, while the crafting division could be tasked with producing the 500 Leap Suspensors needed for a delivery contract. The tool would track the progress of these assignments, providing a centralized command board for the week's political efforts.

#### Feature: Shared Build & Blueprint Library

This feature fosters internal knowledge sharing and strategic planning. Guild members would be able to save their character builds from the Character Planner to a shared guild library. This allows leaders to quickly assess their roster's capabilities—for example, identifying how many players have builds optimized for shield-breaking before engaging a heavily shielded enemy force. The library would also allow members to share their base blueprints, a feature explicitly mentioned in the game's design, facilitating the efficient construction of standardized outposts and fortifications.

The development of these interconnected modules would transform a simple calculator into a dynamic ecosystem. The value of such a platform lies not in any single feature, but in the seamless flow of data between them, mirroring the game's own interdependent systems. A player's character build in the Planner dictates the gear they need, which in turn informs the materials they must gather or buy, a decision driven by data from the Crafting Calculator and CHOAM Tracker. The most powerful gear often comes from the Landsraad, making the Political Strategist essential, and participation in the Landsraad is most effective as a guild, necessitating the collaborative tools of the Guild Imperium. This interconnectedness is the key to creating a tool that feels less like a database and more like an essential extension of the game itself.

## Section 3: Blueprint for a Unified Platform - A Strategic Development Roadmap

Translating the identified opportunities into a tangible, high-value product requires a deliberate and strategic development plan. This section outlines a phased implementation roadmap, emphasizing a modular architecture that allows for iterative development, community engagement, and the delivery of value at each stage. The goal is to build momentum by launching a powerful core feature first, then expanding functionality by layering on more complex, data-dependent modules over time.

### 3.1. The Foundational Data Core: Architecture and Data Management

Before any user-facing features are developed, the project's foundation must be established. This involves key decisions about the application's architecture and the strategy for managing the vast amount of game data it will handle.

#### Architectural Recommendation

The optimal approach for a tool of this nature is a Progressive Web App (PWA). This strategy offers the best of both worlds: the accessibility of a website and the performance and features of a native application. A PWA is accessible via a URL, requires no installation from an app store, and works seamlessly across both desktop and mobile devices. This low-friction approach is critical for maximizing user adoption in a gaming community.

The internal architecture should be strictly modular and component-based. Each major feature set identified in Section 2—the Character Planner, Market Tracker, Landsraad Strategist, and Guild Suite—should be developed as a self-contained module. These modules will communicate with each other through a centralized data layer or API, ensuring that data entered or calculated in one module (e.g., a new market price) can be seamlessly accessed by another (e.g., the crafting profitability calculator). This approach facilitates parallel development, easier maintenance, and the ability to add or update features without breaking the entire application.

#### The Central Database and Community Curation

The heart of the entire platform will be its central database. This database will house all of the game's relatively "static" data: all item stats, crafting recipes, skill tree data, schematic locations, quest details, and so on. The primary challenge with such a database is not its initial creation, but its ongoing maintenance as the game is updated with balance patches and new content.

To address this, the platform should be built around a community curation model. Rather than placing the entire maintenance burden on a single developer, the system should allow a select group of trusted community contributors—"data librarians"—to update the database through a secure administrative interface. This leverages the passion and expertise of the player base to ensure the data remains accurate and up-to-date. To further empower this community effort, the platform should incorporate a feature allowing for the bulk download and upload of data tables in a common format like .csv. This ensures that even if the primary developer is unavailable, the community can continue to maintain the dataset, preventing the tool from becoming obsolete.

### 3.2. Phase 1: The Ultimate Character Planner (The Cornerstone)

**Goal**: The primary objective of Phase 1 is to launch the tool with its most powerful and engaging standalone module: the Ultimate Character Planner. This feature has the highest potential for individual player engagement and can attract a critical mass of users who will form the foundation of the community for later, more complex features.

**Implementation Steps**:

1. **Build the Core Interface**: Develop the user interface for selecting a Mentor, allocating Skill and Intel Points, and equipping items into a full character sheet with slots for all armor pieces, weapons, tools, active abilities, and techniques.

2. **Populate the Skill Database**: The initial data entry focus should be on populating the central database with all skills, techniques, and passives from every class tree, including their descriptions, costs, and statistical effects.

3. **Incrementally Add the Gear Database**: Systematically add all equippable items to the database, starting with weapons, then armor, then shields and tools. It is critical to include not just base stats but all unique effects and properties, as these are often the deciding factor in build creation.

4. **Implement the Simulation Engine**: This is the most complex part of Phase 1. Develop the back-end logic that takes all the inputs from the user's selections and calculates the derived "Combat Effectiveness" stats (EHP, DPS, Shield DPS, Stamina Efficiency, etc.). This engine is the core intellectual property of the module.

5. **Launch with a Sharing Feature**: The initial launch must include a "share build" function that generates a unique, persistent URL for each build. This is a viral marketing feature that encourages users to share their creations on Discord, Reddit, and forums, driving traffic and adoption of the tool.

### 3.3. Phase 2: The Economic and Political Intelligence Modules (The Dynamic Layer)

**Goal**: With a user base established in Phase 1, the second phase focuses on introducing the dynamic, time-sensitive modules that no other tool currently offers. This is where the platform will build its "moat" and become indispensable for serious players.

**Implementation Steps**:

1. **CHOAM Exchange Tracker**:
   - Begin by launching the tracker with the simple, manual-entry web form for price data submission. Announce this as a community project and encourage the user base from Phase 1 to contribute.
   - Simultaneously, begin development of the more advanced OCR companion app. This can be marketed as a "pro" feature for dedicated traders, further incentivizing community engagement.
   - Build the front-end interface, including historical price charts and the integrated Crafting Profitability Calculator. This calculator will be a major draw, as it provides immediate, actionable economic advice.

2. **Landsraad Strategist**:
   - Build the user interface to display the weekly tasks, progress, and potential decrees. Initially, this information can be updated manually by the "data librarian" team at the start of each weekly cycle.
   - Introduce the personal contribution ledger, allowing users to track their progress towards rewards. This feature directly ties into the gear-acquisition loop, making it highly relevant to the users of the Character Planner.
   - The final piece to implement is the "Decree Impact Simulator," as its functionality depends on the full integration of the market and crafting modules.

### 3.4. Phase 3: Guild Integration and Community Ecosystem (The Social Layer)

**Goal**: The final phase is to solidify the platform's position as the central hub for organized play on Arrakis by adding a suite of collaborative tools for guilds.

**Implementation Steps**:

1. **Implement User Accounts and Guilds**: Introduce a user registration system and the ability for users to create and join guilds within the platform itself. This provides the necessary structure for all subsequent collaborative features.

2. **Integrate the Deep Desert Base Planner**: Port the user's existing base planning tool into the new platform. The key enhancement will be connecting its resource calculations to the new Shared Guild Bank ledger, allowing for real-time inventory checking.

3. **Build Collaborative Tools**: Develop the interfaces for the Shared Guild Bank, the Landsraad Objective Coordination board, and the Shared Build/Blueprint Library. These features transform the tool from a personal planner into a multiplayer command center.

4. **Develop Ecosystem Integrations**: To further embed the tool into the community's daily workflow, develop a Discord bot that can be invited to guild servers. This bot could execute simple commands to pull data from the platform's API (e.g., `!price Iron Ingot`, `!landsraad status`), making the tool's data accessible without ever leaving the primary communication platform used by guilds.

## Section 4: Concluding Analysis - Securing a Legacy on Arrakis

The analysis presented in this report delineates a clear path forward, not merely to enhance an existing tool, but to construct a new class of integrated companion platform for Dune: Awakening. The current fan-tool landscape, while populated with useful but disparate resources, presents a significant strategic opportunity. The core deficiency is not a lack of information, but a lack of synthesis. Players are forced to manually bridge the gaps between skill planners that ignore gear, maps that are disconnected from resource needs, and calculators that operate in a vacuum.

The strategic imperative, therefore, is to create a unified, dynamic, and community-driven platform that mirrors the interconnected nature of the game itself. A player's character build, their economic activity, their political allegiances, and their guild's objectives are not separate endeavors on Arrakis; they are facets of a single, holistic struggle for survival and power. A tool that understands and models these interdependencies will provide unparalleled value to the player base.

The proposed phased development roadmap is designed to mitigate risk while building momentum. By launching with the Ultimate Character Planner, the platform can establish a strong user base by solving a universal and complex player problem: understanding the true effectiveness of a character build. This initial success provides the community foundation necessary to tackle the more ambitious, data-dependent modules like the CHOAM Exchange Tracker and the Landsraad Strategist. Successfully solving the data collection problem for these dynamic systems through community crowdsourcing will create a powerful and defensible competitive advantage, establishing the platform as the definitive source for economic and political intelligence. The final phase, the Guild Imperium suite, solidifies this position by transforming the platform into an indispensable command center for organized play, the primary driver of the game's endgame.

This project represents an opportunity to move beyond the traditional "fan site" model and create a vital piece of community infrastructure. It is a platform that empowers individual players with deep analytical capabilities, enables traders and crafters with real-time economic data, and equips guild leaders with the strategic tools needed to navigate the complex political landscape of Arrakis.

Finally, the proposed modular architecture is inherently future-proof. Should the developers at Funcom eventually release a public API—a common request from the community—this platform would be perfectly positioned to integrate it. Such a development would allow for the replacement of crowdsourced data with official, real-time information, further cementing the platform's status as the market leader. By following this strategic roadmap, the initial concept of a Deep Desert planner can evolve into the definitive, must-have companion app for any serious player or guild, securing a lasting and valuable legacy within the Dune: Awakening community.

---

## Works Cited

1. Crafting - Dune: Awakening Community Wiki, accessed August 5, 2025, https://awakening.wiki/Crafting
2. Dune Awakening Database, accessed August 5, 2025, https://dune.gaming.tools/
3. Dune: Awakening Database by gaming.tools : r/duneawakening - Reddit, accessed August 5, 2025, https://www.reddit.com/r/duneawakening/comments/1l5u9r4/dune_awakening_database_by_gamingtools/
4. All Unique Schematics - Dune Awakening Guide - IGN, accessed August 5, 2025, https://www.ign.com/wikis/dune-awakening/All_Unique_Schematics
5. Atreides Faction Guide - Dune: Awakening - IGN, accessed August 5, 2025, https://www.ign.com/wikis/dune-awakening/Atreides_Faction_Guide
6. DUNE: Awakening Interactive Maps and Locations - IGN, accessed August 5, 2025, https://www.ign.com/maps/dune-awakening
7. Dune: Awakening Interactive Map - Find Unique Items | Open World, accessed August 5, 2025, https://www.openworld.gg/dune-awakening/interactive-map
8. Dune: Awakening Interactive Maps & Locations, accessed August 5, 2025, https://duneawakening.th.gl/
9. Dune: Awakening: Home, accessed August 5, 2025, https://www.duneawakening.com/
10. EVERY Dune Player Needs This Tool | Base Calculator + Deep Desert - YouTube, accessed August 5, 2025, https://www.youtube.com/watch?v=zaP7P_oj9gs
11. I created a Base Cost Calculator - Deep Desert is easier than ever. :: Dune: Awakening General Discussions - Steam Community, accessed August 5, 2025, https://steamcommunity.com/app/1172710/discussions/0/595152944226127794/
12. The Base Cost Calculator - Dune: Awakening - Steam Community, accessed August 5, 2025, https://steamcommunity.com/sharedfiles/filedetails/?id=3509428130
13. Dune Base Calculator - TroubleChute Tools, accessed August 5, 2025, https://tools.tcno.co/dune
14. Dune Awakening Skill Tree Viewer & Build Planner - Save & Share ..., accessed August 5, 2025, https://gamingwithdaopa.ellatha.com/duneawakening/skill-tree-viewer/
15. Dune: Awakening – A Deep Dive into the Progression System - Gaming With DaOpa, accessed August 5, 2025, https://gamingwithdaopa.ellatha.com/duneawakening/progression-system/
16. Classes - Dune Awakening Guide - IGN, accessed August 5, 2025, https://www.ign.com/wikis/dune-awakening/Classes
17. Dune Awakening Best Weapons Tier List - Method, accessed August 5, 2025, https://www.method.gg/dune-awakening/dune-awakening-best-weapons-tier-list
18. Weapons - Dune Awakening Guide - IGN, accessed August 5, 2025, https://www.ign.com/wikis/dune-awakening/Weapons
19. Dune Awakening Best Armor Tier List - Method, accessed August 5, 2025, https://www.method.gg/dune-awakening/dune-awakening-best-armor-tier-list
20. Advanced Machinery - Dune: Awakening Community Wiki, accessed August 5, 2025, https://awakening.wiki/Advanced_Machinery
21. How to buy and sell items in Dune Awakening? | Esports News - The Times of India, accessed August 5, 2025, https://timesofindia.indiatimes.com/sports/esports/news/how-to-buy-and-sell-items-in-dune-awakening/articleshow/121692800.cms
22. Choam Exchange - Player Market - please upgrade :: Dune: Awakening General Discussions - Steam Community, accessed August 5, 2025, https://steamcommunity.com/app/1172710/discussions/0/563626489222817377/
23. All 9 Known Decrees In The Landsraad - Which interest you the most? : r/duneawakening, accessed August 5, 2025, https://www.reddit.com/r/duneawakening/comments/1kxzzc6/all_9_known_decrees_in_the_landsraad_which/
24. Dune: Awakening's player guilds will be able to pass some pretty OP server-wide laws—including one that means you'll lose everything when defeated in deep desert PvP | PC Gamer, accessed August 5, 2025, https://www.pcgamer.com/games/survival-crafting/dune-awakenings-player-guilds-will-be-able-to-pass-some-pretty-op-server-wide-laws-including-one-that-means-youll-lose-everything-when-defeated-in-deep-desert-pvp/
25. Choosing a Faction in Dune Awakening: Atreides or Harkonnen?, accessed August 5, 2025, https://www.method.gg/dune-awakening/should-you-pick-house-atreides-or-harkonnen-in-dune-awakening
26. Dune: Awakening — How Respec Works and How to Build Your Perfect Character, accessed August 5, 2025, https://egamersworld.com/blog/how-to-respec-in-dune-awakening-and-dune-awakening-JJ0PYEcVHP
27. Dune Awakening Beginner's Guide - How to Play and Tips - Skycoach, accessed August 5, 2025, https://skycoach.gg/blog/dune-awakening/articles/dune-beginners-guide
28. Armour and mitigation :: Dune: Awakening General Discussions - Steam Community, accessed August 5, 2025, https://steamcommunity.com/app/1172710/discussions/0/595149997463315415/
29. Dune: Awakening Weapons — Master Your Arsenal on Arrakis - LootBar, accessed August 5, 2025, https://lootbar.gg/blog/en/dune-awakening-weapons-master-your-arsenal-on-arrakis.html
30. Armor - Dune Awakening Guide - IGN, accessed August 5, 2025, https://www.ign.com/wikis/dune-awakening/Armor
31. How Armor & DR Work in Dune: Awakening - YouTube, accessed August 5, 2025, https://www.youtube.com/watch?v=XiyEHRdx9-U
32. Lets Talk Armor : r/duneawakening - Reddit, accessed August 5, 2025, https://www.reddit.com/r/duneawakening/comments/1laa9l8/lets_talk_armor/
33. Unpopular Opinion: Complaints about the combat system are a skill issue : r/duneawakening - Reddit, accessed August 5, 2025, https://www.reddit.com/r/duneawakening/comments/1kkwli2/unpopular_opinion_complaints_about_the_combat/
34. Combat system :: Dune: Awakening General Discussions - Steam Community, accessed August 5, 2025, https://steamcommunity.com/app/1172710/discussions/0/595154189866245249/
35. The Exchange (PreBeta) - Dune: Awakening Community Wiki, accessed August 5, 2025, https://awakening.wiki/The_Exchange_(PreBeta)
36. Public API for Guild App : r/duneawakening - Reddit, accessed August 5, 2025, https://www.reddit.com/r/duneawakening/comments/1lkztj0/public_api_for_guild_app/
37. Build in-game apps from scratch - Overwolf, accessed August 5, 2025, https://www.overwolf.com/creators/build-an-app/
38. Why doesn't anyone use the market? :: Dune: Awakening General Discussions, accessed August 5, 2025, https://steamcommunity.com/app/1172710/discussions/0/595152144826416411/
39. Crafting 101 from Livestreams : r/duneawakening - Reddit, accessed August 5, 2025, https://www.reddit.com/r/duneawakening/comments/1jnio9p/crafting_101_from_livestreams/
40. Dune Awakening – Factions Overview - MmonsteR, accessed August 5, 2025, https://mmonster.co/blog/dune-awakening-factions-overview
41. Dune Awakening - Wish I Knew Sooner | Tips, Tricks, & Game Knowledge for New Players, accessed August 5, 2025, https://www.youtube.com/watch?v=PvFBjNr1X6U
42. Dune Awakening Best Tools Tier List - Method, accessed August 5, 2025, https://www.method.gg/dune-awakening/dune-awakening-best-tools-tier-list
43. Is there a definitive guide on the Landsraad and how to claim rewards? - Reddit, accessed August 5, 2025, https://www.reddit.com/r/duneawakening/comments/1lej9l/is_there_a_definitive_guide_on_the_landsraad_and/
44. Landsraad Guide - Dune: Awakening - IGN, accessed August 5, 2025, https://www.ign.com/wikis/dune-awakening/Landsraad_Guide
45. Landsraad Rewards - Dune Awakening - Method, accessed August 5, 2025, https://www.method.gg/dune-awakening/landsraad/rewards
46. CLAIM VICTORY in Faction VS Faction for rewards! | Dune: Awakening | Landsraad Beginner Guide - YouTube, accessed August 5, 2025, https://www.youtube.com/watch?v=rjIg48gwGFU
47. Devs: Increase crafting material requirements. :: Dune: Awakening General Discussions - Steam Community, accessed August 5, 2025, https://steamcommunity.com/app/1172710/discussions/0/813573650210896608/
48. I created the Base Cost Calculator - Deep Desert & More: Easier : r/duneawakening - Reddit, accessed August 5, 2025, https://www.reddit.com/r/duneawakening/comments/1lldbk3/i_created_the_base_cost_calculator_deep_desert/
49. Dune: Awakening, accessed August 5, 2025, https://duneawakening.com/
50. If I wanted to make a companion app for a board game, how would I get started? - Reddit, accessed August 5, 2025, https://www.reddit.com/r/boardgames/comments/7xypmw/if_i_wanted_to_make_a_companion_app_for_a_board/
51. Building Browser-Based Games: A Developer's Guide to Creating Engaging Web Games, accessed August 5, 2025, https://dev.to/okoye_ndidiamaka_5e3b7d30/building-browser-based-games-a-developers-guide-to-creating-engaging-web-games-hcc
52. Making modular videogames - Code Words - The Recurse Center, accessed August 5, 2025, https://codewords.recurse.com/issues/three/making-modular-videogames
53. Dune: Awakening Character Leveling Guide – Reach Level 200! - Gaming With DaOpa, accessed August 5, 2025, https://gamingwithdaopa.ellatha.com/duneawakening/experience-chart/
54. ULTIMATE Melee COMBAT Guide in Dune: Awakening - YouTube, accessed August 5, 2025, https://www.youtube.com/watch?v=XAjuj2x03Wc
55. Dune: Awakening Guilds — Join the Power on Arrakis - LootBar, accessed August 5, 2025, https://lootbar.gg/blog/en/dune-awakening-guilds-join-the-power-on-arrakis.html 