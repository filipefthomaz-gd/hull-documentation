# Declarative Layout

The blueprint builder lets you describe an entire multi-panel layout in a single fluent chain before any window is opened. Panels are tagged by name, so attachment code stays decoupled from the split structure.

---

## Build and Apply

```csharp
layoutManager.Build()
    .Layer(0)
        .Split(Axis.Horizontal, 0.35f, 0.65f)
            .Panel(0, "sidebar")
            .Panel(1, "content")
    .Apply();
```

`Build()` returns a `LayoutBlueprintBuilder`. Each method on the builder returns the same builder so calls can be chained. `Apply()` materialises all panels and splits synchronously — no animations.

---

## Attaching windows by tag

After `Apply()`, use `AttachToPanel` to place windows into named panels:

```csharp
layoutManager.AttachToPanel("sidebar", sidebarWindow);
layoutManager.AttachToPanel("content", contentWindow);
```

`AttachToPanel` accepts an optional animation override:

```csharp
layoutManager.AttachToPanel("sidebar", sidebarWindow,
    enterAnim: new UINodeSlideAnimation(0.25f, SlideDirection.LeftToRight));
```

If no panel with the given tag exists a warning is logged and the call is a no-op.

---

## Fixed-size panels

Use `fixedSize: true` on a panel to give it a pixel budget that is consumed before the remaining space is distributed proportionally among scalable siblings:

```csharp
layoutManager.Build()
    .Layer(0)
        .Split(Axis.Horizontal)
            .Panel(0, "nav",  fixedSize: true, fixedSizePixels: 200f)
            .Panel(1, "main")
    .Apply();

layoutManager.AttachToPanel("nav",  navWindow);
layoutManager.AttachToPanel("main", mainWindow);
```

The `nav` panel is always 200 px wide. `main` fills all remaining horizontal space.

---

## Multiple layers

Each `Layer` call declares a new root panel. Layers are stacked on top of each other (all stretch to fill the root rect). Use different layer IDs to isolate content that should never share a split:

```csharp
layoutManager.Build()
    .Layer(0)                        // base content layer
        .Split(Axis.Horizontal, 0.3f, 0.7f)
            .Panel(0, "sidebar")
            .Panel(1, "main")
    .Layer(1)                        // HUD layer (sits above layer 0)
        .Split(Axis.Vertical, 0.1f, 0.9f)
            .Panel(0, "topbar")
            .Panel(1, "viewport")
    .Apply();
```

::: info Layer stacking
Layers are ordinary `UIPanelNode`s parented directly under the `Root` `RectTransform`. Their draw order follows Unity's sibling index. Layer 0 is created first and therefore sits beneath layer 1 in the hierarchy.
:::

---

## Builder reference

| Method | Description |
|--------|-------------|
| `Layer(id, tag?)` | Declares a root panel with an integer ID and an optional tag |
| `Split(axis, ratios...)` | Adds a split to the current layer; ratios are normalised automatically |
| `Panel(index, tag, fixedSize?, fixedSizePixels?)` | Tags a split panel by index for later lookup |
| `Apply()` | Materialises the blueprint — call once when the chain is complete |
