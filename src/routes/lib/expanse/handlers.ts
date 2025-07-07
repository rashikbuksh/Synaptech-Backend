import type { AppRouteHandler } from '@/lib/types';

import { desc, eq } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import { users } from '@/routes/hr/schema';
import { createToast, DataNotFound, ObjectNotFound } from '@/utils/return';

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './routes';

import { expanse, job } from '../schema';

export const create: AppRouteHandler<CreateRoute> = async (c: any) => {
  const value = c.req.valid('json');

  const [data] = await db.insert(expanse).values(value).returning({
    name: expanse.uuid,
  });

  return c.json(createToast('create', data.name), HSCode.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0)
    return ObjectNotFound(c);

  const [data] = await db.update(expanse)
    .set(updates)
    .where(eq(expanse.uuid, uuid))
    .returning({
      name: expanse.uuid,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('update', data.name), HSCode.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const [data] = await db.delete(expanse)
    .where(eq(expanse.uuid, uuid))
    .returning({
      name: expanse.uuid,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('delete', data.name), HSCode.OK);
};

export const list: AppRouteHandler<ListRoute> = async (c: any) => {
  const resultPromise = db.select({
    uuid: expanse.uuid,
    job_uuid: expanse.job_uuid,
    work_order: job.work_order,
    expense_at: expanse.expense_at,
    type: expanse.type,
    amount: expanse.amount,
    reason: expanse.reason,
    created_by: expanse.created_by,
    created_by_name: users.name,
    created_at: expanse.created_at,
    updated_at: expanse.updated_at,
    remarks: expanse.remarks,
  })
    .from(expanse)
    .leftJoin(job, eq(expanse.job_uuid, job.uuid))
    .leftJoin(users, eq(expanse.created_by, users.uuid))
    .orderBy(desc(expanse.created_at));

  const data = await resultPromise;

  return c.json(data || [], HSCode.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const resultPromise = db.select({
    uuid: expanse.uuid,
    job_uuid: expanse.job_uuid,
    work_order: job.work_order,
    expense_at: expanse.expense_at,
    type: expanse.type,
    amount: expanse.amount,
    reason: expanse.reason,
    created_by: expanse.created_by,
    created_by_name: users.name,
    created_at: expanse.created_at,
    updated_at: expanse.updated_at,
    remarks: expanse.remarks,
  })
    .from(expanse)
    .leftJoin(job, eq(expanse.job_uuid, job.uuid))
    .leftJoin(users, eq(expanse.created_by, users.uuid))
    .where(eq(expanse.uuid, uuid));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data || {}, HSCode.OK);
};
