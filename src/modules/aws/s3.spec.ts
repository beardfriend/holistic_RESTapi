/* eslint-disable @typescript-eslint/no-var-requires */
import S3 from './s3';
import fs from 'fs';

describe('s3', () => {
    it('put Object', async () => {
        const s3 = new S3();
        const buffer = fs.readFileSync('./ss.jpeg');
        await s3.Put('random/image.jpeg', buffer);
    });

    it('get Objects', async () => {
        const s3 = new S3();
        const res = await s3.GetObjects('random');
        console.log(res);
    });
});
