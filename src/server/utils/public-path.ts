import { serverEnv } from '../server-env';

export const publicPath = (path: string) => `${serverEnv.PUBLIC_HOST}${path}`;
