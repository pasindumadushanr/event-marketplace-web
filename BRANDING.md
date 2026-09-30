# Nakathata.lk

The public website, account screens, metadata, legal copy, and contact links use
Nakathata.lk. The canonical website domain is https://nakathata.lk.

## Deployment

- Attach nakathata.lk (and www.nakathata.lk if used) to the frontend hosting
  project and configure DNS and HTTPS before redirecting the old domain.
- Configure support, privacy, careers, vendors, admin, and noreply addresses or
  aliases at nakathata.lk. Changing source code does not create mailboxes.
- Deploy the accompanying backend branding change. It presents older CMS copy
  using the new brand while preserving stored asset URLs, author names, and slugs.
- Update the backend FRONTEND_URL environment variable to https://nakathata.lk
  after the domain is connected, and set SMTP_FROM_EMAIL to a verified sender.
- Existing API, database, Cloudinary, and payment credentials are unchanged.

Legacy website origins remain allowed by backend CORS during the domain cutover.
They can be removed once traffic has migrated to Nakathata.lk.
