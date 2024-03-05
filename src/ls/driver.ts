import * as Queries from './queries';
import stripComments from 'strip-comments';
import AbstractDriver from '@sqltools/base-driver';
import generateId from '../util/internal-id';
import {
  HiveClient,
  HiveUtils,
  thrift as hiveThrift,
  connections as hiveConnections,
  auth as hiveAuth,
} from 'hive-driver';
import { IConnectionDriver, IConnection, NSDatabase, Arg0, MConnectionExplorer, ContextValue, IQueryOptions } from '@sqltools/types';
import IOperation from 'hive-driver/dist/contracts/IOperation';
import IHiveSession, { ColumnRequest, SchemasRequest, TablesRequest } from 'hive-driver/dist/contracts/IHiveSession';
import { keywordsArr } from './keywords';

const toBool = (v: any) => v && (v.toString() === '1' || v.toString().toLowerCase() === 'true' || v.toString().toLowerCase() === 'yes');

export default class HiveSQL<O = any> extends AbstractDriver<any, O> implements IConnectionDriver {
  queries = Queries;
  // private driver: AbstractDriver<any, any>;

  private hiveClient: HiveClient;
  private connectedHiveClient: HiveClient;
  private hiveUtils: HiveUtils;

  constructor(public credentials: IConnection, getWorkSpaceFolders) {
    // move to different drivers
    super(credentials, getWorkSpaceFolders);

    const { TCLIService, TCLIService_types } = hiveThrift || {};

    // create hive-driver
    this.hiveClient = new HiveClient(
      TCLIService,
      TCLIService_types,
    );

    this.hiveUtils = new HiveUtils(
      TCLIService_types,
    );

  }

  /** create a session */
  public async open(): Promise<IHiveSession> {

    // if (this.connection) {
    //   return this.connection;
    // }

    if (!this.connection) {
      this.connectedHiveClient = await this.hiveClient.connect(
        {
          host: this.credentials?.host,
          port: this.credentials?.port,
        },
        new hiveConnections.TcpConnection(),
        this.credentials?.username && this.credentials?.password ?
          new hiveAuth.PlainTcpAuthentication({
            username: this.credentials?.username,
            password: this.credentials?.password,
          }) : new hiveAuth.NoSaslAuthentication(),
      );
      this.connection = this.connectedHiveClient as any;
    }

    // create session
    const session = await this.connectedHiveClient.openSession({
      client_protocol: this.getHiveCliServiceProtocolVersion(),
    });

    return session;

  }

  private getHiveCliServiceProtocolVersion() {
    const { TCLIService_types } = hiveThrift || {};
    const chosen: string = this.credentials?.hiveCLIServiceProtocolVersion;
    const fit = TCLIService_types?.TProtocolVersion?.[`HIVE_CLI_SERVICE_PROTOCOL_${chosen}`];
    return fit !== undefined ? fit : TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V11;
  }

  public async close() {

    try {
      await this.connectedHiveClient?.close?.();
    } catch (e) {
      console.error(e);
    }

    this.connection = null;
    this.connectedHiveClient = null;

    if (!this.connection) return Promise.resolve();
  }

  /**
   * values: ex [{"_c0":1}]
   */
  private executeOneQuery = async (session: IHiveSession, query: string): Promise<{ queriesResults: IOperation; columns: string[]; values: any[] }> => {

    let queriesResults: IOperation;
    let columns: string[];
    let values: ({ [key: string]: any })[];

    if (!query || !session) return { queriesResults, columns, values };

    try {
      const operation = await session?.executeStatement?.(query, { runAsync: false });

      await this.hiveUtils.waitUntilReady(operation, false, () => { });
      queriesResults = await this.hiveUtils.fetchAll(operation);
      await operation.close();
      // ex [{"_c0":1}]
      values = this.hiveUtils.getResult(operation).getValue?.();

      // this.hiveUtils.getResult(operation).getValue?.();

      columns = queriesResults?.getSchema?.()?.columns?.map?.(c => c?.columnName) || [];

    } catch (e) {
      console.error(e);
    }

    return { queriesResults, columns, values };

  }

  private removeComments(str: string) {

    if (!str) return '';

    let stringWithoutComments = '';

    try {

      // remove comments by stripComments
      stringWithoutComments = stripComments(str) || '';

      // without comments
      stringWithoutComments = str.replace(/(\/\*[^*]*\*\/)|(\/\/[^*]*)|(--[^.].*)/gm, '');

      // without linebreak
      stringWithoutComments = stringWithoutComments.replace(/^\s*\n/gm, "")

      // without whitespace
      stringWithoutComments = stringWithoutComments.replace(/^\s+/gm, "")

    } catch (e) {
      console.error(e);
    }

    return stringWithoutComments || '';

  }

  public query: (typeof AbstractDriver)['prototype']['query'] = async (queryStr, opt = {}) => {

    const removedCommentsStr = this.removeComments(queryStr as string);

    // split by semicolon
    const queries = removedCommentsStr?.split?.(/;/g) || [];

    // open session 
    const session = await this.open();

    if (!session) return [];

    const result: NSDatabase.IResult[] = [];

    for (let i = 0; i < queries.length; i++) {

      const query = queries[i];

      if (!query) continue;

      const { columns, values } = await this.executeOneQuery(session, queries[i]);

      try {

        result.push({
          cols: columns,
          connId: this.getId(),
          messages: [{ date: new Date(), message: `Query ok with ${values.length} results.` }],
          results: values.map((_row: any) => {
            const row = {};
            columns?.forEach?.((columnName) => {
              // some columns have dots
              const arr = columnName?.split?.('\.') || [];
              const colName = arr?.[arr?.length - 1];
              row[columnName] = _row?.[colName];
            })
            return row;
          }),
          query: query?.toString?.() || '',
          requestId: opt.requestId,
          resultId: generateId(),
        });

      } catch (e) {
        console.error(e);
      }
    }

    await session.close();
    // await this.close();

    /**
     * write the method to execute queries here!!
     */
    return result;

  }

  /** if you need a different way to test your connection, you can set it here.
   * Otherwise by default we open and close the connection only
   */
  public async testConnection() {
    await this.open();
    // await this.query('SELECT 1', {});
  }

  /**
   * values: ex [{"_c0":1}]
   */
  private commonHandleOperation = async (operation: IOperation) => {
    let queriesResults: IOperation;
    let columns: string[];
    let values: ({ [key: string]: any })[];
    try {
      await this.hiveUtils.waitUntilReady(operation, false, () => { });
      queriesResults = await this.hiveUtils.fetchAll(operation);
      await operation.close();
      // ex [{"_c0":1}]
      values = this.hiveUtils.getResult(operation).getValue?.() || [];
      columns = queriesResults?.getSchema?.()?.columns?.map?.(c => c?.columnName) || [];
    } catch (e) {
      console.error(e);
    }
    return { queriesResults, columns, values };
  };

  private async listDatabases(): Promise<NSDatabase.IDatabase[]> {
    const session = await this.open();

    // const operation = await session?.getCatalogs?.();

    const { values } = await this.executeOneQuery(session, 'show databases');

    return values?.map?.((db) => ({ // {"database_name": "default"}
      type: ContextValue.DATABASE,
      iconName: 'database',
      childType: ContextValue.SCHEMA,
      catalog: db?.[Object.keys(db || {})?.[0]],
      database: db?.[Object.keys(db || {})?.[0]],
      label: db?.[Object.keys(db || {})?.[0]],
      schema: undefined,
      isView: false
    })) || [];

  }

  private async listSchemas(parent, item): Promise<NSDatabase.ISchema[]> {
    const session = await this.open();

    const database = parent?.catalog || parent?.database;

    const request = {
      catalogName: database,
    } as SchemasRequest;

    if (item?.search) request.schemaName = item?.search;

    const operation = await session?.getSchemas?.(request);

    const { values } = await this.commonHandleOperation(operation);

    return values?.map?.((schema: { TABLE_SCHEM: string; TABLE_CATALOG: string }) => ({
      type: ContextValue.SCHEMA,
      iconId: 'group-by-ref-type',
      childType: ContextValue.TABLE,
      database: database,
      catalog: schema?.TABLE_CATALOG || database,
      label: schema?.TABLE_SCHEM,
      schema: schema?.TABLE_SCHEM,
      isView: false
    })) || [];

  }

  private async listTables(parent, item): Promise<NSDatabase.ITable[]> {
    const session = await this.open();

    const database = parent?.catalog || parent?.database;

    const isView = item?.childType === ContextValue.VIEW;

    const request = {
      catalogName: database,
      schemaName: parent?.schema,
      tableTypes: isView ? ['VIEW'] : ['TABLE', 'VIEW', 'SYSTEM TABLE', 'GLOBAL TEMPORARY', 'LOCAL TEMPORARY', 'ALIAS', 'SYNONYM'], // ['TABLE', 'VIEW', 'SYSTEM TABLE', 'GLOBAL TEMPORARY', 'LOCAL TEMPORARY', 'ALIAS', 'SYNONYM']
    } as TablesRequest;

    if (item?.search) request.tableName = item?.search;

    const operation = await session?.getTables?.(request);
    const { values } = await this.commonHandleOperation(operation);
    return values?.map?.((table: {
      TABLE_CAT: string;
      TABLE_SCHEM: string;
      TABLE_NAME: string;
      TABLE_TYPE: string;
      REMARKS: string;
      TYPE_CAT?: string;
      TYPE_SCHEM?: string;
      TYPE_NAME?: string;
      SELF_REFERENCING_COL_NAME?: string;
      REF_GENERATION?: string;
    }) => ({
      type: item?.childType || (isView ? ContextValue.VIEW : ContextValue.TABLE),
      iconName: isView ? 'view' : 'table',
      childType: ContextValue.COLUMN,
      database: database,
      catalog: table?.TABLE_CAT || database,
      schema: table?.TABLE_SCHEM || parent?.schema,
      label: table?.TABLE_NAME,
      table: table?.TABLE_NAME,
      detail: table?.REMARKS,
      isView,
    })) || [];
  }

  /** 
   * equals to listColumns
   * 
   * */
  private async getTable(parent, item): Promise<NSDatabase.IColumn[]> {
    const session = await this.open();

    const database = parent?.catalog || parent?.database;

    const request = {
      catalogName: database,
      schemaName: parent?.schema,
      tableName: parent?.table,
    } as ColumnRequest;

    if (item?.search) request.columnName = item?.search;

    // const queryPartitionResults = await this.executeOneQuery(session, `show partitions ${database ? `${database}.` : ''}${parent.table}`);
    // queryPartitionResults?.values?.map?.((partition) => ({ // {"database_name": "default"}
    //   type: ContextValue.COLUMN,
    //   iconId: 'archive',
    //   childType: ContextValue.NO_CHILD,
    //   catalog: parent?.catalog,
    //   database: database,
    //   label: JSON.stringify(partition),
    //   table: parent?.table,
    //   schema: parent?.schema,
    //   isView: false,
    // })) || [];

    const operation = await session?.getColumns?.(request);

    const { values } = await this.commonHandleOperation(operation);
    return values?.map?.((column: {
      TABLE_CAT?: string;
      TABLE_SCHEM: string;
      TABLE_NAME: string;
      TABLE_TYPE: string;
      REMARKS: string;
      TYPE_CAT?: string;
      TYPE_SCHEM?: string;
      SELF_REFERENCING_COL_NAME?: string;
      REF_GENERATION?: string;
      COLUMN_NAME: string;
      DATA_TYPE: number;
      TYPE_NAME: string; // "STRING"
      COLUMN_SIZE: number;
      BUFFER_LENGTH?: number;
      DECIMAL_DIGITS?: number;
      NUM_PREC_RADIX?: number;
      NULLABLE?: number; // 1
      COLUMN_DEF?: string;
      SQL_DATA_TYPE?: string;
      SQL_DATETIME_SUB?: string;
      CHAR_OCTET_LENGTH?: number;
      ORDINAL_POSITION?: number; // 1
      IS_NULLABLE: 'YES' | 'NO';
      SCOPE_CATALOG?: string;
      SCOPE_SCHEMA?: string;
      SCOPE_TABLE?: string;
      SOURCE_DATA_TYPE?: string;
      IS_AUTO_INCREMENT: 'YES' | 'NO';
    }) => ({
      type: ContextValue.COLUMN,
      iconName: column?.IS_AUTO_INCREMENT === 'YES' ? 'pk' : 'column',
      childType: ContextValue.NO_CHILD,
      database: parent?.database,
      catalog: parent?.catalog,
      schema: column?.TABLE_SCHEM || parent?.schema,
      table: column?.TABLE_NAME || parent?.table,
      label: column?.COLUMN_NAME,
      column: column?.COLUMN_NAME,
      size: column?.COLUMN_SIZE,
      dataType: column?.TYPE_NAME,
      detail: `${column?.TYPE_NAME ? `${column?.TYPE_NAME} ` : ''}${column?.REMARKS || ''}`,
      isNullable: column?.IS_NULLABLE === 'YES',
    })) || [];
  }

  /**
   * This method is a helper to generate the connection explorer tree.
   * it gets the child items based on current item
   */
  public async getChildrenForItem({ item, parent }: Arg0<IConnectionDriver['getChildrenForItem']>) {

    // switch (item.type) {
    //   case ContextValue.CONNECTION:
    //   case ContextValue.CONNECTED_CONNECTION:
    //     return this.queryResults(this.queries.fetchDatabases(item));
    //   case ContextValue.TABLE:
    //   case ContextValue.VIEW:
    //     return this.getColumns(item as NSDatabase.ITable);
    //   case ContextValue.RESOURCE_GROUP:
    //     return this.getChildrenForGroup({ item, parent });
    //   case ContextValue.DATABASE:
    //     return <MConnectionExplorer.IChildItem[]>[
    //       { label: 'Tables', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.TABLE },
    //       { label: 'Views', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.VIEW },
    //       // { label: 'Functions', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.FUNCTION },
    //     ];
    // }
    // return [];

    switch (item.type) {
      case ContextValue.CONNECTION:
      case ContextValue.CONNECTED_CONNECTION:
        return <MConnectionExplorer.IChildItem[]>[
          { label: 'Databases', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.DATABASE }
        ];
      case ContextValue.DATABASE:
        return <MConnectionExplorer.IChildItem[]>[
          { label: 'Schemas', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.SCHEMA }
        ];
      case ContextValue.SCHEMA:
        return <MConnectionExplorer.IChildItem[]>[
          { label: 'Tables', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.TABLE },
          { label: 'Views', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.VIEW },
        ];
      // return this.getTable(parent, item);
      // return <NSDatabase.IDatabase[]>[{
      //   label: 'Catalogs',
      //   database: this.credentials.project,
      //   type: ContextValue.DATABASE,
      //   detail: 'Catalogs'
      // }];

      // return <MConnectionExplorer.IChildItem[]>[
      //   { label: 'Tables', type: ContextValue.RESOURCE_GROUP, iconId: 'table', childType: ContextValue.TABLE }
      // ];
      case ContextValue.VIEW:
      case ContextValue.MATERIALIZED_VIEW:
      case ContextValue.TABLE:
        return this.getTable(parent, item);
      case ContextValue.RESOURCE_GROUP:
        return this.getChildrenForGroup({ item, parent });
    }
    return [];
  }

  /**
 * This method is a helper to generate the connection explorer tree.
 * It gets the child based on child types
 */
  private async getChildrenForGroup({ parent, item }: Arg0<IConnectionDriver['getChildrenForItem']>) {
    switch (item.childType) {
      case ContextValue.DATABASE:
        const databases = await this.listDatabases();
        return <MConnectionExplorer.IChildItem[]>databases;
      case 'tableCatalog' as ContextValue:
        const tableCatalogs = await this.listDatabases();
        return <MConnectionExplorer.IChildItem[]>tableCatalogs;
      case ContextValue.SCHEMA:
        const schemas = await this.listSchemas(parent, item);
        return <MConnectionExplorer.IChildItem[]>schemas;
      case ContextValue.VIEW:
        const views = await this.listTables(parent, item);
        return <MConnectionExplorer.IChildItem[]>views;
      case ContextValue.TABLE:
        const tables = await this.listTables(parent, item);
        return <MConnectionExplorer.IChildItem[]>tables;
    }
    return [];

    // switch (item.childType) {
    //   case ContextValue.TABLE:
    //     return this.queryResults(this.queries.fetchTables(parent as NSDatabase.ISchema)).then(res => res.map(t => ({ ...t, isView: toBool(t.isView) })));
    //   case ContextValue.VIEW:
    //     return this.queryResults(this.queries.fetchViews(parent as NSDatabase.ISchema)).then(res => res.map(t => ({ ...t, isView: toBool(t.isView) })));
    //   case ContextValue.FUNCTION:
    //     return this.queryResults(this.queries.fetchFunctions(parent as NSDatabase.ISchema));
    // }
    // return [];

  }

  public async searchItems(itemType: ContextValue, search: string, extraParams: any = {}): Promise<NSDatabase.SearchableItem[]> {
    switch (itemType) {
      case ContextValue.DATABASE:
      case 'tableCatalog' as ContextValue:
        return await this.listDatabases();
      case ContextValue.SCHEMA:
        return await this.listSchemas({ ...extraParams }, { search });
      case ContextValue.TABLE:
        return await this.listTables({ ...extraParams }, { search });
      // return this.queryResults(this.queries.searchTables({ search })).then(r => r.map(t => {
      //   t.isView = toBool(t.isView);
      //   return t;
      // }));
      // return tables;
      case ContextValue.COLUMN:
        const columns: NSDatabase.IColumn[] = [];
        if (extraParams?.tables?.length > 0) {
          for (let i = 0; i < extraParams?.tables?.length; i++) {
            const table = extraParams?.tables?.[i]?.label;
            const schema = extraParams?.tables?.[i]?.schema;
            const database = extraParams?.tables?.[i]?.database;
            const _columns = await this.getTable({ ...extraParams, database, catalog: database, schema, table }, { search });
            if (_columns?.length > 0) columns.push(..._columns);
          }
        }
        return columns;
      // const columns: NSDatabase.IColumn[] = [];
      // return await this.getTable({ ...extraParams }, { search });
      // if (extraParams?.tables) {
      //   for (let i = 0; i < extraParams?.tables?.length; i++) {
      //     const table = extraParams?.tables?.[i];
      //     const _columns = await this.getTable({ ...extraParams, table }, { search });
      //     if (_columns.length > 0) columns.push(..._columns);
      //   }
      // } else if (extraParams?.table) {
      //   const _columns = await this.getTable({ ...extraParams }, { search });
      //   if (_columns.length > 0) columns.push(..._columns);
      // }
      // return columns;
      // return this.queryResults(this.queries.searchColumns({ search, ...extraParams })).then(r => r.map(c => {
      //   // c.isFk = toBool(c.isFk);
      //   // c.isFk = toBool(c.isFk);
      //   return c;
      // }));
    }
  }

  // public async getInsertQuery(params: { item: NSDatabase.ITable; columns: NSDatabase.IColumn[]; }): Promise<string> {

  //   const values = params?.columns?.map?.(c => {
  //     switch (c?.typeName) {
  //       case 'STRING':
  //         return 'test';
  //       case 'INT':
  //       case 'FLOAT':
  //       case 'DOUBLE':
  //         return '1';
  //       case 'BOOLEAN':
  //         return 'true';
  //     }
  //     if (c?.isNullable) return 'null';
  //     else return '0';
  //   }).join(', ');

  //   return await Promise.resolve(`INSERT INTO TABLE ${params?.item?.label} \n\tVALUES (${values});`);
  // }

  public async showRecords(table: NSDatabase.ITable, opt: IQueryOptions & { limit: number; page?: number; }): Promise<NSDatabase.IResult<any>[]> {
    const queryStr = `SELECT * FROM ${table.label} LIMIT ${opt.limit || 200}`;
    return await this.query(queryStr, opt);
  }

  // private async getColumns(parent: NSDatabase.ITable): Promise<NSDatabase.IColumn[]> {
  //   const results = await this.queryResults(this.queries.fetchColumns(parent));
  //   return results.map((obj) => {
  //     obj.isPk = toBool(obj.isPk);
  //     obj.isFk = toBool(obj.isFk);

  //     return <NSDatabase.IColumn>{
  //       ...obj,
  //       isNullable: toBool(obj.isNullable),
  //       iconName: obj.isPk ? 'pk' : (obj.isFk ? 'fk' : null),
  //       childType: ContextValue.NO_CHILD,
  //       table: parent
  //     };
  //   });
  // }

  // public async getFunctions(): Promise<NSDatabase.IFunction[]> {
  //   const functions = await (
  //     await this.is55OrNewer()
  //       ? this.driver.query(this.queries.fetchFunctions)
  //       : this.driver.query(this.queries.fetchFunctionsV55Older)
  //   );

  //   return functions[0].results
  //     .reduce((prev, curr) => prev.concat(curr), [])
  //     .map((obj) => {
  //       return {
  //         ...obj,
  //         args: obj.args ? obj.args.split(/, */g) : [],
  //         database: obj.dbname,
  //         schema: obj.dbschema,
  //       } as NSDatabase.IFunction;
  //     })
  // }

  // mysqlVersion: string = null;

  // private async getVersion() {
  //   if (this.mysqlVersion) return Promise.resolve(this.mysqlVersion);
  //   this.mysqlVersion = await this.queryResults<any>(`SHOW variables WHERE variable_name = 'version'`).then((res) => res[0].Value);
  //   return this.mysqlVersion;
  // }

  // private async is55OrNewer() {
  //   try {
  //     await this.getVersion();
  //     return compareVersions.compare(this.mysqlVersion, '5.5.0', '>=');
  //   } catch (error) {
  //     return true;
  //   }
  // }

  private completionsCache: { [w: string]: NSDatabase.IStaticCompletion } = null;
  // public getStaticCompletions: IConnectionDriver['getStaticCompletions'] = async () => {
  //   return {};
  // }
  public getStaticCompletions = async () => {
    if (this.completionsCache) return this.completionsCache;
    this.completionsCache = {};
    const items: string[] = keywordsArr;
    items.forEach((item: string) => {
      this.completionsCache[item] = {
        label: item,
        detail: item,
        filterText: item,
        sortText: (['SELECT', 'CREATE', 'UPDATE', 'DELETE'].includes(item) ? '2:' : '') + item,
        documentation: {
          value: `\`\`\`yaml\nWORD: ${item}\nTYPE: ${item}\n\`\`\``,
          kind: 'markdown'
        }
      }
    });
    return this.completionsCache;
  }

  // public getStaticCompletions = async () => {

  //   if (this.completionsCache) return this.completionsCache;
  //   try {
  //     this.completionsCache = {};
  //     const items = await this.queryResults(/* sql */`
  //     SELECT UPPER(word) AS label,
  //       (
  //         CASE
  //           WHEN reserved = 1 THEN 'RESERVED KEYWORD'
  //           ELSE 'KEYWORD'
  //         END
  //       ) AS "desc"
  //     FROM INFORMATION_SCHEMA.KEYWORDS
  //     ORDER BY word ASC
  //     `);

  //     items.forEach((item: any) => {
  //       this.completionsCache[item.label] = {
  //         label: item.label,
  //         detail: item.label,
  //         filterText: item.label,
  //         sortText: (['SELECT', 'CREATE', 'UPDATE', 'DELETE'].includes(item.label) ? '2:' : '') + item.label,
  //         documentation: {
  //           value: `\`\`\`yaml\nWORD: ${item.label}\nTYPE: ${item.desc}\n\`\`\``,
  //           kind: 'markdown'
  //         }
  //       }
  //     });
  //   } catch (error) {
  //     // use default reserved words
  //     this.completionsCache = keywordsCompletion;
  //   }

  //   return this.completionsCache;
  // }
}