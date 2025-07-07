import type { AppRouteHandler } from '@/lib/types';

import { desc, eq } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import { PG_DECIMAL_TO_FLOAT } from '@/lib/variables';
import { users } from '@/routes/hr/schema';
import { createToast, DataNotFound, ObjectNotFound } from '@/utils/return';

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './routes';

import { loan, loan_paid } from '../schema';

export const create: AppRouteHandler<CreateRoute> = async (c: any) => {
  const value = c.req.valid('json');

  const [data] = await db.insert(loan_paid).values(value).returning({
    name: loan_paid.uuid,
  });

  return c.json(createToast('create', data.name), HSCode.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0)
    return ObjectNotFound(c);

  const [data] = await db.update(loan_paid)
    .set(updates)
    .where(eq(loan_paid.uuid, uuid))
    .returning({
      name: loan_paid.uuid,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('update', data.name), HSCode.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const [data] = await db.delete(loan_paid)
    .where(eq(loan_paid.uuid, uuid))
    .returning({
      name: loan_paid.uuid,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('delete', data.name), HSCode.OK);
};

export const list: AppRouteHandler<ListRoute> = async (c: any) => {
  const resultPromise = db.select({
    uuid: loan_paid.uuid,
    loan_uuid: loan_paid.loan_uuid,
    lender_name: loan.lender_name,
    loan_type: loan.type,
    loan_amount: loan.amount,
    index: loan_paid.index,
    type: loan_paid.type,
    amount: PG_DECIMAL_TO_FLOAT(loan_paid.amount),
    created_by: loan_paid.created_by,
    created_by_name: users.name,
    created_at: loan_paid.created_at,
    updated_at: loan_paid.updated_at,
    remarks: loan_paid.remarks,
  })
    .from(loan_paid)
    .leftJoin(loan, eq(loan_paid.loan_uuid, loan.uuid))
    .leftJoin(users, eq(loan_paid.created_by, users.uuid))
    .orderBy(desc(loan_paid.created_at));

  const data = await resultPromise;

  return c.json(data || [], HSCode.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const resultPromise = db.select({
    uuid: loan_paid.uuid,
    loan_uuid: loan_paid.loan_uuid,
    lender_name: loan.lender_name,
    loan_type: loan.type,
    loan_amount: PG_DECIMAL_TO_FLOAT(loan.amount),
    index: loan_paid.index,
    type: loan_paid.type,
    amount: loan_paid.amount,
    created_by: loan_paid.created_by,
    created_by_name: users.name,
    created_at: loan_paid.created_at,
    updated_at: loan_paid.updated_at,
    remarks: loan_paid.remarks,
  })
    .from(loan_paid)
    .leftJoin(loan, eq(loan_paid.loan_uuid, loan.uuid))
    .leftJoin(users, eq(loan_paid.created_by, users.uuid))
    .where(eq(loan_paid.uuid, uuid));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data[0] || {}, HSCode.OK);
};
