# Windows

A **Window** is the fundamental building block of all UI in Hull. Every panel, dialog, HUD element, or overlay you build is a `Window`.

---

## What is a Window?

`Window` is an abstract `MonoBehaviour` that sits at the base of every UI panel. It tracks the panel's open/close **lifecycle**, fires **events** at each transition, and supports both instant and **animated** open/close operations.

You never use `Window` directly — you subclass it:

```csharp
public class InventoryWindow : Window
{
    protected override void OnOpen()  { /* populate inventory data */ }
    protected override void OnClose() { /* release refs, hide panels */ }
}
```

Unity instantiates your window as a scene `GameObject`. Hull tracks it and makes it available through the [`IWindowManager`](#iwindowmanager).

---

## Lifecycle — UIPanelState

Every window moves through a well-defined lifecycle represented by `UIPanelState`:

```
None ──► Opening ──► Opened
                      │
                   Closing ──► Closed ──► Opening ...
```

| State | Description |
|-------|-------------|
| `None` | Initial state — the window has never been opened |
| `Opening` | An open animation is playing |
| `Opened` | Fully open and idle |
| `Closing` | A close animation is playing |
| `Closed` | Fully closed |

Read the current state at any time:

```csharp
window.State           // UIPanelState
window.IsOpen()        // true while Opened or Opening
window.IsClosed()      // true while Closed or Closing
```

---

## Opening and Closing

Hull gives you three ways to open or close a window:

```csharp
// Animated — plays a WindowAnimation component if one is attached
window.Open();
window.Close();

// Awaitable — resolves when the animation finishes
await window.OpenAsync();
await window.CloseAsync();

// Instant — skips animation entirely
window.OpenImmediate();
window.CloseImmediate();

// Toggle between open and closed
window.ToggleState();
```

::: tip Prefer async in sequences
Use `OpenAsync` / `CloseAsync` when you need to chain UI transitions — e.g. close one window and then open another only after it has fully hidden.
:::

---

## Events

Subscribe to lifecycle events to react to state changes:

```csharp
window.OnPanelOpened       += () => { /* window is now fully open   */ };
window.OnPanelClosed       += () => { /* window is now fully closed */ };
window.OnPanelOpenStarted  += () => { /* open animation just began  */ };
window.OnPanelCloseStarted += () => { /* close animation just began */ };
window.OnStateChanged      += state => { Debug.Log($"State → {state}"); };
```

| Event | Signature | Fires when |
|-------|-----------|------------|
| `OnPanelOpened` | `Action` | Window reaches `Opened` |
| `OnPanelClosed` | `Action` | Window reaches `Closed` |
| `OnPanelOpenStarted` | `Action` | State transitions to `Opening` |
| `OnPanelCloseStarted` | `Action` | State transitions to `Closing` |
| `OnStateChanged` | `Action<UIPanelState>` | Any state change |

---

## Protected Overrides

Override these in your subclass to hook into the lifecycle without manually subscribing to events:

```csharp
public class MyWindow : Window
{
    protected override void OnStart()      { /* runs at the end of Start()       */ }
    protected override void OnOpen()       { /* runs when window enters Opened   */ }
    protected override void OnClose()      { /* runs when window enters Closed   */ }
    protected override void OnDestroying() { /* runs before the GameObject is destroyed */ }
}
```

---

## Window\<T\> — Typed Payload

When a window needs data at open time, inherit from the generic variant:

```csharp
public class ItemDetailWindow : Window<ItemData>
{
    public override void Open(ItemData data)
    {
        titleLabel.text = data.Name;
        icon.sprite     = data.Icon;
        base.Open(data);   // trigger normal open flow
    }
}
```

Open it through the manager with the payload:

```csharp
windowManager.Get<ItemDetailWindow>("item-detail").Open(myItemData);
```

---

## Window Registration

Windows register themselves with `IWindowManager` automatically during `Start`. Each window is registered under a **string ID** you provide — either in a component field on the `GameObject` or by calling `RegisterWindow` manually.

::: warning Never hold direct scene references
Avoid storing `Window` references across scene loads. Always retrieve them through `IWindowManager` when you need them.
:::

---

## IWindowManager

`IWindowManager` is the central registry for all active windows. Inject or locate it however your project wires up services.

```csharp
namespace Hull.Core

public interface IWindowManager
```

### Retrieving Windows

```csharp
// By string ID — returns the base Window type
Window win = manager.Get("my-panel");

// By string ID — casts to T for you
InventoryWindow inv = manager.Get<InventoryWindow>("inventory");

// The single registered instance of a type (throws if zero or >1)
HUDWindow hud = manager.GetSingle<HUDWindow>();

// All registered windows
IEnumerable<Window> all = manager.GetAllWindows();

// All registered windows of a specific type
IEnumerable<InventoryWindow> invs = manager.GetAllOfType<InventoryWindow>();
```

### Opening and Closing Through the Manager

```csharp
// Open / close with the manager's default animation
manager.Open(window);
manager.Close(window);

// Open the single registered instance of a type
manager.OpenWindow<HUDWindow>();

// Open a specific instance by ID
manager.OpenWindow<InventoryWindow>("inventory");
```

### Manual Registration

Hull windows self-register on `Start`, but you can also drive registration manually:

```csharp
manager.RegisterWindow("my-panel", window);    // add to the registry
manager.UnregisterWindow("my-panel");           // remove from the registry
```

### Full Method Reference

| Method | Returns | Description |
|--------|---------|-------------|
| `Get(string id)` | `Window` | Retrieve a window by ID |
| `Get<T>(string id)` | `T` | Retrieve and cast a window by ID |
| `GetSingle<T>()` | `T` | Retrieve the only registered instance of T |
| `GetAllWindows()` | `IEnumerable<Window>` | All registered windows |
| `GetAllOfType<T>()` | `IEnumerable<T>` | All registered windows of type T |
| `RegisterWindow(string id, Window)` | `void` | Register a window under an ID |
| `UnregisterWindow(string id)` | `void` | Remove a window from the registry |
| `Open(Window)` | `void` | Open a window via the manager |
| `Close(Window)` | `void` | Close a window via the manager |
| `OpenWindow<T>()` | `void` | Open the single registered window of type T |
| `OpenWindow<T>(string id)` | `void` | Open a specific window of type T by ID |

---

## Putting It Together

A typical flow: open a window, wait for it, do something, close it.

```csharp
// 1. Get the window from the manager
var detail = windowManager.Get<ItemDetailWindow>("item-detail");

// 2. Pass data and open with animation
detail.Open(selectedItem);
await detail.OpenAsync();

// 3. React to the user closing it
detail.OnPanelClosed += () => Debug.Log("Detail closed");

// 4. Or close it programmatically
await detail.CloseAsync();
```

---

## See Also

- [Layout Operations](/guide/layout-operations) — attach, split, and remove windows in the layout tree
- [Popups](/guide/popups) — floating windows outside the layout tree
- [API Reference](/reference/api) — full class and member listing
