import type { AppRouteHandler } from '@/lib/types';

import { desc, eq } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import nanoid from '@/lib/nanoid';
import { PG_DECIMAL_TO_FLOAT } from '@/lib/variables';
import { users } from '@/routes/hr/schema';
import { createToast, DataNotFound, ObjectNotFound } from '@/utils/return';

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './routes';

import { job, job_entry, product, vendor } from '../schema';

export const create: AppRouteHandler<CreateRoute> = async (c: any) => {
  const value = c.req.valid('json');

  const {
    product_uuid,
    vendor_uuid,
    created_at,
    created_by,
  } = value;

  const existingProduct = await db.select().from(product).where(eq(product.name, product_uuid));
  const existingVendor = await db.select().from(vendor).where(eq(vendor.name, vendor_uuid));

  if (existingProduct.length === 0) {
    const addNewProduct = await db.insert(product).values({
      uuid: nanoid(),
      name: product_uuid,
      created_at,
      created_by,
    }).returning({
      uuid: product.uuid,
    });

    value.product_uuid = addNewProduct[0].uuid;
  }
  else {
    value.product_uuid = existingProduct[0].uuid;
  }

  if (existingVendor.length === 0) {
    const addNewVendor = await db.insert(vendor).values({
      uuid: nanoid(),
      name: vendor_uuid,
      created_at,
      created_by,
    }).returning({
      uuid: vendor.uuid,
    });

    value.vendor_uuid = addNewVendor[0].uuid;
  }
  else {
    value.vendor_uuid = existingVendor[0].uuid;
  }

  const [data] = await db.insert(job_entry).values(value).returning({
    name: job_entry.uuid,
  });

  return c.json(createToast('create', data.name), HSCode.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0)
    return ObjectNotFound(c);

  const {
    product_uuid,
    vendor_uuid,
    created_at,
    created_by,
  } = updates;

  const existingProduct = await db.select().from(product).where(eq(product.name, product_uuid));
  const existingVendor = await db.select().from(vendor).where(eq(vendor.name, vendor_uuid));

  if (existingProduct.length === 0) {
    const addNewProduct = await db.insert(product).values({
      uuid: nanoid(),
      name: product_uuid,
      created_at,
      created_by,
    }).returning({
      uuid: product.uuid,
    });

    updates.product_uuid = addNewProduct[0].uuid;
  }
  else {
    updates.product_uuid = existingProduct[0].uuid;
  }

  if (existingVendor.length === 0) {
    const addNewVendor = await db.insert(vendor).values({
      uuid: nanoid(),
      name: vendor_uuid,
      created_at,
      created_by,
    }).returning({
      uuid: vendor.uuid,
    });

    updates.vendor_uuid = addNewVendor[0].uuid;
  }
  else {
    updates.vendor_uuid = existingVendor[0].uuid;
  }

  const [data] = await db.update(job_entry)
    .set(updates)
    .where(eq(job_entry.uuid, uuid))
    .returning({
      name: job_entry.uuid,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('update', data.name), HSCode.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const [data] = await db.delete(job_entry)
    .where(eq(job_entry.uuid, uuid))
    .returning({
      name: job_entry.uuid,
    });

  if (!data)
    return DataNotFound(c);

  return c.json(createToast('delete', data.name), HSCode.OK);
};

export const list: AppRouteHandler<ListRoute> = async (c: any) => {
  const resultPromise = db.select({
    uuid: job_entry.uuid,
    job_uuid: job_entry.job_uuid,
    work_order: job.work_order,
    product_uuid: job_entry.product_uuid,
    product_name: product.name,
    vendor_uuid: job_entry.vendor_uuid,
    vendor_name: vendor.name,
    quantity: PG_DECIMAL_TO_FLOAT(job_entry.quantity),
    buying_unit_price: job_entry.buying_unit_price,
    selling_unit_price: job_entry.selling_unit_price,
    warranty_days: job_entry.warranty_days,
    purchased_at: job_entry.purchased_at,
    is_serial_needed: job_entry.is_serial_needed,
    created_by: job_entry.created_by,
    created_by_name: users.name,
    created_at: job_entry.created_at,
    updated_at: job_entry.updated_at,
    remarks: job_entry.remarks,
  })
    .from(job_entry)
    .leftJoin(job, eq(job_entry.job_uuid, job.uuid))
    .leftJoin(product, eq(job_entry.product_uuid, product.uuid))
    .leftJoin(vendor, eq(job_entry.vendor_uuid, vendor.uuid))
    .leftJoin(users, eq(job_entry.created_by, users.uuid))
    .orderBy(desc(job_entry.created_at));

  const data = await resultPromise;

  return c.json(data || [], HSCode.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c: any) => {
  const { uuid } = c.req.valid('param');

  const resultPromise = db.select({
    uuid: job_entry.uuid,
    job_uuid: job_entry.job_uuid,
    work_order: job.work_order,
    product_uuid: job_entry.product_uuid,
    product_name: product.name,
    vendor_uuid: job_entry.vendor_uuid,
    vendor_name: vendor.name,
    quantity: job_entry.quantity,
    buying_unit_price: job_entry.buying_unit_price,
    selling_unit_price: job_entry.selling_unit_price,
    warranty_days: job_entry.warranty_days,
    purchased_at: job_entry.purchased_at,
    is_serial_needed: job_entry.is_serial_needed,
    created_by: job_entry.created_by,
    created_by_name: users.name,
    created_at: job_entry.created_at,
    updated_at: job_entry.updated_at,
    remarks: job_entry.remarks,
  })
    .from(job_entry)
    .leftJoin(job, eq(job_entry.job_uuid, job.uuid))
    .leftJoin(product, eq(job_entry.product_uuid, product.uuid))
    .leftJoin(vendor, eq(job_entry.vendor_uuid, vendor.uuid))
    .leftJoin(users, eq(job_entry.created_by, users.uuid))
    .where(eq(job_entry.uuid, uuid));

  const data = await resultPromise;

  if (!data)
    return DataNotFound(c);

  return c.json(data || {}, HSCode.OK);
};
