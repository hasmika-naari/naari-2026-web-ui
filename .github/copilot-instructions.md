# Naari Deals - AI Coding Agent Instructions

## Project Overview
This is **Naari Deals**, an Angular 20 e-commerce platform for women-focused deals and promotions. The app features:
- Server-side rendering (SSR) with Express
- Black Friday/seasonal campaign landing pages
- Deal management system with categories and merchants
- Authentication with JWT tokens
- Multi-country support (USA, India)

## Architecture & Key Technologies

### Frontend Stack
- **Angular 20** with standalone components (no NgModules)
- **Angular Material** + **PrimeNG** for UI components
- **Bootstrap 5.3** + custom SCSS architecture
- **Boxicons**, **RemixIcon**, **Font Awesome** for icons
- **ngx-device-detector** for responsive behavior
- **animate.css** for animations

### Backend Integration
- **Backend API**: `https://naarideals.com:8090`
- **Proxy**: `/api/**` routes proxy to backend (see `proxy.config.json`)
- **Auth**: JWT tokens stored in localStorage, intercepted via `HttpRequestInterceptor`
- **SSR Server**: Express with HTTPS, runs on port 443 with SSL certificates

## Critical Project Patterns

### 1. Component Architecture
All components use **standalone: true** pattern:
```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule, RouterModule, /* other imports */],
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.scss']
})
```

### 2. Routing with Data Reuse
Routes use custom `AppRouteReuseStrategy` and include `reuseComponent: true` in route data:
```typescript
{ 
  path: 'home', 
  component: NaariHomePageComponent, 
  data: { reuseComponent: true, breadcrumb: 'Page Title' }
}
```
Lazy-loaded components use `loadComponent: () => import(...)`.

### 3. Service Injection Pattern
Services use `inject()` function and `providedIn: 'root'`:
```typescript
@Injectable({providedIn: 'root'})
export class MyService {
  private http: HttpWrapperService = inject(HttpWrapperService);
  private platformId: object = inject(PLATFORM_ID);
}
```

### 4. Platform-Aware Code (SSR)
Always check if code runs in browser before accessing browser APIs:
```typescript
import { isPlatformBrowser } from '@angular/common';

if (isPlatformBrowser(this.platformId)) {
  // Browser-only code (DOM, localStorage, window)
}
```

### 5. Authentication Flow
- Login tokens stored: `localStorage.getItem('authToken')`
- HTTP interceptor adds `Authorization: Bearer <token>` header
- Token received in response body as `id_token` field
- All API calls (except login/register) require authentication

### 6. Deal/Merchant Data Flow
- Country-based filtering is primary pattern (USA/India)
- Categories: electronics, fashion, home, beauty, toys
- Deal types: tags like "Black Friday", "Cyber Monday"
- API pattern: `/api/naari-deals?approved.equals=true&country.contains=USA`

### 7. Black Friday JSON-Driven Architecture
**All Black Friday content is JSON-configured** - no code changes needed for updates:
- `black-friday-config.json`: Controls countdown, hero slides, section titles, background images
- `black-friday-merchants.json`: Contains all merchants with `adScans[]` array for ad pages
- Background images automatically rotate across ad scan cards from `backgroundImages` array
- Routing: `/black-friday` (landing) → `/black-friday/:merchantId/ad-scans` (detail page)
- See `BLACK_FRIDAY_JSON_GUIDE.md` for complete configuration documentation

## Development Workflows

### Running the App
```powershell
npm run dev          # Dev server on http://localhost:4200
npm run build        # Production build
npm run serve        # Serve SSR build (requires dist folder)
```

### Environment Configuration
- Development: `src/environments/environment.development.ts`
- Production: `src/environments/environment.prod.ts`
- API URL switches based on environment

### Testing
```powershell
npm test             # Run Karma tests
npm run test:headless # Headless Chrome tests
npm run coverage     # Generate coverage report
```

## Styling Conventions

### SCSS Organization
- **Global styles**: `src/styles.scss` (main entry point)
- **Variables**: `src/styles/_variables.scss` (spacing, colors, dimensions)
- **Tokens**: `src/styles/tokens.scss` (Angular Material theme overrides)
- **Component styles**: Co-located with component files

### Key SCSS Variables
```scss
$template_color: #b81f89;        // Primary brand color
$primary: #5d87ff;                // Material primary
$font_family: 'Poppins', sans-serif;
$sidenav-width: 280px;
$sidenav-collapsed-width: 74px;
```

### Responsive Patterns
Use `ngx-device-detector` service:
```typescript
if (this.deviceService.isDesktop()) { /* Desktop UI */ }
if (this.deviceService.isMobile()) { /* Mobile UI */ }
if (this.deviceService.isTablet()) { /* Tablet UI */ }
```

## Common Gotchas

1. **Proxy Config**: When running `ng serve`, API calls to `/api/**` are proxied. In production, server.ts handles this.

2. **SSL Certificates**: Production server uses HTTPS with certificates in `/ssl/naarideals/` directory.

3. **Route Transitions**: App uses `withViewTransitions()` for smooth navigation.

4. **Scroll Position**: Custom `ScrollPositionService` maintains scroll positions across navigations.

5. **CommonJS Dependencies**: Many dependencies listed in `angular.json` under `allowedCommonJsDependencies` to suppress warnings.

6. **Deal Approval**: Deals have an `approved` flag - only approved deals show to users.

## File Structure Reference

### Key Service Locations
- **Auth**: `src/app/services/auth.service.ts`, `auth.interceptor.ts`
- **Deals**: `src/app/services/deals.service.ts`
- **Constants**: `src/app/services/app-constants.service.ts`
- **HTTP**: `src/app/services/http-wrapper.service.ts`

### Feature Directories
- **Black Friday**: `src/app/black-friday-landing/`, `black-friday-ad-scan/`
- **Deals**: `src/app/deals-list/`, `deal-details-page/`
- **Admin**: `src/app/pages/ecommerce-page/` (deal management)
- **Auth Pages**: `src/app/login-page/`, `register-page/`, `reset-password-page/`

### JSON Configuration Files
- **Black Friday Config**: `src/assets/data/black-friday-config.json` (hero slides, sections, backgrounds)
- **Black Friday Merchants**: `src/assets/data/black-friday-merchants.json` (all merchant data & ad scans)
- **Documentation**: `BLACK_FRIDAY_JSON_GUIDE.md` (complete JSON configuration guide)

## API Integration Examples

### Creating a Deal
```typescript
postDeal(dealRequest: DealDataItemRequest): Observable<any> {
  const url = this.appConstants.BASE_API_URL + '/api/naari-deals';
  return this.http.post<any>(url, dealRequest);
}
```

### Fetching Deals by Category
```typescript
getDealsByCountryAndCategory(country: string, category: string): Observable<any> {
  const url = `${this.appConstants.BASE_API_URL}/api/naari-deals?approved.equals=true&country.contains=${country}&category.equals=${category}`;
  return this.http.get<any>(url);
}
```

## When Making Changes

1. **New Components**: Always use standalone components with explicit imports
2. **New Routes**: Add to `app.routes.ts` with proper `data` metadata
3. **API Calls**: Use `HttpWrapperService`, handle browser/server differences
4. **Styling**: Follow existing SCSS variable patterns, avoid inline styles
5. **Icons**: Prefer Boxicons (`bx-*`) for consistency with Black Friday theme
