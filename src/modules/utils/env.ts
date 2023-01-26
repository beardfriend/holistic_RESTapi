export function getOsEnv(key: string): string {
    if (typeof process.env[key] === 'undefined') {
        throw new Error(`Environment variable ${key} is not set.`);
    }

    return process.env[key] as string;
}

export function toBool(value: string): boolean {
    return value === 'true';
}

export function toNumber(value: string): number {
    return parseInt(value, 10);
}
