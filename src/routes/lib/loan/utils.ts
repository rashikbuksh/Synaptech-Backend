import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { dateTimePattern } from '@/utils';

import { loan } from '../schema';

//* crud
export const selectSchema = createSelectSchema(loan);

export const insertSchema = createInsertSchema(
  loan,
  {
    uuid: schema => schema.uuid.length(21),
    lender_name: schema => schema.lender_name.min(1).max(255),
    taken_at: schema => schema.taken_at.regex(dateTimePattern, {
      message: 'taken_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    created_by: schema => schema.created_by.length(21),
    created_at: schema => schema.created_at.regex(dateTimePattern, {
      message: 'created_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    updated_at: schema => schema.updated_at.regex(dateTimePattern, {
      message: 'updated_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    amount: z.number().positive(),
    is_completed: schema => schema.is_completed.optional().default(false),
  },
).required({
  uuid: true,
  created_by: true,
  created_at: true,
}).partial({
  lender_name: true,
  type: true,
  amount: true,
  taken_at: true,
  updated_at: true,
  remarks: true,
  is_completed: true,
});

export const patchSchema = insertSchema.partial();
