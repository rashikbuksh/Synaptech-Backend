import * as HSCode from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';

import { createRoute, z } from '@hono/zod-openapi';

const tags = ['reports'];

export const productDatabase = createRoute({
  path: '/report/job/product-database',
  method: 'get',
  tags,
  // request: {
  //   query: z.object({
  //     semester_uuid: z.string().describe('The UUID of the semester to filter evaluations'),
  //   }),
  // },
  responses: {
    [HSCode.OK]: jsonContent(
      z.object({
        uuid: z.string().describe('Job UUID'),
        job_id: z.string().describe('Job ID'),
        client_uuid: z.string().describe('Client UUID'),
        client_name: z.string().describe('Client name'),
        job_entry_uuid: z.string().describe('Job entry UUID'),
        product_uuid: z.string().describe('Product UUID'),
        product_name: z.string().describe('Product name'),
        serial_number: z.string().describe('Serial number'),
        purchase_unit_price: z.number().describe('Purchase unit price'),
        selling_unit_price: z.number().describe('Selling unit price'),
        warranty_days: z.number().describe('Warranty days'),
        date_of_purchase: z.string().describe('Date of purchase'),
        expiry_date: z.string().describe('Expiry date'),
        vendor_uuid: z.string().describe('Vendor UUID'),
        vendor_name: z.string().describe('Vendor name'),

      }),
      'Product database',
    ),
  },
});

export type ProductDatabaseRoute = typeof productDatabase;
