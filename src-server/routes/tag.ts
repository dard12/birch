import { router } from '..';
import pg from '../pg';

router.get('/api/tag', async (req, res) => {
  const { query } = req;
  const { recording } = query;

  const docs = await pg
    .select('ratings.tag.name', 'ratings.tag.id')
    .from('ratings.recording_tag')
    .where({ 'ratings.recording_tag.recording': recording })
    .leftJoin('ratings.tag', 'ratings.recording_tag.tag', 'ratings.tag.id')
    .limit(100);

  res.status(200).send({ docs });
});
