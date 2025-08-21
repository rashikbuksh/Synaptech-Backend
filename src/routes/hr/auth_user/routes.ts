import * as HSCode from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';

import { notFoundSchema, unauthorizedSchema } from '@/lib/constants';
import * as param from '@/lib/param';
import { createRoute, z } from '@hono/zod-openapi';

import { insertSchema, patchSchema, selectSchema, signinOutputSchema, signinSchema } from '../auth_user/utils';

const tags = ['hr.auth_user'];

export const list = createRoute({
  path: '/hr/auth-user',
  method: 'get',
  tags,
  responses: {
    [HSCode.OK]: jsonContent(
      z.array(selectSchema),
      'The list of user',
    ),
  },
});

export const create = createRoute({
  path: '/hr/auth-user',
  method: 'post',
  request: {
    body: jsonContentRequired(
      insertSchema,
      'The designation to create',
    ),
  },
  tags,
  responses: {
    [HSCode.OK]: jsonContent(
      selectSchema,
      'The created user',
    ),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertSchema),
      'The validation error(s)',
    ),
  },
});

export const getOne = createRoute({
  path: '/hr/auth-user/{uuid}',
  method: 'get',
  request: {
    params: param.uuid,
  },
  tags,
  responses: {
    [HSCode.OK]: jsonContent(
      selectSchema,
      'The requested user',
    ),
    [HSCode.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found',
    ),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(param.uuid),
      'Invalid id error',
    ),
  },
});

export const patch = createRoute({
  path: '/hr/auth-user/{uuid}',
  method: 'patch',
  request: {
    params: param.uuid,
    body: jsonContentRequired(
      patchSchema,
      'The user updates',
    ),
  },
  tags,
  responses: {
    [HSCode.OK]: jsonContent(
      selectSchema,
      'The updated user',
    ),
    [HSCode.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found',
    ),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchSchema)
        .or(createErrorSchema(param.uuid)),
      'The validation error(s)',
    ),
  },
});

export const remove = createRoute({
  path: '/hr/auth-user/{uuid}',
  method: 'delete',
  request: {
    params: param.uuid,
  },
  tags,
  responses: {
    [HSCode.NO_CONTENT]: {
      description: 'User deleted',
    },
    [HSCode.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found',
    ),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(param.uuid),
      'Invalid id error',
    ),
  },
});

export const signout = createRoute({
  path: '/signout/{uuid}',
  method: 'delete',
  request: {
    params: param.uuid,
  },
  tags,
  responses: {
    [HSCode.NO_CONTENT]: {
      description: 'User Signout',
    },
    [HSCode.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found',
    ),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(param.uuid),
      'Invalid id error',
    ),
  },
});

export const getCanAccess = createRoute({
  path: '/hr/users/can-access/{uuid}',
  method: 'get',
  tags,
  request: {
    params: param.uuid,
  },
  responses: {
    [HSCode.OK]: jsonContent(
      z.object({
        can_access: z.string(),
      }),
      'The valueLabel of user',
    ),
  },
});

export const patchCanAccess = createRoute({
  path: '/hr/users/can-access/{uuid}',
  method: 'patch',
  tags,
  request: {
    params: param.uuid,
  },
  responses: {
    [HSCode.OK]: jsonContent(
      z.array(selectSchema),
      'The valueLabel of user',
    ),
  },
});

export const patchStatus = createRoute({
  path: '/hr/users/status/{uuid}',
  method: 'patch',
  tags,
  request: {
    params: param.uuid,
  },
  responses: {
    [HSCode.OK]: jsonContent(
      z.array(selectSchema),
      'The valueLabel of user',
    ),
  },
});

export const signin = createRoute({
  path: '/signin',
  method: 'post',
  request: {
    body: jsonContentRequired(
      signinSchema,
      'The user login',
    ),
  },
  tags,
  responses: {
    [HSCode.OK]: jsonContent(
      signinOutputSchema,
      'The logged user',
    ),
    [HSCode.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found',
    ),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchSchema)
        .or(createErrorSchema(param.uuid)),
      'The validation error(s)',
    ),
    [HSCode.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      'Wrong password',
    ),
  },
});

export const login = createRoute({
  path: '/hr/user/login',
  method: 'post',
  request: {
    body: jsonContentRequired(
      signinSchema,
      'The user login',
    ),
  },
  tags,
  responses: {
    [HSCode.OK]: jsonContent(
      signinOutputSchema,
      'The logged user',
    ),
    [HSCode.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found',
    ),
    [HSCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchSchema)
        .or(createErrorSchema(param.uuid)),
      'The validation error(s)',
    ),
    [HSCode.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      'Wrong password',
    ),
  },
});

export const patchChangePassword = createRoute({
  path: '/hr/users/password/{uuid}',
  method: 'patch',
  tags,
  request: {
    params: param.uuid,
    body: jsonContentRequired(
      z.object({
        pass: z.string(),
        updated_at: z.string().optional(),
      }),
      'The valueLabel of user',
    ),
  },
  responses: {
    [HSCode.OK]: jsonContent(
      z.array(selectSchema),
      'The valueLabel of user',
    ),
  },

});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type SigninRoute = typeof signin;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
export type SignoutRoute = typeof signout;
export type GetCanAccessRoute = typeof getCanAccess;
export type PatchCanAccessRoute = typeof patchCanAccess;
export type PatchStatusRoute = typeof patchStatus;
export type PatchChangePasswordRoute = typeof patchChangePassword;
export type LoginRoute = typeof login;
