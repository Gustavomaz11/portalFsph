export default function checkAuth(req,res,next) {

    const user = req.session.userId;

    if(!user) {
        res.status(202).json({
            err_nu: 202,
            msg: 'Sessão Invalida !',
            user: null,
            nome: null,
            auth: false,
        });
    }
    else if (req.session.timer < Date.now()) {
        
        req.session.destroy();

        res.status(202).json({
            err_nu: 202,
            msg: 'Sessão Expirada !',
            user: null,
            nome: null,
            auth: false,
        });

    }
    else {

        req.session.timer += 30000;

        req.session.save();

        next();

    }
    
}