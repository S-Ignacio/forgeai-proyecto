const router = require('express').Router();
const agente = require('../controllers/agenteController');
const { requireAuth } = require('../middlewares/auth');

router.use(requireAuth);

router.get('/', agente.index);
router.get('/nuevo', agente.create);
router.post('/', agente.store);
router.get('/:id', agente.show);
router.get('/:id/editar', agente.edit);
router.put('/:id', agente.update);
router.delete('/:id', agente.destroy);
router.post('/:id/tareas', agente.storeTarea);

module.exports = router;
