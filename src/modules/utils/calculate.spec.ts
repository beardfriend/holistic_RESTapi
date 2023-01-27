import { getNumGroupsEqaulQuantity } from './calculate';

describe('calculate', () => {
    test('getNumGroupsEqaulQuantity', () => {
        const num = getNumGroupsEqaulQuantity(100, 7);

        expect(num.length).toBe(7);
        expect(num[0][0]).toBe(1);
        expect(num[0][13]).toBe(14);
        expect(num[6][15]).toBe(100);
    });
});
