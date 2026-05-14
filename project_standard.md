# Strictly follow the standards defined in this document 
i want to make this project phase by phase

IMPORTANT DEVELOPMENT RULES:

- Follow existing project architecture strictly
- Do NOT modify unrelated files
- Do NOT redesign existing UI
- Do NOT change folder structure unless requested
- Do NOT add unnecessary libraries
- Maintain full consistency with existing design system
- Follow the Reddit-inspired dark orange theme
- Maintain modular and reusable architecture
- Keep components isolated and scalable
- Use clean production-level code
- Avoid code duplication
- Use reusable utilities and constants
- Follow existing naming conventions
- Maintain responsive design
- Maintain accessibility
- Use smooth minimal animations only
- Keep code interview-ready and enterprise-level

IMPORTANT:
Only perform the tasks explicitly mentioned in requested phase.
Do not implement future phases.
Do not overengineer features.
Wait for next instructions after completing the current phase.


# Team Task Manager — Design System & Development Standards

## Objective
This document defines the global UI/UX, architecture, styling, animation, spacing, and modularity standards for the entire project.

The primary goal is to maintain:
- Visual consistency
- Clean architecture
- Scalability
- Reusability
- Maintainability
- Easy future enhancements

# 1. Core Development Philosophy
The project must follow these principles:

## 1.1 Consistency First
Every screen, component, animation, and interaction must feel part of one unified system.

## 1.2 Modular Architecture
Each module must be isolated and reusable. for every element make seperate folder and file for each component, style, and animation. This promotes separation of concerns and makes it easier to maintain and scale the project.

## 1.3 Scalable Design
New features should be added without breaking existing structure.

## 1.4 Maintainability
Code should be easy to update and debug.

## 1.5 Reusability
Avoid duplicate code and repeated styles.



# 2. Design Language
The UI should follow a:
- Modern
- Minimal
- Professional
- Clean
- Productivity-focused

# 3. Color System
# UI/UX & Design System Standards

## Design Philosophy
The project must follow a modern Reddit-inspired productivity dashboard theme with warm orange accents, dark surfaces, clean layouts, smooth animations, and fully consistent UI/UX across the application.


# Color System

## Brand Colors
| Purpose | Color |
|---|---|
| Primary | #FF6A33 |
| Primary Hover | #E85A26 |
| Accent | #FF8B60 |
| Success | #22C55E |
| Warning | #F59E0B |
| Danger | #EF4444 |
| Info | #3B82F6 |

---

## Background Colors
| Purpose | Color |
|---|---|
| Main Background | #0F1115 |
| Secondary Background | #161A22 |
| Sidebar | #11151C |
| Card | #1B2230 |
| Elevated Card | #222B3A |
| Surface | #1E2635 |

---

## Text Colors
| Purpose | Color |
|---|---|
| Primary Text | #F8FAFC |
| Secondary Text | #CBD5E1 |
| Muted Text | #94A3B8 |
| Disabled Text | #64748B |

---

## Border Colors
| Purpose | Color |
|---|---|
| Primary Border | #2D3748 |
| Active Border | #FF6A33 |
| Soft Border | rgba(255,255,255,0.06) |

---



# Typography

## Font Family
```css
font-family: 'Inter', system-ui, sans-serif;
```

## Font Sizes
| Type | Size |
|---|---|
| Heading XL | 36px |
| Heading LG | 30px |
| Heading MD | 24px |
| Body | 16px |
| Small Text | 14px |
| Caption | 12px |

## Font Weights
| Type | Weight |
|---|---|
| Regular | 400 |
| Medium | 500 |
| SemiBold | 600 |
| Bold | 700 |

---

# Spacing System

| Token | Size |
|---|---|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |

Rules:
- Never use random spacing values
- Maintain equal vertical rhythm
- Use consistent padding and margins throughout the project

---

# Border Radius

| Type | Radius |
|---|---|
| Small | 6px |
| Medium | 10px |
| Large | 16px |
| Card | 20px |

---









# 1. Global Transition System

## Standard Transition
```css
transition: all 0.3s ease;
```

## Fast Transition
```css
transition: all 0.2s ease;
```

## Slow Transition
```css
transition: all 0.5s ease;
```

Rules:
- Use smooth easing only
- Avoid harsh transitions
- Maintain consistency globally

---

# 2. Orange Accent Interaction Effects

## Primary Glow
```css
box-shadow: 0 0 20px rgba(255,106,51,0.18);
```

## Strong Glow
```css
box-shadow: 0 0 32px rgba(255,106,51,0.28);
```

## Soft Border Glow
```css
border: 1px solid rgba(255,106,51,0.35);
```

Use orange glow only for:
- Active buttons
- Focus states
- Important cards
- Hover interactions
- Selected items

Avoid excessive glow usage.

---

# 3. Shadow System

## Soft Card Shadow
```css
box-shadow: 0 4px 20px rgba(0,0,0,0.18);
```

## Elevated Shadow
```css
box-shadow: 0 10px 40px rgba(0,0,0,0.28);
```

## Hover Shadow
```css
box-shadow: 0 12px 32px rgba(0,0,0,0.30);
```

Rules:
- Use dark soft shadows only
- Maintain subtle depth
- Avoid sharp shadows

---

# 4. Hover Animation Standards

## Button Hover
```css
transform: scale(1.02);
background: #E85A26;
```

Effect:
- Slight scale increase
- Warm orange brightness
- Soft glow feedback

---

## Card Hover
```css
transform: translateY(-4px);
border-color: rgba(255,106,51,0.25);
```

Effect:
- Slight upward movement
- Soft orange border glow
- Elevated shadow

---

## Icon Hover
```css
color: #FF8B60;
opacity: 1;
```

Effect:
- Smooth orange accent highlight

---

# 5. Focus States

## Input Focus
```css
outline: none;
border-color: #FF6A33;
box-shadow: 0 0 0 4px rgba(255,106,51,0.15);
```

## Button Focus
```css
box-shadow: 0 0 0 4px rgba(255,106,51,0.18);
```

Rules:
- Focus states must always be visible
- Use soft orange accessibility glow

---

# 6. Glassmorphism Standards

## Glass Surface
```css
background: rgba(30, 38, 53, 0.65);
backdrop-filter: blur(14px);
border: 1px solid rgba(255,255,255,0.06);
```

Use only for:
- Navbar
- Modals
- Floating panels
- Dropdowns

Avoid overusing glass effects.

---

# 7. Animation Standards

Allowed:
- Fade In
- Slide Up
- Soft Scale
- Hover Lift
- Glow Transition

Avoid:
- Bounce animations
- Flashing effects
- Aggressive rotations
- Heavy motion

---

# 8. Loading Animations

Preferred:
- Skeleton loaders
- Smooth spinners
- Pulse animations

Loading animations must:
- Feel lightweight
- Match dark orange theme
- Avoid distraction

---

# 9. Motion Timing Standards

| Type | Duration |
|---|---|
| Fast | 0.2s |
| Normal | 0.3s |
| Slow | 0.5s |

---

# 10. Interaction Philosophy

Every interaction must:
- Feel smooth
- Provide visual feedback
- Maintain orange accent consistency
- Preserve readability
- Support premium SaaS aesthetics

---

# 11. Final Experience Goal

The complete motion system should feel like:
- Reddit dark mode
- Linear smoothness
- Notion simplicity
- Modern SaaS productivity dashboard

with:
- Warm orange accent lighting
- Smooth transitions
- Soft layered depth
- Minimal professional animations