# Code Sandbox — Host & Run

A browser-based code playground. Write HTML, CSS, and JavaScript on the left, see it rendered live in a sandboxed iframe on the right, with console output captured and saved snippets stored in your browser.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173.

Build a production bundle:

```bash
npm run build
npm run preview
```

## Features

- **Live preview** in a sandboxed iframe (`sandbox="allow-scripts allow-modals allow-forms allow-popups allow-pointer-lock"`).
- **Three editors** (HTML / CSS / JS) powered by Monaco.
- **Captured console** — `log`, `info`, `warn`, `error`, `debug`, uncaught errors, and unhandled rejections are forwarded to the in-app console.
- **Auto-run** with debounce, or manual Run.
- **Save / load snippets** — persisted to `localStorage`.
- **Export** the merged document as a standalone `.html` file.
- **Open preview in a new tab** for full-window testing.

## How it works

The HTML, CSS, and JS inputs are merged into a single document by `src/buildSrcDoc.js`. A small console bridge `<script>` is injected before the user code; it overrides `console.*` methods to forward calls to the parent window via `postMessage`. The merged document is loaded into an iframe with a strict `sandbox` attribute, which isolates it from the host app and prevents same-origin access.

Snippets are stored under the localStorage keys:
- `sandbox.snippets.v1` — array of saved snippets
- `sandbox.current.v1` — last working state (restored on reload)

## Stack

- Vite + React 18
- `@monaco-editor/react` for the editor
- No backend — pure client-side
