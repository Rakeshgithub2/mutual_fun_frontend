import { Router } from 'express';
import {
  getFunds,
  getFundById,
  getFundNavs,
  getFundManager,
  searchFunds,
} from '../controllers/funds';

const router = Router();

router.get('/search', searchFunds);
router.get('/', getFunds);
router.get('/:id', getFundById);
router.get('/:id/navs', getFundNavs);
router.get('/:id/manager', getFundManager);

export default router;
