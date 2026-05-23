function formatArg(a) {
  if (a === '__undefined__') return 'undefined'
  if (a && typeof a === 'object' && a.__type === 'error') return a.stack || a.message
  if (typeof a === 'object') {
    try { return JSON.stringify(a, null, 2) } catch { return String(a) }
  }
  return String(a)
}

export default function ConsolePanel({ entries, onClear }) {
  return (
    <div className="console-panel">
      <div className="console-header">
        <span className="console-title">Console</span>
        <span className="console-count">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
        <button className="ghost-btn" onClick={onClear} disabled={entries.length === 0}>Clear</button>
      </div>
      <div className="console-body">
        {entries.length === 0 ? (
          <div className="console-empty">console output will appear here</div>
        ) : (
          entries.map((e, i) => (
            <div key={i} className={`console-line console-${e.level}`}>
              <span className="console-level">{e.level}</span>
              <span className="console-msg">{e.args.map(formatArg).join(' ')}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
