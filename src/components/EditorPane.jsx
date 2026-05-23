import Editor from '@monaco-editor/react'

const LANG_MAP = { html: 'html', css: 'css', js: 'javascript' }

export default function EditorPane({ language, value, onChange }) {
  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language={LANG_MAP[language]}
      value={value}
      onChange={(v) => onChange(v ?? '')}
      options={{
        fontSize: 13,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        automaticLayout: true,
        tabSize: 2,
        renderLineHighlight: 'all',
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        padding: { top: 12 }
      }}
    />
  )
}
