# 🎨 Café Menu Web App - Complete Implementation

A **beautiful, modern, and responsive** café management dashboard built with the latest web technologies.

## ✨ Features Implemented

### 🎯 Core Functionality

- ✅ **Categories Management** - Full CRUD with search, filter, and sort
- ✅ **Products Management** - Complete product catalog with category filters
- ✅ **Orders System** - Create, track, and manage customer orders with status updates
- ✅ **Dashboard** - Live metrics and recent orders overview
- ✅ **Multi-language Support** - English/Arabic with RTL layout

### 🎨 Design & UX

- ✅ **Modern UI** - Clean card-based layouts with smooth transitions
- ✅ **Dark/Light Mode** - Beautiful theme switcher with persistent preferences
- ✅ **Fully Responsive** - Mobile-first design that works on all devices
- ✅ **Micro-interactions** - Hover effects, animations, and polished transitions
- ✅ **Loading States** - Skeleton screens and spinners for better UX
- ✅ **Empty States** - Friendly messages when no data is available
- ✅ **Error Handling** - Graceful error states with retry options

### 🌍 Internationalization

- ✅ **Language Switcher** - Toggle between English and Arabic
- ✅ **RTL Support** - Full right-to-left layout for Arabic
- ✅ **Complete Translations** - All UI text in both languages

## 🛠️ Tech Stack

### Frontend Framework

- **Next.js 15.1.6** - App Router for optimal performance
- **TypeScript 5.7.2** - Full type safety throughout
- **React 19** - Latest React features

### Styling & UI

- **Tailwind CSS 3.4.17** - Utility-first styling
- **Headless UI 2.2.0** - Accessible components (Dialog, Menu, Switch)
- **Heroicons** - Beautiful icon library
- **Custom Design System** - Brand colors, glassmorphism effects

### State Management

- **Zustand 5.0.2** - Lightweight state management (theme, UI state)
- **React Query 5.66.0** - Server state, caching, and optimistic updates

### Forms & Validation

- **React Hook Form 7.54.2** - Performant form handling
- **Zod 3.24.1** - Schema validation matching backend rules

### Internationalization

- **i18next 25.8.14** - Translation framework
- **react-i18next 16.5.6** - React integration with hooks

### Additional Libraries

- **Sonner** - Toast notifications
- **date-fns** - Date formatting

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Dashboard page
│   ├── categories/page.tsx      # Categories list
│   ├── products/page.tsx        # Products catalog
│   ├── orders/page.tsx          # Orders management
│   └── globals.css              # Global styles & Tailwind
│
├── components/
│   ├── categories/              # Category CRUD components
│   │   ├── categories-page.tsx
│   │   └── category-form-modal.tsx
│   ├── dashboard/               # Dashboard metrics
│   │   └── dashboard-page.tsx
│   ├── orders/                  # Order management
│   │   ├── orders-page.tsx
│   │   ├── order-form-modal.tsx
│   │   └── order-details-modal.tsx
│   ├── products/                # Product CRUD components
│   │   ├── products-page.tsx
│   │   └── product-form-modal.tsx
│   ├── layout/                  # Layout components
│   │   ├── app-shell.tsx       # Main app shell with nav
│   │   ├── theme-toggle.tsx    # Dark mode switcher
│   │   └── language-switcher.tsx # EN/AR switcher
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── confirm-dialog.tsx
│   │   ├── status-badge.tsx
│   │   ├── loading-state.tsx
│   │   ├── empty-state.tsx
│   │   └── error-state.tsx
│   └── providers.tsx            # React Query & i18n providers
│
├── lib/
│   ├── api.ts                   # API client functions
│   ├── openapi.generated.ts     # TypeScript types from OpenAPI
│   ├── types.ts                 # Additional type definitions
│   ├── validation.ts            # Zod schemas for forms
│   ├── constants.ts             # App constants
│   ├── format.ts                # Formatting utilities
│   ├── cn.ts                    # Tailwind className merger
│   ├── i18n.ts                  # i18next configuration
│   ├── use-i18n.ts              # Translation hook
│   ├── query-client.ts          # React Query setup
│   ├── query-keys.ts            # Query key factory
│   ├── hooks/                   # Custom React Query hooks
│   │   ├── use-categories.ts
│   │   ├── use-products.ts
│   │   └── use-orders.ts
│   └── stores/                  # Zustand stores
│       ├── theme-store.ts       # Dark mode state
│       └── ui-store.ts          # UI state (modals, drawers)
│
├── public/
│   └── locales/                 # Translation files
│       ├── en/common.json       # English translations
│       └── ar/common.json       # Arabic translations
│
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind customization
├── next.config.ts               # Next.js config
└── postcss.config.mjs           # PostCSS config
```

## 🎨 Design Highlights

### Visual Design

- **Glassmorphism** - Frosted glass effects with backdrop blur
- **Gradient Accents** - Brand color (#1f85ff) with gradient overlays
- **Card Layouts** - Clean surfaces with subtle shadows
- **Smooth Animations** - Fade-in effects and micro-interactions
- **Professional Typography** - Plus Jakarta Sans & Space Grotesk fonts

### Color Palette

```css
/* Brand Colors */
--brand-500: #1f85ff /* Primary blue */ --brand-600: #0f67d7 /* Darker blue */
  /* Dark Mode */ --slate-900: Background --slate-800: Surfaces
  --slate-100: Borders (dark) /* Light Mode */ --white: Background
  --slate-50: Surfaces --slate-200: Borders (light);
```

### Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd frontend
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev
```

### 3. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

### 4. Backend API

Ensure the backend is running on [http://localhost:8000](http://localhost:8000)

## 📱 Pages & Routes

| Route         | Component  | Features                                  |
| ------------- | ---------- | ----------------------------------------- |
| `/`           | Dashboard  | Metrics cards, recent orders table        |
| `/categories` | Categories | List, search, create, edit, delete        |
| `/products`   | Products   | Grid view, filters, CRUD operations       |
| `/orders`     | Orders     | Pagination, status filters, order details |

## 🎯 Key Components

### Categories Management

- **Search** - Real-time category search
- **Sort** - By name or sort order
- **Active Filter** - Show active/inactive categories
- **Form** - Name, description, image URL, sort order, active status

### Products Management

- **Category Filter** - Filter products by category
- **Search** - Find products by name
- **Grid Layout** - Beautiful card-based product display
- **Form** - Name, description, price, category, image, stock status

### Orders System

- **Create Order** - Customer details + line items with live total
- **Status Updates** - NEW → PREPARING → READY → COMPLETED
- **Order Types** - Dine-in, Takeaway, Delivery
- **Pagination** - Navigate through order history
- **Filters** - By status and order type

## 🌍 Internationalization

### Supported Languages

- **English (en)** - Default, LTR layout
- **Arabic (ar)** - Full RTL support

### Translation Coverage

- Navigation menu
- All button labels
- Form fields and validation messages
- Status badges
- Dashboard metrics
- Empty and error states

### How to Switch Languages

Click the globe icon (🌐) in the top-right header next to the theme toggle.

## 🎨 UI Component Library

### Form Controls

- **Button** - Multiple variants (primary, secondary, ghost, danger)
- **Input** - Text fields with validation states
- **Select** - Dropdown with custom styling
- **Textarea** - Multi-line text input

### Layout

- **Card** - Container with glassmorphism effect
- **Modal** - Headless UI dialog with animations
- **ConfirmDialog** - Reusable confirmation prompt

### Feedback

- **LoadingState** - Spinner with optional label
- **EmptyState** - Friendly "no data" message
- **ErrorState** - Error display with retry button
- **StatusBadge** - Colored badges for order status

## 🔧 Configuration

### API Base URL

Located in `src/lib/api.ts`:

```typescript
const API_BASE_URL = "http://localhost:8000";
```

### Theme Persistence

Uses Zustand with localStorage persistence for dark mode preference.

### React Query Setup

- Stale time: 5 minutes
- Cache time: 10 minutes
- Automatic refetch on window focus
- Optimistic updates for mutations

## 📊 State Management

### Zustand Stores

#### Theme Store (`theme-store.ts`)

- Current theme (light/dark)
- Toggle function
- Persisted to localStorage

#### UI Store (`ui-store.ts`)

- Mobile navigation drawer state
- Modal open/close states
- Temporary UI flags

### React Query Hooks

#### Categories

- `useCategories()` - Fetch all categories
- `useCreateCategory()` - Create new category
- `useUpdateCategory()` - Update existing category
- `useDeleteCategory()` - Delete category

#### Products

- `useProducts()` - Fetch all products
- `useCreateProduct()` - Create new product
- `useUpdateProduct()` - Update existing product
- `useDeleteProduct()` - Delete product

#### Orders

- `useOrders()` - Fetch orders with pagination
- `useCreateOrder()` - Create new order
- `useUpdateOrderStatus()` - Update order status
- `useDeleteOrder()` - Delete order

## ✅ Form Validation

All forms use **Zod schemas** that mirror the backend Joi validation:

- **Category**: Name (2-100 chars), description (max 300), image URL, sort order, active status
- **Product**: Name (2-120 chars), price (≥0), category, description (max 500), stock
- **Order**: Customer name/phone, order type, items (min 1), address (required for delivery)

## 🎭 Dark Mode

Toggle between light and dark themes with the sun/moon icon in the header. Theme preference is:

- Persisted to localStorage
- Applied via Tailwind's `dark:` variant
- Smooth transition between modes

## 📈 Performance Optimizations

- ✅ React Query caching reduces API calls
- ✅ Optimistic updates for instant UI feedback
- ✅ Debounced search inputs
- ✅ Lazy loading with Suspense boundaries
- ✅ Server-side rendering via Next.js App Router

## 🔒 TypeScript Type Safety

- All API responses typed via OpenAPI schema
- Form validation with Zod schemas
- Component props fully typed
- No `any` types used

## 🎉 Notable Features

### Micro-interactions

- Hover effects on cards and buttons
- Smooth modal enter/exit animations
- Loading spinners during API calls
- Toast notifications for success/error

### UX Enhancements

- Auto-focus on form inputs
- Keyboard navigation support (Headless UI)
- Accessible ARIA labels
- Mobile-optimized touch targets

### Developer Experience

- Hot module replacement (HMR)
- TypeScript intellisense
- React Query DevTools
- Organized file structure

## 🐛 Error Handling

- Network errors caught and displayed
- Form validation errors shown inline
- Retry mechanisms for failed requests
- Graceful degradation for missing data

## 🚀 Production Ready

This app is production-ready with:

- ✅ TypeScript for type safety
- ✅ Proper error boundaries
- ✅ Responsive design tested
- ✅ Accessibility considerations
- ✅ Performance optimizations
- ✅ Clean code organization

## 📝 Next Steps

To further enhance the app:

1. Add authentication/authorization
2. Implement real-time order updates (WebSocket)
3. Add print receipt functionality
4. Implement advanced analytics dashboard
5. Add image upload (vs. URL input)
6. Export orders to CSV/PDF

---

**Built with ❤️ using Next.js, TypeScript, Tailwind CSS, Zustand, and React Query**
