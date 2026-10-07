# Nakathata.lk favicon

The full `public/images/brand/nakathata-logo.jpg` remains unchanged for the site
logo, social metadata, and Organization structured data.

The favicon is an emblem-only variant created using the built-in image-editing
tool from that logo. Edit prompt: extract and reframe only the facing gold wedding
couple, bouquet, hair flower, and circular ring; remove lettering and tagline;
center on a white square with small margins; keep gold/ochre branding and pose;
shorten the ribbon as needed, no new objects or watermark. This is a favicon
variant, not a pixel-identical crop or a replacement of the full brand artwork.

Assets: `public/images/brand/favicon-512.png` (master), `favicon-96.png` (Google/
browser), `favicon-180.png` (Apple), and `public/favicon.ico` (32/48/64/256).
Run `node scripts/build-favicons.mjs` to regenerate smaller exports from the master.

Keep public icon URLs stable. After deployment confirm 200 image responses and
the homepage icon links, then request homepage indexing once in Search Console.
Google may take days or weeks to refresh the icon and does not guarantee display.
