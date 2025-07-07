import hr from './hr';
import lib from './lib';
import other from './other';

const routes = [
  ...hr,
  ...lib,
  ...other,
] as const;

export default routes;
