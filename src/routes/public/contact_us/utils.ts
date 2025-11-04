import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { dateTimePattern } from '@/utils';
import { z } from '@hono/zod-openapi';

import { contact_us } from '../schema';

//* crud
export const selectSchema = createSelectSchema(contact_us);

export const insertSchema = createInsertSchema(
  contact_us,
  {
    id: z.number().optional(),
    name: schema => schema.name.min(1),
    created_at: schema => schema.created_at.regex(dateTimePattern, {
      message: 'created_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
  },
).required({
  name: true,
  created_at: true,
}).partial({
  email: true,
  phone: true,
  message: true,
  url: true,
}).omit({
  id: true,
});

export const patchSchema = insertSchema.partial();
