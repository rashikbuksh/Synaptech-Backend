import type { AppRouteHandler } from '@/lib/types';

import { asc, eq, sql } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import { PG_DECIMAL_TO_FLOAT } from '@/lib/variables';
// import { users } from '@/routes/hr/schema';
import { client, job, job_entry, product, product_serial, vendor } from '@/routes/lib/schema';
import { DataNotFound } from '@/utils/return';

import type { ProductDatabaseRoute } from './routes';

export const productDatabase: AppRouteHandler<ProductDatabaseRoute> = async (c: any) => {
  const resultPromise = db.select({
    uuid: job.uuid,
    job_id: sql`CONCAT('J', TO_CHAR(${job.created_at}::timestamp, 'YY'), '-', ${job.id})`.as('job_id'),
    client_uuid: job.client_uuid,
    client_name: client.name,
    job_entry_uuid: job_entry.uuid,
    product_uuid: job_entry.product_uuid,
    product_name: product.name,
    serial_number: product_serial.serial,
    purchase_unit_price: PG_DECIMAL_TO_FLOAT(job_entry.buying_unit_price),
    selling_unit_price: PG_DECIMAL_TO_FLOAT(job_entry.selling_unit_price),
    warranty_days: PG_DECIMAL_TO_FLOAT(job_entry.warranty_days),
    date_of_purchase: job_entry.purchased_at,
    expiry_date: sql`(${job_entry.purchased_at} + INTERVAL '1 day' * ${job_entry.warranty_days})`.as('expiry_date'),
    vendor_uuid: job_entry.vendor_uuid,
    vendor_name: vendor.name,

  })
    .from(job)
    .leftJoin(client, eq(job.client_uuid, client.uuid))
    .leftJoin(job_entry, eq(job.uuid, job_entry.job_uuid))
    .leftJoin(product, eq(job_entry.product_uuid, product.uuid))
    .leftJoin(product_serial, eq(job_entry.uuid, product_serial.job_entry_uuid))
    .leftJoin(vendor, eq(job_entry.vendor_uuid, vendor.uuid))
    .orderBy(asc(product.name));

  const data = await resultPromise;

  if (!data || data.length === 0)
    return DataNotFound(c);

  return c.json(data || [], HSCode.OK);
};
