import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { dateTimePattern } from '@/utils';

import { expanse } from '../schema';

//* crud
export const selectSchema = createSelectSchema(expanse);

export const insertSchema = createInsertSchema(
  expanse,
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
  },
).required({
  uuid: true,
  type: true,
  amount: true,
  created_by: true,
  created_at: true,
}).partial({
  job_uuid: true,
  expense_at: true,
  reason: true,
  updated_at: true,
  remarks: true,
}).omit({

});

export const patchSchema = insertSchema.partial();
