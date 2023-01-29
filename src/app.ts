import express from 'express';
import multer from 'multer';
import { credentials } from '@grpc/grpc-js';
import { MDPIPE_SERVER_PORT_LIST } from './constants/constant';
import { HealthServiceClient } from './protos/health';
import BrowserEnv from './modules/browser/browserEnv';
import { specs, swaggerUi } from './modules/swagger/swagger';
import grpcHolistic from './modules/grpc/holistic';
import gRPCService from './services/grpc';
import MediapipeHandler from './handlers/mediapipe';
import { errorHandler } from './handlers/middleware';

function main() {
    // express
    const app = express();
    const upload = multer();

    // browser Env
    const browserEnv = new BrowserEnv();
    browserEnv.init();

    // gRPCs connect
    const healthClients: HealthServiceClient[] = [];
    const holisticClient = new Map<number, grpcHolistic>();

    MDPIPE_SERVER_PORT_LIST.forEach((d, i) => {
        healthClients.push(new HealthServiceClient(`localhost:${d}`, credentials.createInsecure()));
        holisticClient.set(i + 1, new grpcHolistic(`localhost:${d}`));
    });

    // holistic Service
    const gRPCSvc = new gRPCService(healthClients, holisticClient);
    gRPCSvc.gRPCHealthCheck();

    //handler
    const mediapipeHandler = new MediapipeHandler(gRPCSvc);

    const mediapipeRouter = express.Router();

    mediapipeRouter.get(
        '/mediapipe/holistic',
        upload.single('file'),
        mediapipeHandler.getHolistic.bind(mediapipeHandler)
    );
    app.use('/api', mediapipeRouter);
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

    app.use(errorHandler);

    app.listen(4000);
    console.log(`listening on 4000`);
}

main();
