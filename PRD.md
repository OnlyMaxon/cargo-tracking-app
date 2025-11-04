# Cargo Tracking Web Application

A comprehensive web-based cargo tracking system for Azerbaijan market with user authentication, order management, and admin capabilities.

**Experience Qualities**:
1. **Professional** - Clean, trustworthy interface that instills confidence in cargo tracking
2. **Efficient** - Quick access to order status with minimal clicks and clear information hierarchy
3. **Accessible** - Easy navigation for both regular users and administrators with intuitive workflows

**Complexity Level**: Complex Application (advanced functionality, user accounts, role-based access)
- The application requires user authentication, persistent data storage, role-based admin panel, real-time order tracking, and multi-tab navigation with distinct user and admin workflows.

## Essential Features

### User Authentication
- **Functionality**: Register and login with FIN code (Azerbaijan ID), name, surname, and password
- **Purpose**: Secure user identification and personalized order tracking
- **Trigger**: Landing on app or logout
- **Progression**: Login form → Validation (FIN format, required fields) → Authentication → Dashboard
- **Success criteria**: Users can register once, login multiple times, and maintain session

### Order List View
- **Functionality**: Display all user orders in a scrollable list with status badges
- **Purpose**: Quick overview of all cargo shipments and their current status
- **Trigger**: Login success or selecting "Orders" tab
- **Progression**: Dashboard loads → Fetch user orders → Display list with status colors → Click order → Detail view
- **Success criteria**: Orders display with correct statuses ("В пути"=In Transit, "На складе"=In Warehouse, "Доставлен"=Delivered)

### Order Detail View
- **Functionality**: Show comprehensive information about a specific order
- **Purpose**: Provide tracking details, timeline, and shipment information
- **Trigger**: Click on any order in the list
- **Progression**: Order click → Modal/detail page opens → Display tracking info, status history, details
- **Success criteria**: All order information is visible, can navigate back to list

### Support Tab
- **Functionality**: Display contact information and support channels
- **Purpose**: Enable users to get help and contact cargo service
- **Trigger**: Click "Support" in bottom tab bar
- **Progression**: Tab click → Support page with contact details, FAQ, messaging options
- **Success criteria**: Users can find contact information and support resources

### Profile Tab
- **Functionality**: Display user information (name, surname, FIN) with logout option
- **Purpose**: User account management and verification of identity
- **Trigger**: Click "Profile" in bottom tab bar
- **Progression**: Tab click → Profile page → Display user info → Option to logout
- **Success criteria**: Correct user data displayed, logout returns to login screen

### Apps Tab
- **Functionality**: Quick links to popular shopping sites (Allegro, etc.) with expandable list
- **Purpose**: Convenient access to e-commerce platforms for ordering
- **Trigger**: Click "Apps" in bottom tab bar
- **Progression**: Tab click → Grid of app links → Click link → Open in new tab
- **Success criteria**: Links open correctly, list is easily expandable

### Admin Panel
- **Functionality**: View all orders, search by FIN, update order status, send notifications
- **Purpose**: Order management and customer service operations
- **Trigger**: Admin user login
- **Progression**: Admin login → Dashboard with all orders → Search/filter → Select order → Update status → Send notification
- **Success criteria**: Admin can manage all orders, status updates persist, users receive notifications

## Edge Case Handling
- **Invalid FIN format**: Show inline validation error with format example (7 chars alphanumeric)
- **Duplicate registration**: Check FIN existence, show "already registered" message
- **No orders**: Display empty state with helpful message and call-to-action
- **Network errors**: Show retry option with friendly error message
- **Session expiration**: Auto-logout and redirect to login with message
- **Admin access control**: Non-admin users cannot access admin routes
- **Concurrent status updates**: Last update wins, show timestamp on status changes

## Design Direction
The design should feel professional and trustworthy like a modern logistics platform (FedEx, DHL), with emphasis on clarity and efficiency over decoration. A minimal, information-focused interface serves the core purpose of quick status checking and order management.

## Color Selection
Triadic color scheme for clear status differentiation and professional logistics brand identity.

- **Primary Color**: Deep Blue (oklch(0.45 0.12 250)) - Trustworthy, professional logistics brand color for headers and CTAs
- **Secondary Colors**: Neutral Gray (oklch(0.60 0.02 250)) for secondary actions and subtle UI elements
- **Accent Color**: Orange (oklch(0.65 0.15 45)) for active states, notifications, and "In Transit" status highlighting
- **Status Colors**: 
  - In Transit (В пути): Orange (oklch(0.65 0.15 45))
  - In Warehouse (На складе): Blue (oklch(0.60 0.12 250))
  - Delivered (Доставлен): Green (oklch(0.65 0.15 145))
  
- **Foreground/Background Pairings**:
  - Background (White oklch(1 0 0)): Dark text (oklch(0.20 0.02 250)) - Ratio 14.2:1 ✓
  - Card (Light Gray oklch(0.98 0.01 250)): Dark text (oklch(0.20 0.02 250)) - Ratio 13.8:1 ✓
  - Primary (Deep Blue oklch(0.45 0.12 250)): White text (oklch(1 0 0)) - Ratio 8.1:1 ✓
  - Secondary (Gray oklch(0.60 0.02 250)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Accent (Orange oklch(0.65 0.15 45)): Dark text (oklch(0.20 0.02 250)) - Ratio 7.2:1 ✓

## Font Selection
Clean, highly legible sans-serif typography that conveys professionalism and modern logistics efficiency - using Inter for its excellent readability and neutrality.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Inter Bold/32px/tight (-0.02em) for main headers
  - H2 (Section Headers): Inter SemiBold/24px/tight (-0.01em) for sections
  - H3 (Card Titles): Inter Medium/18px/normal for order cards and subheadings
  - Body (Content): Inter Regular/16px/relaxed (1.6) for readable content
  - Small (Meta): Inter Regular/14px/normal for timestamps and secondary info
  - Badge (Status): Inter SemiBold/12px/wide (0.02em) uppercase for status badges

## Animations
Subtle, purposeful animations that communicate state changes and guide attention without slowing down the user's workflow - appropriate for a professional tracking application.

- **Purposeful Meaning**: Quick transitions indicate data updates, smooth page transitions maintain context, status badge colors pulse subtly when orders are "In Transit"
- **Hierarchy of Movement**: Status updates get prominent animation, tab switches are smooth but quick, modal dialogs slide up naturally, list items fade in on load

## Component Selection
- **Components**: 
  - Tabs (bottom navigation bar for Orders/Support/Profile/Apps)
  - Card (order list items and detail views)
  - Badge (status indicators with color coding)
  - Button (primary actions, logout, status updates)
  - Input (login/registration forms with labels)
  - Dialog (order detail modal)
  - Table (admin order management grid)
  - Avatar (user profile icon)
  - Separator (visual section breaks)
  - ScrollArea (order lists and admin panel)
  - Alert (notifications and confirmations)
  
- **Customizations**: 
  - Status badges with custom colors and icons
  - Search input with FIN code formatting
  - Tab bar component with active state highlighting
  - Order timeline component for status history
  
- **States**: 
  - Buttons: Default with subtle shadow, Hover with slight lift, Active with pressed effect, Loading with spinner, Disabled with reduced opacity
  - Inputs: Default with border, Focus with ring and border color, Error with red border and message, Success with green indicator
  - Status badges: Color-coded with icons, hover shows tooltip with timestamp
  
- **Icon Selection**: 
  - Package (order/cargo), Truck (in transit), Warehouse (in warehouse), Check (delivered), User (profile), Question (support), Grid (apps), MagnifyingGlass (search), Bell (notifications), SignOut (logout)
  
- **Spacing**: 
  - Container padding: p-6 (24px)
  - Card spacing: gap-4 (16px)
  - Section margins: mb-8 (32px)
  - List item padding: p-4 (16px)
  - Form field gaps: gap-4 (16px)
  
- **Mobile**: 
  - Stack layout on mobile (<768px)
  - Bottom tab bar remains fixed
  - Cards take full width with reduced padding (p-4)
  - Tables convert to stacked cards on mobile
  - Admin panel gets simplified mobile view with essential controls
  - Touch targets minimum 44px for all interactive elements
