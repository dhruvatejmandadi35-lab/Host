import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import EditorPane from './components/EditorPane'
import Preview from './components/Preview'
import ConsolePanel from './components/ConsolePanel'
import SnippetDrawer from './components/SnippetDrawer'
import { buildSrcDoc } from './buildSrcDoc'
import { EMPTY_SNIPPET } from './defaults'
import { saveSnippet, saveCurrent, loadCurrent } from './storage'

const DEBOUNCE_MS = 400

export default function App() {
  const initial = loadCurrent() || { ...EMPTY_SNIPPET, name: 'Untitled', id: null }
  const [html, setHtml] = useState(initial.html ?? EMPTY_SNIPPET.html)
  const [css, setCss] = useState(initial.css ?? EMPTY_SNIPPET.css)
  const [js, setJs] = useState(initial.js ?? EMPTY_SNIPPET.js)
  const [name, setName] = useState(initial.name ?? 'Untitled')
  const [currentId, setCurrentId] = useState(initial.id ?? null)

  const [activeTab, setActiveTab] = useState('html')
  const [autoRun, setAutoRun] = useState(true)
  const [srcDoc, setSrcDoc] = useState('')
  const [consoleEntries, setConsoleEntries] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showConsole, setShowConsole] = useState(true)
  const [savedFlash, setSavedFlash] = useState(false)

  const debounceRef = useRef(null)
  const iframeRef = useRef(null)

  const run = useCallback(() => {
    setConsoleEntries([])
    setSrcDoc(buildSrcDoc({ html, css, js }))
  }, [html, css, js])

  useEffect(() => { run() }, [])

  useEffect(() => {
    if (!autoRun) return
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(run, DEBOUNCE_MS)
    return () => clearTimeout(debounceRef.current)
  }, [html, css, js, autoRun, run])

  useEffect(() => {
    saveCurrent({ id: currentId, name, html, css, js })
  }, [currentId, name, html, css, js])

  const onConsole = useCallback((entry) => {
    setConsoleEntries(prev => [...prev, entry].slice(-200))
  }, [])

  function handleSave() {
    const snippet = saveSnippet({ id: currentId, name: name || 'Untitled', html, css, js })
    setCurrentId(snippet.id)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1200)
  }

  function handleNew() {
    if (!confirm('Start a new sandbox? Unsaved changes will be lost.')) return
    setHtml(EMPTY_SNIPPET.html)
    setCss(EMPTY_SNIPPET.css)
    setJs(EMPTY_SNIPPET.js)
    setName('Untitled')
    setCurrentId(null)
    setConsoleEntries([])
  }

  function handleLoad(snippet) {
    setHtml(snippet.html ?? '')
    setCss(snippet.css ?? '')
    setJs(snippet.js ?? '')
    setName(snippet.name ?? 'Untitled')
    setCurrentId(snippet.id)
    setDrawerOpen(false)
    setConsoleEntries([])
  }

  function handleExport() {
    const merged = buildSrcDoc({ html, css, js })
      .replace(/<script>[\s\S]*?postMessage[\s\S]*?<\/script>/, '')
    const blob = new Blob([merged], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(name || 'sandbox').replace(/\s+/g, '-').toLowerCase()}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleOpenInNewTab() {
    const blob = new Blob([srcDoc], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(url), 30_000)
  }

  const current = useMemo(() => ({ html, css, js }), [html, css, js])
  const setters = { html: setHtml, css: setCss, js: setJs }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">⚡</span>
          <span className="brand-name">Sandbox</span>
        </div>
        <input
          className="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Untitled"
          spellCheck={false}
        />
        <div className="toolbar">
          <label className="toggle">
            <input type="checkbox" checked={autoRun} onChange={(e) => setAutoRun(e.target.checked)} />
            Auto-run
          </label>
          <button className="btn" onClick={run} title="Run (Ctrl/Cmd + Enter)">Run</button>
          <button className="btn" onClick={handleSave}>
            {savedFlash ? 'Saved ✓' : 'Save'}
          </button>
          <button className="btn ghost" onClick={() => setDrawerOpen(true)}>Snippets</button>
          <button className="btn ghost" onClick={handleNew}>New</button>
          <button className="btn ghost" onClick={handleExport} title="Download as .html">Export</button>
          <button className="btn ghost" onClick={handleOpenInNewTab} title="Open preview in new tab">↗</button>
        </div>
      </header>

      <main className="workspace">
        <section className="editor-col">
          <div className="tabs">
            {['html', 'css', 'js'].map(t => (
              <button
                key={t}
                className={`tab ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="editor-host">
            <EditorPane
              language={activeTab}
              value={current[activeTab]}
              onChange={setters[activeTab]}
            />
          </div>
        </section>

        <section className="preview-col">
          <div className="preview-header">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
            <span className="preview-title">Preview · sandboxed iframe</span>
            <button
              className="ghost-btn small"
              onClick={() => setShowConsole(v => !v)}
            >
              {showConsole ? 'Hide' : 'Show'} Console
            </button>
          </div>
          <div className={`preview-host ${showConsole ? 'with-console' : ''}`}>
            <Preview ref={iframeRef} srcDoc={srcDoc} onConsole={onConsole} />
            {showConsole && (
              <ConsolePanel
                entries={consoleEntries}
                onClear={() => setConsoleEntries([])}
              />
            )}
          </div>
        </section>
      </main>

      <SnippetDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLoad={handleLoad}
        currentId={currentId}
      />
    </div>
  )
}
