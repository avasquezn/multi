import { Router } from 'express';
import { 
    getEarningsByDayMonthYear, 
    getEarningsByMonthYear, 
    getEarningsByYear, 
    getLast6Clients, 
    getCajasConInfo, 
    getDepositos 
} from '../controllers/dashboardController';

const router: Router = Router();

// Rutas para obtener ganancias por día, mes y año
router.get('/earnings', getEarningsByDayMonthYear);
router.get('/earnings/month', getEarningsByMonthYear);
router.get('/earnings/year', getEarningsByYear);

// Ruta para obtener los últimos 6 clientes
router.get('/lastes/clientes', getLast6Clients);

// Ruta para obtener las cajas con información
router.get('/all/cajas', getCajasConInfo);

// Nueva ruta para obtener depósitos con fecha de creación
router.get('/depositos', getDepositos);

export default router;
