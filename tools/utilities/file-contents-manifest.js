export default function fileContentsManifest(filePath, file) {
  const parsed = JSON.parse(file.contents);
  const keys = Object.keys(parsed);
  const values = Object.values(parsed);
  const manifest = keys.map((key, index) => {
    return [key, values[index]];
  });

  return JSON.stringify(manifest);
}
