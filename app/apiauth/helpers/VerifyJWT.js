import jwt from 'jsonwebtoken';

export default function verifyJWT(req, res, next){
    
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({err: 401, msg: "Acesso negado!" });
        return
    } 

    try {

        const secret = process.env.SECRET;

        const decore = jwt.verify(token, secret);

        next();

    } catch (err) {
        res.status(400).json({ err: 400, msg: "O Token é inválido ou Token expirado!" });
    }
    
}
 