import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { dateTimePattern } from '@/utils';

import { job_entry } from '../schema';

//* crud
export const selectSchema = createSelectSchema(job_entry);

export const insertSchema = createInsertSchema(
  job_entry,
  {
    uuid: schema => schema.uuid.length(21),
    job_uuid: schema => schema.job_uuid.length(21),
    product_uuid: schema => schema.product_uuid.length(21),
    vendor_uuid: z.string().length(21).optional(),
    created_by: schema => schema.created_by.length(21),
    created_at: schema => schema.created_at.regex(dateTimePattern, {
      message: 'created_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    updated_at: schema => schema.updated_at.regex(dateTimePattern, {
      message: 'updated_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    quantity: z.number().default(0).optional(),
    buying_unit_price: z.number().default(0).optional(),
    selling_unit_price: z.number().default(0).optional(),
    warranty_days: z.number().default(0).optional(),
    is_serial_needed: z.boolean().default(false).optional(),
  },
).required({
  uuid: true,
  job_uuid: true,
  product_uuid: true,
  created_by: true,
  created_at: true,
}).partial({
  vendor_uuid: true,
  quantity: true,
  buying_unit_price: true,
  selling_unit_price: true,
  warranty_days: true,
  purchased_at: true,
  is_serial_needed: true,
  updated_at: true,
  remarks: true,
});

export const patchSchema = insertSchema.partial();
