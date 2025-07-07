import type { AppRouteHandler } from '@/lib/types';

import { sql } from 'drizzle-orm';
import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import { job } from '@/routes/lib/schema';

import type { ValueLabelRoute } from './routes';

export const valueLabel: AppRouteHandler<ValueLabelRoute> = async (c: any) => {
  const resultPromise = db.select({
    value: job.uuid,
    label: sql`CONCAT('J', TO_CHAR(${job.created_at}::timestamp, 'YY'), '-', ${job.id})`.as('job_id'),
  })
    .from(job);

  const data = await resultPromise;

  return c.json(data, HSCode.OK);
};
