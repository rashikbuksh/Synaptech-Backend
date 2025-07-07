import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { dateTimePattern } from '@/utils';

import { loan_paid } from '../schema';

//* crud
export const selectSchema = createSelectSchema(loan_paid);

export const insertSchema = createInsertSchema(
  loan_paid,
  {
    uuid: schema => schema.uuid.length(21),
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
  loan_uuid: true,
  index: true,
  amount: true,
  created_by: true,
  created_at: true,
}).partial({
  type: true,
  updated_at: true,
  remarks: true,
});

export const patchSchema = insertSchema.partial();
