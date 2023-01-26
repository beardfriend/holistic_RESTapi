import dotenv from 'dotenv';
import { getOsEnv } from '../modules/utils/env';
dotenv.config();
const config = {
    AWS: {
        S3: {
            Access: getOsEnv('AWS_ACCESS_KEY'),
            Secret: getOsEnv('AWS_SECRET_KEY'),
            Region: getOsEnv('AWS_S3_REGION'),
            Bucket: getOsEnv('AWS_S3_BUCKET'),
            EndPoint: getOsEnv('AWS_S3_ENDPOINT'),
        },
    },
};

export default config;
