import * as hr from './hr/schema';
import * as lib from './lib/schema';
import * as publicSchema from './public/schema';

const schema = {
  ...hr,
  ...lib,
  ...publicSchema,
};

export type Schema = typeof schema;

export default schema;
