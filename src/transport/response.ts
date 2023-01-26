export default interface IHolistic {
    index: number;
    faceLandmarks: IVector[];
    leftHandLandmarks: IVector[];
    poseLandmarks: IVector[];
    rightHandLandmark: IVector[];
}

interface IVector {
    x: number;
    y: number;
    z: number | null;
    visibility: number | null;
}
