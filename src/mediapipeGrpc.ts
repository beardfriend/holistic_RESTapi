import { HealthRequest, HealthResponse, HealthServiceService } from './protos/health';
import { sendUnaryData, Server, ServerCredentials, ServerUnaryCall } from '@grpc/grpc-js';
import { MDPIPE_SERVER_PORT_LIST } from './constants/constant';
import { HolisticRequest, HolisticResponse, HolisticServiceService } from './protos/holistic';
import MediaPipeService from './services/mediapipe';

const ipaddr = 'localhost';
const portList = MDPIPE_SERVER_PORT_LIST;

if (!process.env.HOLI_COUNT) {
    throw new Error('0~2를 입력하세요');
}

const port = portList[Number(process.env.HOLI_COUNT)];

const server = new Server({
    'grpc.max_send_message_length': 1000000000000,
    'grpc.max_receive_message_length': 1000000000000,
});
const mpSvc = new MediaPipeService();

server.addService(HolisticServiceService, { getHolistics: getHolistics });
server.addService(HealthServiceService, { getHealth: helathCheck });
server.bindAsync(`${ipaddr}:${port}`, ServerCredentials.createInsecure(), () => {
    console.log(`Listening on ${ipaddr}:${port}`);
    server.start();
});

function helathCheck(_call: ServerUnaryCall<HealthRequest, HealthResponse>, send: sendUnaryData<HealthResponse>) {
    const res: HealthResponse = {
        health: 1,
    };
    console.log('health');
    send(null, res);
}

function getHolistics(call: ServerUnaryCall<HolisticRequest, HolisticResponse>, send: sendUnaryData<HolisticResponse>) {
    const ImagesBufferMap = new Map<number, Buffer>();

    call.request.request.forEach((d) => {
        ImagesBufferMap.set(d.index, Buffer.from(d.data, 'base64'));
    });

    const response: HolisticResponse = {
        result: [],
    };
    mpSvc.getHolistics(ImagesBufferMap).then((v) => {
        response.result = v;
        send(null, response);
    });
}
