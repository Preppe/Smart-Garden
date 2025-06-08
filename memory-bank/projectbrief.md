# Project Brief: Orto

## Project Overview
**Status**: Requirements Defined & Architecture Planned  
**Type**: Smart Garden Management SaaS Platform  
**Tech Stack**: NestJS (Backend) + React with TypeScript (Frontend)

## Project Definition
**Orto** is a SaaS platform for home gardeners to manage smart gardens through IoT sensor integration, automated care systems, and intelligent gardening insights.

**Target Users**: Home gardeners who want to optimize plant health, automate care tasks, and learn better gardening practices through technology.

**Core Value**: Transform raw IoT sensor data into actionable gardening insights, reducing plant loss and increasing yields through intelligent automation.

## Current State
- ✅ Project scaffolding completed (NestJS + React)
- ✅ Requirements defined and documented
- ✅ System architecture planned (modular, scalable design)
- ✅ Memory bank initialized with complete project context
- 🔄 Ready for MVP feature definition and implementation

## Architecture
```
orto/
├── backend/     # NestJS REST API
├── frontend/    # React SPA with Vite
└── memory-bank/ # Project documentation
```

## Technical Foundation
- **Backend**: NestJS 11.x, TypeScript, Express
- **Frontend**: React 19.x, TypeScript, Vite 6.x
- **Development**: ESLint, Prettier configured for both sides

## Next Implementation Phase
1. **MVP Feature Definition**: Core features for first release
2. **Database Design**: Entity models and relationships
3. **API Design**: REST endpoints and data contracts
4. **Frontend Architecture**: Component structure and state management
5. **IoT Integration**: MQTT setup and sensor data flow

## Key Features Planned
- **Garden Management**: Multi-zone garden setup and plant tracking
- **IoT Sensor Integration**: Real-time monitoring (soil, temperature, humidity, light, pH)
- **Automated Care**: Intelligent watering schedules and care reminders
- **Plant Database**: Species-specific care requirements and guidance
- **Smart Dashboards**: Real-time monitoring and historical data visualization
- **Notification System**: Proactive alerts for care needs and issues
