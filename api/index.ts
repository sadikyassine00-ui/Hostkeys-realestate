import app from '../server';

export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error('Vercel serverless error:', err);
    res.status(500).json({ error: 'Serverless invocation error', message: err?.message || err });
  }
}
