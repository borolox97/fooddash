import { MODELS_AND_HELPERS_FILES, AndroidSourceFile } from './modelsAndHelpersSource';
import { ACTIVITIES_PART1_FILES } from './activitiesSourcePart1';
import { ACTIVITIES_PART2_FILES } from './activitiesSourcePart2';
import { XML_AND_CONFIG_FILES } from './xmlLayoutsSource';

export type { AndroidSourceFile };

export const ALL_ANDROID_PROJECT_FILES: AndroidSourceFile[] = [
  ...MODELS_AND_HELPERS_FILES,
  ...ACTIVITIES_PART1_FILES,
  ...ACTIVITIES_PART2_FILES,
  ...XML_AND_CONFIG_FILES,
];

/**
 * Generates a standard POSIX ustar (.tar) archive in memory from all Android Studio project files
 * so students can extract the complete `FoodDash/` Android Studio folder structure in 1 click.
 */
export function buildAndroidProjectTarBlob(): Blob {
  const encoder = new TextEncoder();
  const blocks: Uint8Array[] = [];

  const writeString = (buf: Uint8Array, str: string, offset: number, length: number) => {
    const bytes = encoder.encode(str);
    buf.set(bytes.slice(0, length), offset);
  };

  const writeOctal = (buf: Uint8Array, val: number, offset: number, length: number) => {
    const oct = val.toString(8).padStart(length - 1, '0') + '\0';
    writeString(buf, oct, offset, length);
  };

  const nowOctal = Math.floor(Date.now() / 1000);

  for (const file of ALL_ANDROID_PROJECT_FILES) {
    const fullPath = `FoodDash/${file.path}`;
    const contentBytes = encoder.encode(file.content);
    const size = contentBytes.byteLength;

    const header = new Uint8Array(512);
    writeString(header, fullPath, 0, 100);
    writeOctal(header, 0o644, 100, 8);
    writeOctal(header, 1000, 108, 8);
    writeOctal(header, 1000, 116, 8);
    writeOctal(header, size, 124, 12);
    writeOctal(header, nowOctal, 136, 12);
    // Fill checksum space with spaces (ASCII 32)
    for (let i = 148; i < 156; i++) header[i] = 32;
    header[156] = '0'.charCodeAt(0); // normal file
    writeString(header, 'ustar\0', 257, 6);
    writeString(header, '00', 263, 2);

    let checksum = 0;
    for (let i = 0; i < 512; i++) checksum += header[i];
    const chkStr = checksum.toString(8).padStart(6, '0') + '\0 ';
    writeString(header, chkStr, 148, 8);

    blocks.push(header);

    const paddedLength = Math.ceil(size / 512) * 512;
    const dataBlock = new Uint8Array(paddedLength);
    dataBlock.set(contentBytes, 0);
    blocks.push(dataBlock);
  }

  // Two 512-byte zero blocks mark EOF in TAR
  blocks.push(new Uint8Array(1024));

  return new Blob(blocks as BlobPart[], { type: 'application/x-tar' });
}
