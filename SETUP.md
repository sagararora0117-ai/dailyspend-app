# Development Setup Guide

## Prerequisites

- **Node.js** - v18.0.0 or higher
- **npm** - v8.0.0 or higher (or yarn/pnpm)
- **Git** - For version control
- **VS Code** - Recommended editor

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/dailyspend-app.git
cd dailyspend-app
```

### 2. Install Dependencies

```bash
npm install
```

Or if using yarn:
```bash
yarn install
```

Or if using pnpm:
```bash
pnpm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173` and automatically open in your browser.

## Available Scripts

### Development
```bash
npm run dev
```
Starts Vite dev server with hot module replacement (HMR).

### Build for Production
```bash
npm run build
```
Creates optimized production build in `dist/` folder.

### Preview Production Build
```bash
npm run preview
```
Locally preview the production build.

### Linting
```bash
npm run lint
```
Check code quality with ESLint.

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Navigation.tsx      # Bottom nav bar
│   ├── ExpenseCard.tsx     # Expense display
│   └── SearchBar.tsx       # Search input
├── pages/                  # Page components
│   ├── Home.tsx           # Dashboard
│   ├── AddExpense.tsx     # Expense form
│   ├── Insights.tsx       # Analytics
│   └── Settings.tsx       # Settings
├── services/              # Business logic
│   ├── expenseService.ts
│   ├── categoryService.ts
│   ├── budgetService.ts
│   ├── settingsService.ts
│   └── exportService.ts
├── db/                    # Database layer
│   └── database.ts        # IndexedDB setup
├── context/               # React Context
│   └── AppContext.tsx     # Global state
├── utils/                 # Utility functions
│   ├── dateUtils.ts      # Date helpers
│   └── theme.ts          # Theme config
├── App.tsx                # Main component
├── main.tsx              # Entry point
└── serviceWorker.ts      # PWA worker
```

## Code Style

### TypeScript
- **Strict Mode** - Enabled in tsconfig.json
- **No Any** - Avoid using `any` type
- **Explicit Types** - Always specify types for functions and variables
- **Interfaces** - Use for object shapes

### Component Patterns
```typescript
// Use arrow functions
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>{prop1}</div>;
};

// Export default
export default MyComponent;
```

### Styling
- **Inline Styles** - Using TypeScript object syntax
- **Theme System** - Use theme values from useAppContext()
- **CSS Variables** - CSS custom properties for flexibility

Example:
```typescript
const styles = {
  container: {
    backgroundColor: theme.surface,
    padding: '16px',
    borderRadius: '12px',
  }
};
```

### Naming Conventions
- **Components** - PascalCase (MyComponent.tsx)
- **Files** - PascalCase for components, camelCase for utils
- **Functions** - camelCase (handleClick, formatDate)
- **Constants** - UPPER_SNAKE_CASE (CACHE_NAME)
- **Types/Interfaces** - PascalCase (UserData, Props)

## Database Development

### Adding Data to IndexedDB

```typescript
import { db } from '@/db/database';

// Add
const id = await db.expenses.add({ /* data */ });

// Query
const expenses = await db.expenses.toArray();

// Update
await db.expenses.update(id, { /* updates */ });

// Delete
await db.expenses.delete(id);
```

### Debugging Database

In browser DevTools console:
```javascript
// Open database
db = new DailySpendDB()

// View expenses
db.expenses.toArray().then(d => console.table(d))

// Clear database
db.expenses.clear()

// View all tables
db.tables.forEach(table => console.log(table.name))
```

## Adding Features

### Add a New Page

1. Create component in `src/pages/NewPage.tsx`
2. Add navigation item in `src/components/Navigation.tsx`
3. Add page type to App.tsx
4. Create service file if needed in `src/services/`

### Add a New Service

1. Create file in `src/services/newService.ts`
2. Follow existing service patterns
3. Use database operations from `src/db/database.ts`
4. Export as class with static methods

### Add to Database Schema

1. Edit `src/db/database.ts`
2. Add interface at top
3. Add table to DailySpendDB class
4. Update version number
5. Add store configuration in version() call

## Testing Locally

### Desktop Browser
```bash
npm run dev
# Test in Chrome, Firefox, Safari, Edge
```

### Mobile Testing
```bash
npm run dev
# Find local IP: run `hostname -I` (Linux) or `ipconfig` (Windows)
# Access from phone: http://<YOUR_IP>:5173
```

### Service Worker Testing
1. Open DevTools (F12)
2. Go to Application tab
3. Check Service Workers section
4. Verify registration and caching

### Offline Testing
1. Open DevTools
2. Go to Network tab
3. Check "Offline" checkbox
4. Reload page - should work with cached assets
5. Try adding expense - should work offline

### PWA Installation
**Desktop:**
- Chrome: Click install icon in address bar
- Edge: Same as Chrome

**Mobile:**
- Safari (iOS): Share → Add to Home Screen
- Chrome (Android): Menu → Install app

## Debugging Tips

### Enable Source Maps
In `vite.config.ts`:
```typescript
build: {
  sourcemap: true, // For debugging
}
```

### Console Logging
```typescript
// Use for debugging
console.log('Current expenses:', expenses);
console.error('Error occurred:', error);
```

### DevTools Storage
1. Application → Storage
2. View IndexedDB contents
3. Clear database if needed
4. Check Service Worker caches

### Network Testing
1. DevTools → Network tab
2. Throttle to simulate slow connection
3. Test PWA caching behavior

## Performance Optimization

### Bundle Analysis
```bash
# Install
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  react(),
  visualizer({
    open: true,
  }),
]

# Run build
npm run build
```

### Lighthouse Testing
1. DevTools → Lighthouse
2. Run audit
3. Check scores:
   - Performance > 90
   - Accessibility > 90
   - Best Practices > 90
   - SEO > 90

## Troubleshooting Development

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :5173   # Windows
```

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Service Worker Issues
- Hard refresh: Ctrl+Shift+R or Cmd+Shift+R
- Unregister: DevTools → Application → Service Workers → Unregister
- Clear cache: DevTools → Application → Cache Storage → Clear

### TypeScript Errors
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Auto-fix formatting
npx prettier --write src/
```

## Version Control

### Commit Messages
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
chore: Update dependencies
test: Add tests
```

### Branch Naming
- `feature/feature-name`
- `fix/bug-name`
- `docs/update-readme`

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with clear message
5. Push to GitHub
6. Create Pull Request

## Environment Variables

Create `.env.local`:
```
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Dexie.js Documentation](https://dexie.org)
- [date-fns Documentation](https://date-fns.org)
- [Recharts Documentation](https://recharts.org)

---

**Last Updated**: 2024
