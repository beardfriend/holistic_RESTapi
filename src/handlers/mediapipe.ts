/* eslint-disable */

import { NextFunction, Request, Response } from 'express';
import { HolisticResponse } from '../protos/holistic';
import gRPCService from '../services/grpc';

export default class MediapipeHandler {
    private grpcModule;

    /**
     * @openapi
     * tags:
     *   name: Mediapipe
     *   description: 미디어 파이프에서 제공하는 모델에 맞게 데이터를 가공하는 도메인
     */
    constructor(gpc: gRPCService) {
        this.grpcModule = gpc;
    }

    /**
     * @openapi
     * paths:
     *   /api/mediapipe/holistic:
     *     get:
     *       summary: "홀리스틱 모델에 맞게 가공하는 도메인"
     *       description: "얼굴, 포즈, 동작을 감지하여 이미지의 위치 좌표를 제공"
     *       tags: [Mediapipe]
     *       requestBody:
     *         description: 이미지 or 비디오 (2MB이하)
     *         required: true
     *         content:
     *           multipart/form-data:
     *             schema:
     *               type: object
     *               properties:
     *                 file:
     *                   type: string
     *                   format: binary
     *             encoding:
     *               file:
     *                 contentType: image/png, image/jpeg
     *       responses:
     *        '400':
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/responses/NotFound'
     *              examples:
     *                RequiredFile:
     *                  value:
     *                    code: 5000
     *                    message: 파일을 입력해주세요
     *                    result: []
     *
     *                SmallerFile:
     *                  value:
     *                    code: 5001
     *                    message: 파일 용량이 너무 큽니다
     *                    result: []
     *                FileType:
     *                  value:
     *                    code: 5002
     *                    message: 파일 형식을 확인해주세요
     *                    result: []
     *        '200':
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/responses/OK'
     *              examples:
     *                jsonObject:
     *                  summary: A sample object
     *                  externalValue: 'https://gglabs.s3.ap-northeast-2.amazonaws.com/examples/holistics_sample.json'
     *
     *
     */
    async getHolistic(req: Request, res: Response, next: NextFunction) {
        console.log(req.headers, req);
        try {
            const file = req.file;

            if (!file) {
                return res.status(400).send({ code: 5000, message: '파일을 입력해주세요', result: [] });
            }

            if (file.size > 2000000) {
                return res.status(400).send({ code: 5001, message: '파일 용량이 너무 큽니다', result: [] });
            }

            const isVideo = file.mimetype.includes('video');
            const isImage = file.mimetype.includes('image');

            if (!isVideo && !isImage) {
                return res.status(400).send({ code: 5002, message: '파일 형식을 확인해주세요', result: [] });
            }

            let response: HolisticResponse = { result: [] };

            if (isVideo) {
                const result = await this.grpcModule.getHolisticFromVideo(file.buffer);
                console.log(result);
                result.forEach((d) => {
                    response.result = [...response?.result, ...d?.result];
                });
            } else {
                const result = await this.grpcModule.getHolisticFromImage(file.buffer);
                response.result = result.result;
            }

            res.send({ code: 200, message: '', result: response.result });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}
