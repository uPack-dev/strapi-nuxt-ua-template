<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>Карта сайта</title>
        <style type="text/css">
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>This XML Sitemap contains <xsl:value-of select="count(urlset/url)"/> URLs.</p>
        <table>
          <thead>
            <tr><th>URL</th><th>Last Updated</th></tr>
          </thead>
          <tbody>
            <xsl:for-each select="urlset/url">
              <tr>
                <td><xsl:value-of select="loc"/></td>
                <td><xsl:value-of select="lastmod"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
