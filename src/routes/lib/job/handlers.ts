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
    id: job.id,
    job_id: sql`CONCAT('J', TO_CHAR(${job.created_at}::timestamp, 'YY'), '-', ${job.id})`.as('job_id'),
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
    id: job.id,
    job_id: sql`CONCAT('J', TO_CHAR(${job.created_at}::timestamp, 'YY'), '-', ${job.id})`.as('job_id'),
    work_order: job.work_order,
    client_uuid: job.client_uuid,
    client_name: client.name,
    created_by: job.created_by,
    created_by_name: users.name,
    created_at: job.created_at,
    updated_at: job.updated_at,
    job_entry: sql`
      COALESCE(ARRAY(
        SELECT jsonb_build_object(
          'uuid', job_entry.uuid,
          'job_uuid', job_entry.job_uuid,
          'product_uuid', job_entry.product_uuid,
          'vendor_uuid', job_entry.vendor_uuid,
          'created_by', job_entry.created_by,
          'created_at', job_entry.created_at,
          'updated_at', job_entry.updated_at,
          'quantity', job_entry.quantity,
          'buying_unit_price', job_entry.buying_unit_price,
          'selling_unit_price', job_entry.selling_unit_price,
          'warranty_days', job_entry.warranty_days,
          'purchased_at', job_entry.purchased_at,
          'is_serial_needed', job_entry.is_serial_needed,
          'product_serial', COALESCE(product_serial.product_serial, '[]'::jsonb)
        )
        FROM lib.job_entry
        LEFT JOIN (
          SELECT 
            product_serial.job_entry_uuid,
            COALESCE(
              jsonb_agg(
                jsonb_build_object(
                  'uuid', product_serial.uuid,
                  'job_entry_uuid', product_serial.job_entry_uuid,
                  'index', product_serial.index,
                  'serial', product_serial.serial
                ) ORDER BY product_serial.index ASC
              ), '[]'::jsonb
            ) AS product_serial
          FROM lib.product_serial
          GROUP BY product_serial.job_entry_uuid
        ) AS product_serial ON product_serial.job_entry_uuid = job_entry.uuid
        WHERE job_entry.job_uuid = ${job.uuid}
      ), ARRAY[]::jsonb[])`.as('job_entry'),
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
