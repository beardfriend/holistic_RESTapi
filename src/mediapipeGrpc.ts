import { HealthRequest, HealthResponse, HealthServiceService } from './protos/health';
import { sendUnaryData, Server, ServerCredentials, ServerUnaryCall } from '@grpc/grpc-js';
import { MDPIPE_SERVER_PORT_LIST } from './constants/constant';
import { HolisticRequest, HolisticResponse, HolisticServiceService } from './protos/holistic';
import MediaPipeService from './services/mediapipe';
import { getNumGroupsEqaulQuantityByStartNum } from './modules/utils/calculate';
import { Tensor3D } from '@tensorflow/tfjs-node';

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
const mpSvc4 = new MediaPipeService();
const mpSvc5 = new MediaPipeService();

const list = [mpSvc2, mpSvc3, mpSvc4, mpSvc5];

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

async function getHolistics(
    call: ServerUnaryCall<HolisticRequest, HolisticResponse>,
    send: sendUnaryData<HolisticResponse>
) {
    const count = 4;
    const ImagesBufferMap = new Map<number, Buffer>();
    const startNum = call.request.request[0].index;
    let lastNum;
    call.request.request.forEach((d) => {
        ImagesBufferMap.set(d.index, Buffer.from(d.data, 'base64'));
        lastNum = d.index;
    });

    if (!lastNum) {
        return;
    }
    const nums = getNumGroupsEqaulQuantityByStartNum(startNum, lastNum, count);
    // let job = 0;
    const arr: Map<number, Tensor3D>[] = [];
    for (const data of nums) {
        const nmap = new Map<number, Buffer>();
        for (const j of data) {
            const already = ImagesBufferMap.get(j);
            if (already) nmap.set(j, already);
        }

        const tensor = await mpSvc.bufferToTensor3D(nmap);
        arr.push(tensor);
    }
    await mpSvc.setBackend('wasm');
    let i = 0;
    const asf: any[] = [];
    for (const tensor of arr) {
        list[i].getHolisticData(tensor).then((res: any) => {
            asf.push(res);
        });

        i++;
    }
    const finalResponse: HolisticResponse = {
        result: [],
    };
    let newCount = count;
    const interval = setInterval(() => {
        console.log('dd');
        if (asf.length > 1 && newCount !== 0) {
            asf.forEach((d) => {
                finalResponse.result = [...finalResponse.result, ...mpSvc.dataProcessing(d)];
            });
            newCount--;
        }

        if (finalResponse.result.length === ImagesBufferMap.size) {
            send(null, finalResponse);
            clearInterval(interval);
        }
    }, 1);
}
