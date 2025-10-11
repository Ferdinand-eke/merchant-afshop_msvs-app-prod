# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AfricanShops Merchants Portal** - A React-based merchant dashboard for managing multi-vendor shops across different business types (retail, wholesale, real estate, hotels, food vendors, and logistics). Built with Vite, Material-UI, Redux Toolkit, and the Fuse React template framework.

## Development Commands

### Common Commands
```bash
# Start development server (runs on http://localhost:3000)
npm start
# or
npm run dev

# Build for production (uses increased memory allocation)
npm run build

# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Preview production build
npm run preview

# Bundle analysis
npm run analyze
```

### Testing
No test suite is currently configured in this project.

## Architecture Overview

### Core Technology Stack
- **Build Tool**: Vite 5.2.12
- **Framework**: React 18.3.1
- **UI Library**: Material-UI (MUI) v5.15.x with Emotion for styling
- **State Management**: Redux Toolkit (@reduxjs/toolkit) with RTK Query for API calls
- **Routing**: React Router v6
- **Authentication**: Multi-provider support (JWT, AWS Cognito, Firebase)
- **Styling**: TailwindCSS + Emotion + MUI styled components

### Project Structure

#### `/src/@fuse/`
The Fuse React template core components. This is a commercial template providing:
- Layout systems (layout1, layout2, layout3)
- Navigation, authorization, theming, and settings management
- Reusable UI components (FusePageCarded, FusePageSimple, FuseSuspense, etc.)

**Important**: The Fuse framework drives the app architecture. Routes are configured via config objects, not direct JSX routing.

#### `/src/app/`
Application-specific code:
- **`/app/main/`**: Feature modules organized by business domain:
  - `/vendors-shop/`: Core merchant features (dashboard, products, orders, POS, profile, mailbox)
  - `/vendor-homes-property/`: Real estate property management
  - `/vendor-hotelsandapartments/`: Hotels & apartment booking management
  - `/vendor-foodmarts/`: Restaurant/food vendor management
  - `/vendor-logistics/`: Logistics management
  - `/africanshops-finance/`: Financial dashboard
  - `/africanshops-messenger/`: Internal messaging system
  - `/vendor-settings/`: Merchant settings

- **`/app/auth/`**: Authentication system with multiple providers:
  - `/services/jwt/`: JWT-based authentication
  - `/services/firebase/`: Firebase authentication
  - `/services/aws/`: AWS Cognito authentication
  - `authRoles.js`: Defines role-based access (admin, staff, merchant, user)

- **`/app/store/`**: Redux store configuration
  - `store.js`: Redux store setup with RTK Query
  - `apiService.js`: Base RTK Query API service using Axios
  - `lazyLoadedSlices.js`: Combines all Redux slices

- **`/app/configs/`**: Application configuration
  - `routesConfig.jsx`: Central route configuration
  - `settingsConfig.js`: Default layout, theme, and auth settings

- **`/app/theme-layouts/`**: Layout implementations (layout1, layout2, layout3)

- **`/app/aaqueryhooks/`**: Custom API query hooks and server route configurations

#### `/src/@mock-api/`
Mock API implementation using axios-mock-adapter. Provides development data for testing without a backend. The `MockAdapterProvider` intercepts axios requests and returns mock data.

#### Path Aliases
Configured in both `jsconfig.json` and `vite.config.mjs`:
```javascript
@fuse/*          → /src/@fuse/*
@history         → /src/@history
@lodash          → /src/@lodash
@mock-api/*      → /src/@mock-api/*
app/store        → /src/app/store
app/configs/*    → /src/app/configs/*
app/theme-layouts/* → /src/app/theme-layouts/*
```

## Key Architectural Patterns

### Route Configuration Pattern
Routes are NOT defined in a central router file with JSX. Instead, each feature module exports a config object:

```javascript
// Example: ShopDashboardAppConfig
{
  routes: [
    {
      path: '/shop-dashboard',
      element: <ShopDashboard />,
      auth: authRoles.staff  // Role-based access control
    }
  ]
}
```

These configs are imported in `/app/configs/routesConfig.jsx` and processed by `FuseUtils.generateRoutesFromConfigs()`.

### API Service Pattern (RTK Query)
The app uses RTK Query for data fetching. API endpoints are defined by injecting into the base `apiService`:

```javascript
// Pattern used in *Api.js files
const SomeApi = api
  .enhanceEndpoints({ addTagTypes: ['tag1', 'tag2'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getSomething: build.query({
        query: () => ({ url: '/endpoint' }),
        providesTags: ['tag1']
      })
    })
  });
```

API services can point to either:
1. Mock APIs (`/mock-api/*`) for development
2. Real backend (`https://africanshops-server.scanafrique.com` or `https://sea-turtle-app-c6p3o.ondigitalocean.app`)

### Authentication Flow
- Default protected routes require `['admin', 'merchant']` roles (configured in `settingsConfig.js`)
- Authentication state managed via `userSlice` in Redux
- Token stored in cookies and localStorage
- JWT tokens passed via `accesstoken` header
- 401 responses trigger automatic logout via axios interceptors

### Layout System
The app uses Fuse's layout system with three available layouts (layout1, layout2, layout3):
- **layout1**: Default - navbar on left, toolbar on top
- Each layout has configurable navbar, toolbar, footer, and side panels
- Layout settings stored in Redux and can be customized per route

### Merchant Service Types
The app supports multiple merchant types via environment variables:
- `VITE_AFS_RETAIL`: Retail shops
- `VITE_AFS_WHOLESALERETAIL`: Wholesale & retail
- `VITE_AFS_MANUFACTURERS`: Manufacturers
- `VITE_AFS_HOTELHOMES`: Hotels & apartments
- `VITE_AFS_ESTATES`: Real estate
- `VITE_AFS_FOODMART`: Food vendors
- `VITE_AFS_LOGISTICS`: Logistics

## Important Development Notes

### Environment Variables
All environment variables must be prefixed with `VITE_` to be accessible in the app via `import.meta.env`.

Key variables:
- `VITE_API_BASE_URL_PROD`: Backend API URL
- `VITE_MAP_KEY`: Google Maps API key
- Firebase and AWS Cognito configuration variables

### Styling Approach
The app uses three concurrent styling systems:
1. **Material-UI** components with `sx` prop
2. **Emotion** styled components and `css` prop
3. **TailwindCSS** utility classes

Prefer Material-UI's `sx` prop for component styling when working with MUI components.

### ESLint Configuration
- Single quotes, tabs (width: 4)
- No console logs except `console.error`
- Unused imports are automatically removed
- React prop-types validation is disabled
- Import cycles detection is disabled for performance

### Memory Considerations
The build process uses `NODE_OPTIONS=--max-old-space-size=4096` due to large bundle size from Material-UI and dependencies.

### Hot Module Replacement (HMR)
Custom HMR setup in `vite.config.mjs`: Changes to files in `src/app/configs/` trigger a full page reload instead of HMR.

### Git Workflow
- Main branch: `main`
- Recent work includes merchant authentication, vendor shop features, and service-specific dashboards
- Default route redirects to `/shop-dashboard` for authenticated users

## Common Tasks

### Adding a New Route
1. Create a feature config file (e.g., `MyFeatureAppConfig.js`) with routes array and auth settings
2. Import and add to `routeConfigs` array in `/app/configs/routesConfig.jsx`
3. The config will be automatically processed and added to the router

### Creating an API Endpoint
1. Locate or create an `*Api.js` file in the relevant feature directory
2. Inject endpoints into the base `apiService` using RTK Query's `injectEndpoints`
3. Use generated hooks in components: `useGetSomethingQuery()`, `useUpdateSomethingMutation()`

### Adding Authentication to a Route
In your route config object, add an `auth` property:
```javascript
{
  path: '/my-route',
  element: <MyComponent />,
  auth: authRoles.admin  // Only admin can access
  // or: auth: authRoles.staff (admin, staff, merchant)
  // or: auth: authRoles.onlyGuest (unauthenticated only)
}
```

### Working with Mock vs Real APIs
- Mock APIs are configured in `/src/@mock-api/` and enabled via `MockAdapterProvider`
- Real API endpoints are defined in `/src/app/aaqueryhooks/routestoserver.js`
- To switch between mock and real: update the API URLs in the respective `*Api.js` files

### Customizing Layouts
- Default layout settings are in `/app/configs/settingsConfig.js`
- Per-route layout overrides can be added to route config objects via `settings.layout.config`
- Available layout options: navbar, toolbar, footer, leftSidePanel, rightSidePanel (each with `display` boolean)

## Backend Integration

The app communicates with microservices at:
- Production: `https://africanshops-server.scanafrique.com`
- Alternative: `https://sea-turtle-app-c6p3o.ondigitalocean.app` (for property management)

Authentication uses:
- JWT tokens stored in cookies (`jwt_auth_credentials`)
- Access tokens passed via `accesstoken` header
- Axios interceptors handle 401/403 responses and trigger logout

## File References by Feature

When working on specific features, start with these files:

**Shop Dashboard**: `/src/app/main/vendors-shop/dasboard/`
**Products Management**: `/src/app/main/vendors-shop/products/`
**Orders Management**: `/src/app/main/vendors-shop/orders/`
**Merchant Profile**: `/src/app/main/vendors-shop/profile/`
**POS System**: `/src/app/main/vendors-shop/pos/`
**Real Estate**: `/src/app/main/vendor-homes-property/`
**Hotels/Apartments**: `/src/app/main/vendor-hotelsandapartments/`
**Food Vendors**: `/src/app/main/vendor-foodmarts/`
**Messaging**: `/src/app/main/africanshops-messenger/`
**Finance**: `/src/app/main/africanshops-finance/`
