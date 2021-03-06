import { TimeFilterOptions } from '../../../filter';
import { QueryFormat, QueryOptions } from '../../../query';
import { MetadataOptions } from '../../../metadata';

import { DataSource } from './datasource';


export interface DataSourceOptions {
  title: string;
  alias?: string;
  legend?: DataSourceLegendOptions;
  metadata?: MetadataOptions;
  view?: olx.layer.ImageOptions;
}

export interface DataSourceContext extends DataSourceOptions {
  type: string;
}

export interface DataSourceLegendOptions {
  collapsed?: boolean;
  url?: string;
  html?: string;
  style?: {[key: string]: string | number};
  title?: string;
}

export interface QueryableDataSourceOptions extends DataSourceOptions {
  queryable?: boolean;
  queryFormat?: QueryFormat;
  queryTitle?: string;
  queryHtmlTarget?: string;
}

export interface QueryableDataSource extends DataSource {
  queryFormat: QueryFormat;
  queryTitle?: string;
  queryHtmlTarget?: string;
  options: QueryableDataSourceOptions;
  getQueryUrl(options: QueryOptions): string;
}

export interface FilterableDataSourceOptions extends DataSourceOptions,
    olx.source.ImageWMSOptions {

  filterable?: boolean;
  timeFilter?: TimeFilterOptions;
}

export interface FilterableDataSource extends DataSource {
  options: FilterableDataSourceOptions;
  filterByDate(date: Date | [Date, Date]);
}
