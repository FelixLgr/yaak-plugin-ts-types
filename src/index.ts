import * as fs from "node:fs";

import type { PluginDefinition } from '@yaakapp/api';
import JsonToTS from 'json-to-ts';

export const plugin: PluginDefinition = {
  httpRequestActions: [
    {
      label: 'Generate TypeScript Types',
      icon: 'copy',
      async onSelect (ctx, args){
        const responses = await ctx.httpResponse.find({
          requestId: args.httpRequest.id,
        });
        const response = responses[0];

        if (!response?.bodyPath) {
          ctx.toast.show({
            message: 'No response available. Please execute the HTTP request first.',
            color: 'warning',
            icon: 'search',
          });
          return;
        }

        try {
          const body = fs.readFileSync(response.bodyPath, 'utf-8');
          const json = JSON.parse(body);

          const types = JsonToTS(json, { rootName: 'Response' });

          await ctx.clipboard.copyText(types.join('\n\n'));
          ctx.toast.show({
            message: 'TypeScript types copied to clipboard successfully!',
            color: 'success',
            icon: 'check_circle'
          });
        } catch (error) {
          ctx.toast.show({
            message: 'Response is not valid JSON. Please check the response format.',
            color: 'danger',
            icon: 'alert_triangle'
          });
        }
      },
    },
  ],
};
