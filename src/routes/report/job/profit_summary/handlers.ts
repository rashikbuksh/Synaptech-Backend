import type { AppRouteHandler } from '@/lib/types';

import { eq, sql } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import { users } from '@/routes/hr/schema';
import { client, expense, job, job_entry } from '@/routes/lib/schema';
import { DataNotFound } from '@/utils/return';

import type { ProfitSummaryRoute } from './routes';

export const profitSummary: AppRouteHandler<ProfitSummaryRoute> = async (c: any) => {
  const resultPromise = db.select({
    uuid: job.uuid,
    job_id: sql`CONCAT('J', TO_CHAR(${job.created_at}::timestamp, 'YY'), '-', ${job.id})`.as('job_id'),
    work_order: job.work_order,
    client_uuid: job.client_uuid,
    client_name: client.name,
    created_by: job.created_by,
    created_by_name: users.name,
    created_at: job.created_at,
    updated_at: job.updated_at,
    remarks: job.remarks,
    total_sell_revenue: sql`COALESCE((SELECT SUM(job_entry.selling_unit_price)::float8 FROM lib.job_entry WHERE job_entry.job_uuid = ${job.uuid}), 0)`.as('total_sell_revenue'),
    total_purchased_cost: sql`COALESCE((SELECT SUM(job_entry.buying_unit_price)::float8 FROM lib.job_entry WHERE job_entry.job_uuid = ${job.uuid}), 0)`.as('total_purchased_cost'),
    operational_expenses: sql`COALESCE((SELECT SUM(expense.amount)::float8 FROM lib.expense WHERE expense.job_uuid = ${job.uuid}), 0)`.as('operational_expenses'),
  })
    .from(job)
    .leftJoin(client, eq(job.client_uuid, client.uuid))
    .leftJoin(job_entry, eq(job.uuid, job_entry.job_uuid))
    .leftJoin(expense, eq(job.uuid, expense.job_uuid))
    .leftJoin(users, eq(job.created_by, users.uuid))
    .groupBy(
      job.uuid,
      job.id,
      job.created_at,
      job.work_order,
      job.client_uuid,
      job.created_by,
      job.remarks,
      client.name,
      users.name,
    );

  const data = await resultPromise;

  if (!data || data.length === 0)
    return DataNotFound(c);

  return c.json(data || [], HSCode.OK);
};
