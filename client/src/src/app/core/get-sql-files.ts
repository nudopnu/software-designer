export async function getSqlFiles(
  result: FileSystemDirectoryHandle,
  callback: (content: string) => Promise<any>
) {
  const sqlDir = await result.getDirectoryHandle('sql');
  const schemaDir = await sqlDir.getDirectoryHandle('schema');
  for await (const [filename, handle] of schemaDir.entries()) {
    const isDir = handle.kind === 'directory';
    const isNoSqlFile = !filename.endsWith('.sql');
    if (isDir || isNoSqlFile) continue;
    const sqlFile = await handle.getFile();
    const content = await sqlFile.text();
    await callback(content);
  }
}
