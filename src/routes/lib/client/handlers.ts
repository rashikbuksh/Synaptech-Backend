import type { AppRouteHandler } from '@/lib/types';

import { desc, eq } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import { users } from '@/routes/hr/schema';
import { createToast, DataNotFound, ObjectNotFound } from '@/utils/return';

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './routes';

import { client } from '../schema';

export const create: AppRouteHandler<CreateRoute> = async (c: any) => {
  const value = c.req.valid('json');

  const [data] = await db.insert(client).values(value).returning({
    name: client.name,
  });

  return c.json(createToast('create', data.name), HSCode.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0)
    return ObjectNotFound(c);

  const [data] = await db.update(client)
    .set(updates)
    .where(eq(client.uuid, uuid))
    .returning({
      name: client.name,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('update', data.name), HSCode.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const [data] = await db.delete(client)
    .where(eq(client.uuid, uuid))
    .returning({
      name: client.name,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('delete', data.name), HSCode.OK);
};

export const list: AppRouteHandler<ListRoute> = async (c: any) => {
  const resultPromise = db.select({
    uuid: client.uuid,
    id: client.id,
    name: client.name,
    contact_name: client.contact_name,
    contact_number: client.contact_number,
    email: client.email,
    address: client.address,
    created_by: client.created_by,
    created_by_name: users.name,
    created_at: client.created_at,
    updated_at: client.updated_at,
    remarks: client.remarks,
  })
    .from(client)
    .leftJoin(users, eq(client.created_by, users.uuid))
    .orderBy(desc(client.created_at));

  const data = await resultPromise;

  return c.json(data || [], HSCode.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const resultPromise = db.select({
    uuid: client.uuid,
    id: client.id,
    name: client.name,
    contact_name: client.contact_name,
    contact_number: client.contact_number,
    email: client.email,
    address: client.address,
    created_by: client.created_by,
    created_by_name: users.name,
    created_at: client.created_at,
    updated_at: client.updated_at,
    remarks: client.remarks,
  })
    .from(client)
    .leftJoin(users, eq(client.created_by, users.uuid))
    .where(eq(client.uuid, uuid));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data || {}, HSCode.OK);
};
