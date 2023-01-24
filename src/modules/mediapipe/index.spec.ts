import Face from './face';

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
            const file = fs.readFileSync('./ss.jpeg');
            const tensor = (await tfnode.node.decodeImage(file)) as tfnode.Tensor3D;

            // faceModule
            tfnode.setBackend('cpu');
            const faceMD = new Face();
            await faceMD.init();
            const faceResult = await faceMD.get(tensor as tfnode.Tensor3D);

            // 검증
            expect(faceResult[0].keypoints.length).toBeGreaterThan(1);
        } catch (error) {
            expect(error).toBeNull();
        }
    });
});
