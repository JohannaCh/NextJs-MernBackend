import { validationResult } from 'express-validator'
import User from '../../../models/User';
import initMiddleware from '../../../middleware/initMiddleware';
import loginForm from '../../../middleware/loginForm';
import validateMiddleware from '../../../middleware/validateFields';
import dbConnect from '../../../lib/dbConnect';
import { generateJWT } from '../../../helpers/jwt';
const bcrypt = require('bcryptjs');

const validateBody = initMiddleware(
    validateMiddleware(loginForm, validationResult)
)

export default async function handler(req, res) {
    await validateBody(req, res);

    const { email, password } = req.body;
    await dbConnect();
        try {
            const user = await User.findOne({email: email});
            if (!user) {
                return res.status(400).json({
                    ok:false,
                    msg:'Datos incorrectos'
                })
            }

            //comparar pass
            const validatePass = bcrypt.compareSync(password, user.password);

            if (!validatePass) {
                return res.status(400).json({
                    ok:false,
                    msg:'Contraseña incorrecta'
                })
            }

            //generar el JWT
            const token = await generateJWT(user.id, user.name);
            
            res.status(200).json({
                ok:true,
                msg:'Login Exitoso',
                token
            });

        } catch (error) {
            res.status(500).json({
                ok:false,
                msg:'Fallo el inicio de sesion'
            })
        }
}