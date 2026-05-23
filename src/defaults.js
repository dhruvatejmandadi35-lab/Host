export const DEFAULT_HTML = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My Sandbox</title>
  </head>
  <body>
    <div class="card">
      <h1>Hello, Sandbox 👋</h1>
      <p>Edit the HTML, CSS, or JS panels and watch the preview update live.</p>
      <button id="btn">Click me</button>
      <p id="count">Clicks: 0</p>
    </div>
  </body>
</html>
`

export const DEFAULT_CSS = `* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  color: #f8fafc;
  font-family: system-ui, -apple-system, sans-serif;
}
.card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 2rem 2.5rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
h1 { margin: 0 0 0.5rem; }
button {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.1s, background 0.2s;
}
button:hover { background: #4f46e5; }
button:active { transform: scale(0.97); }
`

export const DEFAULT_JS = `let count = 0;
const btn = document.getElementById('btn');
const out = document.getElementById('count');

btn.addEventListener('click', () => {
  count += 1;
  out.textContent = 'Clicks: ' + count;
  console.log('button clicked', count);
});

console.log('Sandbox ready ✨');
`

export const EMPTY_SNIPPET = {
  html: DEFAULT_HTML,
  css: DEFAULT_CSS,
  js: DEFAULT_JS
}
