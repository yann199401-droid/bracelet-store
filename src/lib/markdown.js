/**
 * Simple Markdown to HTML renderer (no external dependencies)
 */

function sanitizeUrl(url) {
  if (!url) return ''
  const lower = url.trim().toLowerCase()
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
    return ''
  }
  return url
}

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

  // Strip javascript: etc from URLs before inserting
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    const safe = sanitizeUrl(url)
    if (!safe) return text // if sanitized away, just show text
    return `<a href="${safe}" target="_blank" rel="noopener noreferrer">${text}</a>`
  })
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) => {
    const safe = sanitizeUrl(url)
    if (!safe) return ''
    return `<img src="${safe}" alt="${alt}" style="max-width:100%">`
  })

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

  // Lists — process line by line to build proper list groups
  const lines = html.split('\n')
  let result = []
  let inList = false
  let listType = null // 'ul' or 'ol'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Unordered list item
    const ulMatch = line.match(/^[\s]*[-*+]\s+(.+)$/)
    // Ordered list item
    const olMatch = line.match(/^[\s]*\d+\.\s+(.+)$/)

    if (ulMatch || olMatch) {
      const content = ulMatch ? ulMatch[1] : olMatch[1]
      const type = ulMatch ? 'ul' : 'ol'

      if (!inList) {
        listType = type
        result.push(`<${type}>`)
        inList = true
      } else if (listType !== type) {
        // Switching list types
        result.push(`</${listType}><${type}>`)
        listType = type
      }

      result.push(`<li>${content}</li>`)
    } else {
      if (inList) {
        result.push(`</${listType}>`)
        inList = false
        listType = null
      }
      result.push(line)
    }
  }

  if (inList) {
    result.push(`</${listType}>`)
  }

  html = result.join('\n')

  // Clean up nested blockquotes (simple approach)
  html = html.replace(/<\/blockquote>\n?<blockquote>/g, '<br>')

  // Paragraphs (anything not wrapped in block-level tags)
  const blockTags = /^<\/?(h[1-6]|ul|ol|li|pre|blockquote|hr|div|table)/

  const paraLines = html.split('\n')
  result = []
  let inParagraph = false

  for (let i = 0; i < paraLines.length; i++) {
    const pl = paraLines[i].trim()

    if (!pl) {
      if (inParagraph) {
        result.push('</p>')
        inParagraph = false
      }
      continue
    }

    if (blockTags.test(pl)) {
      if (inParagraph) {
        result.push('</p>')
        inParagraph = false
      }
      result.push(pl)
    } else {
      if (!inParagraph) {
        result.push('<p>')
        inParagraph = true
      } else {
        result.push('<br>')
      }
      result.push(pl)
    }
  }

  if (inParagraph) result.push('</p>')

  return result.join('\n')
}
