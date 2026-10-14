# Design Reference — Dr. RVR NRIIT (Deemed to be University)

**Official Reference Website:** [https://rvrnriuniversity.edu.in/](https://rvrnriuniversity.edu.in/)  
**Target Application:** Ph.D. Admissions 2026–2027 Portal  
**Status:** Verified Live Site Custom Theme Extracted from Elementor Site Kit (`post-8.css`, `post-87.css`, `post-742.css`)

---

## 1. Verified Brand Colors & Visual Identity

Direct extraction from `post-8.css` and `post-87.css` on `https://rvrnriuniversity.edu.in/`:

| Token | CSS Variable | Exact Hex | Observed Role on Live University Website |
|---|---|---|---|
| **Primary Brand Color** | `--color-brand-primary` / `--e-global-color-primary` | **`#EC691F`** | **Dr. RVR NRI University Orange** — Used in the top announcement marquee, primary buttons ("Apply Online"), active navigation states, heading underlines, and highlights. |
| **Accent Crimson / Maroon** | `--color-brand-accent` / `--brand-maroon` | **`#A51C30`** | **Dr. RVR NRI Crimson / Maroon** — From the official university crest & logo lockup, modal highlights, and institutional badges. |
| **Primary Dark / Heading** | `--color-heading` / `--e-global-color-text` | **`#1E1D1D`** | **Deep Charcoal Black** — Used for university title, major section headings, navigation links, and dark footer surface. |
| **Secondary Grey** | `--color-body` / `--e-global-color-secondary` | **`#5B5B5B`** | **Medium Slate Grey** — Used for descriptive paragraphs, subtitles, and metadata. |
| **Soft Warm Background** | `--color-page-background` | **`#FAF7F5`** / **`#FBFBFB`** | Clean warm off-white surface matching the university campus pages. |
| **Surface / Card Color** | `--color-surface` | **`#FFFFFF`** | Pure crisp white for cards, panels, and main header strip. |
| **Warm Peach / Amber Tint** | `--color-accent-peach` | **`#FFBC7D`** | Soft warm peach accent extracted from `post-8.css` for subtle highlight badges. |
| **Border / Divider** | `--color-border` | **`#E5E7EB`** / **`#DDDDDD`** | Crisp, clean card dividers and input borders. |

---

## 2. Verified Typography

Direct extraction from `post-8.css` (`--e-global-typography-*`):

| Role | Font Family | Weights | Usage |
|---|---|---|---|
| **All Headings (`h1`–`h4`)** | **`'Lato', sans-serif`** | `600, 700, 800, 900` | Hero titles, section titles, department headers, modal titles. |
| **Navigation & Links** | **`'Lato', sans-serif`** | `600, 700` | Desktop navbar, dropdown links, button labels. |
| **Body & Paragraphs** | **`'Lato', 'Roboto', sans-serif`** | `400, 500` | Description text, table cell content, application instructions. |
| **Form Inputs** | **`'Inter', sans-serif`** | `400, 500` | Clean high-legibility candidate inputs, selects, and textareas. |

---

## 3. Component & Layout Structure

1. **Top Announcement Bar:** Solid **`#EC691F` (Orange)** background with `#FFFFFF` white text, pulsing indicator, and admissions announcement.
2. **Main Header:** Crisp **`#FFFFFF` (White)** background with official logo lockup, charcoal (`#1E1D1D`) university title, and **`#EC691F` (Orange)** primary button.
3. **Desktop Navigation Bar:** Crisp **`#FFFFFF` (White)** with subtle shadow, deep charcoal (`#1E1D1D`) uppercase links, and **`#EC691F` (Orange)** active/hover underline and text highlights.
4. **Section Headers:** Bold `Lato` in `#1E1D1D` with vibrant `#EC691F` underline pill.
5. **Buttons:**
   - **Primary Action ("Apply Online"):** Background `#EC691F` (Orange) with hover `#d8560f`, text `#FFFFFF`.
   - **Secondary Action:** White background with `#EC691F` border and text.
   - **Maroon Badge:** Background `#A51C30` with text `#FFFFFF`.
6. **Footer:** Deep Charcoal (`#1E1D1D`) with `#EC691F` section headers, social icons, and contact links.
