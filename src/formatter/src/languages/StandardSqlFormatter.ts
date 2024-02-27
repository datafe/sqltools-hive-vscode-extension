import AbstractFormatter from './utils/abstract';
import { TokenizerConfig } from '../core/types';

export default class StandardSqlFormatter extends AbstractFormatter {
  getTokenizerConfig() {
    return <TokenizerConfig>{
      reservedWords,
      reservedTopLevelWords,
      reservedNewlineWords,
      reservedTopLevelWordsNoIndent,
      stringTypes: [`""`, "N''", "''", '``', '[]', "E''"],
      openParens: ['(', 'CASE'],
      closeParens: [')', 'END'],
      indexedPlaceholderTypes: ['?'],
      namedPlaceholderTypes: ['@', ':', '%', '$'],
      lineCommentTypes: ['#', '--'],
      specialWordChars: []
    };
  }
}

const reservedWords = [
  'ACCESSIBLE',
  'ACTION',
  'AGAINST',
  'AGGREGATE',
  'ALGORITHM',
  'ALL',
  'ALTER',
  'ANALYSE',
  'ANALYZE',
  'AS',
  'ASC',
  'AUTOCOMMIT',
  'AUTO_INCREMENT',
  'BACKUP',
  'BEGIN',
  'BETWEEN',
  'BINLOG',
  'BOTH',
  'CASCADE',
  'CASE',
  'CHANGE',
  'CHANGED',
  'CHARACTER SET',
  'CHARSET',
  'CHECK',
  'CHECKSUM',
  'COLLATE',
  'COLLATION',
  'COLUMN',
  'COLUMNS',
  'COMMENT',
  'COMMIT',
  'COMMITTED',
  'COMPRESSED',
  'CONCURRENT',
  'CONSTRAINT',
  'CONTAINS',
  'CONVERT',
  'COUNT',
  'CREATE',
  'CROSS',
  'CURRENT_TIMESTAMP',
  'DATABASE',
  'DATABASES',
  'DAY_HOUR',
  'DAY_MINUTE',
  'DAY_SECOND',
  'DAY',
  'DEFAULT',
  'DEFINER',
  'DELAYED',
  'DELETE',
  'DESC',
  'DESCRIBE',
  'DETERMINISTIC',
  'DISTINCT',
  'DISTINCTROW',
  'DIV',
  'DO',
  'DROP',
  'DUMPFILE',
  'DUPLICATE',
  'DYNAMIC',
  'ELSE',
  'ENCLOSED',
  'END',
  'ENGINE',
  'ENGINES',
  'ENGINE_TYPE',
  'ESCAPE',
  'ESCAPED',
  'EVENTS',
  'EXEC',
  'EXECUTE',
  'EXISTS',
  'EXPLAIN',
  'EXTENDED',
  'FAST',
  'FETCH',
  'FIELDS',
  'FILE',
  'FIRST',
  'FIXED',
  'FLUSH',
  'FOR',
  'FORCE',
  'FOREIGN',
  'FULL',
  'FULLTEXT',
  'FUNCTION',
  'GLOBAL',
  'GRANTS',
  'GROUP_CONCAT',
  'HEAP',
  'HIGH_PRIORITY',
  'HOSTS',
  'HOUR',
  'HOUR_MINUTE',
  'HOUR_SECOND',
  'IDENTIFIED',
  'IF',
  'IFNULL',
  'IGNORE',
  'IN',
  'INDEX',
  'INDEXES',
  'INFILE',
  'INSERT',
  'INSERT_ID',
  'INSERT_METHOD',
  'INTERVAL',
  'INTO',
  'INVOKER',
  'IS',
  'ISOLATION',
  'KEY',
  'KEYS',
  'KILL',
  'LAST_INSERT_ID',
  'LEADING',
  'LEVEL',
  'LIKE',
  'LINEAR',
  'LINES',
  'LOAD',
  'LOCAL',
  'LOCK',
  'LOCKS',
  'LOGS',
  'LOW_PRIORITY',
  'MARIA',
  'MASTER',
  'MASTER_CONNECT_RETRY',
  'MASTER_HOST',
  'MASTER_LOG_FILE',
  'MATCH',
  'MAX_CONNECTIONS_PER_HOUR',
  'MAX_QUERIES_PER_HOUR',
  'MAX_ROWS',
  'MAX_UPDATES_PER_HOUR',
  'MAX_USER_CONNECTIONS',
  'MEDIUM',
  'MERGE',
  'MINUTE',
  'MINUTE_SECOND',
  'MIN_ROWS',
  'MODE',
  'MONTH',
  'MRG_MYISAM',
  'MYISAM',
  'NAMES',
  'NATURAL',
  'NOT',
  'NOW()',
  'NULL',
  'OFFSET',
  'ON DELETE',
  'ON UPDATE',
  'ON',
  'ONLY',
  'OPEN',
  'OPTIMIZE',
  'OPTION',
  'OPTIONALLY',
  'OUTFILE',
  'PACK_KEYS',
  'PAGE',
  'PARTIAL',
  'PARTITION',
  'PARTITIONS',
  'PASSWORD',
  'PRIMARY',
  'PRIVILEGES',
  'PROCEDURE',
  'PROCESS',
  'PROCESSLIST',
  'PURGE',
  'QUICK',
  'RAID0',
  'RAID_CHUNKS',
  'RAID_CHUNKSIZE',
  'RAID_TYPE',
  'RANGE',
  'READ',
  'READ_ONLY',
  'READ_WRITE',
  'REFERENCES',
  'REGEXP',
  'RELOAD',
  'RENAME',
  'REPAIR',
  'REPEATABLE',
  'REPLACE',
  'REPLICATION',
  'RESET',
  'RESTORE',
  'RESTRICT',
  'RETURN',
  'RETURNS',
  'REVOKE',
  'RLIKE',
  'ROLLBACK',
  'ROW',
  'ROWS',
  'ROW_FORMAT',
  'SECOND',
  'SECURITY',
  'SEPARATOR',
  'SERIALIZABLE',
  'SESSION',
  'SHARE',
  'SHOW',
  'SHUTDOWN',
  'SLAVE',
  'SONAME',
  'SOUNDS',
  'SQL',
  'SQL_AUTO_IS_NULL',
  'SQL_BIG_RESULT',
  'SQL_BIG_SELECTS',
  'SQL_BIG_TABLES',
  'SQL_BUFFER_RESULT',
  'SQL_CACHE',
  'SQL_CALC_FOUND_ROWS',
  'SQL_LOG_BIN',
  'SQL_LOG_OFF',
  'SQL_LOG_UPDATE',
  'SQL_LOW_PRIORITY_UPDATES',
  'SQL_MAX_JOIN_SIZE',
  'SQL_NO_CACHE',
  'SQL_QUOTE_SHOW_CREATE',
  'SQL_SAFE_UPDATES',
  'SQL_SELECT_LIMIT',
  'SQL_SLAVE_SKIP_COUNTER',
  'SQL_SMALL_RESULT',
  'SQL_WARNINGS',
  'START',
  'STARTING',
  'STATUS',
  'STOP',
  'STORAGE',
  'STRAIGHT_JOIN',
  'STRING',
  'STRIPED',
  'SUPER',
  'TABLE',
  'TABLES',
  'TEMPORARY',
  'TERMINATED',
  'THEN',
  'TO',
  'TRAILING',
  'TRANSACTIONAL',
  'TRIGGER',
  'TRUE',
  'TRUNCATE',
  'TYPE',
  'TYPES',
  'UNCOMMITTED',
  'UNIQUE',
  'UNLOCK',
  'UNSIGNED',
  'USAGE',
  'USE',
  'USING',
  'VARIABLES',
  'VIEW',
  'WHEN',
  'WITH',
  'WORK',
  'WRITE',
  'YEAR_MONTH',
];

const reservedTopLevelWords = [
  'ADD',
  'AFTER',
  'ALTER COLUMN',
  'ALTER TABLE',
  'CREATE OR REPLACE',
  'DECLARE',
  'DELETE FROM',
  'EXCEPT',
  'FETCH FIRST',
  'FROM',
  'GO',
  'GRANT',
  'GROUP BY',
  'HAVING',
  'INSERT INTO',
  'INSERT',
  'LIMIT',
  'MODIFY',
  'ORDER BY',
  'RETURNING',
  'SELECT',
  'SET CURRENT SCHEMA',
  'SET SCHEMA',
  'SET',
  'UPDATE',
  'VALUES',
  'WHERE',
];

const reservedTopLevelWordsNoIndent = ['INTERSECT ALL', 'INTERSECT', 'MINUS', 'UNION ALL', 'UNION'];

const reservedNewlineWords = [
  'AND',
  'CROSS APPLY',
  'CROSS JOIN',
  'ELSE',
  'INNER JOIN',
  "FULL JOIN",
  "FULL OUTER JOIN",
  'LEFT JOIN',
  'LEFT OUTER JOIN',
  'NATURAL JOIN',
  'OR',
  'OUTER APPLY',
  'OUTER JOIN',
  'RENAME',
  'RIGHT JOIN',
  'RIGHT OUTER JOIN',
  'JOIN',
  'WHEN',
  'XOR',
];