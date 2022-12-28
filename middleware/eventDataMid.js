import { check } from 'express-validator';
const isDate = require('../helpers/isDate');

const eventDataMid = [
    check('title').notEmpty().withMessage("El titulo es obligatorio")
    .isLength({ min: 3 }).withMessage("El titulo debe de tener como mínimo 3 caracteres"),
    
    check('start').custom(isDate).withMessage("La fecha de inicio es obligatoria"),

    check('end').custom(isDate).withMessage("La fecha de cierre es obligatoria"),

];
export default eventDataMid;