import BrowserEnv from './browserEnv';
import holi from '@mediapipe/holistic';

describe('browser enviroment on node.js', () => {
    it('mediapipe not run', async () => {
        try {
            new holi.Holistic({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
                },
            });
        } catch (error) {
            expect(error).not.toBeNull();
        }
    });

    it('mediapipe can run', async () => {
        try {
            const benv = new BrowserEnv();
            benv.init();
            const holistic = new holi.Holistic({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
                },
            });
            expect(holistic).not.toBeNull();
        } catch (error) {
            expect(error).toBeNull();
        }
    });
});
