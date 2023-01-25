import { Face, Pose, Hands } from './index';

import '@tensorflow/tfjs-core';
import * as tfnode from '@tensorflow/tfjs-node';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/face_mesh';

import fs from 'fs';

describe('run mediapipe', () => {
    it('face_module', async () => {
        try {
            // set tensor
            tfnode.setBackend('tensorflow');
            const file = fs.readFileSync('./yoga.jpg');
            const tensor = (await tfnode.node.decodeImage(file)) as tfnode.Tensor3D;

            // faceModule
            tfnode.setBackend('cpu');
            const faceMD = new Face();
            await faceMD.init();
            const faceResult = await faceMD.get(tensor as tfnode.Tensor3D);

            // 검증
            expect(faceResult.data[0].keypoints.length).toBeGreaterThan(1);
        } catch (error) {
            expect(error).toBeNull();
        }
    });

    it('pose_module', async () => {
        try {
            // set tensor
            tfnode.setBackend('tensorflow');
            const file = fs.readFileSync('./yoga.jpg');
            const tensor = (await tfnode.node.decodeImage(file)) as tfnode.Tensor3D;

            // poseModule
            tfnode.setBackend('cpu');
            const postMD = new Pose();
            await postMD.init();
            const postResult = await postMD.get(tensor as tfnode.Tensor3D);
            // 검증
            expect(postResult.data[0].keypoints.length).toBeGreaterThan(1);
        } catch (error) {
            expect(error).toBeNull();
        }
    });

    it('hands_module', async () => {
        try {
            // set tensor
            tfnode.setBackend('tensorflow');
            const file = fs.readFileSync('./yoga.jpg');
            const tensor = (await tfnode.node.decodeImage(file)) as tfnode.Tensor3D;

            // handsModule
            tfnode.setBackend('cpu');
            const handsMD = new Hands();
            await handsMD.init();
            const handsResult = await handsMD.get(tensor as tfnode.Tensor3D);
            // 검증
            console.log(handsResult.data);
            expect(handsResult.data[0].keypoints.length).toBeGreaterThan(1);
        } catch (error) {
            expect(error).toBeNull();
        }
    });
});
