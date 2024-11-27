import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config/config';
import { User } from 'parse';

export const authRequired = (req, res, next) =>{
    const cookies = req.cookies;
    console.log(cookies);


    if (!token) return res.status(401).json({message: "No token, permiso denegado"});

    jwt.verify(token, TOKEN_SECRET, (err, User) => {
        if(err) return res.status(403).json({message: "Invalid token"}); 
    })

    req.User= User 
    next()
}