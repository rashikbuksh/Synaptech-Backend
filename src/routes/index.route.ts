import hr from './hr';
import lib from './lib';
import other from './other';
import report from './report';

const routes = [
  ...hr,
  ...lib,
  ...other,
  ...report,
] as const;

export default routes;
