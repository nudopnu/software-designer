import { Injectable } from '@angular/core';
import { parseSql, runMigrations } from '../core/parse-sql';

@Injectable({
  providedIn: 'root',
})
export class FileSystemService {
  async c() {
    const result = await window.showDirectoryPicker();
    if (!result) {
      return;
    }
    const tables = await this.getTablesFromMigrations(result);
    console.log(tables);
  }

  private async getTablesFromMigrations(result: FileSystemDirectoryHandle) {
    const upMigrations: string[] = [];
    const sqlDir = await result.getDirectoryHandle('sql');
    const schemaDir = await sqlDir.getDirectoryHandle('schema');
    for await (const [filename, handle] of schemaDir.entries()) {
      const isDir = handle.kind === 'directory';
      const isNoSqlFile = !filename.endsWith('.sql');
      if (isDir || isNoSqlFile) continue;
      const sqlFile = await handle.getFile();
      const content = await sqlFile.text();
      const [up, down] = await parseSql(content);
      upMigrations.push(up);
    }
    const tables = await runMigrations(upMigrations);
    return tables;
  }
}
