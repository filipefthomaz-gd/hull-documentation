# API Reference

---

## Window

```csharp
namespace Hull.Core

public abstract class Window : MonoBehaviour, IWindow
```

Abstract base for all UI windows. Inherit from this to create panels.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `State` | `UIPanelState` | Current lifecycle state |
| `RectTransform` | `RectTransform` | The window's RectTransform |
| `CancellationTokenSource` | `CancellationTokenSource` | Token source for in-progress animations |

### Events

| Event | Signature | Description |
|-------|-----------|-------------|
| `OnPanelOpened` | `Action` | Fires when the window finishes opening |
| `OnPanelClosed` | `Action` | Fires when the window finishes closing |
| `OnPanelOpenStarted` | `Action` | Fires when an animated open begins |
| `OnPanelCloseStarted` | `Action` | Fires when an animated close begins |
| `OnStateChanged` | `Action<UIPanelState>` | Fires on every state change |

### Methods

```csharp
void OpenImmediate()
void CloseImmediate()
void Open()
void Close()
Task OpenAsync()
Task CloseAsync()
void ToggleState()
void Refresh()
bool IsOpen()
bool IsClosed()
```

### Protected overrides

```csharp
protected virtual void OnOpen()  { }   // called when the window enters the open state
protected virtual void OnClose() { }   // called when the window enters the closed state
protected virtual void OnStart() { }   // called at the end of Start()
protected virtual void OnDestroying() { }
```

---

## Window\<T\>

```csharp
public abstract class Window<T> : Window
```

Generic window that accepts a typed data payload when opening.

```csharp
public abstract void Open(T data);
```

---

## UIPanelState

```csharp
namespace Hull.Core

public enum UIPanelState
```

| Value | Description |
|-------|-------------|
| `None` | Initial state before the window has been opened or closed |
| `Closed` | Fully closed |
| `Opening` | Open animation in progress |
| `Opened` | Fully open |
| `Closing` | Close animation in progress |

---

## LayoutManager

```csharp
namespace Hull.Layout

public class LayoutManager : MonoBehaviour
```

Scene `MonoBehaviour` that owns the layout tree. Assign `Root` in the Inspector.

### Inspector fields

| Field | Type | Description |
|-------|------|-------------|
| `root` | `RectTransform` | The full-screen rect all panels are measured against |
| `defaultEnterAnim` | `UINodeAnimation` | Played when a window enters any slot (default: slide left-to-right) |
| `defaultExitAnim` | `UINodeAnimation` | Played when a window leaves any slot (default: slide right-to-left) |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `Layouts` | `IReadOnlyDictionary<int, UIPanelNode>` | All active root panels keyed by layer ID |
| `Root` | `RectTransform` | The root rect this manager lays out within |

### Methods

```csharp
void Attach(Window window, int id = 0, UINodeAnimation overrideAnim = null)
```
Attaches a window to a layout layer.

---

```csharp
void Attach(Window window, AttachOptions options)
```
Attaches with full options, including scalable auto-split behaviour.

---

```csharp
void Detach(Window window, UINodeAnimation overrideAnim = null)
```
Removes a window from its panel and restores it to its original parent.

---

```csharp
void Split(Window targetWindow, Axis axis, int count, float[] ratios,
    params (int index, Window window, UINodeAnimation enterAnim)[] assignments)
```
Splits the panel containing the target window into N sub-panels.

---

```csharp
void Overlay(Window targetWindow, Window newWindow,
    UINodeAnimation enterAnim = null, PopupConfig positionConfig = null)
```
Overlays a window on top of an existing window's slot.

---

```csharp
void Remove(Window window, UINodeAnimation exitAnim = null, bool animated = true)
```
Removes a window, collapsing its split node and animating surviving siblings.

---

```csharp
void ShowPopup(Window window, PopupConfig config = null, UINodeAnimation enterAnim = null)
```
Displays a window as a floating popup above the layout tree.

---

```csharp
void HidePopup(Window window, UINodeAnimation exitAnim = null)
```
Hides a popup window and destroys its backdrop.

---

```csharp
void AttachToPanel(string tag, Window window, UINodeAnimation enterAnim = null)
```
Attaches a window to the panel identified by a tag string set via the blueprint builder.

---

```csharp
LayoutBlueprintBuilder Build()
```
Returns a fluent builder for describing a full layout declaratively.

---

```csharp
UIPanelNode GetOrCreateLayer(int id)
```
Returns the root panel for the given layer ID, creating it if absent.

---

## LayoutBlueprintBuilder

```csharp
namespace Hull.Layout

public class LayoutBlueprintBuilder
```

Fluent builder for a layout blueprint. Obtain via `LayoutManager.Build()`.

| Method | Description |
|--------|-------------|
| `Layer(int id, string? tag)` | Declares a root panel |
| `Split(Axis axis, params float[] ratios)` | Adds a split to the current layer |
| `Panel(int index, string tag, bool fixedSize, float fixedSizePixels)` | Tags a split panel |
| `Apply()` | Materialises the blueprint — call once |

---

## UILayoutNode

```csharp
namespace Hull.Layout

public abstract class UILayoutNode
```

Abstract base for all nodes in the layout tree.

| Member | Description |
|--------|-------------|
| `Parent` | Parent node, or null for root nodes |
| `Layout(Rect rect)` | Lays out this node within the given area |
| `IsPanel` | True if this is a `UIPanelNode` |
| `IsSplit` | True if this is a `UISplitNode` |
| `IsWindow` | True if this is a `UIWindowNode` |

---

## UIPanelNode

```csharp
namespace Hull.Layout

public class UIPanelNode : UILayoutNode
```

A full-screen container that holds child nodes.

| Member | Type | Description |
|--------|------|-------------|
| `Rect` | `RectTransform` | The panel's RectTransform |
| `Children` | `List<UILayoutNode>` | Direct child nodes |
| `Tag` | `string` | Optional name for `AttachToPanel` lookup |
| `FixedSize` | `bool` | When true, the panel uses a fixed pixel size in a split |
| `FixedSizePixels` | `float` | The fixed size in pixels |

```csharp
void AddChild(UILayoutNode child)
void RemoveChild(UILayoutNode child)
```

---

## UISplitNode

```csharp
namespace Hull.Layout

public class UISplitNode : UILayoutNode
```

Divides its area along an axis into `UIPanelNode` children.

| Member | Type | Description |
|--------|------|-------------|
| `Axis` | `Axis` | The split axis |
| `Rect` | `RectTransform` | The container RectTransform |
| `Panels` | `List<UIPanelNode>` | The child panels |
| `Ratios` | `List<float>` | Normalised size ratios; sum to 1 |

```csharp
void AddPanel(UIPanelNode panel, float ratio = -1f)
void RemovePanel(UIPanelNode panel)   // re-normalises remaining ratios automatically
```

Fixed-size panels (see `UIPanelNode.FixedSize`) consume their pixel budget first; remaining space is distributed proportionally.

---

## UIWindowNode

```csharp
namespace Hull.Layout

public class UIWindowNode : UILayoutNode
```

Hosts a single `Window` inside a masked slot container.

| Member | Type | Description |
|--------|------|-------------|
| `Window` | `Window` | The hosted window |
| `Rect` | `RectTransform` | The mask container's RectTransform |
| `Mask` | `Mask` | The `Mask` component that clips window content |
| `OriginalParent` | `Transform` | The window's parent before layout placement |
| `IsOverlay` | `bool` | True when this node stretches to fill its host slot |

---

## Axis

```csharp
namespace Hull.Layout

public enum Axis
```

| Value | Description |
|-------|-------------|
| `Horizontal` | Splits left and right |
| `Vertical` | Splits top and bottom |

---

## AttachOptions

```csharp
namespace Hull.Layout

public struct AttachOptions
```

Controls how a window is placed by `Attach(Window, AttachOptions)`.

| Field | Type | Description |
|-------|------|-------------|
| `LayerId` | `int` | Target layer ID |
| `Scalable` | `bool` | When true and `Region` is set, auto-splits the panel |
| `Region` | `AttachRegion?` | The normalised sub-region the new window should occupy |
| `EnterAnim` | `UINodeAnimation` | Override enter animation |

```csharp
AttachOptions.Default   // LayerId=0, Scalable=false, no region, no anim
```

---

## AttachRegion

```csharp
namespace Hull.Layout

public struct AttachRegion
```

| Field | Type | Description |
|-------|------|-------------|
| `Axis` | `Axis` | The axis along which the region is defined |
| `Start` | `float` | Normalised start position (0–1) |
| `End` | `float` | Normalised end position (0–1) |

---

## PopupConfig

```csharp
namespace Hull.Layout

public class PopupConfig
```

Positioning and behaviour for popups and positioned overlays.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `AnchorMin` | `Vector2` | `(0.5, 0.5)` | Anchor min |
| `AnchorMax` | `Vector2` | `(0.5, 0.5)` | Anchor max |
| `Pivot` | `Vector2` | `(0.5, 0.5)` | Pivot |
| `AnchoredPos` | `Vector2` | `(0, 0)` | Anchored position |
| `SizeOverride` | `Vector2?` | `null` | Optional size override |
| `SortingOrder` | `int` | `100` | Canvas sorting order |
| `BlockInput` | `bool` | `false` | Spawn a blocking backdrop |

---

## IWindowManager

```csharp
namespace Hull.Core

public interface IWindowManager
```

Service that registers and looks up all active windows.

| Method | Description |
|--------|-------------|
| `Get(string id)` | Retrieves a window by string ID |
| `Get<T>(string id)` | Retrieves and casts a window by ID |
| `GetAllWindows()` | Returns all registered windows |
| `GetAllOfType<T>()` | Returns all registered windows of type T |
| `GetSingle<T>()` | Returns the single registered window of type T |
| `RegisterWindow(string id, Window)` | Registers a window under an ID |
| `UnregisterWindow(string id)` | Removes a window from the registry |
| `Open(Window)` | Opens a window with animation |
| `Close(Window)` | Closes a window with animation |
| `OpenWindow<T>()` | Opens the single registered window of type T |
| `OpenWindow<T>(string id)` | Opens a specific window of type T by ID |
