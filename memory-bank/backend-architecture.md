# Backend Orto - Architettura Modulare NestJS

## Struttura Moduli Implementata

### 1. UsersModule
- **Responsabilità**: Gestione utenti base
- **Entities**: User
- **Services**: UsersService (CRUD utenti, validazione password)
- **Exports**: UsersService (per altri moduli)

### 2. AuthModule  
- **Responsabilità**: Autenticazione JWT
- **Guards**: JwtAuthGuard
- **Decorators**: @CurrentUser
- **Strategies**: JWT strategy

### 3. GardensModule
- **Responsabilità**: Gestione orti e coltivazioni + validazione cross-module
- **Entities**: Garden, Cultivation
- **Services**: GardensService
- **Exports**: GardensService (per SensorsModule)
- **Dependencies**: UsersModule (per UsersService)

### 4. SensorsModule
- **Responsabilità**: Gestione sensori IoT
- **Entities**: Sensor
- **Services**: SensorsService  
- **Dependencies**: GardensModule (per validazione ownership)

## Entities Schema

### User Entity
```typescript
- id: UUID (PK)
- email: string (unique)
- username: string (unique) 
- firstName: string
- lastName: string
- password: string (hashed)
- isActive: boolean
- createdAt: Date
- updatedAt: Date
```

### Garden Entity
```typescript
- id: UUID (PK)
- name: string
- description?: string
- type: GardenType (indoor|outdoor|greenhouse)
- location?: GardenLocation { latitude?, longitude?, address? }
- user: User (ManyToOne)
- cultivations: Cultivation[] (OneToMany)
- sensors: Sensor[] (OneToMany)
- createdAt: Date
- updatedAt: Date
```

### Cultivation Entity
```typescript
- id: UUID (PK)
- plantName: string
- variety?: string
- plantedDate: Date
- expectedHarvestDate?: Date
- growthStage: GrowthStage (seed|seedling|vegetative|flowering|fruiting|harvest)
- notes?: string
- garden: Garden (ManyToOne)
- sensors: Sensor[] (OneToMany)
- createdAt: Date
- updatedAt: Date
```

### Sensor Entity
```typescript
- id: UUID (PK)
- deviceId: string (unique)
- name: string
- type: SensorType (temperature|humidity|soil_moisture|light|ph|air_quality)
- unit: string
- locationLevel: SensorLocationLevel (garden|cultivation)
- isActive: boolean
- calibration?: SensorCalibration { offset?, multiplier?, lastCalibrated? }
- thresholds?: SensorThresholds { min?, max?, optimal_min?, optimal_max? }
- garden?: Garden (ManyToOne, nullable)
- cultivation?: Cultivation (ManyToOne, nullable)
- createdAt: Date
- updatedAt: Date
```

## Relazioni Database
```
User (1) ←→ (N) Garden (1) ←→ (N) Cultivation
              ↓                    ↓
            Sensor              Sensor
```

## Best Practices Implementate

### 1. Service-Based Architecture
```typescript
// ✅ Corretto: uso services esterni
constructor(private usersService: UsersService) {}
constructor(private gardensService: GardensService) {}

// ❌ Evitato: accesso diretto repository esterni
constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}
```

### 2. Relations Format Ottimizzato
```typescript
// ✅ Formato corretto
relations: { cultivations: true, sensors: true }
relations: { garden: true, cultivation: true }

// ❌ Formato deprecato
relations: ['cultivations', 'sensors']
```

### 3. Cross-Module Validation
```typescript
// GardensService espone metodi per altri moduli
async validateGardenOwnership(gardenId: string, userId: string): Promise<Garden>
async validateCultivationOwnership(cultivationId: string, userId: string): Promise<Cultivation>
```

### 4. GraphQL Types Condivisi
```typescript
// Tipi condivisi per evitare conflitti
- garden-location.input.ts
- sensor-calibration.input.ts  
- sensor-thresholds.input.ts
```

### 5. Module Dependencies
```typescript
// GardensModule
imports: [
  TypeOrmModule.forFeature([Garden, Cultivation]),
  UsersModule  // Per UsersService
],
exports: [GardensService]  // Per SensorsModule

// SensorsModule
imports: [
  TypeOrmModule.forFeature([Sensor]),
  GardensModule  // Per GardensService
],
```

## API GraphQL Organizzate

### Gardens API
```graphql
# Queries
getUserGardens: [Garden!]!
getGarden(id: ID!): Garden!
getCultivation(id: ID!): Cultivation!

# Mutations  
createGarden(input: CreateGardenInput!): Garden!
updateGarden(id: ID!, input: UpdateGardenInput!): Garden!
deleteGarden(id: ID!): Boolean!
createCultivation(input: CreateCultivationInput!): Cultivation!
updateCultivation(id: ID!, input: UpdateCultivationInput!): Cultivation!
deleteCultivation(id: ID!): Boolean!
```

### Sensors API
```graphql
# Queries
getSensor(id: ID!): Sensor!
getUserSensors: [Sensor!]!
getGardenSensors(gardenId: ID!): [Sensor!]!
getCultivationSensors(cultivationId: ID!): [Sensor!]!

# Mutations
createSensor(input: CreateSensorInput!): Sensor!
updateSensor(id: ID!, input: UpdateSensorInput!): Sensor!
deleteSensor(id: ID!): Boolean!
```

## Sicurezza e Validazione

### 1. JWT Authentication
- Tutti gli endpoint protetti con @UseGuards(JwtAuthGuard)
- User context estratto con @CurrentUser('sub') userId

### 2. Ownership Validation
- Ogni operazione valida che l'utente possieda la risorsa
- Cross-module validation tramite services dedicati
- Cascading validation (User → Garden → Cultivation → Sensor)

### 3. Input Validation
- DTO con class-validator decorators
- Enum validation per types
- UUID validation per relations

## File Structure Finale
```
backend/src/
├── users/
│   ├── entities/user.entity.ts
│   ├── dto/create-user.input.ts, update-user.input.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── resolvers/users.resolver.ts
├── auth/
│   ├── dto/login.input.ts, register.input.ts
│   ├── auth.service.ts, auth.module.ts
│   ├── guards/jwt-auth.guard.ts
│   ├── strategies/jwt.strategy.ts
│   ├── decorators/current-user.decorator.ts
│   └── resolvers/auth.resolver.ts
├── gardens/
│   ├── entities/garden.entity.ts, cultivation.entity.ts
│   ├── dto/
│   │   ├── garden-location.input.ts (shared)
│   │   ├── create-garden.input.ts, update-garden.input.ts
│   │   └── create-cultivation.input.ts, update-cultivation.input.ts
│   ├── gardens.service.ts (+ validation methods)
│   ├── gardens.module.ts
│   └── gardens.resolver.ts
└── sensors/
    ├── entities/sensor.entity.ts
    ├── dto/
    │   ├── sensor-calibration.input.ts (shared)
    │   ├── sensor-thresholds.input.ts (shared)
    │   ├── create-sensor.input.ts
    │   └── update-sensor.input.ts
    ├── sensors.service.ts
    ├── sensors.module.ts
    └── sensors.resolver.ts
```

## Testing e Build
- ✅ Build testato e funzionante
- ✅ GraphQL schema generato senza conflitti
- ✅ TypeScript completamente tipizzato
- ✅ Dependencies injection risolte correttamente

## Prossimi Passi
- Setup database migrations
- Implementazione MQTT per dati sensori in tempo reale
- Setup Redis per caching
- API testing con Jest
- Frontend integration con Apollo Client
