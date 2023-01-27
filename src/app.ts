import { credentials, ServiceError } from '@grpc/grpc-js';

import express, { Request, Response } from 'express';
import multer from 'multer';
import { MDPIPE_SERVER_PORT_LIST, fileTypeRegex } from './constants/constant';
import BrowserEnv from './modules/browser/browserEnv';
import FfmpegStream from './modules/ffmpeg/ffmpegStream';
import { HolisticRequest, HolisticResponse, HolisticServiceClient } from './protos/holistic';

// import fs from 'fs';

function main(): void {
    const app = express();
    const upload = multer();

    // modules
    const browserEnv = new BrowserEnv();
    browserEnv.init();

    const HolisticClients = new Set<HolisticServiceClient>();
    MDPIPE_SERVER_PORT_LIST.forEach((d) => {
        HolisticClients.add(
            new HolisticServiceClient(`localhost:${d}`, credentials.createInsecure(), {
                'grpc.max_receive_message_length': 1000000000000000,
                'grpc.max_send_message_length': 1000000000000000,
            })
        );
    });

    //handler
    app.get('/mediapipe/holistic', upload.single('file'), async (req: Request, res: Response) => {
        try {
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

            if (isVideo) {
                const ffStream = new FfmpegStream(24);

                // FFmpeg 데이터 입력
                ffStream.Input(file.buffer);

                let isFirst = true;
                let index = 1;
                let tmpBuffer = Buffer.allocUnsafe(0);
                // FFmpeg 데이터 출력
                await ffStream.Output(async (chunk) => {
                    if (chunk.length > 3 && chunk[0] === 255 && chunk[1] === 216 && chunk[2] === 255 && !isFirst) {
                        ImagesBufferMap.set(index, tmpBuffer);
                        tmpBuffer = Buffer.from(chunk);
                        index++;
                        return;
                    }

                    tmpBuffer = Buffer.from([...tmpBuffer, ...chunk]);

                    if (index === 1) {
                        isFirst = false;
                    }
                });
                tmpBuffer = Buffer.allocUnsafe(0);
                // prepare Holistics Data
                const portList = MDPIPE_SERVER_PORT_LIST;
                const min = 1;
                const max = ImagesBufferMap.size;
                const range = Math.floor(max / portList.length);
                let start = min;

                const startEndArr: { [key: string]: number }[] = [];

                const promise = portList.map(async (_, i) => {
                    const startX = start;
                    let end = startX + range;
                    if (i + 1 === portList.length) {
                        end = ImagesBufferMap.size;
                    }
                    start = start + range + 1;

                    await startEndArr.push({ start: startX, end: end });
                });

                await Promise.all(promise);

                let i = 0;
                for (const client of HolisticClients) {
                    const p1 = [];
                    for (let j = startEndArr[i].start; j <= startEndArr[i].end; j++) {
                        p1.push(j);
                    }
                    const holisticRequest: HolisticRequest = { request: [] };

                    const p2 = await p1.map(async (d) => {
                        const num = await d;
                        const buf = await ImagesBufferMap.get(num);
                        if (buf) {
                            holisticRequest.request.push({ index: num, data: Buffer.from(buf).toString('base64') });
                        }
                    });

                    await Promise.all(p2);

                    await client.getHolistics(holisticRequest, (_err: ServiceError | null, ress: HolisticResponse) => {
                        return res.send(ress.result);
                    });
                    i++;
                }
            } else {
                return res.send('helo');
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: '일시적인 에러가 발생했습니다' });
        }
    });

    app.listen(4000);
}

main();
