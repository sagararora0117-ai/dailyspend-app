# Daily Spend - Production Ready PWA Expense Tracker

A modern, production-ready Progressive Web App (PWA) for tracking daily expenses built with React, TypeScript, and IndexedDB. Install on your iPhone home screen for native-like experience with full offline support.

## ✨ Features

### Core Functionality
- ✅ **Add Expense Transactions** - Quick and intuitive expense entry
- ✅ **Edit & Delete** - Modify or remove transactions anytime
- ✅ **Category Management** - Organize expenses by custom categories
- ✅ **Search** - Powerful search across all transactions
- ✅ **Budget Management** - Set and track budgets per category
- ✅ **CSV Export** - Download all expenses as CSV for analysis

### Analytics & Insights
- 📊 **Insights Dashboard** - Visual representation of spending patterns
- 📈 **Category Breakdown** - Pie charts showing expense distribution
- 📉 **Daily Trend** - Line charts tracking spending over time
- 💰 **Statistics** - Today's, this month's, and total spending summaries

### User Experience
- 🌙 **Dark Mode** - Eye-friendly dark theme toggle
- 📱 **iPhone Home Screen** - Install as standalone app on iOS
- 🔌 **Offline Support** - Full functionality without internet connection
- ⚡ **Progressive Web App** - Fast, reliable, and installable
- 🎨 **Responsive Design** - Works perfectly on mobile, tablet, and desktop

### Data Management
- 💾 **IndexedDB Storage** - Offline-first local database
- 🔒 **Privacy First** - All data stored locally, never sent to servers
- 🔄 **Automatic Sync** - Data syncs across tabs and windows
- 📦 **Data Export** - Export all data as CSV anytime

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173`

3. **Build for Production**
   ```bash
   npm run build
   ```
   Output will be in the `dist/` directory

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 📱 Installation on iPhone

1. Open the app in Safari on your iPhone
2. Tap the Share button (⬆️)
3. Select "Add to Home Screen"
4. Choose a name and tap "Add"
5. The app will appear on your home screen and launch like a native app

## 🛠️ Project Structure

```
dailyspend-app/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Navigation.tsx   # Bottom navigation bar
│   │   ├── ExpenseCard.tsx  # Expense card component
│   │   └── SearchBar.tsx    # Search input component
│   ├── pages/               # Page components
│   │   ├── Home.tsx         # Main dashboard
│   │   ├── AddExpense.tsx   # Expense form
│   │   ├── Insights.tsx     # Analytics dashboard
│   │   └── Settings.tsx     # Settings & preferences
│   ├── services/            # Business logic
│   │   ├── expenseService.ts    # Expense operations
│   │   ├── categoryService.ts   # Category management
│   │   ├── budgetService.ts     # Budget operations
│   │   ├── settingsService.ts   # Settings operations
│   │   └── exportService.ts     # CSV export
│   ├── db/                  # Database
│   │   └── database.ts      # IndexedDB setup
│   ├── context/             # React Context
│   │   └── AppContext.tsx   # Global app state
│   ├── utils/               # Utility functions
│   │   ├── dateUtils.ts     # Date formatting
│   │   └── theme.ts         # Theme configuration
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── serviceWorker.ts     # PWA service worker
├── public/
│   └── manifest.json        # PWA manifest
├── index.html               # HTML template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── vite.config.ts          # Vite configuration
```

## 📊 Features in Detail

### Home Page
- **Summary Cards** - Display today's and this month's spending
- **Recent Expenses List** - Quick view of latest transactions
- **Search Functionality** - Find expenses by title, category, or description
- **Quick Actions** - Edit/delete buttons for each expense

### Add Expense Page
- **Form Validation** - Ensures correct data entry
- **Category Selection** - Choose from predefined or custom categories
- **Date Picker** - Set expense date (defaults to today)
- **Description Field** - Optional notes for transactions
- **Auto-save** - Data persists immediately

### Insights Page
- **Monthly Selector** - Navigate between different months
- **Pie Chart** - Visual breakdown by category
- **Daily Trend Line Chart** - Track spending patterns
- **Category Statistics** - Amount and percentage for each category
- **Total Spent** - Month-to-date spending total

### Settings Page
- **Dark Mode Toggle** - Switch between light and dark themes
- **Currency Selection** - Choose your preferred currency ($, €, £, ¥, ₹, ₽)
- **Monthly Budget** - Set overall monthly spending limit
- **Category Management** - Add/remove/customize expense categories
- **Budget Management** - Set and track budgets per category
- **CSV Export** - Download all expense data

## 🔐 Privacy & Security

- **100% Local Storage** - All data stored in IndexedDB on your device
- **No Server Sync** - Your financial data never leaves your device
- **No Tracking** - No analytics or usage tracking
- **Open Source Ready** - Fully transparent codebase

## 📡 Offline Capabilities

- **Full Offline Support** - Access and modify expenses without internet
- **Automatic Sync** - Changes sync when connection is restored
- **Service Worker** - Caches assets for instant loading
- **Background Sync** - Queues changes for later sync if needed

## 🎨 Theme System

### Light Mode
- Clean, bright interface
- Easy on the eyes during day
- High contrast for readability

### Dark Mode
- Reduces eye strain in low light
- OLED-friendly color palette
- Elegant dark theme with accent colors

## 🧮 Calculation Features

- **Daily Total** - Sum of expenses for today
- **Monthly Total** - Sum of expenses for current month
- **Category Totals** - Sum of expenses per category
- **Budget Progress** - Track spending against category limits
- **Percentage Calculations** - Category distribution visualization

## 🔄 Data Management

### Automatic Backups
- Data automatically saved to IndexedDB
- Survives app closes and refreshes
- Multi-tab synchronization

### Manual Backups
- Export as CSV anytime
- Open with Excel, Google Sheets, or any spreadsheet app
- Reimport data if needed

## ⚙️ Technologies Used

- **Frontend Framework** - React 18.2
- **Language** - TypeScript 5.0
- **Database** - Dexie.js (IndexedDB wrapper)
- **Charts** - Recharts
- **Date Handling** - date-fns
- **Build Tool** - Vite
- **Styling** - Inline CSS with TypeScript
- **PWA** - Web Manifest & Service Workers

## 📦 Production Deployment

### Build Optimization
```bash
npm run build
```
- Minified output
- Tree-shaking enabled
- Source maps excluded for smaller builds

### Deployment Options
1. **Vercel** - Recommended for PWAs
2. **Netlify** - Static hosting with PWA support
3. **GitHub Pages** - Free static hosting
4. **Firebase Hosting** - Scalable static hosting
5. **Any Static Host** - Works with any static file server

### Deployment Checklist
- ✅ Build completes without errors
- ✅ Service worker registers successfully
- ✅ Manifest.json is served with correct MIME type
- ✅ HTTPS enabled (required for PWA)
- ✅ Home screen icon displays correctly
- ✅ Offline functionality works

## 🚨 Troubleshooting

### Service Worker Not Installing
- Ensure HTTPS is enabled
- Clear browser cache and reload
- Check browser console for errors

### IndexedDB Issues
- Clear browser storage and reinitialize
- Check browser's storage quota
- Try incognito mode to rule out extensions

### Dark Mode Not Persisting
- Ensure IndexedDB is enabled
- Check browser privacy settings
- Clear browser storage and try again

## 📈 Future Enhancements

Potential features for future versions:
- Multiple accounts/profiles
- Recurring expenses
- Bill reminders
- Cloud sync with encryption
- Budget alerts
- Custom reports
- Multi-currency conversions
- Social sharing

## 📄 License

Open source and available for commercial use.

## 🤝 Contributing

Feel free to fork and customize for your needs!

---

**Version 1.0.0** - Production Ready
Last Updated: 2024
