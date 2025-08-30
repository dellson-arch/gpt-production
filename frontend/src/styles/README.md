# Theme System Documentation

This directory contains the centralized theme system for the GPT Production application.

## File Structure

- `theme.css` - CSS variables for light and dark themes
- `global.css` - Global styles and CSS reset
- `forms.css` - Form-specific styles (Login, Register)
- `home.css` - Home page styles

## Theme Variables

### Colors
- `--primary-color`: Main brand color (#6366f1)
- `--primary-hover`: Hover state for primary elements (#4f46e5)
- `--secondary-color`: Secondary brand color (#64748b)
- `--accent-color`: Accent color (#06b6d4)

### Background Colors
- `--bg-primary`: Main background (#ffffff / #0f172a)
- `--bg-secondary`: Secondary background (#f8fafc / #1e293b)
- `--bg-tertiary`: Tertiary background (#f1f5f9 / #334155)

### Text Colors
- `--text-primary`: Primary text (#0f172a / #f8fafc)
- `--text-secondary`: Secondary text (#475569 / #cbd5e1)
- `--text-muted`: Muted text (#64748b / #94a3b8)
- `--text-inverse`: Inverse text (#ffffff)

### Spacing
- `--spacing-xs`: 0.25rem (4px)
- `--spacing-sm`: 0.5rem (8px)
- `--spacing-md`: 1rem (16px)
- `--spacing-lg`: 1.5rem (24px)
- `--spacing-xl`: 2rem (32px)
- `--spacing-2xl`: 3rem (48px)

### Border Radius
- `--radius-sm`: 0.375rem (6px)
- `--radius-md`: 0.5rem (8px)
- `--radius-lg`: 0.75rem (12px)
- `--radius-xl`: 1rem (16px)

### Typography
- `--font-family`: System font stack
- `--font-size-xs` through `--font-size-4xl`: Typography scale

### Transitions
- `--transition-fast`: 150ms
- `--transition-normal`: 250ms
- `--transition-slow`: 350ms

## Theme Switching

The application automatically detects system theme preferences and allows manual switching between light and dark themes.

### System Theme Detection
- Automatically switches based on `prefers-color-scheme` media query
- Respects user's system preference
- Can be overridden manually

### Manual Theme Control
- Use the `ThemeToggle` component
- Theme preference is saved to localStorage
- Context provides `useTheme()` hook for components

## Responsive Design

### Mobile-First Approach
- Base styles target mobile devices
- Progressive enhancement for larger screens
- Breakpoints: 768px (tablet), 1024px (desktop), 1280px (large desktop)

### Media Queries
```css
@media (min-width: 768px) { /* Tablet styles */ }
@media (min-width: 1024px) { /* Desktop styles */ }
@media (min-width: 1280px) { /* Large desktop styles */ }
```

## Accessibility Features

### Focus Management
- Visible focus indicators using `:focus-visible`
- High contrast mode support
- Reduced motion support

### High Contrast Mode
- Enhanced borders and shadows
- Improved text contrast
- Respects `prefers-contrast: high`

### Reduced Motion
- Disables animations when `prefers-reduced-motion: reduce`
- Smooth scrolling disabled
- Transform effects removed

## Usage Examples

### Using Theme Variables
```css
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}
```

### Theme Context in React
```jsx
import { useTheme } from '../context/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
};
```

### Adding New Components
1. Import the theme variables: `@import './theme.css';`
2. Use CSS variables for colors, spacing, and typography
3. Follow mobile-first responsive design
4. Include accessibility considerations
5. Test with different themes and screen sizes

## Best Practices

1. **Always use CSS variables** instead of hardcoded values
2. **Mobile-first approach** - start with mobile styles, enhance for larger screens
3. **Accessibility first** - ensure proper contrast and focus management
4. **Performance** - minimize CSS bundle size and use efficient selectors
5. **Consistency** - use the established spacing and typography scale
6. **Testing** - test across different themes, screen sizes, and accessibility modes
