import { pgTable, serial, text } from 'drizzle-orm/pg-core';

import { DateTime } from '@/lib/variables';

//* Department
export const contact_us = pgTable('contact_us', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  message: text('message'),
  url: text('url'),
  created_at: DateTime('created_at').notNull(),
});

export default contact_us;
