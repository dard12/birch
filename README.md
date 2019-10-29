# Rating

[Project Management](https://airtable.com/tblQIxBHdO058Aqt6/viwK41mVRISdkXtcS?blocks=hide)


Hey, I found you on RYM and your reviews are great.

I'm building a platform similar to RYM and thought you might be interested: https://www.tilde.app/

Any feedback will be very appreciated :)

Additionally if you'd like a few of your reviews ported over to see how it works, I can do that for you!


https://www.albumoftheyear.org/donate/
https://www.albumoftheyear.org/discover/people/
https://www.albumoftheyear.org/users/stats/?q=reviews
https://www.albumoftheyear.org/user/toasterqueen12/

https://rateyourmusic.com/
https://rateyourmusic.com/~_THOTH_
https://rateyourmusic.com/~tomsarram

/mu/

SENT
https://rateyourmusic.com/~meepbeep
https://rateyourmusic.com/~danielito19
https://www.albumoftheyear.org/user/nickshutter & https://rateyourmusic.com/~NickShutter
https://www.albumoftheyear.org/user/beeyyaahh
https://www.albumoftheyear.org/user/music-observer/
Sputnik liheng_chan / lak89


Ad Copy
```
Hey Reddit, Tilde here. We're a social network for music lovers. Also I heard that ads with longer text do better? So here's an extra sentence at the end.
Hey Reddit, I made a chart of the best music albums of 2019. Let's fight about it. But like, on the website. Because we want the traffic.

Tilde | Social Music Discovery
Tilde | Share your Favorite Music

Tilde is a social network for music-lovers.
Rate your music. Discover 20 million songs. Listen on all major platforms.


Best Hip-Hop Albums of 2019 | Tilde

A definitive list of the best hip-hop albums of 2019 voted on by Tilde users.
Tilde is a social network for music lovers. Sign up today!
```

getting musicbrainz
```
- https://pypi.org/project/mbdata/
- mbslave sync
```

setup tables
```
create temp tables
create recordings + release_group
rename to recording_new + release_group_new
dump into prod
update rating column
rename tables to swap
```

```
SELECT musicbrainz.release.*
INTO ratings.temp_release
FROM musicbrainz.release
LEFT JOIN musicbrainz.artist_credit
ON musicbrainz.release.artist_credit = musicbrainz.artist_credit.id

SELECT musicbrainz.release_group.*,
musicbrainz.release_group_meta.first_release_date_year as date_year,
musicbrainz.release_group_meta.first_release_date_month as date_month,
musicbrainz.release_group_meta.rating as musicbrainz_rating,
musicbrainz.release_group_meta.rating_count as musicbrainz_count
INTO ratings.temp_release_group
FROM musicbrainz.release_group
LEFT JOIN musicbrainz.artist_credit
ON musicbrainz.release_group.artist_credit = musicbrainz.artist_credit.id
LEFT JOIN musicbrainz.release_group_meta
ON musicbrainz.release_group_meta.id = musicbrainz.release_group.id

SELECT *
INTO ratings.temp_release_country
FROM musicbrainz.release_country
WHERE (
  (musicbrainz.release_country.date_year >= 1950 AND musicbrainz.release_country.date_year <= 2019)
  OR musicbrainz.release_country.date_year IS NULL
)

SELECT *
INTO ratings.temp_release_unknown_country
FROM musicbrainz.release_unknown_country
WHERE (
  (musicbrainz.release_unknown_country.date_year >= 1950 AND musicbrainz.release_unknown_country.date_year <= 2019)
  OR musicbrainz.release_unknown_country.date_year IS NULL
)

SELECT *
INTO ratings.temp_language
FROM musicbrainz.language
WHERE (musicbrainz.language.name IS NULL OR musicbrainz.language.name IN ('English', 'German', 'Japanese', 'French', 'Spanish', 'Italian', 'Portugese', 'Russian', 'Finnish', 'Dutch', 'Swedish', 'Chinese', 'Korean'))
```

```
SELECT musicbrainz.recording.gid as recording_gid,
  array_remove(array_agg(DISTINCT musicbrainz.recording_tag.tag), NULL) as tag_ids
INTO ratings.temp_recording_tag_ids
FROM musicbrainz.recording
LEFT JOIN musicbrainz.recording_tag
ON musicbrainz.recording_tag.recording = musicbrainz.recording.id
WHERE musicbrainz.recording_tag.count >= 1
GROUP BY musicbrainz.recording.gid

SELECT musicbrainz.artist.id as artist_id,
  array_remove(array_agg(DISTINCT musicbrainz.artist_tag.tag), NULL) as tag_ids
INTO ratings.temp_artist_tag_ids
FROM musicbrainz.artist
LEFT JOIN musicbrainz.artist_tag
ON musicbrainz.artist_tag.artist = musicbrainz.artist.id
WHERE musicbrainz.artist_tag.count >= 1
GROUP BY musicbrainz.artist.id

SELECT ratings.temp_release.gid as release_gid,
  array_remove(array_agg(DISTINCT musicbrainz.release_tag.tag), NULL) as tag_ids
INTO ratings.temp_release_tag_ids
FROM ratings.temp_release
LEFT JOIN musicbrainz.release_tag
ON musicbrainz.release_tag.release = ratings.temp_release.id
WHERE musicbrainz.release_tag.count >= 1
GROUP BY ratings.temp_release.gid

SELECT ratings.temp_release_group.id as release_group_id,
  array_remove(array_agg(DISTINCT musicbrainz.release_group_tag.tag), NULL) as tag_ids
INTO ratings.temp_release_group_tag_ids
FROM ratings.temp_release_group
LEFT JOIN musicbrainz.release_group_tag
ON musicbrainz.release_group_tag.release_group = ratings.temp_release_group.id
WHERE musicbrainz.release_group_tag.count >= 1
GROUP BY ratings.temp_release_group.id
```

```
SELECT cover_art_archive.cover_art.id,
cover_art_archive.cover_art.release

INTO ratings.temp_cover_art
FROM cover_art_archive.cover_art

LEFT JOIN cover_art_archive.cover_art_type
ON cover_art_archive.cover_art.id = cover_art_archive.cover_art_type.id

WHERE (cover_art_archive.cover_art_type.type_id = 1)
```

```
SELECT DISTINCT ON (ratings.temp_release_group.id)
ratings.temp_release_group.id,
ratings.temp_release_group.gid,
ratings.temp_release_group.name,
musicbrainz.artist.id as artist_id,
musicbrainz.artist.name as artist_name,
musicbrainz.artist_credit.name as artist_credit_name,
musicbrainz.medium.id as medium_id,
ratings.temp_release.gid as release_gid,

ratings.temp_release_group.date_year as release_date_year1,
ratings.temp_release_country.date_year as release_date_year2,
ratings.temp_release_unknown_country.date_year as release_date_year3,

ratings.temp_release_group.date_month as release_date_month1,
ratings.temp_release_country.date_month as release_date_month2,
ratings.temp_release_unknown_country.date_month as release_date_month3,

ratings.temp_language.name as language_name,
ratings.temp_cover_art.id as cover_id,
ratings.temp_release_group.musicbrainz_rating as musicbrainz_rating,
ratings.temp_release_group.musicbrainz_count as musicbrainz_count

INTO ratings.temp_release_group2

FROM ratings.temp_release

LEFT JOIN musicbrainz.artist_credit
ON ratings.temp_release.artist_credit = musicbrainz.artist_credit.id

LEFT JOIN musicbrainz.artist_credit_name
ON (
  musicbrainz.artist_credit.id = musicbrainz.artist_credit_name.artist_credit
  AND musicbrainz.artist_credit_name.position = 0
)

LEFT JOIN musicbrainz.artist
ON (
  musicbrainz.artist_credit_name.artist = musicbrainz.artist.id
  AND musicbrainz.artist_credit_name.position = 0
)

LEFT JOIN ratings.temp_release_group
ON ratings.temp_release.release_group = ratings.temp_release_group.id

LEFT JOIN musicbrainz.medium
ON musicbrainz.medium.release = ratings.temp_release.id

LEFT JOIN musicbrainz.track
ON musicbrainz.track.medium = musicbrainz.medium.id

LEFT JOIN musicbrainz.recording
ON musicbrainz.recording.id = musicbrainz.track.recording

LEFT JOIN ratings.temp_release_country
ON ratings.temp_release.id = ratings.temp_release_country.release

LEFT JOIN ratings.temp_release_unknown_country
ON ratings.temp_release.id = ratings.temp_release_unknown_country.release

LEFT JOIN ratings.temp_language
ON ratings.temp_release.language = ratings.temp_language.id

LEFT JOIN ratings.temp_cover_art
ON ratings.temp_cover_art.release = ratings.temp_release.id

WHERE ratings.temp_release_group.id IS NOT NULL

ORDER BY
ratings.temp_release_group.id,
release_date_year1, release_date_year2, release_date_year3,
release_date_month1, release_date_month2, release_date_month3,
medium_id
```

make temp_release_group2.id primary key

```
SELECT
ratings.temp_release_group2.id,
ratings.temp_release_group2.gid,
ratings.temp_release_group2.name,
ratings.temp_release_group2.artist_name,
ratings.temp_release_group2.release_gid,
COALESCE(
  ratings.temp_release_group2.release_date_year1,
  ratings.temp_release_group2.release_date_year2,
  ratings.temp_release_group2.release_date_year3
) as release_date_year,
ratings.temp_release_group2.language_name,
ratings.temp_release_group2.cover_id,
ratings.temp_release_group2.artist_credit_name,
ratings.temp_release_group2.artist_id,
ratings.temp_release_group2.musicbrainz_rating,
ratings.temp_release_group2.musicbrainz_count,
array_agg(musicbrainz.recording.id ORDER BY musicbrainz.track.position) as recording_ids

INTO ratings.temp_release_group3
FROM ratings.temp_release_group2

LEFT JOIN musicbrainz.track
ON musicbrainz.track.medium = ratings.temp_release_group2.medium_id

LEFT JOIN musicbrainz.recording
ON musicbrainz.recording.id = musicbrainz.track.recording

GROUP BY ratings.temp_release_group2.id
```

```
INSERT INTO ratings.release_group

SELECT
ratings.temp_release_group3.id,
ratings.temp_release_group3.gid,
ratings.temp_release_group3.name,
ratings.temp_release_group3.artist_name,
ratings.temp_release_group3.release_gid,

(to_tsvector(coalesce(ratings.temp_release_group3.name,'')) ||
to_tsvector(coalesce(ratings.temp_release_group3.artist_name,'')) ||
to_tsvector(coalesce(ratings.temp_release_group3.artist_credit_name,''))) as tsv,

ratings.temp_release_group3.release_date_year,
ratings.temp_release_group3.language_name,

ARRAY(SELECT DISTINCT UNNEST(
  ratings.temp_artist_tag_ids.tag_ids ||
  ratings.temp_release_tag_ids.tag_ids ||
  ratings.temp_release_group_tag_ids.tag_ids
) ORDER BY 1) as tag_ids,

ratings.temp_release_group3.cover_id,
NULL as rating,
ratings.temp_release_group3.artist_credit_name,
ratings.temp_release_group3.artist_id,
NULL as adjusted_rating,
ratings.temp_release_group3.recording_ids,
ratings.temp_release_group3.musicbrainz_rating,
ratings.temp_release_group3.musicbrainz_count

FROM ratings.temp_release_group3

LEFT JOIN ratings.temp_artist_tag_ids
ON ratings.temp_artist_tag_ids.artist_id = ratings.temp_release_group3.artist_id

LEFT JOIN ratings.temp_release_tag_ids
ON ratings.temp_release_tag_ids.release_gid = ratings.temp_release_group3.release_gid

LEFT JOIN ratings.temp_release_group_tag_ids
ON ratings.temp_release_group_tag_ids.release_group_id = ratings.temp_release_group3.id
```

```
SELECT
musicbrainz.recording.id,
musicbrainz.recording.gid,
musicbrainz.recording.name,
musicbrainz.artist.id as artist_id,
musicbrainz.artist.name as artist_name,
musicbrainz.artist_credit.name as artist_credit_name,
ratings.temp_release_group.id as release_group_id,
ratings.temp_release_group.name as release_group_name,
ratings.temp_release.gid as release_gid,

ratings.temp_release_group.date_year as release_date_year1,
ratings.temp_release_country.date_year as release_date_year2,
ratings.temp_release_unknown_country.date_year as release_date_year3,

ratings.temp_release_group.date_month as release_date_month1,
ratings.temp_release_country.date_month as release_date_month2,
ratings.temp_release_unknown_country.date_month as release_date_month3,

ratings.temp_language.name as language_name,
ratings.temp_cover_art.id as cover_id

INTO ratings.temp_recording

FROM musicbrainz.recording

LEFT JOIN musicbrainz.artist_credit
ON musicbrainz.recording.artist_credit = musicbrainz.artist_credit.id

LEFT JOIN musicbrainz.artist_credit_name
ON (
  musicbrainz.artist_credit.id = musicbrainz.artist_credit_name.artist_credit
  AND musicbrainz.artist_credit_name.position = 0
)

LEFT JOIN musicbrainz.artist
ON (
  musicbrainz.artist_credit_name.artist = musicbrainz.artist.id
  AND musicbrainz.artist_credit_name.position = 0
)

LEFT JOIN musicbrainz.track
ON musicbrainz.recording.id = musicbrainz.track.recording

LEFT JOIN musicbrainz.medium
ON musicbrainz.track.medium = musicbrainz.medium.id

LEFT JOIN ratings.temp_release
ON musicbrainz.medium.release = ratings.temp_release.id

LEFT JOIN ratings.temp_release_group
ON ratings.temp_release.release_group = ratings.temp_release_group.id

LEFT JOIN ratings.temp_release_country
ON ratings.temp_release.id = ratings.temp_release_country.release

LEFT JOIN ratings.temp_release_unknown_country
ON ratings.temp_release.id = ratings.temp_release_unknown_country.release

LEFT JOIN ratings.temp_language
ON ratings.temp_release.language = ratings.temp_language.id

LEFT JOIN ratings.temp_cover_art
ON ratings.temp_cover_art.release = ratings.temp_release.id

WHERE musicbrainz.recording.name != '[untitled]'
AND musicbrainz.recording.name != '[silence]'
AND musicbrainz.recording.name != '[unknown]'
AND musicbrainz.artist.name != '[unknown]'
AND musicbrainz.artist.name != '[no artist]'
```

```
DELETE FROM ratings.temp_recording recording1
USING ratings.temp_recording recording2
WHERE
recording1.id = recording2.id
AND (
  recording1.release_date_year1 > recording2.release_date_year1
  OR recording1.release_date_year2 > recording2.release_date_year2
  OR recording1.release_date_year3 > recording2.release_date_year3
  OR (
    recording1.release_date_year1 = recording2.release_date_year1
    AND recording1.release_date_month1 > recording2.release_date_month1
  )
  OR (
    recording1.release_date_year2 = recording2.release_date_year2
    AND recording1.release_date_month2 > recording2.release_date_month2
  )
  OR (
    recording1.release_date_year3 = recording2.release_date_year3
    AND recording1.release_date_month3 > recording2.release_date_month3
  )
)
```

```
SELECT DISTINCT ON (id)
id,
gid,
name,
artist_name,
release_group_name,
release_gid,
release_group_id,
COALESCE(release_date_year1, release_date_year2, release_date_year3) as release_date_year,
cover_id,
artist_credit_name,
artist_id,
language_name

INTO ratings.temp_recording2
FROM ratings.temp_recording

ORDER BY id,
release_date_year1, release_date_year2, release_date_year3,
release_date_month1, release_date_month2, release_date_month3, 
release_group_id
```

```
INSERT INTO ratings.recording

SELECT
ratings.temp_recording2.id,
ratings.temp_recording2.name,
ratings.temp_recording2.artist_name,
ratings.temp_recording2.release_group_name,
ratings.temp_recording2.release_gid,
ratings.temp_recording2.release_group_id,
ratings.temp_recording2.release_date_year,
ratings.temp_recording2.language_name,

ARRAY(SELECT DISTINCT UNNEST(
  ratings.temp_recording_tag_ids.tag_ids ||
  ratings.temp_artist_tag_ids.tag_ids ||
  ratings.temp_release_tag_ids.tag_ids ||
  ratings.temp_release_group_tag_ids.tag_ids
) ORDER BY 1) as tag_ids,

ratings.temp_recording2.cover_id,
NULL as rating,
ratings.temp_recording2.artist_credit_name,
ratings.temp_recording2.artist_id,
NULL as adjusted_rating,
ratings.temp_recording2.gid,
musicbrainz.recording_meta.rating as musicbrainz_rating,
random() as random,
(to_tsvector(coalesce(ratings.temp_recording2.name,'')) ||
to_tsvector(coalesce(ratings.temp_recording2.release_group_name,'')) ||
to_tsvector(coalesce(ratings.temp_recording2.artist_name,'')) ||
to_tsvector(coalesce(ratings.temp_recording2.artist_credit_name,''))) as tsv

FROM ratings.temp_recording2

LEFT JOIN ratings.temp_recording_tag_ids
ON ratings.temp_recording_tag_ids.recording_gid = ratings.temp_recording2.gid

LEFT JOIN ratings.temp_artist_tag_ids
ON ratings.temp_artist_tag_ids.artist_id = ratings.temp_recording2.artist_id

LEFT JOIN ratings.temp_release_tag_ids
ON ratings.temp_release_tag_ids.release_gid = ratings.temp_recording2.release_gid

LEFT JOIN ratings.temp_release_group_tag_ids
ON ratings.temp_release_group_tag_ids.release_group_id = ratings.temp_recording2.release_group_id

LEFT JOIN musicbrainz.recording_meta
ON ratings.temp_recording2.id = musicbrainz.recording_meta.id
```

```
pg_dump -Fc -n ratings -t ratings.recording_new musicbrainz > recording.sql
pg_dump -Fc -n ratings -t ratings.release_group_new musicbrainz > release_group.sql
pg_restore -d 'conn' --jobs 4 ./recording.sql
pg_restore -d 'conn' --jobs 4 ./release_group.sql
pg_restore -d musicbrainz --jobs 4 ./recording.sql
pg_restore -d musicbrainz --jobs 4 ./release_group.sql
```

```
UPDATE ratings.recording_new
SET rating = ratings.avg_rating.rating, adjusted_rating = ratings.avg_rating.adjusted_rating
FROM ratings.avg_rating
WHERE ratings.avg_rating.target_gid = ratings.recording_new.gid

UPDATE ratings.release_group_new
SET rating = ratings.avg_rating.rating, adjusted_rating = ratings.avg_rating.adjusted_rating
FROM ratings.avg_rating
WHERE ratings.avg_rating.target_gid = ratings.release_group_new.gid
```

```
BEGIN;
ALTER TABLE ratings.recording RENAME TO recording_old;
ALTER TABLE ratings.recording_new RENAME TO recording;
COMMIT;

BEGIN;
ALTER TABLE ratings.release_group RENAME TO release_group_old;
ALTER TABLE ratings.release_group_new RENAME TO release_group;
COMMIT;
```

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