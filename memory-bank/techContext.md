# Technical Context: Orto

## Technology Stack

### Backend (NestJS)
- **Framework**: NestJS 11.0.1
- **Runtime**: Node.js with TypeScript 5.7.3
- **HTTP**: Express.js (default NestJS platform)
- **Build**: SWC compiler for fast builds
- **Testing**: Jest with e2e testing setup

### Frontend (React)
- **Framework**: React 18.3.1 with TypeScript 5.5.3
- **Build Tool**: Vite 5.4.1 with SWC plugin for React
- **UI Library**: Shadcn/ui complete component system (40+ components)
- **Styling**: Tailwind CSS 3.4.11 with custom design tokens
- **State Management**: React Query 5.56.2 (TanStack Query)
- **Routing**: React Router DOM 6.26.2
- **Charts**: Recharts 2.12.7 for data visualization
- **Icons**: Lucide React 0.462.0
- **Forms**: React Hook Form 7.53.0 with Zod validation
- **UI Primitives**: Radix UI components for accessibility
- **Animations**: Tailwind CSS animations with custom keyframes
- **Development**: Hot Module Replacement (HMR), ESLint 9.x, Prettier 3.4.2

### Development Tools
- **Linting**: ESLint 9.x with TypeScript support
- **Formatting**: Prettier 3.4.2
- **Package Manager**: pnpm (backend), npm (frontend)

## Infrastructure Stack

### Docker Services (Latest Versions)
- **PostgreSQL 17-alpine**: Main application database
- **Redis 7-alpine**: Cache and session management
- **Eclipse Mosquitto 2.0**: MQTT broker for IoT sensor communication
- **pgAdmin 4**: Database administration interface (optional)
- **Redis Commander**: Redis management interface (optional)

### Database Configuration
- Database: `orto_db`
- User: `orto_user`
- Extensions: UUID, pgcrypto
- Health checks and initialization scripts included

### MQTT Configuration
- MQTT Port: 1883 (standard protocol)
- WebSocket Port: 9001 (for web applications)
- Anonymous access enabled for development
- Persistent message storage
- Topics structure: `orto/{garden_id}/sensor/{sensor_type}/{zone_id}`

### Redis Configuration
- Port: 6379
- Password protected
- Persistent storage enabled (AOF)
- Health checks included

## Project Structure
```
orto/
├── backend/
│   ├── src/
│   │   ├── app.controller.ts    # Main controller
│   │   ├── app.service.ts       # Main service
│   │   ├── app.module.ts        # Root module
│   │   └── main.ts              # Application entry
│   ├── test/                    # E2E tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main component
│   │   ├── main.tsx             # React entry
│   │   └── assets/              # Static assets
│   ├── public/                  # Public assets
│   └── package.json
├── docker-compose.yml           # Infrastructure stack
├── .env                         # Environment variables
├── mosquitto/                   # MQTT broker config
├── init-scripts/                # Database initialization
└── memory-bank/                 # Documentation
```

## Development Workflow
- **Infrastructure**: `docker compose up -d` (starts all services)
- **Backend Start**: `cd backend && pnpm start:dev`
- **Frontend Start**: `cd frontend && npm run dev`
- **Backend Build**: `nest build`
- **Frontend Build**: `tsc -b && vite build`

## Current Configuration
- Docker Compose stack fully configured with health checks
- Environment variables managed through `.env` file
- Initialization scripts for database setup
- Both backend and frontend have ESLint + Prettier configured
- TypeScript strict mode enabled
- Infrastructure ready for application development

## Dependencies Status
- All dependencies are up-to-date
- Docker infrastructure implemented and ready
- Database schemas and permissions configured
- MQTT broker ready for IoT sensor integration
- Redis cache ready for session management and performance optimization
