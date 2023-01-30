import { MDPIPE_SERVER_PORT_LIST } from '../constants/constant';
import FfmpegStream from '../modules/ffmpeg/ffmpegStream';
import grpcHolistic from '../modules/grpc/holistic';
import { getNumGroupsEqaulQuantity } from '../modules/utils/calculate';
import { HealthRequest, HealthServiceClient } from '../protos/health';
import { HolisticRequest, HolisticResponse } from '../protos/holistic';
import FFmpegService from './ffmpegStream';

export default class gRPCService {
    private ffmpegServiceModule: FFmpegService;
    private holisticClient: Map<number, grpcHolistic>;
    private healthClient: HealthServiceClient[];
    private frameOrderWithImageBufferMap: Map<number, Buffer>;

    constructor(healthClient: HealthServiceClient[], holisticClient: Map<number, grpcHolistic>) {
        this.holisticClient = holisticClient;
        this.healthClient = healthClient;
        this.ffmpegServiceModule = new FFmpegService();
    }

    gRPCHealthCheck() {
        this.healthClient.forEach((d) => {
            const req: HealthRequest = { health: 1 };
            d.getHealth(req, (_err, response) => {
                if (response?.health !== 1) {
                    throw new Error('gRPC를 연결해주세요.');
                }
            });
        });
        console.log(`-----${MDPIPE_SERVER_PORT_LIST.length} gRPCs conneceted------`);
    }

    getHolisticFromVideo(file: Buffer): Promise<HolisticResponse[]> {
        return new Promise((resolve, reject) => {
            this.frameOrderWithImageBufferMap = new Map<number, Buffer>();

            // ffmpeg 실행
            const streamInOutMoudule = new FfmpegStream(24);
            streamInOutMoudule.Input(file);
            this.ffmpegServiceModule.init();

            // ffmpeg에서 나온 결과물 처리
            streamInOutMoudule
                .Output(async (chunk) => {
                    this.ffmpegServiceModule.cutJpegfromBuffer(this.frameOrderWithImageBufferMap, chunk);
                })
                .then(() => {
                    // 병렬처리
                    const nums = getNumGroupsEqaulQuantity(
                        this.frameOrderWithImageBufferMap.size,
                        MDPIPE_SERVER_PORT_LIST.length
                    );

                    const arr = [];
                    for (const [i, client] of this.holisticClient) {
                        const holisticRequest: HolisticRequest = { request: [] };

                        for (const j of nums[i - 1]) {
                            const buf = this.frameOrderWithImageBufferMap.get(j);
                            if (buf) {
                                holisticRequest.request.push({ index: j, data: Buffer.from(buf).toString('base64') });
                            }
                        }
                        arr.push(client.get(holisticRequest));
                    }
                    // 결과물 다 받으면 리턴
                    resolve(Promise.all(arr));
                })
                .catch((err) => reject(err));
        });
    }

    async getHolisticFromImage(file: Buffer): Promise<HolisticResponse> {
        try {
            const holisticRequest: HolisticRequest = { request: [] };

            const randInt = Math.floor(Math.random() * MDPIPE_SERVER_PORT_LIST.length) + 1;
            holisticRequest.request.push({ index: 1, data: Buffer.from(file.buffer).toString('base64') });

            const res = this.holisticClient.get(randInt)?.get(holisticRequest);
            if (!res) {
                const emptyRes: HolisticResponse = { result: [] };
                return emptyRes;
            }

            return res;
        } catch (err: any) {
            throw new Error(err);
        }
    }
}
