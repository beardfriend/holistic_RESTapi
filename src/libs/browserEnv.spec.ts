import BrowserEnv from './browserEnv';
import holi from '@mediapipe/holistic';

describe('browser enviroment on node.js', () => {
    it('mediapipe can run', () => {
        try {
            const benv = new BrowserEnv();
            benv.init();
            const holistic = new holi.Holistic({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
                },
            });
            console.log(holistic);
        } catch (error) {
            expect(error).toBeNull();
        }
    });
});
