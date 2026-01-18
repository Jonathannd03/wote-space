# Wote Space - Brand Identity Guide

## Logo

The Wote Space logo features a handwritten-style "S" with a dot motif.

**Location**: `/public/Wotespace-logo-01.png`

## Color Palette

### Primary Colors

- **Deep Black**: `#0a0a0a` (brand-black)
  - Main background color
  - Creates high contrast and modern feel

- **Black Light**: `#1a1a1a` (brand-black-light)
  - Secondary background
  - Card backgrounds and sections

- **Strong Red**: `#dc2626` (brand-red)
  - Primary accent color
  - CTAs, highlights, and interactive elements

- **Red Dark**: `#b91c1c` (brand-red-dark)
  - Hover states for red elements

- **Red Light**: `#ef4444` (brand-red-light)
  - Subtle red accents

### Usage Guidelines

**High Contrast Design**
- Black backgrounds with red accents
- White text on black for readability
- Red for calls-to-action and emphasis

**Do's**
- ✅ Use deep black (#0a0a0a) for main backgrounds
- ✅ Use strong red (#dc2626) for primary CTAs
- ✅ Maintain generous spacing between elements
- ✅ Use uppercase text with wide tracking for emphasis
- ✅ Keep borders minimal (1px) or use solid blocks

**Don'ts**
- ❌ Don't use rounded corners (use sharp edges or minimal rounding)
- ❌ Don't dilute the brand with too many colors
- ❌ Don't use red as background for large sections
- ❌ Don't use light backgrounds except for specific contrast sections

## Typography

### Hierarchy
- **Headings**: Bold, large, white text
- **Body**: Regular weight, gray-300 text
- **CTAs**: Uppercase, wide tracking, bold

### Spacing
- Generous padding and margins
- Clean, breathable layouts
- Clear visual hierarchy

## Design Principles

### 1. Creative & Bold
- Strong visual identity
- Confident use of color
- Eye-catching CTAs

### 2. Modern & Urban
- Clean lines
- Minimal ornamentation
- Contemporary spacing

### 3. Community-Driven
- Accessible navigation
- Clear communication
- Welcoming atmosphere

## Component Patterns

### Buttons

**Primary CTA**
```
bg-brand-red
text-white
uppercase
tracking-wider
hover:bg-brand-red-dark
transform hover:scale-105
```

**Secondary CTA**
```
bg-transparent
border-2 border-brand-red
text-white
hover:bg-brand-red
```

### Cards
```
bg-brand-black
border border-brand-black-light
hover:border-brand-red
```

### Section Dividers
```
h-1 w-24 bg-brand-red
```

## Tailwind Configuration

The brand colors are configured in `tailwind.config.ts`:

```typescript
colors: {
  brand: {
    black: '#0a0a0a',
    'black-light': '#1a1a1a',
    red: '#dc2626',
    'red-dark': '#b91c1c',
    'red-light': '#ef4444',
  }
}
```

## Brand Voice

- **Professional** yet **approachable**
- **Modern** and **innovative**
- **Community-focused**
- **Action-oriented**
