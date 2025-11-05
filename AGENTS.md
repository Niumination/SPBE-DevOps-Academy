# AGENTS.md - Development Guidelines

## Build/Lint/Test Commands
- Start local server: `python -m http.server 8000` or `npx serve`
- Open browser to `http://localhost:8000`
- No build system, linting, or testing framework (vanilla JS)

## Code Style Guidelines

### JavaScript (app.js)
- Use ES6+ features: const/let, arrow functions, template literals
- Object-oriented pattern: separate data (`curricula`, `state`) from logic (`app`)
- camelCase for variables/functions, PascalCase for constructors
- Descriptive function names: `renderCurriculum()`, `calculateProgress()`
- No imports - vanilla JS with global scope management
- Handle errors gracefully with try/catch and user feedback
- Use semantic event handling: `onclick="app.functionName()"` in HTML

### HTML (index.html)
- Semantic HTML5: `<nav>`, `<main>`, `<section>` with proper hierarchy
- BEM-like classes: `curriculum-card`, `module-header`, `btn--primary`
- Accessibility: aria labels, semantic structure, keyboard navigation
- Indonesian language content: `<html lang="id">`

### CSS (style.css)
- CSS custom properties for theming: `--color-primary`, `--space-16`
- Mobile-first responsive design with logical media queries
- Utility classes for common patterns, component-specific styles after base
- Dark mode support via `@media (prefers-color-scheme: dark)` and `[data-color-scheme]`

### General
- No external dependencies - keep vanilla
- Progressive enhancement approach
- DRY, reusable components with consistent error handling
- Indonesian localization for UI text and content