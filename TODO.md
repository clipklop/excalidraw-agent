# Diagram Quality Improvement TODO

The model currently chooses raw pixel coordinates, dimensions, arrow points,
and bindings. Models are useful for understanding diagram structure, but layout
and routing should be handled deterministically.

## 1. Fix the tool contract

- [ ] Update the system prompt to reference the actual tools:
  `addElements`, `updateElements`, and `removeElements`.
- [ ] Replace ambiguous shape `text` fields with Excalidraw-compatible labels
  or bound text elements.
- [ ] Create distinct schemas for shapes, text, arrows, and lines.
- [ ] Require arrow points, valid bindings, and existing source/destination IDs.
- [ ] Add complete tool examples for flowcharts, architecture diagrams, and
  sequence diagrams.

## 2. Move layout out of the model

- [ ] Define a semantic graph format, for example:

  ```ts
  {
    direction: "left-to-right",
    nodes: [
      { id: "client", label: "Client", kind: "actor" },
      { id: "worker", label: "Worker", kind: "service" }
    ],
    edges: [
      { from: "client", to: "worker", label: "Request" }
    ]
  }
  ```

- [ ] Make the model generate semantic nodes and edges instead of coordinates.
- [ ] Add a deterministic graph-to-Excalidraw conversion layer.
- [ ] Evaluate Dagre and ELK for node placement and edge routing.
- [ ] Standardize node sizes, margins, rank gaps, and sibling gaps.

## 3. Add diagram-specific layout strategies

- [ ] Flowchart: ranked top-to-bottom or left-to-right layout.
- [ ] Architecture: clients → gateways → services → storage layout.
- [ ] Sequence diagram: fixed participant columns and chronological rows.
- [ ] ER diagram: entity grid with relationship routing.
- [ ] Org chart: hierarchical tree layout.
- [ ] State machine: circular or layered layout.

## 4. Validate and repair geometry

- [ ] Detect overlapping nodes.
- [ ] Detect labels that exceed their containers.
- [ ] Detect arrows that cross unrelated nodes.
- [ ] Reject bindings that reference missing element IDs.
- [ ] Enforce a minimum visible gap between connected shapes.
- [ ] Keep generated elements inside reasonable canvas bounds.
- [ ] Detect multiple edges occupying the same route.
- [ ] Automatically shift nodes or reroute edges when possible.

## 5. Improve arrow generation

- [ ] Generate arrows only after node positions are finalized.
- [ ] Bind arrows to their source and destination elements.
- [ ] Select the nearest compatible connection sides.
- [ ] Maintain an 8–16 px binding gap.
- [ ] Route arrows around boxes using orthogonal segments where appropriate.
- [ ] Position edge labels near route midpoints without covering nodes.
- [ ] Visually distinguish request, response, error, and optional paths.

## 6. Expand evaluation coverage

- [ ] Add an overlap-area score.
- [ ] Add alignment and spacing consistency scores.
- [ ] Add edge-to-node intersection checks.
- [ ] Validate arrow bindings and referenced IDs.
- [ ] Score label containment and readability.
- [ ] Score expected flow direction.
- [ ] Score canvas compactness and disconnected nodes.
- [ ] Save rendered previews for human comparison across models and prompts.

## 7. Add a repair pass

- [ ] Return validation issues in a structured format.
- [ ] Give the semantic graph and validation issues to a repair step.
- [ ] Let the repair step modify graph structure, not raw pixels.
- [ ] Rerun deterministic layout and validation after repair.
- [ ] Limit repair attempts and preserve the best valid result.

## Recommended implementation order

- [ ] Correct tool names and label conversion.
- [ ] Add geometry validation.
- [ ] Introduce semantic node-and-edge generation.
- [ ] Add Dagre or ELK layout.
- [ ] Implement flowchart and architecture strategies first.
- [ ] Expand automated evaluations.
- [ ] Add automatic repair.
