import type { AppRouteHandler } from '@/lib/types';

import { desc, eq } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import * as hrSchema from '@/routes/hr/schema';
import { createToast, DataNotFound, ObjectNotFound } from '@/utils/return';

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './routes';

import { product, product_category } from '../schema';

export const create: AppRouteHandler<CreateRoute> = async (c: any) => {
  const value = c.req.valid('json');

  const [data] = await db.insert(product).values(value).returning({
    name: product.name,
  });

  return c.json(createToast('create', data.name), HSCode.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0)
    return ObjectNotFound(c);

  const [data] = await db.update(product)
    .set(updates)
    .where(eq(product.uuid, uuid))
    .returning({
      name: product.name,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('update', data.name), HSCode.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const [data] = await db.delete(product)
    .where(eq(product.uuid, uuid))
    .returning({
      name: product.name,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('delete', data.name), HSCode.OK);
};

export const list: AppRouteHandler<ListRoute> = async (c: any) => {
  const resultPromise = db.select({
    uuid: product.uuid,
    product_category_uuid: product.product_category_uuid,
    product_category_name: product_category.name,
    name: product.name,
    created_by: product.created_by,
    created_by_name: hrSchema.users.name,
    created_at: product.created_at,
    updated_at: product.updated_at,
    remarks: product.remarks,

  })
    .from(product)
    .leftJoin(product_category, eq(product.product_category_uuid, product_category.uuid))
    .leftJoin(hrSchema.users, eq(hrSchema.users.uuid, product.created_by))
    .orderBy(desc(product.created_at));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data || [], HSCode.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  // const data = await db.query.product.findFirst({
  //   where(fields, operators) {
  //     return operators.eq(fields.uuid, uuid);
  //   },
  // });

  const resultPromise = db.select({
    uuid: product.uuid,
    product_category_uuid: product.product_category_uuid,
    product_category_name: product_category.name,
    name: product.name,
    created_by: product.created_by,
    created_by_name: hrSchema.users.name,
    created_at: product.created_at,
    updated_at: product.updated_at,
    remarks: product.remarks,

  })
    .from(product)
    .leftJoin(product_category, eq(product.product_category_uuid, product_category.uuid))
    .leftJoin(hrSchema.users, eq(hrSchema.users.uuid, product.created_by))
    .where(eq(product.uuid, uuid));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data || {}, HSCode.OK);
};
