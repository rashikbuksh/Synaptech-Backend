import type { AppRouteHandler } from '@/lib/types';

import { desc, eq } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import * as hrSchema from '@/routes/hr/schema';
import { createToast, DataNotFound, ObjectNotFound } from '@/utils/return';

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './routes';

import { product_serial } from '../schema';

export const create: AppRouteHandler<CreateRoute> = async (c: any) => {
  const value = c.req.valid('json');

  const [data] = await db.insert(product_serial).values(value).returning({
    name: product_serial.uuid,
  });

  return c.json(createToast('create', data.name), HSCode.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0)
    return ObjectNotFound(c);

  const [data] = await db.update(product_serial)
    .set(updates)
    .where(eq(product_serial.uuid, uuid))
    .returning({
      name: product_serial.uuid,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('update', data.name), HSCode.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const [data] = await db.delete(product_serial)
    .where(eq(product_serial.uuid, uuid))
    .returning({
      name: product_serial.uuid,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('delete', data.name), HSCode.OK);
};

export const list: AppRouteHandler<ListRoute> = async (c: any) => {
  const resultPromise = db.select({
    uuid: product_serial.uuid,
    job_entry_uuid: product_serial.job_entry_uuid,
    index: product_serial.index,
    serial: product_serial.serial,
    created_by: product_serial.created_by,
    created_by_name: hrSchema.users.name,
    created_at: product_serial.created_at,
    updated_at: product_serial.updated_at,
    remarks: product_serial.remarks,
  })
    .from(product_serial)
    .leftJoin(hrSchema.users, eq(hrSchema.users.uuid, product_serial.created_by))
    .orderBy(desc(product_serial.created_at));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data || [], HSCode.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  // const data = await db.query.product_serial.findFirst({
  //   where(fields, operators) {
  //     return operators.eq(fields.uuid, uuid);
  //   },
  // });

  const resultPromise = db.select({
    uuid: product_serial.uuid,
    job_entry_uuid: product_serial.job_entry_uuid,
    index: product_serial.index,
    serial: product_serial.serial,
    created_by: product_serial.created_by,
    created_by_name: hrSchema.users.name,
    created_at: product_serial.created_at,
    updated_at: product_serial.updated_at,
    remarks: product_serial.remarks,
  })
    .from(product_serial)
    .leftJoin(hrSchema.users, eq(hrSchema.users.uuid, product_serial.created_by))
    .where(eq(product_serial.uuid, uuid));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data[0] || {}, HSCode.OK);
};
