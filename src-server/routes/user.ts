import _ from 'lodash';
import { router, requireAuth } from '../index';
import pg from '../pg';

router.get('/api/user', async (req, res) => {
  const { query } = req;
  const docs = await pg
    .select('*')
    .from('user')
    .where(query)
    .limit(10);

  res.status(200).send({ docs });
});

router.post('/api/user', requireAuth, async (req, res) => {
  const { body, user }: any = req;
  const { onboarding_welcome } = body;

  if (onboarding_welcome) {
    const docs = await pg
      .update({ onboarding_welcome })
      .from('user')
      .where({ id: user.id })
      .returning('*');

    res.status(200).send({ docs });
  }
});
