import type { AppRouteHandler } from '@/lib/types';

import * as HSCode from 'stoker/http-status-codes';

import db from '@/db';
import { vendor } from '@/routes/lib/schema';

import type { ValueLabelRoute } from './routes';

export const valueLabel: AppRouteHandler<ValueLabelRoute> = async (c: any) => {
  const resultPromise = db.select({
    value: vendor.uuid,
    label: vendor.name,
  })
    .from(vendor);

  const data = await resultPromise;

  return c.json(data, HSCode.OK);
};
