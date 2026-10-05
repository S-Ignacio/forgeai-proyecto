const router = require('express').Router();
const auth = require('../controllers/authController');
const { guestOnly } = require('../middlewares/auth');

router.get('/registro', guestOnly, auth.showRegister);
router.post('/registro', guestOnly, auth.register);
router.get('/login', guestOnly, auth.showLogin);
router.post('/login', guestOnly, auth.login);
router.post('/logout', auth.logout);

module.exports = router;
