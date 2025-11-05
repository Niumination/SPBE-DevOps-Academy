# AGENTS.md - Development Guidelines

## Build/Lint/Test Commands
- Start local server: `python -m http.server 8000` or `npx serve`
- Open browser to `http://localhost:8000`
- Test with demo account: demo@spbe.academy / demo123
- No build system, linting, or testing framework (vanilla JS)

## Code Style Guidelines

### JavaScript (app.js, js/*.js)
- Use ES6+ features: const/let, arrow functions, template literals, async/await
- Class-based architecture: separate managers (AuthManager, ProgressManager, etc.)
- camelCase for variables/functions, PascalCase for classes/constructors
- Descriptive function names: `renderCurriculum()`, `calculateProgress()`
- No imports - vanilla JS with global window scope for managers
- Handle errors gracefully with try/catch and user feedback via notifications
- Use semantic event handling: `onclick="app.functionName()"` in HTML
- Return consistent response format: `{ success: boolean, data?: any, error?: string }`

### HTML (index.html)
- Semantic HTML5: `<nav>`, `<main>`, `<section>` with proper hierarchy
- BEM-like classes: `curriculum-card`, `module-header`, `btn--primary`
- Accessibility: aria labels, semantic structure, keyboard navigation
- Indonesian language content: `<html lang="id">`
- Use data attributes for dynamic content: `data-module-id`, `data-video-url`

### CSS (style.css, components/*.css)
- CSS custom properties for theming: `--color-primary`, `--space-16`
- Mobile-first responsive design with logical media queries
- Component-based CSS organization in separate files
- Dark mode support via `@media (prefers-color-scheme: dark)` and `[data-color-scheme]`
- Use CSS Grid and Flexbox for layouts

### Database (database/migrations/*.sql)
- Use UUID for primary keys with `uuid_generate_v4()`
- Implement Row Level Security (RLS) policies
- Add created_at/updated_at timestamps with triggers
- Use proper indexing for performance
- Follow naming conventions: snake_case for tables/columns

### General
- No external dependencies - keep vanilla JavaScript
- Progressive enhancement approach with fallback systems
- DRY, reusable components with consistent error handling
- Indonesian localization for all UI text and content
- Environment variables use VITE_ prefix for Vercel compatibility