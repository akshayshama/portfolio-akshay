# BankFlow - SaaS Banking Platform Specification

## 1. Project Overview
- **Project Name**: BankFlow
- **Type**: Full-stack SaaS banking web application
- **Core Functionality**: Multi-tenant banking platform with account management, transactions, transfers, and dashboard analytics
- **Target Users**: Banking customers, fintech startups, SaaS platforms requiring banking features

## 2. Tech Stack
- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Deployment**: Docker + Render (auto-deploy on git push)

## 3. UI/UX Specification

### Layout Structure
- **Responsive layout** with sidebar navigation
- **Pages**:
  1. Login/Register
  2. Dashboard (overview, balance, recent transactions)
  3. Accounts (checking, savings, credit)
  4. Transactions (history, filters, search)
  5. Transfer (send money, internal/external)
  6. Settings (profile, security)

### Visual Design

**Color Palette**
- Background: `#0a0a0f` (dark)
- Surface: `#12121a` (card bg)
- Primary: `#00d4aa` (teal accent)
- Secondary: `#6366f1` (indigo)
- Success: `#10b981`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Text primary: `#f8fafc`
- Text secondary: `#94a3b8`
- Border: `#1e293b`

**Typography**
- Font: 'DM Sans', sans-serif
- Headings: 700 weight
- Body: 400 weight
- Monospace (numbers): 'JetBrains Mono'

**Components**
- Sidebar with navigation icons
- Top header with user avatar and notifications
- Cards with subtle glow effects
- Data tables with pagination
- Modal dialogs for forms
- Toast notifications

## 4. Functionality Specification

### Authentication
- User registration with email/password
- Login with JWT tokens
- Protected routes
- Session management

### Dashboard
- Total balance across accounts
- Monthly income/expense chart
- Recent transactions list
- Quick action buttons

### Account Management
- Multiple account types (Checking, Savings)
- Account details (number, balance, type)
- Account creation

### Transactions
- Transaction history with pagination
- Filter by date, type, amount
- Search by description
- Transaction details modal

### Transfers
- Internal transfers (between accounts)
- External transfers (to other users)
- Transfer confirmation
- Transaction validation

### API Endpoints
```
POST /api/auth/register
POST /api/auth/login
GET  /api/user/profile

GET  /api/accounts
POST /api/accounts
GET  /api/accounts/:id

GET  /api/transactions
GET  /api/transactions/:id

POST /api/transfers
```

## 5. Database Schema

### Users
- id, email, password, name, createdAt

### Accounts
- id, userId, type, balance, accountNumber, createdAt

### Transactions
- id, accountId, type, amount, description, createdAt

## 6. Acceptance Criteria
- [ ] User can register and login
- [ ] Dashboard shows account balance and transactions
- [ ] Can view all accounts
- [ ] Can view transaction history with filters
- [ ] Can transfer money between accounts
- [ ] Responsive on mobile and desktop
- [ ] Docker container runs locally
- [ ] Auto-deploys to Render on git push