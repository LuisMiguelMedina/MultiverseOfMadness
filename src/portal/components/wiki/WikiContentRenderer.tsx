import { FC, ReactNode, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './WikiContentRenderer.scss';

export interface WikiContentRendererProps {
  content: string;
  campaignID: string;
  categories: string[];
  resolveSlug: (target: string) => string;
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const WikiContentRenderer: FC<WikiContentRendererProps> = ({
  content,
  campaignID,
  categories,
  resolveSlug,
}) => {
  const renderedElements = useMemo(() => {
    // 1. Clean content of infoboxes, redirects, and meta templates
    let clean = content
      .replace(/\{\{[Ii]nfobox[\s\S]*?\}\}/gi, '')
      .replace(/#REDIRECCI[OÓ]N\s*\[\[.*?\]\]/gi, '')
      .replace(/\{\{ORDENAR:.*?\}\}/gi, '')
      .replace(/<mainpage-leftcolumn-start\s*\/>/gi, '')
      .replace(/<center><inputbox>[\s\S]*?<\/inputbox><\/center>/gi, '')
      .replace(/\[\[Categor[ií]a:.*?\]\]/gi, '')
      .replace(/\[\[Category:.*?\]\]/gi, '');

    // Split into lines
    const lines = clean.split('\n');
    const elements: Array<{
      type: 'h2' | 'h3' | 'h4' | 'p' | 'li' | 'blockquote';
      text: string;
    }> = [];

    let inBlockquote = false;
    let blockquoteBuffer: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      if (line.toLowerCase().includes('<blockquote>')) {
        inBlockquote = true;
        const text = line.replace(/<blockquote>/gi, '').replace(/<\/blockquote>/gi, '');
        if (text) blockquoteBuffer.push(text);
        if (line.toLowerCase().includes('</blockquote>')) {
          inBlockquote = false;
          elements.push({ type: 'blockquote', text: blockquoteBuffer.join(' ') });
          blockquoteBuffer = [];
        }
        continue;
      }

      if (inBlockquote) {
        if (line.toLowerCase().includes('</blockquote>')) {
          inBlockquote = false;
          const text = line.replace(/<\/blockquote>/gi, '');
          if (text) blockquoteBuffer.push(text);
          elements.push({ type: 'blockquote', text: blockquoteBuffer.join(' ') });
          blockquoteBuffer = [];
        } else {
          blockquoteBuffer.push(line);
        }
        continue;
      }

      // Check headings
      if (line.startsWith('====') && line.endsWith('====')) {
        elements.push({ type: 'h4', text: line.replace(/====/g, '').trim() });
      } else if (line.startsWith('===') && line.endsWith('===')) {
        elements.push({ type: 'h3', text: line.replace(/===/g, '').trim() });
      } else if (line.startsWith('==') && line.endsWith('==')) {
        elements.push({ type: 'h2', text: line.replace(/==/g, '').trim() });
      } else if (line.startsWith('*')) {
        elements.push({ type: 'li', text: line.replace(/^\*+\s*/, '') });
      } else {
        elements.push({ type: 'p', text: line });
      }
    }

    return elements;
  }, [content]);

  // Helper to parse formatting (bold, italic, wiki links) in text
  const parseInlineMarkup = (text: string) => {
    // Replace bold and italics
    const formatted = text;

    // Split by wiki links [[Target|Label]] or [[Target]]
    const linkRegex = /\[\[(.*?)(?:\|(.*?))?\]\]/g;
    const parts: Array<string | ReactNode> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(formatted)) !== null) {
      if (match.index > lastIndex) {
        parts.push(formatted.substring(lastIndex, match.index));
      }

      const targetRaw = match[1];
      const label = match[2] || targetRaw;
      const targetSlug = resolveSlug(slugify(targetRaw));

      parts.push(
        <Link
          key={`${targetSlug}-${match.index}`}
          to={`/wiki/${campaignID}/${targetSlug}`}
          className="wiki-internal-link"
        >
          {label}
        </Link>,
      );

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < formatted.length) {
      parts.push(formatted.substring(lastIndex));
    }

    // Process bold '''text''' and italic ''text'' in string fragments
    return parts.map((part, idx) => {
      if (typeof part !== 'string') return part;

      // Handle bold
      const boldParts = part.split(/'''/g);
      return boldParts.map((bPart, bIdx) => {
        if (bIdx % 2 === 1) {
          return <strong key={`b-${idx}-${bIdx}`}>{bPart}</strong>;
        }
        // Handle italic
        const italicParts = bPart.split(/''/g);
        return italicParts.map((iPart, iIdx) => {
          if (iIdx % 2 === 1) {
            return <em key={`i-${idx}-${bIdx}-${iIdx}`}>{iPart}</em>;
          }
          return iPart;
        });
      });
    });
  };

  return (
    <article className="wiki-rendered-content">
      {renderedElements.map((el, index) => {
        switch (el.type) {
          case 'h2':
            return <h2 key={index}>{parseInlineMarkup(el.text)}</h2>;
          case 'h3':
            return <h3 key={index}>{parseInlineMarkup(el.text)}</h3>;
          case 'h4':
            return <h4 key={index}>{parseInlineMarkup(el.text)}</h4>;
          case 'blockquote':
            return <blockquote key={index}>{parseInlineMarkup(el.text)}</blockquote>;
          case 'li':
            return (
              <ul key={index}>
                <li>{parseInlineMarkup(el.text)}</li>
              </ul>
            );
          case 'p':
          default:
            return <p key={index}>{parseInlineMarkup(el.text)}</p>;
        }
      })}

      {categories.length > 0 && (
        <div className="wiki-category-tags">
          <span className="tag-title">
            <i className="fas fa-tags me-1" />
            Categorías:
          </span>
          {categories.map((cat) => (
            <span key={cat} className="category-badge">
              {cat}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};
