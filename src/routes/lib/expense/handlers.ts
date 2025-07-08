import type { AppRouteHandler } from '@/lib/types';

import { desc, eq, sql } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import { PG_DECIMAL_TO_FLOAT } from '@/lib/variables';
import { users } from '@/routes/hr/schema';
import { createToast, DataNotFound, ObjectNotFound } from '@/utils/return';

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './routes';

import { expense, job } from '../schema';

export const create: AppRouteHandler<CreateRoute> = async (c: any) => {
  const value = c.req.valid('json');

  const [data] = await db.insert(expense).values(value).returning({
    name: expense.uuid,
  });

  return c.json(createToast('create', data.name), HSCode.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0)
    return ObjectNotFound(c);

  const [data] = await db.update(expense)
    .set(updates)
    .where(eq(expense.uuid, uuid))
    .returning({
      name: expense.uuid,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('update', data.name), HSCode.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const [data] = await db.delete(expense)
    .where(eq(expense.uuid, uuid))
    .returning({
      name: expense.uuid,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('delete', data.name), HSCode.OK);
};

export const list: AppRouteHandler<ListRoute> = async (c: any) => {
  const resultPromise = db.select({
    uuid: expense.uuid,
    job_uuid: expense.job_uuid,
    job_id: sql`CONCAT('J', TO_CHAR(${job.created_at}::timestamp, 'YY'), '-', ${job.id})`.as('job_id'),
    work_order: job.work_order,
    expense_at: expense.expense_at,
    type: expense.type,
    amount: PG_DECIMAL_TO_FLOAT(expense.amount),
    reason: expense.reason,
    created_by: expense.created_by,
    created_by_name: users.name,
    created_at: expense.created_at,
    updated_at: expense.updated_at,
    remarks: expense.remarks,
  })
    .from(expense)
    .leftJoin(job, eq(expense.job_uuid, job.uuid))
    .leftJoin(users, eq(expense.created_by, users.uuid))
    .orderBy(desc(expense.created_at));

  const data = await resultPromise;

  return c.json(data || [], HSCode.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const resultPromise = db.select({
    uuid: expense.uuid,
    job_uuid: expense.job_uuid,
    work_order: job.work_order,
    expense_at: expense.expense_at,
    type: expense.type,
    amount: PG_DECIMAL_TO_FLOAT(expense.amount),
    reason: expense.reason,
    created_by: expense.created_by,
    created_by_name: users.name,
    created_at: expense.created_at,
    updated_at: expense.updated_at,
    remarks: expense.remarks,
  })
    .from(expense)
    .leftJoin(job, eq(expense.job_uuid, job.uuid))
    .leftJoin(users, eq(expense.created_by, users.uuid))
    .where(eq(expense.uuid, uuid));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data[0] || {}, HSCode.OK);
};
