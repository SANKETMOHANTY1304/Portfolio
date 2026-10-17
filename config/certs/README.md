# Supabase database CA

`supabase-ca.crt` is Supabase's public Root 2021 CA certificate, retrieved over HTTPS from:
https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt

It expires on April 26, 2031. This certificate is public, contains no private key,
and can be committed. It is used only for database hosts under `supabase.com`
or `supabase.co`. Certificate and hostname verification remain enabled.

See https://supabase.com/docs/guides/platform/ssl-enforcement for certificate renewal
and the database dashboard's SSL settings. If Supabase rotates its CA, update this
file from that trusted source; do not disable certificate verification.
