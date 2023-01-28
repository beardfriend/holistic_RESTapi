import { credentials, ServiceError } from '@grpc/grpc-js';

import { HolisticRequest, HolisticResponse, HolisticServiceClient } from '../../protos/holistic';

export default class grpcHolistic {
    client: HolisticServiceClient;

    constructor(address: string) {
        this.client = new HolisticServiceClient(address, credentials.createInsecure(), {
            'grpc.max_receive_message_length': 1000000000000000,
            'grpc.max_send_message_length': 1000000000000000,
        });
    }

    async get(req: HolisticRequest): Promise<HolisticResponse> {
        return new Promise((resolve, reject) => {
            this.client.getHolistics(req, (err: ServiceError | null, res: HolisticResponse) => {
                resolve(res);
                reject(err);
                return res;
            });
        });
    }
}
