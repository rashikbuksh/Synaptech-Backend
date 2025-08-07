import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { dateTimePattern } from '@/utils';

import { expense } from '../schema';

//* crud
export const selectSchema = createSelectSchema(expense);

export const insertSchema = createInsertSchema(
  expense,
  {
    uuid: schema => schema.uuid.length(21),
    job_uuid: schema => schema.job_uuid.length(21).optional(),
    created_by: schema => schema.created_by.length(21),
    created_at: schema => schema.created_at.regex(dateTimePattern, {
      message: 'created_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    updated_at: schema => schema.updated_at.regex(dateTimePattern, {
      message: 'updated_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    amount: z.number().positive(),
  },
).required({
  uuid: true,
  created_by: true,
  created_at: true,
}).partial({
  job_uuid: true,
  expense_at: true,
  type: true,
  amount: true,
  reason: true,
  updated_at: true,
  remarks: true,
}).omit({

});

export const patchSchema = insertSchema.partial();
