# Popups

Popups float above the entire layout tree in a dedicated layer. They do not affect the size or position of any panel in the layout tree. A popup layer is created lazily on the first `ShowPopup` call and is always sorted above all layout panels.

---

## Showing a popup

```csharp
layoutManager.ShowPopup(window, config, enterAnim);
```

All parameters after `window` are optional. When `config` is null the popup is centred with no backdrop.

### Centred with input block

```csharp
layoutManager.ShowPopup(window, new PopupConfig
{
    AnchorMin    = new Vector2(0.5f, 0.5f),
    AnchorMax    = new Vector2(0.5f, 0.5f),
    Pivot        = new Vector2(0.5f, 0.5f),
    AnchoredPos  = Vector2.zero,
    SizeOverride = new Vector2(500f, 350f),
    BlockInput   = true
});
```

### Corner toast (no backdrop)

```csharp
layoutManager.ShowPopup(window, new PopupConfig
{
    AnchorMin    = new Vector2(1f, 0f),
    AnchorMax    = new Vector2(1f, 0f),
    Pivot        = new Vector2(1f, 0f),
    AnchoredPos  = new Vector2(-20f, 20f),
    SizeOverride = new Vector2(300f, 200f),
    BlockInput   = false
});
```

---

## Hiding a popup

```csharp
layoutManager.HidePopup(window);

// Override the exit animation
layoutManager.HidePopup(window, exitAnim: new UINodeSlideAnimation(0.2f, SlideDirection.BottomToTop));
```

After the exit animation the backdrop (if any) is destroyed and the window is closed with `CloseImmediate`.

---

## PopupConfig

`PopupConfig` drives anchor, pivot, position, size, and backdrop for a popup:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `AnchorMin` | `Vector2` | `(0.5, 0.5)` | Normalised anchor min of the popup rect |
| `AnchorMax` | `Vector2` | `(0.5, 0.5)` | Normalised anchor max of the popup rect |
| `Pivot` | `Vector2` | `(0.5, 0.5)` | Pivot of the popup rect |
| `AnchoredPos` | `Vector2` | `(0, 0)` | Offset from the anchor point |
| `SizeOverride` | `Vector2?` | `null` | When set, overrides the window's own size |
| `SortingOrder` | `int` | `100` | Canvas sorting order of the popup layer |
| `BlockInput` | `bool` | `false` | When true, a semi-transparent backdrop blocks all input beneath the popup |

::: tip Shared config
`PopupConfig` is also accepted by `Overlay` to position an overlay within its host slot instead of stretching to fill it. The same fields drive both cases.
:::

---

## Popup vs Overlay

| | Popup | Overlay |
|---|---|---|
| Layer | Dedicated popup layer (above all panels) | Parented inside the host window's slot |
| Affects sibling layout | No | No |
| Moves with host on split/resize | No | Yes |
| Has backdrop support | Yes | No |
| API | `ShowPopup` / `HidePopup` | `Overlay` |
