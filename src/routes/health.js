import { Router } from 'express';

const router = Router({ caseSensitive: true });

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET');
  return next();
});

router.get('/', (req, res) => {
  const dateOptions = {
    hour12: false,
    timeZone: 'UTC'
  };

  const data = {
    uptime: `${process.uptime().toFixed(1)}s`,
    ok: true,
    date: new Date().toLocaleString('pt-BR', dateOptions)
  };

  return res.status(200).json(data);
});

export default router;
