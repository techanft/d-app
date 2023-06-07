import { checkIsLocalhost } from "./casual-helpers";

export enum EnvEnum {
    DEV = 'development',
    PROD = 'production',
    LOCAL = 'local',
}

const devHost = 'dapp-dev.anfteco.io';
const prodHost = 'app.anfteco.vn';

const envDetect = (): EnvEnum  => {
    const hostname = window.location.hostname;
    console.log('hostname', hostname);
    if (checkIsLocalhost()) {
        return EnvEnum.LOCAL;
    } else if (hostname === devHost) {
        return EnvEnum.DEV;
    } else if (hostname === prodHost) {
        return EnvEnum.PROD;
    }
    return EnvEnum.DEV;
}

export const _env = envDetect()