const CONSOLE_BRIDGE = `
<script>
(function() {
  const send = (level, args) => {
    try {
      const safe = args.map(a => {
        if (a instanceof Error) return { __type: 'error', message: a.message, stack: a.stack };
        if (typeof a === 'function') return a.toString();
        if (typeof a === 'undefined') return '__undefined__';
        try { JSON.stringify(a); return a; } catch (_) { return String(a); }
      });
      parent.postMessage({ source: 'sandbox-console', level, args: safe }, '*');
    } catch (e) {}
  };
  ['log', 'info', 'warn', 'error', 'debug'].forEach(level => {
    const original = console[level].bind(console);
    console[level] = function(...args) { send(level, args); original(...args); };
  });
  window.addEventListener('error', (e) => {
    send('error', [e.message + ' (' + (e.filename || '') + ':' + (e.lineno || '?') + ')']);
  });
  window.addEventListener('unhandledrejection', (e) => {
    send('error', ['Unhandled promise rejection: ' + (e.reason && e.reason.message || e.reason)]);
  });
})();
</script>
`;

export function buildSrcDoc({ html, css, js }) {
  const styleTag = `<style>${css || ''}</style>`;
  const scriptTag = `<script>\ntry {\n${js || ''}\n} catch (err) { console.error(err); }\n<\/script>`;

  if (/<\/head>/i.test(html)) {
    return html
      .replace(/<\/head>/i, `${CONSOLE_BRIDGE}${styleTag}</head>`)
      .replace(/<\/body>/i, `${scriptTag}</body>`);
  }
  if (/<\/body>/i.test(html)) {
    return `${CONSOLE_BRIDGE}${styleTag}` + html.replace(/<\/body>/i, `${scriptTag}</body>`);
  }
  return `<!doctype html><html><head>${CONSOLE_BRIDGE}${styleTag}</head><body>${html || ''}${scriptTag}</body></html>`;
}
