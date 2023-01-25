export default interface IHolistic {
    faceLandmarks: IVector[];
    leftHandLandmarks: IVector[];
    poseLandmarks: IVector[];
    rightHandLandmark: IVector[];
}

interface IVector {
    x: number;
    y: number;
    z?: number;
    visibility?: number;
}
