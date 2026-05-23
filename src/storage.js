const KEY = 'sandbox.snippets.v1'
const CURRENT_KEY = 'sandbox.current.v1'

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function listSnippets() {
  return read().sort((a, b) => b.updatedAt - a.updatedAt)
}

export function saveSnippet({ id, name, html, css, js }) {
  const list = read()
  const now = Date.now()
  if (id) {
    const idx = list.findIndex(s => s.id === id)
    if (idx >= 0) {
      list[idx] = { ...list[idx], name, html, css, js, updatedAt: now }
      write(list)
      return list[idx]
    }
  }
  const snippet = {
    id: crypto.randomUUID(),
    name: name || 'Untitled',
    html, css, js,
    createdAt: now,
    updatedAt: now
  }
  list.push(snippet)
  write(list)
  return snippet
}

export function deleteSnippet(id) {
  write(read().filter(s => s.id !== id))
}

export function getSnippet(id) {
  return read().find(s => s.id === id) || null
}

export function saveCurrent(state) {
  try { localStorage.setItem(CURRENT_KEY, JSON.stringify(state)) } catch {}
}

export function loadCurrent() {
  try {
    const raw = localStorage.getItem(CURRENT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
