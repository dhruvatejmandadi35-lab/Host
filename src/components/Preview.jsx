import { forwardRef, useEffect, useRef } from 'react'

const Preview = forwardRef(function Preview({ srcDoc, onConsole }, ref) {
  const localRef = useRef(null)
  const iframeRef = ref || localRef

  useEffect(() => {
    function handler(e) {
      if (!e.data || e.data.source !== 'sandbox-console') return
      onConsole?.({ level: e.data.level, args: e.data.args, time: Date.now() })
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onConsole])

  return (
    <iframe
      ref={iframeRef}
      title="sandbox-preview"
      sandbox="allow-scripts allow-modals allow-forms allow-popups allow-pointer-lock"
      srcDoc={srcDoc}
      className="preview-frame"
    />
  )
})

export default Preview
