import FfmpegStream from './ffmpegStream';
import fs from 'fs';

describe('ffmpeg 모듈', () => {
    test('video to image', async () => {
        const fmpg = new FfmpegStream(24);
        const videoBuffer = fs.readFileSync('./__test__/datas/free.mp4');

        let empty = Buffer.alloc(0);
        expect(empty.length).toBe(0);

        fmpg.Input(videoBuffer);
        // 비디오를 이미지로 변환
        await fmpg.Output(async (chunk) => {
            empty = Buffer.from([...empty, ...chunk]);
        });

        // 버퍼가 변경되면서 값이 바뀜
        expect(empty[0] === videoBuffer[0]).toBe(false);

        expect(empty.length).toBeGreaterThan(videoBuffer.length);
    });
});
