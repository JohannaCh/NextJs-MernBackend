const jwt = require('jsonwebtoken');

export default function validateJWT(req) {
    const token = req.headers['x-token'];

    if (!token) {
      throw new Error("No hay token en la peticiòn");
    };

    try {
        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        return {
          uid: uid,
          name: name
        };
        
    } catch (error) {
      throw new Error("Token no valido");
    }
}