import { check } from 'express-validator'
const registerForm = [
    check('name').notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 3 }).withMessage("El nombre debe de tener al menos tres carácteres")
    .isAlpha().withMessage("No se admiten números o caracteres especiales"),
    
    check('email').not().isEmpty().withMessage("El campo email no puede estar vacio").bail()
    .isEmail().withMessage("Debe de ingresar un email válido"),


    check('password').trim().notEmpty().withMessage("El campo contraseña no puede estar vacio")
    .isLength({ min: 8 }).withMessage("La contraseña debe de tener como mínimo 8 caracteres")
    .matches(/^(?=.*[0-9])(?=.*[!@#$_.^&*])[a-zA-Z0-9!@#$_.^&*]{8,16}$/)
    .withMessage("La contraseña debe de tener un numero, una mayuscula y un caracter especial"),

    check("repassword").notEmpty().withMessage("El campo reingresar contraseña es obligatorio")
    .custom(async (confirmPassword, {req}) => {
        const password = req.body.password
        
        if(password !== confirmPassword){
          throw new Error('Las contraseñas ingresadas no coinciden')
        }
    }),
];
export default registerForm;