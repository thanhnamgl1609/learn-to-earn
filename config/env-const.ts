import _ENV_CONST from './env-const.json';

const env = process.env.NODE_ENV || 'development';

type IEnvConst = typeof _ENV_CONST;

export const ENV_CONST: IEnvConst[keyof IEnvConst] = _ENV_CONST[env];
