import cp from 'child_process';
import express, { Request, Response } from 'express';
import multer from 'multer';
import BrowserEnv from './modules/browser/browserEnv';
import MediaPipeService from './services/mediapipe';
import { PassThrough } from 'stream';
import fs from 'fs';

function main(): void {
    const app = express();
    const upload = multer();

    // modules
    const browserEnv = new BrowserEnv();
    browserEnv.init();

    //service
    const mpSvc = new MediaPipeService();

    app.get('/stream', upload.single('file'), async (req: Request, res: Response) => {
        if (!req.file?.buffer) {
            return res.status(400).send({ message: '파일 에러', result: [] });
        }

        // setStream
        const readStream = fs.createReadStream('./test/freevideo.mp4');

        const passStream = new PassThrough();
        const option = ['-i', '-', '-r', '24', '-f', 'image2pipe', '-'];
        const cmmand = cp.spawn('ffmpeg', option);
        readStream.pipe(passStream).pipe(cmmand.stdin);

        // cmmand.stdout.on('data', (chunk: Buffer) => {
        //     if (chunk.length > 3 && chunk[0] === 255 && chunk[1] === 216 && chunk[2] === 255) {

        //     }
        // });

        let count = 1;

        let emptyBuffer = Buffer.allocUnsafe(0);
        const BufferMap: { [key: number]: Buffer } = {};
        let isFirst = true;
        cmmand.stdout.on('data', (chunk: any) => {
            if (chunk.length > 3 && chunk[0] === 255 && chunk[1] === 216 && chunk[2] === 255 && !isFirst) {
                BufferMap[count] = emptyBuffer;
                emptyBuffer = Buffer.from(chunk);
                count++;
                return;
            }

            emptyBuffer = Buffer.from([...emptyBuffer, ...chunk]);

            if (count === 1) {
                isFirst = false;
            }
        });

        // const tensorObject: { [key: number]: tfnode.Tensor3D } = {};
        // const response: IHolistic[] = [];
        cmmand.stdout.on('end', async () => {
            const res = await mpSvc.getHolistic(BufferMap[1]);
            console.log(res);
            // Object.entries(BufferMap).forEach(async (d) => {

            //     console.log(res);
            //     response.push(res);
            // });
        });

        // res.send(frame);
    });

    //handler
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
