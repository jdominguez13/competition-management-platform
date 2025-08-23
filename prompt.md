# Claude Code Prompt: Build a Modern Figure Skating Competition Management Platform

## Project Overview

Build a comprehensive, modern web application that reimagines EntryEeze.com as a state-of-the-art figure skating competition and membership management platform. The original EntryEeze serves figure skating clubs but has an outdated design and user experience. Create a superior version with modern UI/UX, enhanced functionality, and better performance.

## Core Business Requirements

### Primary Functions
1. **Competition Management System**
   - Create and configure competitions with custom rules and categories
   - Handle skater registrations with validation and payment processing
   - Generate referee reports and competition schedules
   - Manage practice ice reservations and merchandise sales
   - Real-time entry tracking and revenue monitoring

2. **Membership Management System**
   - Club member database with profiles and status tracking
   - Membership renewal automation with payment processing
   - Communication tools for club announcements
   - Member verification for competition eligibility

3. **Multi-User Dashboard System**
   - Competition organizers (admin panel)
   - Coaches (view student entries and schedules)
   - Skaters (registration and personal schedules)
   - Clubs (member verification and management)

## Technical Stack Requirements

### Frontend
- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand or React Query for server state
- **Authentication**: NextAuth.js with multiple providers
- **Forms**: React Hook Form with Zod validation
- **UI Libraries**: Framer Motion for animations, React DnD for drag-and-drop scheduling

### Backend
- **API**: Next.js API routes or separate Express.js server
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with secure session management
- **Payments**: Stripe integration for credit card processing
- **Email**: Resend or SendGrid for automated notifications
- **File Storage**: AWS S3 or Cloudinary for documents/images

### DevOps & Hosting
- **Deployment**: Vercel or AWS with Docker containers
- **Database Hosting**: Railway, Supabase, or AWS RDS
- **CDN**: Cloudfront or Vercel Edge Network
- **Monitoring**: Sentry for error tracking, analytics dashboard

## Key Features to Implement

### 1. Modern Landing Page & Marketing Site
```
Create a conversion-focused homepage with:
- Hero section with clear value proposition
- Feature showcase with animations
- Customer testimonials and success stories
- Interactive demo booking system
- Pricing plans with feature comparison
- Mobile-responsive design with dark/light mode
```

### 2. Competition Creation & Management
```
Build an intuitive competition setup wizard:
- Step-by-step competition configuration
- Event categories with custom rules and age groups
- Entry fee structure with early bird discounts
- Practice ice session management
- Merchandise catalog setup
- Automated referee report generation
- Real-time dashboard with analytics
```

### 3. Advanced Registration System
```
Implement a modern registration flow:
- Shopping cart experience for multiple events
- Real-time availability checking
- Smart conflict detection (time/level conflicts)
- Coach and club verification workflow
- Multiple payment options (Stripe, PayPal)
- Automated confirmation emails
- Mobile-optimized registration forms
```

### 4. Intelligent Scheduling System
```
Create a drag-and-drop scheduler with:
- Visual timeline interface
- Automatic conflict resolution
- Practice ice assignment automation
- Export to PDF/Excel capabilities
- Real-time updates for all stakeholders
- Mobile app for on-site schedule viewing
```

### 5. Enhanced User Dashboards
```
Design role-specific dashboards:

Skater Dashboard:
- Upcoming competitions and deadlines
- Personal competition history
- Payment tracking and receipts
- Schedule viewer with calendar sync
- Music upload and requirements tracker

Coach Dashboard:
- Student overview with status tracking
- Bulk registration capabilities
- Competition calendar with filtering
- Performance analytics and reports
- Communication center for updates

Admin Dashboard:
- Revenue tracking with detailed analytics
- Entry management with bulk operations
- Real-time competition monitoring
- Automated report generation
- Customer support ticket system
```

### 6. Communication & Notification System
```
Build comprehensive messaging:
- Automated email sequences for different user actions
- In-app notification center
- SMS notifications for urgent updates
- Slack/Discord integration for organizers
- Customizable email templates
- Bulk communication tools
```

## UI/UX Design Requirements

### Design Principles
- **Clean & Modern**: Minimalist design with plenty of white space
- **Mobile-First**: Responsive design optimized for all devices
- **Accessible**: WCAG 2.1 AA compliance with proper contrast and navigation
- **Fast**: Sub-2 second load times with optimized images and code splitting
- **Intuitive**: Clear user flows with minimal clicks to complete actions

### Visual Design System
```
Create a cohesive design system:
- Primary brand colors: Modern blue/teal palette
- Typography: Clean sans-serif font stack (Inter or similar)
- Component library: Consistent buttons, forms, cards, modals
- Icon system: Lucide or Heroicons for consistency
- Animation guidelines: Subtle, purposeful micro-interactions
- Loading states: Skeleton screens and progress indicators
```

### Key UI Components to Build
1. **Navigation**: Responsive navbar with user-specific menus
2. **Forms**: Multi-step forms with validation and auto-save
3. **Tables**: Sortable, filterable data tables with pagination
4. **Calendar**: Interactive calendar for scheduling and viewing
5. **Charts**: Revenue and analytics dashboards
6. **Cards**: Competition and event display components
7. **Modals**: Confirmation dialogs and detail views

## Advanced Features to Include

### 1. Payment & Financial Management
```
- Stripe Connect for direct deposits to organizers
- Automated refund processing
- Financial reporting and tax documents
- Multi-currency support
- Payment plan options for expensive competitions
- Scholarship/discount code system
```

### 2. Integration Capabilities
```
- U.S. Figure Skating API integration
- ISI (Ice Skating Institute) partnership features
- Calendar sync (Google Calendar, Outlook)
- Accounting software integration (QuickBooks)
- Live streaming platform integration
- Social media sharing automation
```

### 3. Mobile App Features
```
- Progressive Web App (PWA) capabilities
- Offline functionality for viewing schedules
- Push notifications for important updates
- QR code check-in system
- Live competition updates
- Photo sharing and social features
```

### 4. Analytics & Reporting
```
- Real-time competition analytics dashboard
- Skater participation trends
- Revenue optimization insights
- Performance benchmarking tools
- Custom report builder
- Data export capabilities
```

## Implementation Phases

### Phase 1: Foundation (Weeks 1-3)
- Set up development environment and repository
- Implement authentication system
- Create basic database schema
- Build core UI components and design system
- Set up payment processing infrastructure

### Phase 2: Core Competition Features (Weeks 4-7)
- Competition creation and configuration system
- Basic registration flow with payment
- User dashboards for all user types
- Email notification system
- Admin panel for competition management

### Phase 3: Advanced Features (Weeks 8-11)
- Intelligent scheduling system with drag-and-drop
- Practice ice management
- Advanced reporting and analytics
- Mobile optimization and PWA features
- Integration with external systems

### Phase 4: Polish & Launch (Weeks 12-14)
- Performance optimization and caching
- Comprehensive testing and bug fixes
- Documentation and help system
- Beta testing with real figure skating clubs
- Production deployment and monitoring setup

## Quality Standards

### Performance Requirements
- Lighthouse score: 90+ in all categories
- Time to Interactive: < 3 seconds
- First Contentful Paint: < 1.5 seconds
- Database query optimization with proper indexing
- Image optimization with next/image

### Security Standards
- OWASP security guidelines compliance
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Secure payment processing (PCI DSS compliance)
- Regular security audits and updates

### Code Quality
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Comprehensive unit and integration tests
- API documentation with OpenAPI/Swagger
- Git workflow with feature branches and reviews

## Success Metrics

### User Experience Metrics
- Registration completion rate > 85%
- User satisfaction score > 4.5/5
- Support ticket reduction > 60%
- Mobile usage > 40% of total traffic

### Business Metrics
- Competition creation time reduced by 70%
- Processing time for entries reduced by 80%
- Revenue processing efficiency improved by 90%
- Customer acquisition cost reduced by 50%

## Getting Started

1. **Initial Setup**: Create Next.js project with TypeScript and Tailwind
2. **Database Design**: Set up PostgreSQL with Prisma schema
3. **Authentication**: Implement NextAuth.js with email/password and social logins
4. **Core Components**: Build reusable UI components with shadcn/ui
5. **Payment Integration**: Set up Stripe for payment processing
6. **API Development**: Create RESTful APIs for all core functionality

## Additional Considerations

- **Accessibility**: Ensure keyboard navigation and screen reader compatibility
- **Internationalization**: Prepare for multiple language support
- **Scalability**: Design for handling 10,000+ concurrent users
- **Backup Strategy**: Automated daily backups with point-in-time recovery
- **Monitoring**: Implement comprehensive logging and error tracking
- **Documentation**: Create user guides and API documentation

---

**Start by building the core authentication system and basic user dashboards, then progressively add competition management features. Focus on creating an intuitive user experience that makes competition management effortless for organizers while providing a seamless registration experience for skaters.**