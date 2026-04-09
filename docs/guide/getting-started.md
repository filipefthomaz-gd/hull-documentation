# Getting Started

## What is Hull

Hull (HUD and UI Layout Library) is the OCEAN framework's window and layout system. It has two main concerns:

- **Window** — a `MonoBehaviour` base class that tracks open/close state, fires events, and supports animated and immediate transitions.
- **LayoutOrchestrator v2** — a `LayoutManager` `MonoBehaviour` that organises windows into a tree of panel and split nodes, handling attach, detach, split, overlay, popup, and remove operations with per-operation animations.

---

## The Window base class

Every UI panel in Hull inherits from `Window`. You do not instantiate windows directly — Unity creates them as scene objects.

```csharp
public class InventoryWindow : Window
{
    protected override void OnOpen()  { /* populate data */ }
    protected override void OnClose() { /* release refs  */ }
}
```

### Opening and closing

```csharp
// Animated (plays WindowAnimation component if one is attached)
window.Open();
window.Close();

// Awaitable
await window.OpenAsync();
await window.CloseAsync();

// Instant — no animation
window.OpenImmediate();
window.CloseImmediate();

// Toggle
window.ToggleState();
```

### State and events

```csharp
window.State          // UIPanelState: None | Closed | Opening | Opened | Closing
window.IsOpen()       // true when Opened or Opening
window.IsClosed()     // true when Closed or Closing

window.OnPanelOpened      += () => { };
window.OnPanelClosed      += () => { };
window.OnPanelOpenStarted += () => { };
window.OnPanelCloseStarted += () => { };
window.OnStateChanged     += state => { };
```

::: tip Register once
Windows register themselves with `IWindowManager` on `Start`. Retrieve them by ID or type through the manager — never keep a hard reference across scene loads.
:::

---

## The LayoutManager

`LayoutManager` is a `MonoBehaviour`. Add it to a scene GameObject and assign its `Root` `RectTransform` in the Inspector. The root is the full-screen rect all layout panels are measured against.

```
[Scene]
 └── UICanvas
      └── LayoutRoot            ← assign this as Root
           ├── Layout_0         ← created by LayoutManager on first attach
           └── PopupLayer       ← created lazily on first popup
```

### Your first attach

```csharp
// Attach a window to layer 0 (created automatically if absent)
layoutManager.Attach(myWindow);
```

The window opens immediately and fills the root rect. A slide-in animation plays by default.

### Detach

```csharp
layoutManager.Detach(myWindow);
```

The window slides out, is closed, and its slot `GameObject` is destroyed. The window's `RectTransform` is re-parented back to its original parent.

---

## Next steps

- [Layout Operations](/guide/layout-operations) — split, overlay, remove, scalable attach
- [Popups](/guide/popups) — floating windows above the layout tree
- [Declarative Layout](/guide/declarative-layout) — blueprint builder for pre-defined layouts
- [API Reference](/reference/api) — full class and method listing
