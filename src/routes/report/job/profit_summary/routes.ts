import * as HSCode from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';

import { createRoute, z } from '@hono/zod-openapi';

const tags = ['reports'];

export const profitSummary = createRoute({
  path: '/report/job/profit-summary',
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
        work_order: z.string().describe('Work order number'),
        client_uuid: z.string().describe('Client UUID'),
        client_name: z.string().describe('Client name'),
        remarks: z.string().optional().describe('Remarks for the job'),
        total_sell_revenue: z.number().describe('Total sell revenue for the job'),
        total_purchased_cost: z.number().describe('Total purchased cost for the job'),
        operational_expenses: z.number().describe('Operational expenses for the job'),

      }),
      'The profit summary for jobs',
    ),
  },
});

export type ProfitSummaryRoute = typeof profitSummary;
