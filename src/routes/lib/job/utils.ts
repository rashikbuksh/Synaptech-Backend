import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { dateTimePattern } from '@/utils';

import { job } from '../schema';

//* crud
export const selectSchema = createSelectSchema(job);

export const insertSchema = createInsertSchema(
  job,
  {
    uuid: schema => schema.uuid.length(21),
    client_uuid: schema => schema.client_uuid.length(21),
    created_by: schema => schema.created_by.length(21),
    created_at: schema => schema.created_at.regex(dateTimePattern, {
      message: 'created_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    updated_at: schema => schema.updated_at.regex(dateTimePattern, {
      message: 'updated_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    to_date: schema => schema.to_date.regex(dateTimePattern, {
      message: 'to_date must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
  },
).required({
  uuid: true,
  client_uuid: true,
  work_order: true,
  created_by: true,
  created_at: true,
}).partial({
  to_date: true,
  subject: true,
  updated_at: true,
  remarks: true,
}).omit({
  id: true,
});

export const patchSchema = insertSchema.partial();
