import type { AppRouteHandler } from '@/lib/types';

import { desc, eq, sql } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import { users } from '@/routes/hr/schema';
import { createToast, DataNotFound, ObjectNotFound } from '@/utils/return';

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './routes';

import { client, job } from '../schema';

export const create: AppRouteHandler<CreateRoute> = async (c: any) => {
  const value = c.req.valid('json');

  const [data] = await db.insert(job).values(value).returning({
    name: job.uuid,
  });

  return c.json(createToast('create', data.name), HSCode.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0)
    return ObjectNotFound(c);

  const [data] = await db.update(job)
    .set(updates)
    .where(eq(job.uuid, uuid))
    .returning({
      name: job.uuid,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('update', data.name), HSCode.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const [data] = await db.delete(job)
    .where(eq(job.uuid, uuid))
    .returning({
      name: job.uuid,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('delete', data.name), HSCode.OK);
};

export const list: AppRouteHandler<ListRoute> = async (c: any) => {
  const resultPromise = db.select({
    uuid: job.uuid,
    work_order: job.work_order,
    client_uuid: job.client_uuid,
    client_name: client.name,
    created_by: job.created_by,
    created_by_name: users.name,
    created_at: job.created_at,
    updated_at: job.updated_at,
  })
    .from(job)
    .leftJoin(users, eq(job.created_by, users.uuid))
    .leftJoin(client, eq(job.client_uuid, client.uuid))
    .orderBy(desc(job.created_at));

  const data = await resultPromise;

  return c.json(data || [], HSCode.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const resultPromise = db.select({
    uuid: job.uuid,
    work_order: job.work_order,
    client_uuid: job.client_uuid,
    client_name: client.name,
    created_by: job.created_by,
    created_by_name: users.name,
    created_at: job.created_at,
    updated_at: job.updated_at,
    job_entry: sql`
      (
        SELECT *
        FROM lib.job_entry
        WHERE job_entry.job_uuid = ${job.uuid}
      ) AS job_entry
    `,
  })
    .from(job)
    .leftJoin(users, eq(job.created_by, users.uuid))
    .leftJoin(client, eq(job.client_uuid, client.uuid))
    .where(eq(job.uuid, uuid));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data[0] || {}, HSCode.OK);
};
