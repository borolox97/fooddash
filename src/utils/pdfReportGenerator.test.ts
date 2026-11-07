import test from 'node:test';
import assert from 'node:assert/strict';
import {
  APK_AND_LAB_REPORT_GUIDE_SECTIONS,
  generateFoodDashGuidePdfBytes,
} from './pdfReportGenerator';

test('APK_AND_LAB_REPORT_GUIDE_SECTIONS covers Method 1 (Android Studio) and Method 2 (GitHub Actions)', () => {
  assert.ok(APK_AND_LAB_REPORT_GUIDE_SECTIONS.length >= 5);
  const titles = APK_AND_LAB_REPORT_GUIDE_SECTIONS.map((s) => s.title).join(' ');
  assert.ok(titles.includes('Method 1: Manual APK Compilation in Android Studio'));
  assert.ok(titles.includes('Method 2: Automated Cloud APK Build via GitHub Actions'));
});

test('generateFoodDashGuidePdfBytes produces a valid multi-page PDF 1.4 binary', () => {
  const pdfBytes = generateFoodDashGuidePdfBytes();
  assert.ok(pdfBytes.byteLength > 4000);

  const text = new TextDecoder().decode(pdfBytes);
  assert.ok(text.startsWith('%PDF-1.4'));
  assert.ok(text.includes('/Type /Catalog'));
  assert.ok(text.includes('Method 1: Manual APK Compilation in Android Studio'));
  assert.ok(text.includes('Method 2: Automated Cloud APK Build via GitHub Actions'));
  assert.ok(text.includes('assembleDebug'));
  assert.ok(text.trimEnd().endsWith('%%EOF'));
});
