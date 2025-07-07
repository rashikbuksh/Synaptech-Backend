import type { AppRouteHandler } from '@/lib/types';

import { desc, eq } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import { PG_DECIMAL_TO_FLOAT } from '@/lib/variables';
import * as hrSchema from '@/routes/hr/schema';
import { createToast, DataNotFound, ObjectNotFound } from '@/utils/return';

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './routes';

import { payment } from '../schema';

export const create: AppRouteHandler<CreateRoute> = async (c: any) => {
  const value = c.req.valid('json');

  const [data] = await db.insert(payment).values(value).returning({
    name: payment.uuid,
  });

  return c.json(createToast('create', data.name), HSCode.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0)
    return ObjectNotFound(c);

  const [data] = await db.update(payment)
    .set(updates)
    .where(eq(payment.uuid, uuid))
    .returning({
      name: payment.uuid,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('update', data.name), HSCode.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const [data] = await db.delete(payment)
    .where(eq(payment.uuid, uuid))
    .returning({
      name: payment.uuid,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('delete', data.name), HSCode.OK);
};

export const list: AppRouteHandler<ListRoute> = async (c: any) => {
  const resultPromise = db.select({
    uuid: payment.uuid,
    index: payment.index,
    job_uuid: payment.job_uuid,
    paid_at: payment.paid_at,
    method: payment.method,
    amount: PG_DECIMAL_TO_FLOAT(payment.amount),
    created_by: payment.created_by,
    created_by_name: hrSchema.users.name,
    created_at: payment.created_at,
    updated_at: payment.updated_at,
  })
    .from(payment)
    .leftJoin(hrSchema.users, eq(hrSchema.users.uuid, payment.created_by))
    .orderBy(desc(payment.created_at));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data || [], HSCode.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  // const data = await db.query.payment.findFirst({
  //   where(fields, operators) {
  //     return operators.eq(fields.uuid, uuid);
  //   },
  // });

  const resultPromise = db.select({
    uuid: payment.uuid,
    index: payment.index,
    job_uuid: payment.job_uuid,
    paid_at: payment.paid_at,
    method: payment.method,
    amount: PG_DECIMAL_TO_FLOAT(payment.amount),
    created_by: payment.created_by,
    created_by_name: hrSchema.users.name,
    created_at: payment.created_at,
    updated_at: payment.updated_at,
  })
    .from(payment)
    .leftJoin(hrSchema.users, eq(hrSchema.users.uuid, payment.created_by))
    .where(eq(payment.uuid, uuid));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data[0] || {}, HSCode.OK);
};
