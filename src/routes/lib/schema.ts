import { relations, sql } from 'drizzle-orm';
import { boolean, integer, pgSchema, serial, text } from 'drizzle-orm/pg-core';

import { DateTime, defaultUUID, PG_DECIMAL, uuid_primary } from '@/lib/variables';
import { users } from '@/routes/hr/schema';
import { DEFAULT_OPERATION, DEFAULT_SEQUENCE } from '@/utils/db';

const lib = pgSchema('lib');

//* loan

export const loan_type = lib.enum('loan_type', ['friend', 'business', 'family']);

export const loan = lib.table('loan', {
  uuid: uuid_primary,
  lender_name: text('lender_name').notNull(),
  type: loan_type('type').notNull(),
  amount: PG_DECIMAL('amount').notNull(),
  taken_at: DateTime('taken_at'),
  created_by: defaultUUID('created_by').references(
    () => users.uuid,
    DEFAULT_OPERATION,
  ),
  created_at: DateTime('created_at').notNull(),
  updated_at: DateTime('updated_at'),
  remarks: text('remarks'),
});

// * loan paid
export const loan_paid_type = lib.enum('loan_paid_type', ['cash', 'mfs', 'cheque']);

export const loan_paid = lib.table('loan_paid', {
  uuid: uuid_primary,
  loan_uuid: defaultUUID('loan_uuid').references(
    () => loan.uuid,
    DEFAULT_OPERATION,
  ),
  index: integer('index').notNull(),
  type: loan_paid_type('type').default('cash').notNull(),
  amount: PG_DECIMAL('amount').notNull(),
  created_by: defaultUUID('created_by').references(
    () => users.uuid,
    DEFAULT_OPERATION,
  ),
  created_at: DateTime('created_at').notNull(),
  updated_at: DateTime('updated_at'),
  remarks: text('remarks'),
});

export const client = lib.table('client', {
  uuid: uuid_primary,
  id: serial('id').notNull(),
  name: text('name').notNull(),
  contact_name: text('contact_name').notNull(),
  contact_number: text('contact_number').notNull(),
  email: text('email').notNull(),
  address: text('address'),
  created_by: defaultUUID('created_by').references(
    () => users.uuid,
    DEFAULT_OPERATION,
  ),
  created_at: DateTime('created_at').notNull(),
  updated_at: DateTime('updated_at'),
  remarks: text('remarks'),
});

export const job_id = lib.sequence('job_id', DEFAULT_SEQUENCE);

export const job = lib.table('job', {
  uuid: uuid_primary,
  id: integer('id').default(sql`nextval('lib.job_id')`).notNull(),
  work_order: text('work_order').notNull(),
  client_uuid: defaultUUID('client_uuid').references(
    () => client.uuid,
    DEFAULT_OPERATION,
  ),
  created_by: defaultUUID('created_by').references(
    () => users.uuid,
    DEFAULT_OPERATION,
  ),
  created_at: DateTime('created_at').notNull(),
  updated_at: DateTime('updated_at'),
  remarks: text('remarks'),
});

export const product_category = lib.table('product_category', {
  uuid: uuid_primary,
  name: text('name').notNull().unique(),
  short_name: text('short_name').notNull().unique(),
  created_by: defaultUUID('created_by').references(
    () => users.uuid,
    DEFAULT_OPERATION,
  ),
  created_at: DateTime('created_at').notNull(),
  updated_at: DateTime('updated_at'),
  remarks: text('remarks'),
});

export const product = lib.table('product', {
  uuid: uuid_primary,
  name: text('name').notNull(),
  product_category_uuid: defaultUUID('product_category_uuid').references(
    () => product_category.uuid,
    DEFAULT_OPERATION,
  ),
  created_by: defaultUUID('created_by').references(
    () => users.uuid,
    DEFAULT_OPERATION,
  ),
  created_at: DateTime('created_at').notNull(),
  updated_at: DateTime('updated_at'),
  remarks: text('remarks'),
});

export const vendor = lib.table('vendor', {
  uuid: uuid_primary,
  id: serial('id').notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  purpose: text('purpose').notNull(),
  starting_date: DateTime('starting_date').notNull(),
  ending_date: DateTime('ending_date').notNull(),
  product_type: text('product_type').notNull(),
  created_by: defaultUUID('created_by').references(
    () => users.uuid,
    DEFAULT_OPERATION,
  ),
  created_at: DateTime('created_at').notNull(),
  updated_at: DateTime('updated_at'),
  remarks: text('remarks'),
});

export const payment_method = lib.enum('payment_method', [
  'cash',
  'mfs',
  'cheque',
]);

export const payment = lib.table('payment', {
  uuid: uuid_primary,
  index: integer('index').notNull(),
  job_uuid: defaultUUID('job_uuid').references(
    () => job.uuid,
    DEFAULT_OPERATION,
  ),
  paid_at: DateTime('paid_at'),
  method: payment_method('method').default('cash').notNull(),
  amount: PG_DECIMAL('amount').notNull(),
  created_by: defaultUUID('created_by').references(
    () => users.uuid,
    DEFAULT_OPERATION,
  ),
  created_at: DateTime('created_at').notNull(),
  updated_at: DateTime('updated_at'),
  remarks: text('remarks'),
});

export const expense = lib.table('expense', {
  uuid: uuid_primary,
  job_uuid: defaultUUID('job_uuid').references(
    () => job.uuid,
    DEFAULT_OPERATION,
  ),
  expense_at: DateTime('expense_at'),
  type: text('type').notNull(),
  amount: PG_DECIMAL('amount').notNull(),
  reason: text('reason'),
  created_by: defaultUUID('created_by').references(
    () => users.uuid,
    DEFAULT_OPERATION,
  ),
  created_at: DateTime('created_at').notNull(),
  updated_at: DateTime('updated_at'),
  remarks: text('remarks'),
});

export const job_entry = lib.table('job_entry', {
  uuid: uuid_primary,
  job_uuid: defaultUUID('job_uuid').references(
    () => job.uuid,
    DEFAULT_OPERATION,
  ),
  product_uuid: defaultUUID('product_uuid').references(
    () => product.uuid,
    DEFAULT_OPERATION,
  ),
  vendor_uuid: defaultUUID('vendor_uuid').references(
    () => vendor.uuid,
    DEFAULT_OPERATION,
  ).default(sql`null`),
  quantity: PG_DECIMAL('quantity').default(sql`0`).notNull(),
  buying_unit_price: PG_DECIMAL('buying_unit_price').default(sql`0`).notNull(),
  selling_unit_price: PG_DECIMAL('selling_unit_price').default(sql`0`).notNull(),
  warranty_days: integer('warranty_days').default(sql`0`).notNull(),
  purchased_at: DateTime('purchased_at').default(sql`null`),
  is_serial_needed: boolean('is_serial_needed').default(false),
  created_by: defaultUUID('created_by').references(
    () => users.uuid,
    DEFAULT_OPERATION,
  ),
  created_at: DateTime('created_at').notNull(),
  updated_at: DateTime('updated_at'),
  remarks: text('remarks'),
});

export const product_serial = lib.table('product_serial', {
  uuid: uuid_primary,
  job_entry_uuid: defaultUUID('job_entry_uuid').references(
    () => job_entry.uuid,
    DEFAULT_OPERATION,
  ),
  index: integer('index').notNull(),
  serial: text('serial').notNull(),
  created_by: defaultUUID('created_by').references(
    () => users.uuid,
    DEFAULT_OPERATION,
  ),
  created_at: DateTime('created_at').notNull(),
  updated_at: DateTime('updated_at'),
  remarks: text('remarks'),
});

//* relations

export const loanRelations = relations(loan, ({ one }) => ({
  createdBy: one(users, {
    fields: [loan.created_by],
    references: [users.uuid],
  }),
}));

export const loanPaidRelations = relations(loan_paid, ({ one }) => ({
  loan: one(loan, {
    fields: [loan_paid.loan_uuid],
    references: [loan.uuid],
  }),
  createdBy: one(users, {
    fields: [loan_paid.created_by],
    references: [users.uuid],
  }),
}));

export const clientRelations = relations(client, ({ one }) => ({
  createdBy: one(users, {
    fields: [client.created_by],
    references: [users.uuid],
  }),
}));

export const jobRelations = relations(job, ({ one }) => ({
  client: one(client, {
    fields: [job.client_uuid],
    references: [client.uuid],
  }),
  createdBy: one(users, {
    fields: [job.created_by],
    references: [users.uuid],
  }),
}));

export const productCategoryRelations = relations(product_category, ({ one }) => ({
  createdBy: one(users, {
    fields: [product_category.created_by],
    references: [users.uuid],
  }),
}));

export const productRelations = relations(product, ({ one }) => ({
  productCategory: one(product_category, {
    fields: [product.product_category_uuid],
    references: [product_category.uuid],
  }),
  createdBy: one(users, {
    fields: [product.created_by],
    references: [users.uuid],
  }),
}));

export const vendorRelations = relations(vendor, ({ one }) => ({
  createdBy: one(users, {
    fields: [vendor.created_by],
    references: [users.uuid],
  }),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
  job: one(job, {
    fields: [payment.job_uuid],
    references: [job.uuid],
  }),
  createdBy: one(users, {
    fields: [payment.created_by],
    references: [users.uuid],
  }),
}));

export const expenseRelations = relations(expense, ({ one }) => ({
  job: one(job, {
    fields: [expense.job_uuid],
    references: [job.uuid],
  }),
  createdBy: one(users, {
    fields: [expense.created_by],
    references: [users.uuid],
  }),
}));

export const jobEntryRelations = relations(job_entry, ({ one }) => ({
  job: one(job, {
    fields: [job_entry.job_uuid],
    references: [job.uuid],
  }),
  product: one(product, {
    fields: [job_entry.product_uuid],
    references: [product.uuid],
  }),
  vendor: one(vendor, {
    fields: [job_entry.vendor_uuid],
    references: [vendor.uuid],
  }),
  createdBy: one(users, {
    fields: [job_entry.created_by],
    references: [users.uuid],
  }),
}));

export const productSerialRelations = relations(product_serial, ({ one }) => ({
  jobEntry: one(job_entry, {
    fields: [product_serial.job_entry_uuid],
    references: [job_entry.uuid],
  }),
  createdBy: one(users, {
    fields: [product_serial.created_by],
    references: [users.uuid],
  }),
}));

export default lib;
