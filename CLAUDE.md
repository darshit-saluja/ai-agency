# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.
- Check the `brand_assets/` folder before touching colors, fonts, or logos.
- If anything in the brief is unclear or ambiguous, **ask before proceeding** — do not assume.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).

## Tech Stack
- **Default output:** Single `index.html` file, all styles inline, Tailwind CSS via CDN.
- **If React is requested:** Use a `.jsx` artifact with Tailwind utility classes. No separate CSS files unless explicitly asked.
- Always confirm which stack to use if the project brief doesn't specify.
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Landing Page Defaults
- Structure pages with clear visual hierarchy: Hero → Value props → Social proof → CTA.
- Every page must have at least one strong, above-the-fold CTA.
- Copy should be concise and action-oriented — avoid filler placeholder text like "Lorem ipsum"; write realistic stand-in copy instead.
- Sections should feel distinct in background tone (alternate light/dark/tinted) to create rhythm.

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Derive all colors from brand assets if available.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference or brief
- Do not "improve" a reference design — match it
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
- Do not use "Lorem ipsum" — write realistic placeholder copy
- Always ask before proceeding if the brief is ambiguous or incomplete