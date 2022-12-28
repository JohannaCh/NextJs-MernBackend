import { check } from 'express-validator'
const loginForm = [
    check('email').not().isEmpty().withMessage("El campo email no puede estar vacio").bail()
    .isEmail().withMessage("Debe de ingresar un email válido"),

    check('password').trim().notEmpty().withMessage("El campo contraseña no puede estar vacio")
    .isLength({ min: 8 }).withMessage("La contraseña debe de tener como mínimo 8 caracteres")
    .matches(/^(?=.*[0-9])(?=.*[!@#$_.^&*])[a-zA-Z0-9!@#$_.^&*]{8,16}$/)
    .withMessage("La contraseña debe de tener un numero, una mayuscula y un caracter especial"),
];

module.exports = loginForm;