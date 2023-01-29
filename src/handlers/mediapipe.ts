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
     *   description: 미디어 파이프에서 제공하는 모델에 맞게 데이터를 가져오는 도메인
     */
    constructor(gpc: gRPCService) {
        this.grpcModule = gpc;
    }

    /**
     * @openapi
     * paths:
     *   /api/mediapipe/holistic:
     *     post:
     *       summary: "홀리스틱 모델의 데이터를 가져오는 API"
     *       description: "얼굴, 포즈, 동작을 감지하여 이미지의 위치 좌표를 제공 (Swagger Try it out을 정상적으로 사용하기 위해 메서드 POST 사용)"
     *       tags: [Mediapipe]
     *       requestBody:
     *         description: 이미지(jpg) or 비디오(mp4) (2MB이하)
     *         content:
     *           multipart/form-data:
     *             schema:
     *               type: object
     *               required:
     *                 - file
     *               properties:
     *                 file:
     *                   type: string
     *                   format: base64
     *             encoding:
     *               file:
     *                 contentType: image/png, image/jpeg
     *       responses:
     *        '400':
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/Common'
     *              examples:
     *                FileRequired:
     *                  value:
     *                    code: 5000
     *                    message: 파일을 입력해주세요
     *                    result: []
     *
     *                FileMaximum:
     *                  value:
     *                    code: 5001
     *                    message: 파일 용량을 확인해주세요
     *                    result: []
     *                FileType:
     *                  value:
     *                    code: 5002
     *                    message: 파일 타입을 확인해주세요
     *                    result: []
     *                FileExtension:
     *                  value:
     *                    code: 5003
     *                    message: 파일 확장자를 확인해주세요
     *                    result: []
     *        '200':
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/Holistics'
     *              examples:
     *                OK:
     *                  $ref: '#/components/examples/Holistics'
     *
     *
     */
    async getHolistic(req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file;

            if (!file) {
                return res.status(400).send({ code: 5000, message: '파일을 입력해주세요', result: [] });
            }

            if (file.size > 2000000) {
                return res.status(400).send({ code: 5001, message: '파일 용량을 확인해주세요', result: [] });
            }
            const splited = file.mimetype.split('/');
            const fileType = splited[0];
            const extension = splited[1];

            if (fileType !== 'image' && fileType !== 'video') {
                return res.status(400).send({ code: 5002, message: '파일 타입을 확인해주세요', result: [] });
            }

            if (extension !== 'jpg' && extension !== 'jpeg') {
                return res.status(400).send({ code: 5003, message: '파일 확장자를 확인해주세요', result: [] });
            }

            let response: HolisticResponse = { result: [] };

            if (fileType === 'video') {
                const result = await this.grpcModule.getHolisticFromVideo(file.buffer);
                console.log(result);
                result.forEach((d) => {
                    response.result = [...response?.result, ...d?.result];
                });
            }
            if (fileType === 'image') {
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
