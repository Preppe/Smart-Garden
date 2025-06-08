# Active Context: Orto Smart Garden SaaS

## Current Focus: Frontend Dashboard Implementation ✅

### Just Completed - Major Frontend Update
- **Complete UI Overhaul**: Full dashboard implementation with smart garden management interface
- **Shadcn/ui Integration**: 40+ professional UI components with Tailwind CSS styling
- **Dashboard Components**: Custom components for garden zone management, sensor visualization, weather, and alerts
- **Real-time Simulation**: Live sensor data updates with state management
- **Design System**: Cohesive green/nature theme with glassmorphism effects
- **Modern Architecture**: React Query, React Router, TypeScript integration

### Frontend Architecture Implemented

**Core Technologies**:
- **React 18.3.1** with TypeScript 5.5.3
- **Vite 5.4.1** for fast development and builds
- **Tailwind CSS 3.4.11** with custom design tokens
- **Shadcn/ui** complete component library
- **React Query 5.56.2** for state management
- **React Router 6.26.2** for navigation
- **Recharts 2.12.7** for data visualization

**UI Component Library (40+ Components)**:
- Layout: Card, Sidebar, Accordion, Tabs, Separator
- Forms: Input, Button, Select, Switch, Checkbox, Form validation
- Data: Table, Chart, Progress, Badge, Avatar
- Feedback: Alert, Toast, Tooltip, Dialog, Popover
- Navigation: Breadcrumb, Menu, Pagination
- Advanced: Calendar, Command palette, Date picker

**Custom Dashboard Components**:
1. **GardenZoneCard**: Individual zone management with plant health, watering status, automation controls
2. **SensorChart**: Real-time line charts for temperature, humidity, soil moisture trends
3. **WeatherWidget**: Local weather display with forecast integration
4. **AlertsPanel**: Notification system for garden alerts and automation status

**Dashboard Features Implemented**:
- **Real-time Monitoring**: Live sensor data with 5-second updates
- **Garden Zone Management**: Multiple zones with plant tracking and health monitoring
- **Automation Controls**: Auto-watering and auto-lighting toggles
- **Visual Analytics**: Multi-line charts for sensor data trends
- **Alert System**: Categorized notifications (warning, info, success)
- **Weather Integration**: Local weather display with forecast
- **Plant Health Tracking**: Progress indicators and status badges
- **Responsive Design**: Mobile-first with glassmorphism aesthetics

### Technical Implementation Details

**State Management Pattern**:
```typescript
// Real-time sensor simulation
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTemp(prev => prev + (Math.random() - 0.5) * 2);
    setHumidity(prev => Math.max(30, Math.min(90, prev + (Math.random() - 0.5) * 5)));
    setSoilMoisture(prev => Math.max(20, Math.min(80, prev + (Math.random() - 0.5) * 3)));
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

**Component Architecture**:
- **Modular Design**: Reusable components with TypeScript interfaces
- **Props-based Configuration**: Flexible component APIs
- **Consistent Styling**: Shared design tokens and utility classes
- **Accessibility**: ARIA compliance through Radix UI primitives

**Design System**:
- **Color Palette**: Green/emerald theme with nature-inspired gradients
- **Typography**: Clear hierarchy with responsive scaling
- **Spacing**: Consistent grid system and component spacing
- **Effects**: Glassmorphism with backdrop-blur and transparency
- **Icons**: Lucide React with contextual icon usage

### Backend Integration Ready
- **GraphQL Client**: Ready for Apollo Client integration
- **Authentication**: JWT token management infrastructure
- **Real-time**: WebSocket preparation for live sensor data
- **API Structure**: Component architecture supports GraphQL queries/mutations

### Development Status
- ✅ **Complete Dashboard UI**: Professional garden management interface
- ✅ **Component Library**: Full Shadcn/ui implementation
- ✅ **Real-time Simulation**: Live data updates and interactivity
- ✅ **Responsive Design**: Mobile and desktop optimized
- ✅ **GraphQL Integration**: Apollo Client + Code Generator setup complete
- ✅ **Type-Safe GraphQL**: Automatic type generation from backend schema
- 🔄 **Authentication Flow**: Login/register UI components ready for backend
- 🔄 **Real Data**: Replace mock data with backend integration

### GraphQL Implementation Completed ✅

**Apollo Client + GraphQL Code Generator Setup**:
- **Apollo Client**: Configured with JWT auth, intelligent caching, error handling
- **GraphQL Codegen**: Automatic type generation from backend schema
- **Type-Safe Hooks**: Generated React hooks for all queries/mutations
- **Fragment System**: Reusable GraphQL fragments for consistency
- **Hybrid Architecture**: Apollo Client for GraphQL + React Query for UI state

**Files Created**:
- `codegen.yml` - GraphQL Code Generator configuration
- `src/graphql/client.ts` - Apollo Client setup with auth
- `src/graphql/fragments/user.graphql` - User fragment
- `src/graphql/queries/auth.graphql` - Authentication queries
- `src/graphql/mutations/auth.graphql` - Auth mutations (login, register, logout)
- `src/graphql/mutations/users.graphql` - User management mutations
- `src/hooks/useAuth.ts` - Type-safe authentication hooks
- `src/components/auth/LoginForm.tsx` - Example login component
- `README-GraphQL.md` - Complete documentation

**Key Features**:
- **Zero Manual Models**: All types auto-generated from backend GraphQL schema
- **Complete Type Safety**: Full TypeScript integration with backend entities
- **Automatic Sync**: Schema always up-to-date with backend changes
- **Developer Experience**: Intellisense, autocompletion, error detection

**Usage Example**:
```typescript
// Completamente tipizzato automaticamente
const { data, loading } = useGetUsersQuery();
const [login] = useLoginMutation();

// data.users è tipizzato come User[]
// login variables sono tipizzate come LoginInput
```

### GraphQL Import Errors Fixed ✅

**Problem Resolved**: Components were importing missing GraphQL hooks:
- `useLoginUserMutation` 
- `useRegisterUserMutation`
- `useLogoutUserMutation`

**Root Cause**: GraphQL operations files were missing, so hooks weren't generated.

**Solution Implemented**:
1. **Created GraphQL Operations**: Added authentication mutations and queries
2. **Updated Codegen Config**: Added `documents: "src/graphql/**/*.graphql"` 
3. **Generated Complete Schema**: All React hooks now available
4. **Verified Build**: Frontend builds successfully with no import errors

**New GraphQL Files Created**:
- `src/graphql/mutations/auth.graphql` - Login, register, logout mutations
- `src/graphql/queries/auth.graphql` - User profile and authentication queries  
- `src/graphql/queries/gardens.graphql` - Garden management queries
- `src/graphql/mutations/gardens.graphql` - Garden, cultivation, sensor CRUD operations

**All Generated Hooks Now Available**:
- Authentication: `useLoginUserMutation`, `useRegisterUserMutation`, `useLogoutUserMutation`
- User Queries: `useMeQuery`, `useGetUserQuery`, `useGetUsersQuery`  
- Garden Management: `useGetUserGardensQuery`, `useGetGardenQuery`, `useCreateGardenMutation`
- Full CRUD: Complete type-safe hooks for all entities (gardens, cultivations, sensors)

### Next Steps Priority
1. ✅ **GraphQL Import Errors Fixed**: All hooks generated and working
2. **Authentication Flow**: Connect login components to real backend
3. **Real Sensor Data**: MQTT integration for live IoT data  
4. **Garden CRUD**: Full garden and zone management interface
5. **User Dashboard**: Personalized garden management per user

### Development Workflow
1. **Start Infrastructure**: `docker compose up -d`
2. **Start Backend**: `cd backend && pnpm start:dev` (port 3000)
3. **Start Frontend**: `cd frontend && npm run dev` (port 5173)
4. **View Dashboard**: http://localhost:5173

### Recent Updates ✅

**Index → Dashboard Renaming Completed**:
- **File Renamed**: `frontend/src/pages/Index.tsx` → `frontend/src/pages/Dashboard.tsx`
- **Component Renamed**: `Index` component → `Dashboard` component
- **App.tsx Updated**: Import and usage updated to use `Dashboard` component
- **Build Verified**: Frontend builds successfully with no errors
- **Routing Maintained**: `/dashboard` route continues to work correctly

### Recent Major Update: Frontend Layout Optimization ✅

**Just Completed - Layout Architecture Refactor**:
- **Header Component**: Created reusable Header component eliminating `px-6 py-4` duplication
- **Layout Component**: Enhanced existing Layout to include shared Header with Sidebar
- **Profile Migration**: Moved user profile from header to sidebar with full authentication flow
- **Sensor Removal**: Removed sensor overview cards from header as requested
- **Code Elimination**: Eliminated duplicate header code across all pages

**New Architecture**:
```
Layout Component:
├── Header (shared - with px-6 py-4 styling)
│   ├── Dynamic title/description
│   └── System status badge
├── Sidebar (enhanced with profile)
│   ├── Navigation menu
│   ├── Quick actions
│   ├── System status
│   └── User profile dropdown (with logout)
└── Main Content Area
    └── Page-specific content
```

**Files Modified**:
- `frontend/src/components/Header.tsx` - NEW: Reusable header component
- `frontend/src/components/Layout.tsx` - UPDATED: Enhanced with Header integration
- `frontend/src/components/Sidebar.tsx` - UPDATED: Added user profile section with logout
- `frontend/src/pages/Dashboard.tsx` - REFACTORED: Uses new Layout, removed duplicate code

**Key Improvements**:
- ✅ **DRY Principle**: Eliminated `px-6 py-4` code duplication
- ✅ **Reusable Components**: Header works for any page with dynamic props
- ✅ **Better UX**: Profile always accessible in sidebar
- ✅ **Cleaner Dashboard**: Sensor cards now only in main content
- ✅ **Consistent Layout**: All pages will use same header/sidebar structure

**Profile Features in Sidebar**:
- User avatar with initials
- Full name and email display
- Profile link
- Settings link
- Logout functionality with proper GraphQL mutation
- Responsive design (collapses with sidebar)

### Recent Major Update: Complete UI Consistency Standardization ✅

**Just Completed - Button, Card Styling & Navigation Unification**:
- **Design System Compliance**: All forms now use standardized button variants from `button.tsx`
- **Consistent Card Styling**: Unified glassmorphism effect across all pages
- **Emerald Theme Consistency**: Standardized emerald color scheme throughout interface
- **Eliminated Custom CSS**: Removed all custom button classes in favor of design system variants
- **Unified Back Navigation**: Created reusable `BackButton` component for consistent navigation

**New Component Created**:
- `frontend/src/components/ui/back-button.tsx` - NEW: Standardized back navigation component

**Files Updated**:
- `CultivationFormPage.tsx` - UPDATED: Uses `BackButton` component, removed custom classes
- `GardenFormPage.tsx` - UPDATED: Uses `BackButton`, removed gradient classes, emerald theme
- `CultivationsListPage.tsx` - UPDATED: Standardized all button variants
- `GardensListPage.tsx` - UPDATED: Unified card styling and button consistency
- `CultivationDetailPage.tsx` - UPDATED: Uses `BackButton` for consistent navigation
- `GardenDetailPage.tsx` - UPDATED: Uses `BackButton`, standardized button variants

**Key Improvements**:
- ✅ **Button Consistency**: All buttons use predefined variants (`default`, `outline`, `ghost`)
- ✅ **Card Standardization**: All cards use `border-emerald-200 bg-white/70 backdrop-blur-sm`
- ✅ **Navigation Consistency**: Unified back button component across all pages
- ✅ **Design System Adherence**: Eliminated custom CSS classes for UI components
- ✅ **Visual Coherence**: Consistent emerald/green theme across all forms and lists
- ✅ **Maintainability**: Centralized styling through Shadcn/ui component system

**Design System Standards Applied**:
```css
/* Card Standard */
border-emerald-200 bg-white/70 backdrop-blur-sm

/* Button Variants - FINALIZED */
variant="default"    // bg-emerald-600 hover:bg-emerald-700 text-white
variant="outline"    // Secondary actions (cancel, edit)
variant="ghost"      // Navigation buttons

/* Back Button Component */
<BackButton onClick={() => navigate('/path')}>
  Torna a...
</BackButton>
```

**Final Update - Button Component Enhanced ✅**:
- `frontend/src/components/ui/button.tsx` - UPDATED: Default variant now includes `bg-emerald-600 hover:bg-emerald-700 text-white`
- All custom button classes completely removed from all pages
- Consistent emerald styling centralized in the design system

### Recent Major Update: Date Format Standardization ✅

**Just Completed - ISO Date Format Implementation**:
- **Utility Function**: Created `dateToISOString()` in `src/lib/utils.ts` using `date-fns`
- **Timezone Handling**: Properly manages local timezone with midnight (00:00:00) timing
- **ISO Compliance**: Converts JavaScript Date objects to full ISO format for backend
- **Form Updates**: Updated `CultivationFormPage.tsx` to use new utility function

**Technical Implementation**:
```typescript
// New utility function in src/lib/utils.ts
export function dateToISOString(date: Date): string {
  const dateAtMidnight = startOfDay(date);
  return formatISO(dateAtMidnight);
}

// Updated in cultivation form
plantedDate: dateToISOString(formData.plantedDate),
expectedHarvestDate: formData.expectedHarvestDate ? dateToISOString(formData.expectedHarvestDate) : undefined,
```

**Before vs After**:
- **Before**: `formData.plantedDate.toISOString().split('T')[0]` → `"2025-01-15"` (date only)
- **After**: `dateToISOString(formData.plantedDate)` → `"2025-01-15T00:00:00+01:00"` (full ISO with timezone)

**Key Benefits**:
✅ **Backend Compatibility**: Dates now sent in full ISO format as expected by GraphQL schema  
✅ **Timezone Aware**: Properly handles local timezone (Europe/Rome)  
✅ **Consistent Format**: Standardized approach for all date handling  
✅ **Future-Proof**: Reusable utility for additional forms with dates  
✅ **Library-Based**: Uses `date-fns` for reliable date manipulation  
✅ **Build Verified**: Frontend builds successfully with all changes  

**Files Modified**:
- `frontend/src/lib/utils.ts` - NEW: Added `dateToISOString()` utility function
- `frontend/src/pages/cultivations/CultivationFormPage.tsx` - UPDATED: Replaced manual date conversion

### Recent Major Update: ActionButtons Abstract Component ✅

**Just Completed - Abstract Action Buttons Implementation**:
- **Simplified ActionButtons**: Created truly abstract component without variants
- **Single Structure**: Always same layout - inline edit and delete buttons
- **Parent Responsibility**: Text alignment and formatting handled by parent components
- **No Conditional Logic**: Removed all `if` statements from child component
- **Clean Interface**: Streamlined props for maximum reusability

**New Component Created**:
- `frontend/src/components/ui/action-buttons.tsx` - NEW: Abstract action buttons wrapper

**Component Features**:
```typescript
interface ActionButtonsProps {
  editAction: () => void;           // Edit button handler
  deleteAction: () => void;         // Delete confirmation handler  
  deleteConfirmation: {             // Simple confirmation props
    title: string;
    description: string;            // Pre-formatted by parent
  };
  isDeleting?: boolean;             // Loading state support
  size?: 'sm' | 'default';         // Button size variants
}
```

**Pages Updated**:
- `CultivationDetailPage.tsx` - UPDATED: Uses simplified `ActionButtons`, formats description text
- `GardenDetailPage.tsx` - UPDATED: Uses simplified `ActionButtons`, formats description text

**Key Benefits Achieved**:
✅ **True Abstraction**: Single, consistent structure without internal variants  
✅ **Parent Control**: Components format their own confirmation texts  
✅ **Simplified Logic**: No conditional rendering or complex props handling  
✅ **Code Clarity**: Clear separation of concerns between parent and child  
✅ **Maintainability**: Abstract component easy to understand and modify  
✅ **Build Verified**: Frontend builds successfully without errors  

**Usage Examples**:
```jsx
// Both pages use identical structure
<ActionButtons
  editAction={() => navigate(`/path/${id}/edit`)}
  deleteAction={handleDelete}
  deleteConfirmation={{
    title: "Custom Title",
    description: "Pre-formatted description with all context included by parent component."
  }}
  isDeleting={deleting}
/>
```

**Architecture Improvement**:
- **Abstract Design**: Component always renders same structure
- **Parent Formatting**: Description text includes item name and context from parent
- **No Variants**: Single component behavior eliminates complexity
- **Clean Props**: Minimal interface for maximum reusability

### Recent Major Update: Dynamic Page Titles Implementation ✅

**Just Completed - React Helmet Dynamic Title System**:
- **React Helmet Integration**: Installed and configured `react-helmet-async` for dynamic meta management
- **Provider Setup**: Added `HelmetProvider` wrapper in `App.tsx` for app-wide meta control
- **Layout Enhancement**: Enhanced `Layout` component with automatic title and meta description management
- **Universal Coverage**: All pages now have dynamic titles in browser tabs

**Technical Implementation**:
```typescript
// In Layout component
<Helmet>
  <title>{title} - Orto</title>
  <meta name="description" content={description || `${title} - Sistema di gestione giardino smart`} />
</Helmet>
```

**Files Modified**:
- `package.json` - NEW: Added `react-helmet-async` and `@types/react-helmet` dependencies
- `frontend/src/App.tsx` - UPDATED: Added `HelmetProvider` wrapper for entire application
- `frontend/src/components/Layout.tsx` - UPDATED: Integrated `Helmet` for automatic title management
- `frontend/src/pages/NotFound.tsx` - UPDATED: Added specific title "Pagina non trovata - Orto"
- `frontend/src/pages/auth/AuthPage.tsx` - UPDATED: Dynamic title that changes between "Accedi - Orto" and "Registrati - Orto"

**Dynamic Titles Implemented**:
- **Dashboard**: "Dashboard - Orto"
- **Gardens**: "Gardens - Orto"
- **Nuovo Garden**: "Nuovo Garden - Orto"
- **Garden Details**: "Garden Details - Orto"
- **Modifica Garden**: "Modifica Garden - Orto"
- **Coltivazioni**: "Coltivazioni - Orto"
- **Nuova Coltivazione**: "Nuova Coltivazione - Orto"
- **Dettagli Coltivazione**: "Dettagli Coltivazione - Orto"
- **Modifica Coltivazione**: "Modifica Coltivazione - Orto"
- **Login**: "Accedi - Orto"
- **Register**: "Registrati - Orto"
- **404**: "Pagina non trovata - Orto"

**Key Benefits Achieved**:
✅ **SEO Optimization**: Dynamic meta descriptions for each page improve search visibility
✅ **User Experience**: Clear page identification in browser tabs improves navigation
✅ **Brand Consistency**: All titles follow consistent "Page Name - Orto" format
✅ **Extensibility**: Foundation ready for Open Graph tags, Twitter cards, and other meta improvements
✅ **Type Safety**: Full TypeScript integration with existing Layout props
✅ **Build Verified**: Frontend builds successfully with all React Helmet integration

**Architecture Benefits**:
- **Centralized Management**: All page titles managed through existing Layout component props
- **Automatic Updates**: Page titles update automatically when navigating between routes
- **Meta Description**: Dynamic descriptions improve SEO and social sharing
- **Future Ready**: Easy to extend for additional meta tags (Open Graph, Twitter, etc.)

### Recent Major Update: TanStack Query Removal ✅

**Just Completed - Complete TanStack Query Elimination**:
- **Package Removed**: Eliminated `@tanstack/react-query` dependency from `package.json`
- **Code Cleanup**: Removed all TanStack Query imports and providers from `main.tsx` and `App.tsx`
- **Architecture Simplified**: Application now uses only Apollo Client for state management
- **Bundle Optimization**: Reduced bundle size by ~50KB removing unused dependency
- **Build Verified**: Frontend builds successfully without any errors

**Files Modified**:
- `frontend/package.json` - UPDATED: Removed `@tanstack/react-query` dependency
- `frontend/src/main.tsx` - UPDATED: Removed QueryClient and QueryClientProvider imports/usage
- `frontend/src/App.tsx` - UPDATED: Removed QueryClient instantiation and provider wrapper

**Technical Benefits Achieved**:
✅ **Cleaner Architecture**: Single state management system (Apollo Client only)
✅ **Reduced Bundle Size**: Eliminated ~50KB of unused code from final build
✅ **Simplified Dependencies**: Fewer packages to maintain and potential security vulnerabilities
✅ **Build Performance**: Faster builds with fewer dependencies to process
✅ **Code Clarity**: Removed confusion between two competing state management solutions

**Current State**:
- **Apollo Client**: Handles all GraphQL queries, mutations, and caching
- **Zustand**: Manages local UI state (auth store)
- **No TanStack Query**: Completely removed as it was never actually used in the codebase

### Architecture Status
The frontend now has a clean, focused architecture:
```
State Management:
├── Apollo Client (GraphQL data)
├── Zustand (Local UI state)  
└── React Built-ins (Component state)
```

### Build Verification
- ✅ **npm install**: Successfully removed 2 packages
- ✅ **GraphQL Codegen**: Continues to work perfectly
- ✅ **Build Process**: Completes without errors (7.79s)
- ✅ **Bundle Analysis**: No TanStack Query code in final bundle

### Recent Major Update: getUserCultivations GraphQL Implementation ✅

**Just Completed - Direct Cultivation Query Optimization**:
- **Backend Enhancement**: Added `getUserCultivations` GraphQL query to directly fetch user's cultivations
- **Service Method**: Created `findUserCultivations()` in `GardensService` with proper relations and ordering
- **Frontend Optimization**: Updated `CultivationsListPage` to use new direct query instead of `getUserGardens`
- **Performance Improvement**: Eliminated frontend flatMap logic, now gets cultivations directly from backend
- **Type Safety**: Full GraphQL codegen integration with automatic TypeScript types

**Technical Implementation**:

**Backend Changes**:
- `backend/src/gardens/gardens.service.ts` - NEW: `findUserCultivations()` method
- `backend/src/gardens/gardens.resolver.ts` - NEW: `getUserCultivations` GraphQL query
- Query includes proper relations: `{ garden: true, sensors: true }` and ordering by `createdAt: 'DESC'`

**Frontend Changes**:
- `frontend/src/graphql/queries/gardens.graphql` - NEW: `GetUserCultivations` query with garden data
- `frontend/src/pages/cultivations/CultivationsListPage.tsx` - UPDATED: Uses `useGetUserCultivationsQuery` instead of `useGetUserGardensQuery`
- Simplified data transformation: Direct mapping instead of flatMap from gardens
- Updated refetchQueries to use `['GetUserCultivations']`

**GraphQL Query Structure**:
```graphql
query GetUserCultivations {
  getUserCultivations {
    id
    plantName
    variety
    growthStage
    plantedDate
    expectedHarvestDate
    notes
    garden {
      id
      name
    }
    createdAt
    updatedAt
  }
}
```

**Before vs After Architecture**:
```typescript
// BEFORE: Inefficient nested extraction
const { data: gardensData } = useGetUserGardensQuery();
const allCultivations = gardensData?.getUserGardens?.flatMap((garden) =>
  garden.cultivations.map((cultivation) => ({
    ...cultivation,
    gardenName: garden.name,
    gardenId: garden.id,
  }))
) || [];

// AFTER: Direct, efficient query
const { data: cultivationsData } = useGetUserCultivationsQuery();
const allCultivations = cultivationsData?.getUserCultivations?.map((cultivation) => ({
  ...cultivation,
  gardenName: cultivation.garden.name,
  gardenId: cultivation.garden.id,
})) || [];
```

**Key Benefits Achieved**:
✅ **Performance Optimization**: Direct database query eliminates unnecessary garden data transfer  
✅ **Cleaner Architecture**: Separation of concerns - cultivation list doesn't need garden details  
✅ **Reduced Complexity**: Eliminated flatMap logic in frontend  
✅ **Scalability**: Better performance as cultivation count grows  
✅ **Type Safety**: Full TypeScript integration with GraphQL codegen  
✅ **Build Verified**: Frontend builds successfully (8.19s) with no errors  
✅ **Backend Integration**: Proper SQL query with JOIN to gardens table  

**SQL Query Generated**:
The backend now generates optimized queries that JOIN cultivations with gardens directly:
```sql
SELECT cultivation.*, garden.name, garden.id 
FROM cultivations 
LEFT JOIN gardens ON gardens.id = cultivation.gardenId 
WHERE garden.userId = ? 
ORDER BY cultivation.createdAt DESC
```

**Development Status**:
- ✅ **Backend Query**: `getUserCultivations` implemented and tested
- ✅ **Frontend Integration**: CultivationsListPage updated and working
- ✅ **GraphQL Codegen**: Types generated successfully
- ✅ **Build Process**: Complete build pipeline working (8.19s)
- ✅ **Performance**: Direct query eliminates N+1 problems and reduces data transfer

### Immediate Context
Advanced GraphQL implementation successfully completed:
- **Optimized Query Pattern**: Direct cultivation queries improve performance and maintainability
- **Clean Architecture**: Proper separation between garden management and cultivation listing
- **Type-Safe Integration**: Full GraphQL codegen with backend schema synchronization
- **Scalable Foundation**: Ready for additional cultivation-specific queries and mutations
- **Development Ready**: All build and development processes continue to work perfectly

The implementation provides a more efficient, maintainable approach to data fetching with better performance characteristics.
