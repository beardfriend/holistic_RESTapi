import express, { Response, Request } from 'express';
import multer from 'multer';
import BrowserEnv from './modules/browser/browserEnv';
const browserEnv = new BrowserEnv();
browserEnv.init();
import MediaPipeService from './services/mediapipe';

function main(): void {
    const app = express();
    const upload = multer();

    const mpSvc = new MediaPipeService();

    app.get('/mediapipe/holistic', upload.single('file'), async (req: Request, res: Response) => {
        try {
            const file = req.file;

            if (!file?.buffer) {
                return res.status(400).send({ message: '파일 에러', result: [] });
            }
            const response = await mpSvc.getHolistic(file.buffer);

            res.send({ message: '', result: response });
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: '일시적인 에러가 발생했습니다' });
        }
    });

    app.listen(4000);
}

main();
