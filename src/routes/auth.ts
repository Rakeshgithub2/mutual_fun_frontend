import { Router } from 'express';
import { register, login, refreshTokens } from '../controllers/auth';
import {
  redirectToGoogle,
  handleGoogleCallback,
  verifyGoogleToken,
} from '../controllers/googleAuth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshTokens);

// Google OAuth - ID Token verification (for @react-oauth/google)
// IMPORTANT: POST route must come before GET to avoid route conflicts
router.post('/google', verifyGoogleToken);

// Google OAuth - Redirect flow (for direct backend redirect)
router.get('/google', redirectToGoogle);
router.get('/google/callback', handleGoogleCallback);

export default router;
