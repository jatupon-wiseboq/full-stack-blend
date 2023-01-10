// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HierarchicalDataRow, ActionType} from "../helpers/DatabaseHelper";
import {DataTableSchema} from "../helpers/SchemaHelper";
import {Base as Connector} from '../connectors/Base';

const sitemapDictionary = {};

const SitemapHelper = {
  register: (path: string, frequency: string = 'weekly', priority: number = 0.5) => {
    sitemapDictionary[path] = {
      frequency: frequency,
      priority: priority
    };
  },
  generateXMLDocument: () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${Object.keys(sitemapDictionary).map((key) => `
   <url>
      <loc>${escape(key)}</loc>${sitemapDictionary[key].frequency && `
      <changefreq>${sitemapDictionary[key].frequency}</changefreq>` || ''}${sitemapDictionary[key].priority && `
      <priority>${sitemapDictionary[key].priority}</priority>` || ''}
   </url>`).join('\n')}
</urlset> 
`;
  }
};

export {SitemapHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.