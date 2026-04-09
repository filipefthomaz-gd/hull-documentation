---
layout: home

hero:
  name: Hull
  text: HUD and UI Layout Library
  tagline: A code-driven window and layout system for OCEAN. Open, split, overlay, and animate UI panels without manual RectTransform wrangling.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: API Reference
      link: /reference/api

features:
  - icon: ▣
    title: Window lifecycle
    details: Every UI panel is a Window — a MonoBehaviour with open, close, animated, immediate, and toggle variants. State is tracked and events fire on each transition.

  - icon: ⊞
    title: Layout tree
    details: LayoutManager organises windows into a tree of panel and split nodes. The tree is traversed on every layout call; you never touch RectTransforms directly.

  - icon: ⟷
    title: Split and resize
    details: Split any panel horizontally or vertically into N sub-panels with custom ratios or fixed pixel sizes. Siblings animate to their new sizes when a window is removed.

  - icon: ◫
    title: Overlay
    details: Overlay a window on top of another without affecting sibling layout. Overlays travel with their host through subsequent splits and resizes.

  - icon: ↗
    title: Popups
    details: Float a window above the entire layout tree with full anchor and pivot control. Optional input-blocking backdrop included.

  - icon: ∷
    title: Declarative blueprint
    details: Describe an entire multi-panel layout in one fluent chain before any window opens. Attach windows by tag name instead of panel IDs.
---
