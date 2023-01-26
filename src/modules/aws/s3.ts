import { ListObjectsCommandOutput, PutObjectCommandOutput, S3 as s3 } from '@aws-sdk/client-s3';
import config from '../../config/config';

export default class S3 {
    private module: s3;
    private bucketName: string;

    constructor() {
        this.module = new s3({
            region: config.AWS.S3.Region,
            credentials: {
                accessKeyId: config.AWS.S3.Access,
                secretAccessKey: config.AWS.S3.Secret,
            },
        });

        this.bucketName = config.AWS.S3.Bucket;
    }

    async Put(key: string, body: Buffer): Promise<PutObjectCommandOutput> {
        return await this.module.putObject({
            Key: key,
            Body: body,
            Bucket: this.bucketName,
        });
    }

    async GetObjects(directoryName: string): Promise<ListObjectsCommandOutput> {
        return await this.module.listObjectsV2({
            Bucket: this.bucketName,
            StartAfter: directoryName,
            MaxKeys: 10000,
        });
    }
}
