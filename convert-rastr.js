import sharp from 'sharp';
import { globSync } from 'glob';
import path from 'path';
import fs from 'fs';
import cliProgress from 'cli-progress';

// Найти все изображения (png, jpg, jpeg)
const files = globSync('src/**/*.{png,jpg,jpeg}');

// Отфильтровать уже сконвертированные
const filteredFiles = files.filter(file => {
  const baseName = path.basename(file);
  return !baseName.includes('@1x') && !baseName.includes('@2x');
});

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
bar.start(filteredFiles.length, 0);

const work = filteredFiles.map(async (file) => {
  const parsed = path.parse(file);
  const dir = parsed.dir;
  const baseName = parsed.name;
  const ext = parsed.ext.toLowerCase();

  const file1x = path.join(dir, `${baseName}@1x${ext}`);
  const file2x = path.join(dir, `${baseName}@2x${ext}`);
  const fileWebp = path.join(dir, `${baseName}.webp`);

  const img = sharp(file);
  const metadata = await img.metadata();

  // Создаем @2x — копию оригинала
  await img.toFile(file2x);

  // Создаем @1x — уменьшенную версию
  await sharp(file)
    .resize(Math.round(metadata.width / 2), Math.round(metadata.height / 2))
    .toFile(file1x);

  // Создаем WebP-версию
  await sharp(file)
    .webp({ quality: 80 })
    .toFile(fileWebp);

  // Удаляем оригинал
  fs.unlinkSync(file);

  bar.increment();
});

Promise.all(work).then(() => {
  bar.stop();
});