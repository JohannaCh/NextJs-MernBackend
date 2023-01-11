import { validationResult } from 'express-validator'
import User from '../../../models/User';
import initMiddleware from '../../../middleware/initMiddleware';
import loginForm from '../../../middleware/loginForm';
import validateMiddleware from '../../../middleware/validateFields';
import dbConnect from '../../../lib/dbConnect';
import { generateJWT } from '../../../helpers/jwt';
import Cors from 'cors'
const bcrypt = require('bcryptjs');

const cors = Cors({
    methods: ['POST', 'HEAD'],
  })

const validateBody = initMiddleware(
    validateMiddleware(loginForm, validationResult)
)

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

export default async function handler(req, res) {

    // await initCors(req, res, cors);
    await runMiddleware(req, res, cors);
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