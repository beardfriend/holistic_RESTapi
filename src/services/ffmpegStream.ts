class FFmpegService {
    private index: number;
    private tmpBuffer: Buffer;
    private isFirst: boolean;

    init() {
        this.index = 1;
        this.tmpBuffer = Buffer.allocUnsafe(0);
        this.isFirst = true;
    }

    SetJpgBuffer(result: Map<number, Buffer>, chunk: Buffer) {
        if (chunk.length > 3 && chunk[0] === 255 && chunk[1] === 216 && chunk[2] === 255 && !this.isFirst) {
            result.set(this.index, this.tmpBuffer);
            this.tmpBuffer = Buffer.from(chunk);
            this.index++;
            return;
        }
        this.tmpBuffer = Buffer.from([...this.tmpBuffer, ...chunk]);

        if (this.index === 1) {
            this.isFirst = false;
        }
    }
}

export default FFmpegService;
