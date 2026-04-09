# Animations Reference

Layout Orchestrator v2 uses `UINodeAnimation` subclasses to animate slot `RectTransform`s as windows enter and exit. Animations operate on the slot container — not the window itself — so the window's own `RectTransform` stays stable while the slot moves.

---

## UINodeAnimation

```csharp
namespace Hull.Layout

public abstract class UINodeAnimation
```

Abstract base for all slot animations.

| Member | Type | Default | Description |
|--------|------|---------|-------------|
| `Duration` | `float` | `0.25` | Animation duration in seconds |
| `EasingType` | `Easing.Type` | `QuadraticOut` | Easing curve |

```csharp
abstract Task PlayEnter(RectTransform slot, CancellationToken ct)
abstract Task PlayExit(RectTransform slot, CancellationToken ct)
```

Both methods return a `Task` that completes when the animation finishes. Operations that wait on multiple animations run them in parallel via `Task.WhenAll`.

---

## UINodeSlideAnimation

```csharp
namespace Hull.Layout

[System.Serializable]
public class UINodeSlideAnimation : UINodeAnimation
```

Slides the slot in from offscreen on enter and out to offscreen on exit.

### Constructors

```csharp
// Default direction (LeftToRight), inherits base Duration and EasingType
new UINodeSlideAnimation()

// Explicit
new UINodeSlideAnimation(duration: 0.25f, direction: SlideDirection.RightToLeft)
new UINodeSlideAnimation(duration: 0.3f,  direction: SlideDirection.BottomToTop, easing: Easing.Type.CubicOut)
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `Direction` | `SlideDirection` | `LeftToRight` | Slide direction for enter and exit |

### SlideDirection

```csharp
public enum SlideDirection
```

| Value | Enter — starts at | Exit — moves to |
|-------|-------------------|-----------------|
| `LeftToRight` | Off left edge | Off right edge |
| `RightToLeft` | Off right edge | Off left edge |
| `TopToBottom` | Off top edge | Off bottom edge |
| `BottomToTop` | Off bottom edge | Off top edge |

---

## Using animations

Animations can be set in the Inspector (on `LayoutManager`'s `defaultEnterAnim` / `defaultExitAnim` fields) or constructed inline:

```csharp
// Use default animation (from Inspector)
layoutManager.Attach(window);

// Override per-call
layoutManager.Attach(window, id: 0,
    overrideAnim: new UINodeSlideAnimation(0.4f, SlideDirection.BottomToTop));

// Per-slot in a split
layoutManager.Split(
    targetWindow: windowA,
    axis: Axis.Horizontal,
    count: 2,
    ratios: new[] { 0.5f, 0.5f },
    (1, windowB, new UINodeSlideAnimation(0.25f, SlideDirection.RightToLeft))
);
```

::: tip Null animation
Passing `null` as an animation skips the animation entirely. This is useful for instant layout changes during scene setup.
:::

---

## Writing a custom animation

Subclass `UINodeAnimation` and implement `PlayEnter` and `PlayExit`. Both receive the slot's `RectTransform` and a `CancellationToken` that fires if the operation is cancelled mid-flight (e.g. the `LayoutManager` is destroyed).

```csharp
public class UINodeFadeAnimation : UINodeAnimation
{
    public override async Task PlayEnter(RectTransform slot, CancellationToken ct)
    {
        var group = slot.GetComponent<CanvasGroup>()
                    ?? slot.gameObject.AddComponent<CanvasGroup>();
        group.alpha = 0f;
        // drive group.alpha from 0 → 1 over Duration using TIDE or any tween library
        await /* tween task */;
    }

    public override async Task PlayExit(RectTransform slot, CancellationToken ct)
    {
        var group = slot.GetComponent<CanvasGroup>();
        if (group == null) return;
        // drive group.alpha from 1 → 0 over Duration
        await /* tween task */;
    }
}
```

Mark the class `[System.Serializable]` if you want it to be selectable in the `LayoutManager` Inspector via the `TypeSelector` attribute.
