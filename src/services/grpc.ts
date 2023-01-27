import { HolisticRequest, HolisticResponse } from '../protos/holistic';

class grpcService {
    private processCount: number;

    public request: {
        holistic: HolisticRequest;
    };

    public response: {
        holistic: HolisticResponse;
    };

    sendImagesToHolisiticProcessor() {}

    getHolisitics() {}

    private prepareRawData() {}
}
