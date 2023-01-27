import express, { Request, Response } from 'express';
import multer from 'multer';
import { fileTypeRegex, MDPIPE_SERVER_PORT_LIST } from './constants/constant';
import BrowserEnv from './modules/browser/browserEnv';
import FfmpegStream from './modules/ffmpeg/ffmpegStream';
import grpcHolistic from './modules/grpc/holistic';
import { getNumGroupsEqaulQuantity } from './modules/utils/calculate';
import { HolisticRequest, HolisticResponse } from './protos/holistic';
import FFmpegService from './services/ffmpegStream';

// import fs from 'fs';

function main(): void {
    const app = express();
    const upload = multer();

    // modules
    const browserEnv = new BrowserEnv();
    browserEnv.init();

    const HolisticClients = new Map<number, grpcHolistic>();
    MDPIPE_SERVER_PORT_LIST.forEach((d, i) => {
        HolisticClients.set(i + 1, new grpcHolistic(`localhost:${d}`));
    });

    //svc

    const ffmpegSvc = new FFmpegService();

    //handler
    app.get('/mediapipe/holistic', upload.single('file'), async (req: Request, res: Response) => {
        const file = req.file;

        if (!file) {
            return res.status(400).send({ message: '파일 에러', result: [] });
        }

        if (file.size > 2000000) {
            return res.status(400).send({ message: '파일 용량이 너무 큽니다.', result: [] });
        }

        if (!fileTypeRegex.test(file.mimetype)) {
            return res.status(400).send({ message: '파일 타입을 확인해주세요.', result: [] });
        }

        const isVideo = file.mimetype.includes('video');
        const ImagesBufferMap = new Map<number, Buffer>();
        let response: HolisticResponse[] = [];
        if (isVideo) {
            const ffStream = new FfmpegStream(24);

            // FFmpeg 데이터 입력
            ffStream.Input(file.buffer);
            ffmpegSvc.init();
            // FFmpeg 데이터 출력
            await ffStream.Output(async (chunk) => {
                await ffmpegSvc.SetJpgBuffer(ImagesBufferMap, chunk);
            });
            ffmpegSvc.init();

            const nums = getNumGroupsEqaulQuantity(ImagesBufferMap.size, MDPIPE_SERVER_PORT_LIST.length);

            const arr = [];
            for (const [i, client] of HolisticClients) {
                const holisticRequest: HolisticRequest = { request: [] };

                for (const j of nums[i - 1]) {
                    const buf = await ImagesBufferMap.get(j);
                    if (buf) {
                        holisticRequest.request.push({ index: j, data: Buffer.from(buf).toString('base64') });
                    }
                }
                arr.push(client.get(holisticRequest));
            }
            response = await Promise.all(arr);
        } else {
            const holisticRequest: HolisticRequest = { request: [] };
            const randInt = Math.floor(Math.random() * MDPIPE_SERVER_PORT_LIST.length) + 1;
            holisticRequest.request.push({ index: 1, data: Buffer.from(file.buffer).toString('base64') });
            const res = await HolisticClients.get(randInt)?.get(holisticRequest);
            if (!res) {
                throw new Error('일시적인 에러');
            }

            response.push(res);
        }

        res.send(response);
    });

    app.listen(4000);
}

main();
