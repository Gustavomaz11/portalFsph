export default async function checkAuth(req,res,next) {

    const userId = req.session.userid;

    if(!userId) {
        await res.status(401).send('<center><h2>Usuario não autenticado.</h2></center>')
    }
    else if (req.session.timer < Date.now()) {
        
        await req.session.destroy();

        await res.status(401).send('<center><h2>Sessão Expirada!</h2></center>');

    }
    else {

        req.session.timer += 30000;
        req.session.userid = userId;

        await req.session.save();

        await next();

    }
    
}