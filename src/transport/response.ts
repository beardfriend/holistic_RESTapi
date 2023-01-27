export default interface IHolistic {
    index: number;
    faceLandmarks: IVector[];
    leftHandLandmarks: IVector[];
    poseLandmarks: IVector[];
    rightHandLandmark: IVector[];
}

export interface IVector {
    x: number;
    y: number;
    z?: number | undefined;
    visibility?: number | undefined;
}
