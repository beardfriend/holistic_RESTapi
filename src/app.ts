import { credentials } from '@grpc/grpc-js';
import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { MDPIPE_SERVER_PORT_LIST } from './constants/constant';
import BrowserEnv from './modules/browser/browserEnv';
import grpcHolistic from './modules/grpc/holistic';
import { HealthServiceClient } from './protos/health';
import { HolisticResponse } from './protos/holistic';
import gRPCService from './services/grpc';

async function main() {
    // express
    const app = express();
    const upload = multer();

    // browser Env
    const browserEnv = new BrowserEnv();
    browserEnv.init();

    // gRPCs connect
    const healthClients: HealthServiceClient[] = [];
    const holisticClient = new Map<number, grpcHolistic>();

    MDPIPE_SERVER_PORT_LIST.forEach((d, i) => {
        healthClients.push(new HealthServiceClient(`localhost:${d}`, credentials.createInsecure()));
        holisticClient.set(i + 1, new grpcHolistic(`localhost:${d}`));
    });

    // holistic Service
    const gRPCSvc = new gRPCService(healthClients, holisticClient);
    gRPCSvc.gRPCHealthCheck();

    //handler
    app.get('/mediapipe/holistic', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file;

            if (!file) {
                return res.status(400).send({ message: '파일 에러', result: [] });
            }

            if (file.size > 2000000) {
                return res.status(400).send({ message: '파일 용량이 너무 큽니다.', result: [] });
            }

            const isVideo = file.mimetype.includes('video');
            const isImage = file.mimetype.includes('image');

            if (!isVideo && !isImage) {
                return res.status(400).send({ message: '파일 형식을 확인해주세요', result: [] });
            }

            let response: HolisticResponse[] = [];

            if (isVideo) {
                const result = await gRPCSvc.getHolisticFromVideo(file.buffer);
                response = result;
            } else {
                const result = await gRPCSvc.getHolisticFromImage(file.buffer);
                response.push(result);
            }

            res.send({ message: '', result: response });
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

    app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
        res.status(500).send({ message: '일시적인 에러가 발생했습니다' });
    });

    app.listen(4000);
    console.log(`listening on 4000`);
}

main();
