# Al-Furqan Group of Schools - Design Guidelines

## Design Approach

**Hybrid Strategy**: Public website uses institutional/educational reference patterns (combining warmth of school sites like St. Paul's School with modern web standards), while dashboards follow clean data-management patterns inspired by Linear and Notion for efficiency.

**Core Principle**: Professional institutional presence that builds trust while maintaining accessibility for diverse user literacy levels (staff, students, parents in Nigeria).

---

## Typography System

**Primary Font**: Inter or Open Sans (Google Fonts) - excellent readability for both English and data-heavy interfaces
**Secondary Font**: Poppins - for headings to add personality

**Hierarchy**:
- Hero Headlines: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section Headers: text-3xl md:text-4xl, font-semibold
- Subsection Titles: text-xl md:text-2xl, font-semibold
- Body Text: text-base md:text-lg, font-normal, leading-relaxed
- Dashboard Labels: text-sm font-medium
- Data/Stats: text-4xl md:text-5xl font-bold (for impact numbers)
- Metadata/Captions: text-xs md:text-sm, text-gray-600

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 20, 24** consistently
- Component padding: p-4 to p-8
- Section spacing: py-12 md:py-20 lg:py-24
- Card gaps: gap-6 md:gap-8
- Form fields: space-y-4

**Container Strategy**:
- Public pages: max-w-7xl mx-auto px-4 md:px-6 lg:px-8
- Dashboard content: max-w-screen-2xl mx-auto px-6
- Reading content: max-w-4xl for optimal readability

**Grid Systems**:
- Alumni/Teacher showcase: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Feature cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dashboard stats: grid-cols-2 md:grid-cols-4
- Form layouts: Single column on mobile, two-column on desktop where appropriate

---

## Public Website Components

### Home Page Structure

**Hero Section** (h-screen or min-h-[600px]):
- Large hero image showing school building or students in uniform
- Overlaid headline: "Al-Furqan Group of Schools"
- Subheading: Location (Airforce Road GbaGba, Ilorin, Kwara State)
- Two CTAs with blurred backgrounds: "Portal Login" (primary), "Learn More" (secondary)
- Buttons use backdrop-blur-md bg-white/10 border border-white/20

**Statistics Section** (py-16):
- Four-column grid showcasing: Years Established, Students Enrolled, Qualified Teachers, Success Rate
- Large numbers with icons above, labels below

**About Preview** (py-20):
- Two-column layout: left side has rich text about school mission, right side features image of students or campus
- "Read Full History" button linking to About page

**Alumni & Teacher Showcase** (py-20):
- Masonry-style or card grid layout
- Each card: portrait photo, name (text-xl font-semibold), graduation year/subject (text-sm), brief description (text-base)
- Minimum 8-12 featured profiles on home page
- "View All Alumni" button if more exist

**Call-to-Action Section** (py-16):
- Centered, prominent section encouraging registration/portal access
- Brief explanation of document-based registration process
- Clear buttons: "Download Registration Forms", "Access Portal"

### About Page

**History Section**:
- Timeline layout or narrative format with supporting images
- Founder information, milestones, achievements
- Mission, vision, values cards in three-column grid

**Facilities/Departments Section**:
- Visual cards showing different school levels (Nursery, Primary, Secondary, etc.)
- Icons representing each department

### Navigation

**Header**: 
- Sticky navigation with school logo (left), menu items (center), "Portal Login" button (right)
- Mobile: Hamburger menu with smooth slide-in drawer
- Links: Home, About, Alumni, Teachers, Contact, Portal

**Footer**:
- Three-column layout: School info & address, Quick links, Contact details
- Social media icons if applicable
- Copyright and regulatory info

---

## Dashboard Design System

### Common Dashboard Elements

**Sidebar Navigation** (fixed, w-64):
- School logo at top
- User profile card showing: avatar placeholder, name, role badge
- Menu items with icons (use Heroicons): Dashboard, specific role features
- Logout at bottom

**Top Bar** (h-16):
- Breadcrumb navigation
- Search bar (where applicable)
- Notification bell icon
- User avatar with dropdown

**Page Layout**:
- Content area: ml-64 (accounting for sidebar), p-6 md:p-8
- Page headers: mb-8 with title and optional action buttons

### Role-Specific Dashboard Components

**Super Admin Dashboard**:
- Document management table with upload zone (border-dashed border-2 when empty)
- Pending applications cards showing uploaded scans preview
- Approve/Reject action buttons with modal confirmations
- User management table with search, filter by role

**Staff Dashboard**:
- Timetable: Weekly calendar grid showing class schedule
- Subject cards listing assigned classes
- Payroll section: Clean form with bank account input field (with validation), submission status indicator
- Grade entry: Spreadsheet-like table interface (student rows, assessment columns)
- Notice board: Card-based feed with date stamps

**Student Dashboard**:
- Notice board: Timeline layout with newest first
- Results card: Locked state with message when not released, detailed grade table when released
- Fee payment info card: School bank details specific to class level, payment reference instructions

**Management Dashboard**:
- Payroll overview: Data table showing all staff, their submitted bank details, payment status
- Notice composer: Rich text editor for announcements with target audience selector (Staff/Students/Both)
- Financial summary: Charts showing fee collection by class

### Dashboard UI Patterns

**Cards**: Consistent shadow-sm border rounded-lg p-6
**Tables**: Striped rows, hover states, sortable headers, pagination for long lists
**Forms**: Grouped by fieldsets, clear labels above inputs, validation messages, submit buttons aligned right
**Modals**: Centered, max-w-2xl, with backdrop blur
**Badges**: For roles (Admin, Staff, Student), status indicators (Pending, Approved, Paid)
**Empty States**: Centered with icon, helpful message, primary action button

---

## Images

### Public Website Images:
1. **Hero Image**: Full-width, high-quality photo of school building exterior or students in uniform during assembly (Professional, aspirational feel)
2. **About Section**: Campus facilities, classrooms in use, students learning
3. **Alumni Portraits**: Professional headshots or graduation photos (minimum 100x100px, ideally 300x300px)
4. **Teacher Portraits**: Professional photos in teaching context or formal headshots
5. **Activities Section** (if added): Sports day, cultural events, science labs

### Dashboard Images:
- User avatars: 40x40px circular placeholders
- Document previews: Thumbnail representations of uploaded scans
- School logo: Consistent placement in navigation (approx 120x60px)

---

## Responsive Behavior

**Breakpoints**:
- Mobile: < 768px - single column, stacked navigation, simplified tables
- Tablet: 768px - 1024px - two columns where appropriate, condensed dashboards
- Desktop: > 1024px - full multi-column layouts, sidebar visible

**Dashboard Mobile Adaptation**:
- Sidebar becomes hamburger overlay
- Tables convert to card views with key information
- Reduced padding throughout

---

## Accessibility & Usability

- Minimum touch targets: 44x44px for all interactive elements
- Form inputs: h-12 minimum, clear focus states with ring
- Error messages: text-red-600, positioned below field
- Success states: text-green-600 with checkmark icon
- Loading states: Skeleton loaders for data-heavy sections, spinners for actions
- Consistent iconography from Heroicons throughout entire application

This design creates a professional, trustworthy institutional presence while ensuring the complex dashboard functionality remains intuitive for users with varying technical literacy.