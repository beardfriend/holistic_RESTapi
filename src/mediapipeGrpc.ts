import { HealthRequest, HealthResponse, HealthServiceService } from './protos/health';
import { sendUnaryData, Server, ServerCredentials, ServerUnaryCall } from '@grpc/grpc-js';
import { MDPIPE_SERVER_PORT_LIST } from './constants/constant';
import { HolisticRequest, HolisticResponse, HolisticServiceService } from './protos/holistic';
import MediaPipeService from './services/mediapipe';
import { getNumGroupsEqaulQuantity } from './modules/utils/calculate';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

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
const mpSvc2 = new MediaPipeService();
const mpSvc3 = new MediaPipeService();
const mpSvcList = [mpSvc, mpSvc2, mpSvc3];

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
    let messageCount = 3;
    let thread = 0;
    if (isMainThread) {
        console.log('s');
        const ImagesBufferMap = new Map<number, Buffer>();
        const job = 3;

        call.request.request.forEach((d) => {
            ImagesBufferMap.set(d.index, Buffer.from(d.data, 'base64'));
        });
        const nums = getNumGroupsEqaulQuantity(ImagesBufferMap.size, job);

        const finalResponse: HolisticResponse = {
            result: [],
        };

        for (const data of nums) {
            const nmap = new Map<number, Buffer>();
            for (const j of data) {
                const already = ImagesBufferMap.get(j);
                if (already) nmap.set(j, already);
            }
            const worker = new Worker(__filename, { workerData: { namp: nmap } });
            console.log(nmap);
            worker.on('error', (err) => {
                console.log(err);
            });
            worker.on('exit', () => {
                if (messageCount === 0) {
                    send(null, finalResponse as HolisticResponse);
                }
            });

            worker.on('message', (msg) => {
                finalResponse.result.push(msg);
            });
        }
    } else {
        const response: HolisticResponse = {
            result: [],
        };
        console.log(workerData);
        mpSvcList[thread].getHolistics(workerData.nmap as Map<number, Buffer>).then((v) => {
            response.result = v;
            parentPort?.postMessage(response.result);
            messageCount = messageCount - 1;
        });
        console.log(thread);
        thread++;
    }
}
