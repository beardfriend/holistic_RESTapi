import { Readable } from 'stream';
import streamifier from 'streamifier';
import cp from 'child_process';

class FfmpegStream {
    // 인풋 파이프
    private inputPipe: Readable;
    // 메인 로직 실행
    private mainHouse: cp.ChildProcessWithoutNullStreams;

    constructor(frame: number) {
        const option = ['-i', '-', '-r', String(frame), '-f', 'image2pipe', '-'];
        this.mainHouse = cp.spawn('ffmpeg', option);
    }

    Input(buffer: Buffer) {
        this.inputPipe = streamifier.createReadStream(buffer);
        this.inputPipe.pipe(this.mainHouse.stdin);
    }

    async Output(callback: (chunk: Buffer) => Promise<void>): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.mainHouse.stdout.on('data', async (data: Buffer) => {
                await callback(data);
            });

            this.mainHouse.stdout.on('end', () => {
                resolve(true);
            });

            this.mainHouse.stdout.on('error', (err) => {
                console.log(err);
                reject(err);
            });
        });
    }
}

export default FfmpegStream;
