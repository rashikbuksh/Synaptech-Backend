import hr from './hr';
import lib from './lib';
import other from './other';
import publicSchema from './public';
import report from './report';

const routes = [
  ...hr,
  ...lib,
  ...other,
  ...report,
  ...publicSchema,
] as const;

export default routes;
