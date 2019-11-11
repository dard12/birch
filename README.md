content marketing:

website like tell-me-what-to-do.com
that just randomly tells you something to do and why it's good
with a CTA like
> want to customize what i tell you to do?
> there's an app for that!
> hint: this is content marketing for that app


server setup process

```
get domain from namecheap
get nameservers from cloudflare, put them in namecheap
create droplet in digitialocean
create A records in cloudflare that point to the IP of the digitialocean droplet https://www.digitalocean.com/community/tutorials/how-to-mitigate-ddos-attacks-against-your-website-with-cloudflare
setup ufw, non-root user with ssh + sudo https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-18-04
install nginx https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04
setup sites-available https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04#step-5-%E2%80%93-setting-up-server-blocks-(recommended)
setup nginx for HTTPS https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04#step-3-%E2%80%94-allowing-https-through-the-firewall
install letsencrypt https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04
install node + npm https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04#step-1-%E2%80%94-installing-nodejs
install pm2 https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04
git clone
filezilla transfer envs to droplet
npm i
npm run build-prod
pm2 start ecosystem.config.js
```

```
SELECT
  schema_name,
  relname,
  pg_size_pretty(table_size) AS size,
  table_size

FROM (
       SELECT
         pg_catalog.pg_namespace.nspname           AS schema_name,
         relname,
         pg_relation_size(pg_catalog.pg_class.oid) AS table_size

       FROM pg_catalog.pg_class
         JOIN pg_catalog.pg_namespace ON relnamespace = pg_catalog.pg_namespace.oid
     ) t
WHERE schema_name NOT LIKE 'pg_%'
ORDER BY table_size DESC;
```
