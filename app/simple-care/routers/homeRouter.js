import Router from 'express';
import fileDirName from '../helpers/file-dir-name.js';

const router = Router();
const {__dirname} = fileDirName(import.meta);

const options = {
    root: __dirname.replace('routers','views')
};

router.set('view engine', 'html');

router.get('/', (req,res) => {
    res.status(200).sendFile('/main.html',options);
});

export default router;