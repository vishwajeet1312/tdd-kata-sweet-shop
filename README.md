# Sweet Shop Management System

A modern, responsive Single Page Application (SPA) for managing a sweet shop with user authentication, product browsing, and admin capabilities.

## Features

### Authentication & Authorization
- JWT token-based authentication (mock implementation for demo)
- Register and login pages with client-side validation
- Role-based access control (User and Admin)
- Secure token storage in localStorage
- Protected routes based on authentication status

### User Features
- **Dashboard**: Browse all available sweets in a responsive grid layout
- **Search & Filter**: 
  - Search sweets by name
  - Filter by category
  - Filter by price range (min/max)
  - Dynamic results with instant updates
  - Clear all filters button
- **Purchase**: One-click purchase with instant quantity update
- **Out of Stock Handling**: Disabled purchase button for unavailable items
- **Confirmation Dialogs**: Visual feedback on successful purchases

### Admin Features (Admin Users Only)
- **Add New Sweet**: Form to add new sweets with all details
- **Edit Sweet**: Update name, category, price, quantity, and description
- **Delete Sweet**: Remove sweets from inventory with confirmation
- **Restock**: Add inventory quantities to existing sweets
- **Stock Status Badges**: Visual indicators for stock levels
- **Comprehensive Management**: Full CRUD operations on sweet inventory

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **State Management**: React Context API
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React
- **Notifications**: Toast notifications for user feedback
- **Image Handling**: Next.js Image component with optimization

## Getting Started

1. **Login as User**: Use any email and password
2. **Login as Admin**: Include "admin" in the email (e.g., admin@example.com)

### User Flow
1. Register or login
2. Browse sweets on the dashboard
3. Use search and filters to find specific sweets
4. Click "Purchase" to buy sweets
5. Receive confirmation of purchase

### Admin Flow
1. Login with admin email
2. Access Admin Panel from navigation
3. View all sweets with detailed information
4. Add, edit, delete, or restock sweets
5. Monitor stock levels with visual indicators

## API Structure (Mock Implementation)

The current implementation uses mock data and localStorage for demonstration purposes. In production, you would:

1. Replace auth context with real API calls to your backend
2. Connect to a database (PostgreSQL, MongoDB, etc.)
3. Implement real JWT token generation and validation
4. Add payment processing integration
5. Implement proper password hashing (bcrypt)
6. Add session management with secure cookies

## Design System

- **Primary Color**: Pink/Rose (#E53E82 approx)
- **Accent Color**: Warm amber/orange
- **Fonts**: Geist Sans for body, Geist Mono for code
- **Layout**: Mobile-first responsive design
- **Components**: Consistent shadcn/ui component library

## Security Notes

⚠️ **This is a demo application.** For production:
- Implement server-side authentication
- Use HTTP-only cookies for tokens
- Add CSRF protection
- Implement rate limiting
- Use environment variables for sensitive data
- Add input sanitization and validation
- Implement proper error handling
- Add logging and monitoring

## Project Structure

```
sweet-shop-spa/
├── app/                                    # Next.js App Router
│   ├── layout.tsx                          # Root layout with providers
│   ├── page.tsx                            # Home/landing page
│   ├── globals.css                         # Global styles
│   ├── login/
│   │   └── page.tsx                        # Login page
│   ├── register/
│   │   └── page.tsx                        # Registration page
│   ├── dashboard/
│   │   ├── page.tsx                        # User dashboard (browse sweets)
│   │   └── loading.tsx                     # Loading state
│   ├── admin/
│   │   └── page.tsx                        # Admin panel for inventory management
│   └── api/                                # API routes
│       ├── auth/
│       │   ├── login/
│       │   │   └── route.ts                # Login API endpoint
│       │   └── register/
│       │       └── route.ts                # Register API endpoint
│       ├── sweets/
│       │   ├── route.ts                    # Get all sweets / Create sweet
│       │   ├── [id]/
│       │   │   ├── route.ts                # Get/Update/Delete specific sweet
│       │   │   ├── purchase/
│       │   │   │   └── route.ts            # Purchase sweet
│       │   │   └── restock/
│       │   │       └── route.ts            # Restock sweet
│       │   └── search/
│       │       └── route.ts                # Search sweets
│       ├── cart/
│       │   ├── route.ts                    # Get cart / Clear cart
│       │   ├── [sweetId]/
│       │   │   └── route.ts                # Add/Remove items from cart
│       │   └── checkout/
│       │       └── route.ts                # Checkout cart
│       └── purchase/
│           └── route.ts                    # Purchase endpoint
│
├── components/                             # React components
│   ├── navbar.tsx                          # Main navigation bar
│   ├── sweet-card.tsx                      # Sweet product display card
│   ├── search-filter.tsx                   # Search and filter controls
│   ├── purchase-confirmation-dialog.tsx    # Purchase success dialog
│   ├── theme-provider.tsx                  # Theme context provider
│   ├── admin/                              # Admin-specific components
│   │   ├── add-sweet-dialog.tsx            # Dialog to add new sweet
│   │   ├── edit-sweet-dialog.tsx           # Dialog to edit sweet details
│   │   ├── delete-sweet-dialog.tsx         # Confirmation dialog for deletion
│   │   └── restock-dialog.tsx              # Dialog to add stock quantity
│   └── ui/                                 # shadcn/ui component library
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button-group.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── empty.tsx
│       ├── field.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-group.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── item.tsx
│       ├── kbd.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── spinner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       ├── use-mobile.tsx
│       └── use-toast.ts
│
├── lib/                                    # Utilities and contexts
│   ├── auth-context.tsx                    # Authentication state management
│   ├── sweets-context.tsx                  # Sweets data context
│   ├── db.ts                               # Database utilities
│   ├── utils.ts                            # Helper functions
│   ├── middleware/
│   │   └── auth.ts                         # Authentication middleware
│   └── models/                             # Data models
│       ├── User.ts                         # User model
│       ├── Sweet.ts                        # Sweet product model
│       └── Cart.ts                         # Shopping cart model
│
├── hooks/                                  # Custom React hooks
│   ├── use-mobile.ts                       # Mobile viewport detection
│   └── use-toast.ts                        # Toast notification hook
│
├── scripts/                                # Utility scripts
│   ├── check-users.js                      # Check user data
│   ├── create-admin.js                     # Create admin user
│   ├── test-api.js                         # Test API endpoints
│   └── test-db-connection.js               # Test database connection
│
├── public/                                 # Static assets
│   └── (sweet product images)
│
├── styles/                                 # Style files
│   └── globals.css
│
├── components.json                         # shadcn/ui configuration
├── next.config.mjs                         # Next.js configuration
├── next-env.d.ts                           # Next.js TypeScript declarations
├── tsconfig.json                           # TypeScript configuration
├── postcss.config.mjs                      # PostCSS configuration
├── package.json                            # Project dependencies
├── pnpm-lock.yaml                          # pnpm lock file
├── Sweet-Shop-API.postman_collection.json  # Postman API collection
└── README.md                               # Project documentation
```

## Future Enhancements

- Real database integration (Supabase, Neon, etc.)
- Payment processing (Stripe integration)
- Order history and tracking
- User profiles and preferences
- Shopping cart functionality
- Wishlist feature
- Product reviews and ratings
- Email notifications
- Advanced analytics for admin
- Bulk operations for admin
- Export/import inventory data
