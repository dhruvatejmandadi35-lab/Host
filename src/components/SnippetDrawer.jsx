import { useEffect, useState } from 'react'
import { listSnippets, deleteSnippet } from '../storage'

export default function SnippetDrawer({ open, onClose, onLoad, currentId }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    if (open) setItems(listSnippets())
  }, [open])

  function handleDelete(id) {
    if (!confirm('Delete this snippet?')) return
    deleteSnippet(id)
    setItems(listSnippets())
  }

  if (!open) return null
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer">
        <div className="drawer-header">
          <h2>Saved Snippets</h2>
          <button className="ghost-btn" onClick={onClose}>Close</button>
        </div>
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <p>No snippets saved yet.</p>
              <p className="hint">Use the Save button to keep your work.</p>
            </div>
          ) : (
            items.map(s => (
              <div key={s.id} className={`snippet-row ${s.id === currentId ? 'active' : ''}`}>
                <button className="snippet-load" onClick={() => onLoad(s)}>
                  <div className="snippet-name">{s.name}</div>
                  <div className="snippet-meta">{new Date(s.updatedAt).toLocaleString()}</div>
                </button>
                <button className="snippet-delete" onClick={() => handleDelete(s.id)} aria-label="Delete">
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  )
}
