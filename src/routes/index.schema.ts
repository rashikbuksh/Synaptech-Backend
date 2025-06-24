import * as hr from './hr/schema';
import * as lib from './lib/schema';

const schema = {
  ...hr,
  ...lib,
};

export type Schema = typeof schema;

export default schema;
