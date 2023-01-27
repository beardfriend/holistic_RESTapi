// 1 ~ total 숫자를 groupCount개수만큼 그룹을 나눔
export function getNumGroupsEqaulQuantity(total: number, groupCount: number): number[][] {
    const result = [];

    let min = 1;
    const max = total;
    const range = Math.floor(max / groupCount);
    for (let i = 1; i <= groupCount; i++) {
        const start = min; // 1
        let end = start + range - 1;

        if (i == groupCount) {
            end = total;
        }

        let tmp = [];
        for (let j = start; j <= end; j++) {
            tmp.push(j);
        }
        min = start + range;
        result.push(tmp);
        tmp = [];
    }
    return result;
}
