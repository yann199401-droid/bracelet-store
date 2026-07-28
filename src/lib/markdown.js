/**
 * Simple Markdown to HTML renderer (no external dependencies)
 */

export function renderMarkdown(md) {
  if (!md) return ''

  let html = md

  // Escape HTML
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr>')

  // Code blocks (with language or without)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const langClass = lang ? ` class="language-${lang}"` : ''
    return `<pre><code${langClass}>${code.trim()}</code></pre>`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Images (before links)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%">')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')

  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')

  // Unordered lists
  html = html.replace(/^[\s]*[-*+]\s+(.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, (match) => {
    // Wrap consecutive <li> in <ul>
    return match
  })

  // Ordered lists
  html = html.replace(/^[\s]*\d+\.\s+(.+)$/gm, '<li>$1</li>')

  // Wrap consecutive list items
  html = html.replace(/((?:<li>.*?<\/li>\n?)+)/g, (match) => {
    if (match.trim()) return `<ul>${match.trim()}</ul>`
    return match
  })

  // Clean up nested blockquotes (simple approach)
  html = html.replace(/<\/blockquote>\n?<blockquote>/g, '<br>')

  // Paragraphs (anything not wrapped in block-level tags)
  const blockTags = /^<\/?(h[1-6]|ul|ol|li|pre|blockquote|hr|div|table)/

  const lines = html.split('\n')
  const result = []
  let inParagraph = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (!line) {
      if (inParagraph) {
        result.push('</p>')
        inParagraph = false
      }
      continue
    }

    if (blockTags.test(line)) {
      if (inParagraph) {
        result.push('</p>')
        inParagraph = false
      }
      result.push(line)
    } else {
      if (!inParagraph) {
        result.push('<p>')
        inParagraph = true
      } else {
        result.push('<br>')
      }
      result.push(line)
    }
  }

  if (inParagraph) result.push('</p>')

  return result.join('\n')
}
