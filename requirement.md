# Claude Code CLI Prompt — wote-space

## System Role

You are a senior full-stack engineer and product designer operating autonomously via Claude Code CLI.

---

## Objective

Build a **production-ready website** for a co-working and meeting space named **wote-space**, with a strong focus on **online booking**, **email confirmation**, and **brand consistency**.

---

## Brand Identity (Mandatory)

- **Logo:** Provided (handwritten-style “S” with dot motif)
- **Primary colors:**
  - Deep black background
  - Strong red accent (logo red)
- **Brand feel:**
  - Creative
  - Bold
  - Modern
  - Urban / community-driven

Design must emphasize:
- High contrast (black × red)
- Clean layouts
- Generous spacing
- Subtle motion and micro-interactions (optional)

---

## Gallery

- logo in /public/Wotespace-logo-01.png
- premises pictures /public/premises

---

## Design Direction

- Visual structure inspired by a **professional WordPress theme**
- Implemented with **modern frameworks**
- No WordPress or page builders
- Minimal, business-ready, creative-friendly
- Fully responsive
- Accessible and performant

---

## Tech Stack (Recommended)

Choose the best fit and explain briefly:

- **Frontend:** Next.js (App Router preferred)
- **Styling:** Tailwind CSS
- **Backend:** API routes / server actions
- **Database:** PostgreSQL or SQLite via Prisma
- **Email:** SMTP-based transactional email
- **Internationalization:** French (default) + English

---

## Core Pages

- `/` — Home  
  - Brand-aligned hero
  - Clear value proposition
  - Primary booking CTA

- `/spaces`
  - Room configurations/setups (single room with different setups)
  - Co-working option
  - Capacity, amenities, pricing for each setup

- `/booking` (Critical)  
  - Step-by-step booking flow

- `/about`

- `/contact`

---

## Booking System (Critical)

Must support:

- Date and time selection
- Space selection
- Real-time availability validation
- Prevention of double bookings
- Persistent storage in database
- Unique booking reference ID
- **Automatic confirmation email to client**
- Optional admin notification email

UX must be simple, clear, and trustworthy.

---

## Internationalization (i18n)

- Default language: **French**
- Secondary language: **English**
- Visible language switcher
- Fully translated UI (no placeholders)
- Localized routes or dictionary-based i18n
- Confirmation emails localized (FR + EN)

---

## Engineering Standards

- Clean, maintainable architecture
- Reusable UI components
- Clear folder structure
- Environment variables for secrets
- Basic security best practices
- Fully self-hostable
- **No WordPress**
- **No third-party booking SaaS**

---

## Deliverables

1. Project initialization
2. Folder structure overview
3. Core UI components (brand-aligned)
4. Booking logic implementation
5. Email sending logic
6. i18n setup
7. Local development instructions

---

## Execution Rules

- Think before coding
- Build incrementally
- Explain major decisions briefly
- Prioritize reliability and real-world usability
- Assume production deployment

---

**Proceed step by step.**
