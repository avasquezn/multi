import { Router } from 'express';
import { getEarningsByDayMonthYear, getEarningsByMonthYear, getEarningsByYear, getLast6Clients, getCajasConInfo } from '../controllers/dashboardController';

const router: Router = Router();

// Ruta para obtener ganancias por día, mes y año
router.get('/earnings', getEarningsByDayMonthYear);
router.get('/earnings/month', getEarningsByMonthYear);
router.get('/earnings/year', getEarningsByYear);
router.get('/lastes/clientes', getLast6Clients);
router.get('/all/cajas', getCajasConInfo);

export default router;
