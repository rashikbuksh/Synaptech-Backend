import * as HSCode from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';

import { notFoundSchema } from '@/lib/constants';
import * as param from '@/lib/param';
import { createRoute, z } from '@hono/zod-openapi';

import { insertSchema, patchSchema, selectSchema } from './utils';

const tags = ['lib.product_serial'];

export const list = createRoute({
  path: '/lib/product-serial',
  method: 'get',
  tags,
  responses: {
    [HSCode.OK]: jsonContent(
      z.array(selectSchema),
      'The list of product serials',
    ),
  },
});

export const create = createRoute({
  path: '/lib/product-serial',
  method: 'post',
  request: {
    body: jsonContentRequired(
      z.union([insertSchema, z.array(insertSchema)]),
      'The product serial(s) to create (single object or array of objects)',
    ),
  },
  tags,
  responses: {
    [HSCode.OK]: jsonContent(
      z.union([selectSchema, z.array(selectSchema)]),
      'The created product serial(s)',
    ),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(z.union([insertSchema, z.array(insertSchema)])),
      'The validation error(s)',
    ),
  },
});

export const getOne = createRoute({
  path: '/lib/product-serial/{uuid}',
  method: 'get',
  request: {
    params: param.uuid,
  },
  tags,
  responses: {
    [HSCode.OK]: jsonContent(
      selectSchema,
      'The requested product serial',
    ),
    [HSCode.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Product serial not found',
    ),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(param.uuid),
      'Invalid id error',
    ),
  },
});

export const patch = createRoute({
  path: '/lib/product-serial/{uuid}',
  method: 'patch',
  request: {
    params: param.uuid,
    body: jsonContentRequired(
      z.union([patchSchema, z.array(patchSchema)]),
      'The product serial updates (single object or array of objects)',
    ),
  },
  tags,
  responses: {
    [HSCode.OK]: jsonContent(
      z.union([selectSchema, z.array(selectSchema)]),
      'The updated product serial(s)',
    ),
    [HSCode.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Product serial not found',
    ),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(z.union([patchSchema, z.array(patchSchema)]))
        .or(createErrorSchema(param.uuid)),
      'The validation error(s)',
    ),
  },
});
export const remove = createRoute({
  path: '/lib/product-serial/{uuid}',
  method: 'delete',
  request: {
    params: param.uuid,
  },
  tags,
  responses: {
    [HSCode.NO_CONTENT]: {
      description: 'Product serial deleted',
    },
    [HSCode.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Product serial not found',
    ),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(param.uuid),
      'Invalid id error',
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
