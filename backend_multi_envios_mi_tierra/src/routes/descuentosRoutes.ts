import { Router } from 'express';
import { 
    getTipoDescuento,
    getDescuentos,
    insertDiscountType,
    insertDiscount,
    updateDiscountType,
    updateDiscount
} from '../controllers/descuentosController';

const router = Router();

// Rutas para obtener los tipos de descuento y descuentos
router.get('/tipos-descuento', getTipoDescuento);  // Obtener tipos de descuento
router.get('/descuentos', getDescuentos);  // Obtener todos los descuentos

// Rutas para insertar un nuevo tipo de descuento y descuento
router.post('/tipo-descuento/insert', insertDiscountType);  // Insertar tipo de descuento
router.post('/descuento/insert', insertDiscount);  // Insertar descuento

// Rutas para actualizar un tipo de descuento y descuento
router.post('/tipo-descuento/update', updateDiscountType);  // Actualizar tipo de descuento
router.post('/descuento/update', updateDiscount);  // Actualizar descuento

export default router;
