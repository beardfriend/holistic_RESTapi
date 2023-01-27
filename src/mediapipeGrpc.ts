import { Server, ServerCredentials, sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { HolisticServiceService, HolisticRequest, HolisticResponse, Data } from './protos/holistic';

const server = new Server();

server.addService(HolisticServiceService, { getHolistics: getHolistics }); // login 은 이후에 정의할 예정입니다.
server.bindAsync('localhost:8080', ServerCredentials.createInsecure(), () => {
    server.start();
});

function getHolistics(call: ServerUnaryCall<HolisticRequest, HolisticResponse>, send: sendUnaryData<HolisticResponse>) {
    const holire: HolisticResponse = {
        response: [],
    };
    console.log(call.request.request);
    const res: Data[] = [];

    res.push({
        index: call.request.request[0].index,
        data: call.request.request[0].data,
    });
    res.push({
        index: 2,
        data: 'do',
    });
    holire.response = res;
    send(null, holire);
}
