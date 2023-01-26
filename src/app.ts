import express, { Request, Response } from 'express';
import multer from 'multer';

import BrowserEnv from './modules/browser/browserEnv';
import FfmpegStream from './modules/ffmpeg/ffmpegStream';
import MediaPipeService from './services/mediapipe';

// import fs from 'fs';

function main(): void {
    const app = express();
    const upload = multer();

    // modules
    const browserEnv = new BrowserEnv();
    browserEnv.init();

    //service
    const mpSvc = new MediaPipeService();

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
            } else {
                bufferMap.set(1, file.buffer);
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
