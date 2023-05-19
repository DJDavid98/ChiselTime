import { clientEnv } from '../client-env';

export const publicAssetPath = (path: string, absolute = false) =>
  `${absolute ? clientEnv.PUBLIC_HOST : ''}/static${path}`;
