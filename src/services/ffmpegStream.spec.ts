import FfmpegStream from '../modules/ffmpeg/ffmpegStream';
import fs from 'fs';
import FFmpegService from './ffmpegStream';
describe('이미지 자르는 서비스', () => {
    test('자르기 테스트', async () => {
        //이미지 버퍼
        const fmpg = new FfmpegStream(24);
        const videoBuffer = fs.readFileSync('./__test__/datas/free.mp4');

        fmpg.Input(videoBuffer);
        const ffmpegSvc = new FFmpegService();
        ffmpegSvc.init();
        const result = new Map<number, Buffer>();

        await fmpg.Output(async (chunk) => {
            ffmpegSvc.cutJpegfromBuffer(result, chunk);
        });

        // nodejs buffer는 16진수를 담는다.
        // jpg는 ff d8 ff로 시작
        for (let i = 0; i < result?.size; i++) {
            const buf = result.get(i);

            if (buf !== undefined) {
                if (i === 1) {
                    console.log(buf[0].toString(16), buf[1].toString(16), buf[2].toString(16));
                }

                expect(buf[0].toString(16)).toEqual('ff');
                expect(buf[1].toString(16)).toEqual('d8');
                expect(buf[0].toString(16)).toEqual('ff');
            }
        }
    });
});
