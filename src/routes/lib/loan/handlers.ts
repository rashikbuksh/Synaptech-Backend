import type { AppRouteHandler } from '@/lib/types';

import { desc, eq } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import { PG_DECIMAL_TO_FLOAT } from '@/lib/variables';
import { users } from '@/routes/hr/schema';
import { createToast, DataNotFound, ObjectNotFound } from '@/utils/return';

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './routes';

import { loan } from '../schema';

export const create: AppRouteHandler<CreateRoute> = async (c: any) => {
  const value = c.req.valid('json');

  const [data] = await db.insert(loan).values(value).returning({
    name: loan.lender_name,
  });

  return c.json(createToast('create', data.name), HSCode.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0)
    return ObjectNotFound(c);

  const [data] = await db.update(loan)
    .set(updates)
    .where(eq(loan.uuid, uuid))
    .returning({
      name: loan.lender_name,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('update', data.name), HSCode.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const [data] = await db.delete(loan)
    .where(eq(loan.uuid, uuid))
    .returning({
      name: loan.lender_name,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('delete', data.name), HSCode.OK);
};

export const list: AppRouteHandler<ListRoute> = async (c: any) => {
  const resultPromise = db.select({
    uuid: loan.uuid,
    lender_name: loan.lender_name,
    type: loan.type,
    amount: PG_DECIMAL_TO_FLOAT(loan.amount),
    taken_at: loan.taken_at,
    created_by: loan.created_by,
    created_by_name: users.name,
    created_at: loan.created_at,
    updated_at: loan.updated_at,
    remarks: loan.remarks,
  })
    .from(loan)
    .leftJoin(users, eq(loan.created_by, users.uuid))
    .orderBy(desc(loan.created_at));

  const data = await resultPromise;

  return c.json(data || [], HSCode.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const resultPromise = db.select({
    uuid: loan.uuid,
    lender_name: loan.lender_name,
    type: loan.type,
    amount: PG_DECIMAL_TO_FLOAT(loan.amount),
    taken_at: loan.taken_at,
    created_by: loan.created_by,
    created_by_name: users.name,
    created_at: loan.created_at,
    updated_at: loan.updated_at,
    remarks: loan.remarks,
  })
    .from(loan)
    .leftJoin(users, eq(loan.created_by, users.uuid))
    .where(eq(loan.uuid, uuid));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data[0] || {}, HSCode.OK);
};
