import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

export default function CodePlayground({ initial = { html: '', css: '', js: '' } }) {
  const [html, setHtml] = useState(initial.html || '');
  const [css, setCss] = useState(initial.css || '');
  const [js, setJs] = useState(initial.js || '');

  const srcDoc = useMemo(() => {
    return `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
  }, [html, css, js]);

  const run = () => {
    const frame = document.getElementById('playground-frame');
    if (frame) frame.srcdoc = srcDoc;
  };

  return (
    <motion.div className="playground" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4><i className="fas fa-code" /> Try It Yourself</h4>
      <div className="playground-editors">
        <label>
          HTML
          <textarea value={html} onChange={(e) => setHtml(e.target.value)} spellCheck={false} />
        </label>
        <label>
          CSS
          <textarea value={css} onChange={(e) => setCss(e.target.value)} spellCheck={false} />
        </label>
        <label>
          JavaScript
          <textarea value={js} onChange={(e) => setJs(e.target.value)} spellCheck={false} />
        </label>
      </div>
      <motion.button type="button" className="btn btn-primary" onClick={run} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <i className="fas fa-play" /> Run
      </motion.button>
      <div className="playground-preview">
        <iframe id="playground-frame" title="Live preview" sandbox="allow-scripts" srcDoc={srcDoc} />
      </div>
    </motion.div>
  );
}
