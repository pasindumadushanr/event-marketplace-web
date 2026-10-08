# Website image management

Deploy the backend first, then the frontend. No migration or new environment variable is needed. Uploads use the existing storage provider (Cloudinary in production).

Admin → CMS → Website Images (`/admin/cms/images`) controls:

- The homepage hero photograph.
- The shared website logo (navigation, footer, and other BrandLogo consumers).
- Homepage category photographs and the four Browse by Location photographs.
- The package fallback image, without overriding vendor/package photos.

Upload PNG, JPEG or WebP, up to 5 MB, or enter an HTTPS image URL. Preview and click Save Images to publish. Reset to default clears an override but must also be saved. Existing settings are stored under SITE_MEDIA and changes are recorded in the admin activity log. Only image settings are exposed publicly; upload and save routes require an admin role. Failed loading disables editing; failed saving retains the draft.

Public pages load image overrides once per full page load, with original artwork as a fallback if settings or an image fail. Reload to see changes; no redeploy is necessary. Google favicons, metadata/social preview artwork and organization structured-data artwork remain separate and are not changed by this editor.

New uploads are retained when replaced/reset so resetting cannot delete images still referenced elsewhere. Unpublished uploads are also retained; unused-asset cleanup is a separate task. Logo uploads use object-contain rather than the default artwork's custom crop. Use a tightly cropped logo for best results.

Each upload card shows suggested pixel dimensions and aspect ratio: hero 1920 × 1080 (16:9), logo 800 × 500 (8:5), package fallback 1200 × 900 (4:3), category and location cards 800 × 1000 (4:5). These are recommendations rather than strict requirements. Admin previews use object-contain and show the loaded image's natural width and height. Uploads preserve the original file; public hero/cards still use responsive object-cover frames and may crop edges even at these recommended sizes. Keep the main subject centered; the website logo uses object-contain.
