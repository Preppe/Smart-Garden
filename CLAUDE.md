# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (NestJS)
```bash
cd backend
pnpm install                    # Install dependencies
pnpm start:dev                  # Development server with hot reload (port 3000)
pnpm start:debug               # Debug mode development server
pnpm build                     # Production build
pnpm test                      # Run unit tests
pnpm test:e2e                  # Run end-to-end tests
pnpm test:cov                  # Run tests with coverage
pnpm lint                      # ESLint with auto-fix
pnpm format                    # Prettier formatting
pnpm format:check              # Check Prettier formatting
```

### Frontend (React + Vite)
```bash
cd frontend
npm install                    # Install dependencies
npm run dev                    # Development server (port 5173)
npm run build                  # Production build
npm run preview                # Preview production build
npm run codegen                # Generate GraphQL types from backend schema
npm run lint                   # ESLint
npm run format                 # Prettier formatting
npm run format:check           # Check Prettier formatting
```

### Infrastructure
```bash
docker-compose up -d           # Start all services (PostgreSQL, Redis, MQTT, InfluxDB)
docker-compose down            # Stop all services
docker-compose logs -f         # View logs
docker-compose --profile admin up -d  # Include admin tools (pgAdmin, Redis Commander)
```

## Architecture Overview

### Tech Stack
- **Backend**: NestJS 11.0.1 with TypeScript, GraphQL (Apollo Server), PostgreSQL, Redis
- **Frontend**: React 18.3.1 with TypeScript, Vite, Apollo Client, Shadcn/ui, Tailwind CSS
- **Infrastructure**: Docker Compose with PostgreSQL, Redis, MQTT (Mosquitto), InfluxDB

### Monorepo Structure
- `backend/` - NestJS GraphQL API server
- `frontend/` - React SPA dashboard
- `memory-bank/` - Project documentation and context
- `docker-compose.yml` - Infrastructure services

### Backend Architecture (NestJS)
The backend follows a modular architecture with clear separation of concerns:

- **AuthModule**: JWT authentication with Passport.js strategies
- **UsersModule**: User management and profile operations
- **GardensModule**: Garden and cultivation management with geolocation
- **SensorsModule**: IoT sensor integration with MQTT support

Key patterns:
- Service-based architecture - modules export services for cross-module dependencies
- GraphQL-first API with automatic schema generation
- TypeORM with proper entity relations and validation
- JWT authentication with guards and decorators (`@UseGuards(JwtAuthGuard)`, `@CurrentUser()`)
- Cross-module validation through service dependencies (e.g., SensorsModule uses GardensService)

### Frontend Architecture (React)
Modern React application with type-safe GraphQL integration:

- **GraphQL Code Generation**: Automatic TypeScript types from backend schema via `@graphql-codegen`
- **Apollo Client**: GraphQL state management with intelligent caching and error handling
- **Shadcn/ui Component System**: 40+ professional UI components with Radix UI primitives
- **Zustand**: Local state management for authentication
- **React Router**: Route-based navigation with protected routes
- **Tailwind CSS**: Custom design system with emerald/green theme

### Database Schema
Core entities with proper relations:
- **User** (1:N) → **Garden** (1:N) → **Cultivation**
- **Garden** and **Cultivation** both relate to **Sensor** entities
- Support for geolocation, growth stages, sensor thresholds, and calibration data

## Key Development Patterns

### GraphQL Integration
The frontend uses automatic code generation for type-safe GraphQL operations:

```bash
npm run codegen  # Generates TypeScript types and React hooks from backend schema
```

Generated hooks pattern:
```typescript
// Query hooks
const { data, loading, error } = useGetUserGardensQuery();
const { data } = useGetUserCultivationsQuery(); // Direct cultivation query for performance

// Mutation hooks  
const [createGarden] = useCreateGardenMutation();
const [loginUser] = useLoginUserMutation();
```

### Authentication Flow
- JWT tokens managed via Zustand store (`src/stores/authStore.ts`)
- Apollo Client automatically adds Bearer token to requests
- Protected routes use `<ProtectedRoute>` component
- Backend validates ownership through service methods

### Component Architecture
- **Layout System**: Shared `Layout` component with `Header` and `Sidebar`
- **UI Components**: Consistent design system through `components/ui/`
- **Page Components**: Route-specific components in `pages/`
- **Form Patterns**: React Hook Form with Zod validation
- **Data Visualization**: Recharts for sensor data and analytics

### Code Quality Standards
- **TypeScript Strict Mode**: Full type safety across frontend and backend
- **ESLint + Prettier**: Automated code formatting and linting
- **GraphQL Schema Sync**: Types automatically stay in sync with backend changes
- **Service Dependencies**: Proper module separation with exported services for validation

## Development Workflow

### Starting Development
1. Start infrastructure: `docker-compose up -d`
2. Start backend: `cd backend && pnpm start:dev`
3. Start frontend: `cd frontend && npm run dev`
4. Access dashboard: http://localhost:5173
5. GraphQL playground: http://localhost:3000/graphql

### Adding New Features
1. **Backend**: Add entities, services, resolvers following modular pattern
2. **Frontend**: Run `npm run codegen` to generate new GraphQL types
3. **UI**: Use existing component system and follow design patterns
4. **Testing**: Run `pnpm test` (backend) and ensure build succeeds

### GraphQL Schema Updates
When backend schema changes, frontend types update automatically:
1. Modify backend entities/resolvers
2. Run `npm run codegen` in frontend
3. New types and hooks are generated and available immediately

## Smart Garden Domain Context

This is a comprehensive SaaS platform for smart garden management:
- **Multi-Garden Management**: Users can manage multiple gardens with zones
- **IoT Integration**: Real-time sensor data (temperature, humidity, soil moisture, pH, light)
- **Plant Tracking**: Growth stage monitoring and cultivation management
- **Automation**: Smart watering and lighting systems
- **Analytics**: Data visualization and health insights
- **MQTT Communication**: Real-time IoT sensor data streaming

The system transforms raw sensor data into actionable gardening insights to reduce plant loss and increase yields through intelligent automation.