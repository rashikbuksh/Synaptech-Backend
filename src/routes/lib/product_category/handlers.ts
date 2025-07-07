import type { AppRouteHandler } from '@/lib/types';

import { desc, eq } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import * as hrSchema from '@/routes/hr/schema';
import { createToast, DataNotFound, ObjectNotFound } from '@/utils/return';

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './routes';

import { product_category } from '../schema';

export const create: AppRouteHandler<CreateRoute> = async (c: any) => {
  const value = c.req.valid('json');

  const [data] = await db.insert(product_category).values(value).returning({
    name: product_category.name,
  });

  return c.json(createToast('create', data.name), HSCode.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0)
    return ObjectNotFound(c);

  const [data] = await db.update(product_category)
    .set(updates)
    .where(eq(product_category.uuid, uuid))
    .returning({
      name: product_category.name,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('update', data.name), HSCode.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const [data] = await db.delete(product_category)
    .where(eq(product_category.uuid, uuid))
    .returning({
      name: product_category.name,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('delete', data.name), HSCode.OK);
};

export const list: AppRouteHandler<ListRoute> = async (c: any) => {
  const resultPromise = db.select({
    uuid: product_category.uuid,
    name: product_category.name,
    short_name: product_category.short_name,
    created_by: product_category.created_by,
    created_by_name: hrSchema.users.name,
    created_at: product_category.created_at,
    updated_at: product_category.updated_at,
    remarks: product_category.remarks,
  })
    .from(product_category)
    .leftJoin(hrSchema.users, eq(product_category.created_by, hrSchema.users.uuid))
    .orderBy(desc(product_category.created_at));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data || [], HSCode.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  // const data = await db.query.product_category.findFirst({
  //   where(fields, operators) {
  //     return operators.eq(fields.uuid, uuid);
  //   },
  // });

  const resultPromise = db.select({
    uuid: product_category.uuid,
    name: product_category.name,
    short_name: product_category.short_name,
    created_by: product_category.created_by,
    created_by_name: hrSchema.users.name,
    created_at: product_category.created_at,
    updated_at: product_category.updated_at,
    remarks: product_category.remarks,
  })
    .from(product_category)
    .leftJoin(hrSchema.users, eq(product_category.created_by, hrSchema.users.uuid))
    .where(eq(product_category.uuid, uuid));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data || {}, HSCode.OK);
};
