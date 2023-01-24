// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import jsdom from 'jsdom';

class BrowserEnv {
    private dom: jsdom.JSDOM;

    constructor() {
        const { JSDOM } = jsdom;
        this.dom = new JSDOM();
    }

    init(): void {
        const window = this.dom.window;
        global.window = this.dom.window;
        const navigator = window.navigator;
        global.navigator = navigator;
        global.document = window.document;
    }
}

export default BrowserEnv;
