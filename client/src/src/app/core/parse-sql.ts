import Parser from 'web-tree-sitter';
import initSqlJs from 'sql.js/dist/sql-wasm';
import { Attribute, Table } from '../models/data.model';

export async function parseSql(sourceCode: string) {
  let up = '';
  let down = '';
  const parts = sourceCode.split(/(-- \+goose Up|-- \+goose Down)/);
  parts.forEach((part, idx) => {
    if (part === '-- +goose Up') {
      up = parts[idx + 1].trim();
    } else if (part === '-- +goose Down') {
      down = parts[idx + 1].trim();
    }
  });
  return [await cleanSQL(up), await cleanSQL(down)];
}

export async function cleanSQL(sql: string) {
  await Parser.init();
  const Lang = await Parser.Language.load('tree-sitter-sql.wasm');
  const parser = new Parser();
  parser.setLanguage(Lang);
  let tree = parser.parse(sql);
  let removals: { startIndex: number; endIndex: number }[] = [];

  function clean(node: Parser.SyntaxNode) {
    if (node.isError) {
      const { startIndex, endIndex } = node;
      removals.push({ startIndex, endIndex });
    } else {
      node.children.forEach((node: Parser.SyntaxNode) => clean(node));
    }
  }
  clean(tree.rootNode);
  let offset = 0;
  removals.forEach(({ startIndex, endIndex }) => {
    sql = sql.slice(0, startIndex + offset) + sql.slice(endIndex + offset);
    offset -= endIndex + startIndex;
  });
  return sql;
}

export async function runMigrations(migrations: string[]) {
  const config = {
    locateFile: (filename: string) => `/dist/${filename}`,
  };
  const SQL = await initSqlJs(config);
  const db = new SQL.Database();

  console.log(db.exec('SELECT sqlite_version();'));

  for (let i = 0; i < migrations.length; i++) {
    const migration = migrations[i];
    try {
      db.exec(migration);
    } catch (error) {
      console.log(error);
    }
  }

  const tables: Table[] = [];
  const tableNames = db
    .exec("SELECT name FROM sqlite_master WHERE type='table';")[0]
    .values.flatMap((x) => x);

  for (let i = 0; i < tableNames.length; i++) {
    const tableName = tableNames[i]!.toString();
    const columns = db.exec(
      `select name, type, pk from pragma_table_info("${tableNames[0]}")`
    )[0];
    const table: Table = {
      name: tableName,
      attributes: columns.values.map(
        (row) =>
          ({
            name: row[0],
            keyType: row[2] === 1 ? 'primary' : 'none',
            type: row[1],
          } as Attribute)
      ),
    };
    tables.push(table);
  }
  return tables;
}
