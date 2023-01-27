import express, { Request, Response } from 'express';
import multer from 'multer';
import BrowserEnv from './modules/browser/browserEnv';
import FfmpegStream from './modules/ffmpeg/ffmpegStream';
import MediaPipeService from './services/mediapipe';
import { Worker } from 'worker_threads';
import IHolistic from './transport/response';
import { ServiceError, credentials } from '@grpc/grpc-js';
import { HolisticServiceClient, HolisticRequest, HolisticResponse } from './protos/holistic';

// import fs from 'fs';

function main(): void {
    const app = express();
    const upload = multer();
    const client = new HolisticServiceClient('localhost:8080', credentials.createInsecure());
    // modules
    const browserEnv = new BrowserEnv();
    browserEnv.init();

    //service
    const mpSvc = new MediaPipeService();
    app.get('/grpc', (_req: Request, res: Response) => {
        const holisticRequest: HolisticRequest = {
            request: [
                {
                    index: 1,
                    data: 'hi',
                },
            ],
        };

        client.getHolistics(holisticRequest, (_err: ServiceError | null, response: HolisticResponse) => {
            console.log(JSON.stringify(response));
            res.send(JSON.stringify(response));
        });
    });
    //handler
    app.get('/mediapipe/holistic', upload.single('file'), async (req: Request, res: Response) => {
        try {
            const file = req.file;

            if (!file?.buffer) {
                return res.status(400).send({ message: '파일 에러', result: [] });
            }

            const isVideo = file.mimetype.includes('video');
            const bufferMap = new Map<number, Buffer>();

            if (isVideo) {
                const ffStream = new FfmpegStream(24);

                // FFmpeg 데이터 입력
                ffStream.Input(file.buffer);

                let isFirst = true;
                let index = 1;
                let tmpBuffer = Buffer.allocUnsafe(0);
                // FFmpeg 데이터 출력
                await ffStream.Output((chunk) => {
                    // jpg 파일 분리 (메모리 때문에 내버려둠)
                    if (chunk.length > 3 && chunk[0] === 255 && chunk[1] === 216 && chunk[2] === 255 && !isFirst) {
                        bufferMap.set(index, tmpBuffer);
                        tmpBuffer = Buffer.from(chunk);
                        index++;
                        return;
                    }

                    tmpBuffer = Buffer.from([...tmpBuffer, ...chunk]);

                    if (index === 1) {
                        isFirst = false;
                    }
                });

                const threadCount = 8;
                const min = 1;
                const threads = new Set<Worker>();
                const max = bufferMap.size;
                const range = Math.ceil((max - min) / threadCount);

                let start = min;

                for (let i = 0; i < threadCount - 1; i++) {
                    const wStart = start;

                    threads.add(
                        new Worker('./src/tt.js', {
                            workerData: { start: wStart, range: range, svc: mpSvc, data: bufferMap },
                        })
                    );
                    start += range;
                }
                threads.add(
                    new Worker('./src/tt.js', {
                        workerData: {
                            start: start,
                            range: range + ((max - min + 1) % threadCount),
                            svc: mpSvc,
                            data: bufferMap,
                        },
                    })
                );

                // 워커들 이벤트 등록
                for (const worker of threads) {
                    worker.on('error', (err) => {
                        throw err;
                    });

                    worker.on('exit', () => {
                        threads.delete(worker);

                        if (threads.size === 0) {
                            console.timeEnd('prime2');
                        }
                    });

                    // 워커들이 일한 결과를 메시지 받아서 정리해주는 동작도 직접 구현
                    worker.on('message', (msg: IHolistic[]) => {
                        console.log(msg);
                    });
                }
            }

            const response = await mpSvc.getHolistics(bufferMap);
            res.send({ message: '', result: response });
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: '일시적인 에러가 발생했습니다' });
        }
    });

    app.listen(4000);
}

main();
