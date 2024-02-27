import queryFactory from '@sqltools/base-driver/dist/lib/factory';
import { IBaseQueries, ContextValue, NSDatabase } from '@sqltools/types';

function escapeTableName(table: Partial<NSDatabase.ITable> | string) {
  let items: string[] = [];
  let tableObj = typeof table === 'string' ? <NSDatabase.ITable>{ label: table } : table;
  tableObj.schema && items.push(`\`${tableObj.schema}\``);
  items.push(`\`${tableObj.label}\``);
  return items.join('.');
}

export const describeTable: IBaseQueries['describeTable'] = queryFactory`
  DESCRIBE ${p => escapeTableName(p)}
`;

export const fetchColumns: IBaseQueries['fetchColumns'] = queryFactory`
${p => p?.table ? `SHOW COLUMNS IN ${p.tables} LIMIT ${p.limit || 100};` : ';'}
`;

export const fetchRecords: IBaseQueries['fetchRecords'] = queryFactory`
SELECT *
FROM ${p => escapeTableName(p.table)}
LIMIT ${p => p.limit || 50}
OFFSET ${p => p.offset || 0};
`;

export const countRecords: IBaseQueries['countRecords'] = queryFactory`
SELECT count(1) AS total
FROM ${p => escapeTableName(p.table)}
`;

export const fetchFunctions: IBaseQueries['fetchFunctions'] = queryFactory`
;`;

const fetchTablesAndViews = (type: ContextValue, tableType = 'BASE TABLE'): IBaseQueries['fetchTables'] => queryFactory`
SHOW TABLES ${p => p.search ? `LIKE '${p.search}*'` : ''};
`;

export const fetchTables: IBaseQueries['fetchTables'] = fetchTablesAndViews(ContextValue.TABLE);
export const fetchViews: IBaseQueries['fetchTables'] = fetchTablesAndViews(ContextValue.VIEW, 'VIEW');

export const fetchDatabases: IBaseQueries['fetchDatabases'] = queryFactory`
SHOW DATABASES ${p => p.search ? `LIKE '${p.search}*'` : ''};
`;

export const searchTables: IBaseQueries['searchTables'] = queryFactory`
SHOW TABLES ${p => p.search ? `LIKE '${p.search}*'` : ''};
`;

export const searchColumns: IBaseQueries['searchColumns'] = queryFactory`
${p => p?.tables?.length > 0 ? `SHOW COLUMNS IN ${p => p.tables?.[0]} ${p => p.search ? `LIKE '${p.search}*'` : ''};` : ';'}
`;

