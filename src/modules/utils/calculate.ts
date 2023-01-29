export function isPNG(buf: Buffer): boolean {
    if (
        buf.length > 8 &&
        buf[0] === 137 &&
        buf[1] === 80 &&
        buf[2] === 78 &&
        buf[3] === 71 &&
        buf[4] === 13 &&
        buf[5] === 10 &&
        buf[6] === 26 &&
        buf[7] === 10
    ) {
        return true;
    }
    return false;
}

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

export function getNumGroupsEqaulQuantityByStartNum(startNum: number, lastNum: number, groupCount: number): number[][] {
    const result = [];

    let min = startNum;
    const max = lastNum;
    const range = Math.floor((max - min) / groupCount);
    for (let i = 1; i <= groupCount; i++) {
        const start = min;
        let end = start + range - 1;

        if (i == groupCount) {
            end = lastNum;
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
