import ENV_CONST from './env-const.json';

const env = process.env.NODE_ENV || 'development';

const CONST = ENV_CONST[env];

export default CONST;
