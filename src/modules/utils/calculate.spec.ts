import { getNumGroupsEqaulQuantity, getNumGroupsEqaulQuantityByStartNum, isPNG } from './calculate';
import fs from 'fs';

describe('calculate', () => {
    test('getNumGroupsEqaulQuantity', () => {
        const num = getNumGroupsEqaulQuantity(100, 7);

        expect(num.length).toBe(7);
        expect(num[0][0]).toBe(1);
        expect(num[0][13]).toBe(14);
        expect(num[6][15]).toBe(100);
    });

    // 100
    // 1 ~ 33 / 34 ~ 67 / 39 ~100

    // 첫번째 숫자 알지, 마지막 숫자 알지
    test('getNumGroupsEqaulQuantity2', () => {
        const num = getNumGroupsEqaulQuantityByStartNum(26, 50, 3);
        console.log(num);
    });
});

describe('pngCheck', () => {
    test('PNG파일', () => {
        const pngBuf = fs.readFileSync('./__test__/datas/mem.png');
        expect(isPNG(pngBuf)).toBe(true);
    });

    test('JPEG파일', () => {
        const pngBuf = fs.readFileSync('./__test__/datas/ss.jpeg');
        expect(isPNG(pngBuf)).toBe(false);
    });
});
