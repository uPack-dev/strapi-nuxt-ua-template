/**
 * GET /__sitemap__/style.xsl
 * XSL stylesheet for sitemap visual presentation in browsers.
 */
export default defineEventHandler((event) => {
  setResponseHeader(
    event,
    'Content-Type',
    'application/xslt+xml; charset=utf-8',
  );
  setResponseHeader(event, 'Cache-Control', 'public, max-age=86400');

  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
                exclude-result-prefixes="sm">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Sitemap</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&amp;display=swap');

          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          :root {
          --bg:        #0d0d0d;
          --surface:   #161616;
          --border:    #2a2a2a;
          --accent:    #c9a96e;
          --accent-dim:#8a6e41;
          --text:      #e8e2d9;
          --muted:     #6b6560;
          --hover:     #1f1f1f;
          --radius:    6px;
          }

          html { scroll-behavior: smooth; }

          body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          min-height: 100vh;
          }

          /* ── Header ── */
          header {
          border-bottom: 1px solid var(--border);
          padding: 32px 48px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          position: sticky;
          top: 0;
          background: rgba(13,13,13,.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 10;
          }

          .header-left h1 {
          font-size: 22px;
          font-weight: 500;
          letter-spacing: -.3px;
          color: var(--text);
          }

          .header-left h1 span {
          color: var(--accent);
          }

          .header-left p {
          margin-top: 4px;
          color: var(--muted);
          font-size: 13px;
          }

          .header-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          }

          .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 5px 12px;
          font-size: 12px;
          color: var(--muted);
          font-weight: 400;
          }

          .badge .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
          }

          /* ── Search ── */
          .search-wrap {
          padding: 24px 48px 0;
          }

          .search-inner {
          position: relative;
          max-width: 480px;
          }

          .search-inner svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
          pointer-events: none;
          }

          #search {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 9px 14px 9px 40px;
          color: var(--text);
          font-family: inherit;
          font-size: 13px;
          outline: none;
          transition: border-color .15s;
          }

          #search::placeholder { color: var(--muted); }
          #search:focus { border-color: var(--accent-dim); }

          /* ── Groups ── */
          main {
          padding: 32px 48px 64px;
          }

          .group {
          margin-bottom: 40px;
          }

          .group-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
          }

          .group-label {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: var(--accent);
          }

          .group-count {
          font-size: 11px;
          color: var(--muted);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 1px 8px;
          }

          /* ── Table ── */
          table {
          width: 100%;
          border-collapse: collapse;
          }

          thead th {
          text-align: left;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: .8px;
          color: var(--muted);
          padding: 0 12px 10px;
          }

          thead th:first-child { padding-left: 0; }

          tbody tr {
          border-top: 1px solid var(--border);
          transition: background .12s;
          }

          tbody tr:hover { background: var(--hover); }

          tbody td {
          padding: 11px 12px;
          vertical-align: middle;
          }

          tbody td:first-child { padding-left: 0; }

          .url-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          }

          .url-icon {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--muted);
          }

          .url-link {
          color: var(--text);
          text-decoration: none;
          font-size: 13px;
          word-break: break-all;
          transition: color .12s;
          }

          .url-link:hover { color: var(--accent); }

          .lastmod {
          color: var(--muted);
          font-size: 12px;
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
          }

          /* ── Empty ── */
          #no-results {
          display: none;
          text-align: center;
          padding: 60px 0;
          color: var(--muted);
          }

          /* ── Footer ── */
          footer {
          border-top: 1px solid var(--border);
          padding: 20px 48px;
          text-align: center;
          color: var(--muted);
          font-size: 12px;
          }

          footer a {
          color: var(--accent-dim);
          text-decoration: none;
          }

          footer a:hover { color: var(--accent); }

          /* ── Responsive ── */
          @media (max-width: 640px) {
          header, .search-wrap, main, footer { padding-left: 20px; padding-right: 20px; }
          header { flex-direction: column; align-items: flex-start; padding-top: 20px; padding-bottom: 16px; }
          .lastmod-col { display: none; }
          }
        </style>
      </head>
      <body>

        <header>
          <div class="header-left">
            <h1>XML <span>Sitemap</span></h1>
            <p>
              <xsl:variable name="count" select="count(sm:urlset/sm:url)"/>
              <xsl:value-of select="$count"/> URL<xsl:if test="$count != 1">s</xsl:if> indexed
            </p>
          </div>
          <div class="header-right">
            <span class="badge">
              <span class="dot"/>
              sitemap.xml
            </span>
          </div>
        </header>

        <div class="search-wrap">
          <div class="search-inner">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input id="search" type="text" placeholder="Filter URLs…" autocomplete="off" spellcheck="false"/>
          </div>
        </div>

        <main>
          <div id="groups-container">
            <xsl:variable name="urls" select="sm:urlset/sm:url"/>
            <xsl:if test="count($urls) > 0">
              <div class="group">
                <div class="group-header">
                  <span class="group-label">URLs</span>
                  <span class="group-count"><xsl:value-of select="count($urls)"/></span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>URL</th>
                      <th class="lastmod-col">Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="$urls">
                      <xsl:call-template name="renderRow"/>
                    </xsl:for-each>
                  </tbody>
                </table>
              </div>
            </xsl:if>

          </div>

          <p id="no-results">No URLs match your search.</p>
        </main>

        <footer>
          XML Sitemap ·
          <a href="https://www.sitemaps.org/protocol.html" target="_blank" rel="noopener">sitemaps.org</a>
        </footer>

        <script>
          <![CDATA[
          const input = document.getElementById('search');
          const noResults = document.getElementById('no-results');

          input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            const rows = document.querySelectorAll('tbody tr');
            let visible = 0;

            rows.forEach(row => {
              const url = row.querySelector('.url-link');
              const text = url ? url.textContent.toLowerCase() : '';
              const match = !q || text.includes(q);
              row.style.display = match ? '' : 'none';
              if (match) visible++;
            });

            // Hide/show group headers when all rows in group are hidden
            document.querySelectorAll('.group').forEach(group => {
              const groupRows = group.querySelectorAll('tbody tr');
              const anyVisible = Array.from(groupRows).some(r => r.style.display !== 'none');
              group.style.display = anyVisible ? '' : 'none';
            });

            noResults.style.display = visible === 0 && q ? 'block' : 'none';
          });
          ]]>
        </script>

      </body>
    </html>
  </xsl:template>

  <!-- ── renderRow ── -->
  <xsl:template name="renderRow">
    <tr>
      <td>
        <div class="url-cell">
          <span class="url-icon">
            <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </span>
          <a class="url-link" href="{sm:loc}" target="_blank" rel="noopener">
            <xsl:value-of select="sm:loc"/>
          </a>
        </div>
      </td>
      <td class="lastmod lastmod-col">
        <xsl:if test="sm:lastmod">
          <xsl:value-of select="substring(sm:lastmod, 1, 10)"/>
        </xsl:if>
      </td>
    </tr>
  </xsl:template>

</xsl:stylesheet>

`;
});
