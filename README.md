# react-hybrender

A **Hybrid LinkedList + HashMap** progressive renderer for React.  
This library is designed for rendering sequences of components with **O(1) random access**, while keeping memory usage low by maintaining only a **sliding window** of mounted nodes.

Ideal for step-by-step flows, interactive storytelling, chat-like UIs, and large data navigation without loading everything at once.

Note this package is in early stage
---

## ✨ Features

- 🔄 **Hybrid Data Structure** — Combines LinkedList (for ordering) and HashMap (for instant lookups).
- ⚡ **O(1) Random Access** — Jump to any node instantly without re-rendering the entire sequence.
- 🪟 **Sliding Window Rendering** — Keeps only a limited set of components mounted (improves performance).
- 🛠 **Preload Hooks** — Load data before a node mounts for a smoother experience.
- 📦 Lightweight — Minimal dependencies and easy to integrate.
- 🧩 Fully TypeScript supported.

---

## 📦 Installation

```bash
npm install react-hybrender
# or
yarn add react-hybrender

import { LinkedListProvider, Node } from "react-hybrender";

function App(){
  return (
    <HybridRenderProvider windowSize={3}>
      <Node id="intro" next="sec1" component={Intro} />
      <Node id="sec1" next="sec2" component={Section1} />
      <Node id="sec2" component={Section2} />
    </HybridRenderProvider>
  );
}
