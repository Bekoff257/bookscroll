import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDb } from './config/db';
import { initFirebaseAdmin } from './config/firebase';
import { router } from './routes';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/', router);

const port = Number(process.env.PORT || 4000);

async function start() {
  initFirebaseAdmin();
  await connectDb();
  app.listen(port, () => console.log(`API running on ${port}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
