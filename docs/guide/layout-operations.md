# Layout Operations

`LayoutManager` supports six primary operations: attach, detach, split, overlay, remove, and scalable attach. Each operation mutates the layout tree and can play a per-operation animation.

---

## Attach

Adds a window to a layout layer. If the layer does not yet exist it is created automatically.

```csharp
// Layer 0, default enter animation
layoutManager.Attach(window);

// Specific layer
layoutManager.Attach(window, id: 2);

// Custom animation override
layoutManager.Attach(window, id: 0, overrideAnim: new UINodeSlideAnimation(0.3f, SlideDirection.BottomToTop));
```

The window is opened with `OpenImmediate` before the slot animation plays, so its `OnOpen` callback fires before any transition.

---

## Detach

Removes a window from its panel, plays an exit animation, then closes it and destroys the slot container.

```csharp
layoutManager.Detach(window);

// Override the exit animation
layoutManager.Detach(window, overrideAnim: new UINodeSlideAnimation(0.2f, SlideDirection.LeftToRight));
```

The window's `RectTransform` is re-parented to its original parent (the transform it had before the first `Attach`).

---

## Split

Replaces the panel containing a target window with a split node, dividing the area into N sub-panels.

```csharp
// Split A's panel horizontally: A on the left (50%), B on the right (50%)
layoutManager.Split(
    targetWindow: windowA,
    axis:         Axis.Horizontal,
    count:        2,
    ratios:       new[] { 0.5f, 0.5f },
    (1, windowB, new UINodeSlideAnimation(0.25f, SlideDirection.RightToLeft))
);
```

The target window is **auto-placed** into the first unassigned slot unless it appears in the explicit assignments list. New windows slide in; the target window animates from its old world position to its new size and position.

### Three-panel split

```csharp
layoutManager.Split(
    targetWindow: windowA,
    axis:         Axis.Horizontal,
    count:        3,
    ratios:       new[] { 0.35f, 0.35f, 0.30f },
    (1, windowB, new UINodeSlideAnimation(0.25f, SlideDirection.RightToLeft)),
    (2, windowC, new UINodeSlideAnimation(0.25f, SlideDirection.RightToLeft))
);
```

### Vertical split

```csharp
layoutManager.Split(
    targetWindow: windowA,
    axis:         Axis.Vertical,
    count:        2,
    ratios:       new[] { 0.5f, 0.5f },
    (0, windowC, new UINodeSlideAnimation(0.25f, SlideDirection.BottomToTop))
);
```

::: tip Overlay migration
If any overlays are parented under the target window's slot at the time of the split, they are automatically migrated to the target's new slot.
:::

---

## Overlay

Places a new window on top of an existing window's slot, without disturbing the layout of siblings.

```csharp
// Stretch to fill the target's slot (default)
layoutManager.Overlay(targetWindow: windowA, newWindow: windowC);

// Positioned overlay via PopupConfig
layoutManager.Overlay(
    targetWindow:   windowA,
    newWindow:      windowC,
    positionConfig: new PopupConfig
    {
        AnchorMin    = new Vector2(0.5f, 0.5f),
        AnchorMax    = new Vector2(0.5f, 0.5f),
        Pivot        = new Vector2(0.5f, 0.5f),
        AnchoredPos  = Vector2.zero,
        SizeOverride = new Vector2(400f, 300f)
    }
);
```

The overlay is parented under the target's slot `RectTransform`, so it moves with the target through subsequent splits and resizes.

---

## Remove

Removes a window from the layout tree. If the window occupied a slot inside a split node, the split collapses and surviving siblings animate to fill the freed space.

```csharp
// Animated removal (default exit animation)
layoutManager.Remove(window);

// Custom exit animation
layoutManager.Remove(window, exitAnim: new UINodeSlideAnimation(0.25f, SlideDirection.LeftToRight));

// Instant — no transitions
layoutManager.Remove(window, animated: false);
```

After removal, the window is closed (`CloseImmediate`) and its `RectTransform` is re-parented to its original parent.

---

## Scalable attach

A smart attach that automatically creates a split so the new window occupies a defined region of the panel while existing content is compressed into the remainder.

```csharp
// Attach B to the right 60% of layer 0 — existing content moves left
layoutManager.Attach(windowB, new AttachOptions
{
    LayerId   = 0,
    Scalable  = true,
    Region    = new AttachRegion { Axis = Axis.Horizontal, Start = 0.4f, End = 1f },
    EnterAnim = new UINodeSlideAnimation(0.25f, SlideDirection.RightToLeft)
});

// Attach C to the left 30% — existing content moves right
layoutManager.Attach(windowC, new AttachOptions
{
    LayerId   = 0,
    Scalable  = true,
    Region    = new AttachRegion { Axis = Axis.Horizontal, Start = 0f, End = 0.3f },
    EnterAnim = new UINodeSlideAnimation(0.25f, SlideDirection.LeftToRight)
});
```

If the panel is empty, or `Scalable` is false, scalable attach falls back to a standard attach.

### AttachRegion

`AttachRegion` defines the normalised sub-region the new window should occupy:

| Field | Type | Description |
|-------|------|-------------|
| `Axis` | `Axis` | Horizontal or Vertical |
| `Start` | `float` | Normalised start position (0–1) |
| `End` | `float` | Normalised end position (0–1) |

The region size is `End - Start`. The complementary region (`1 - regionSize`) is given to the existing content.
