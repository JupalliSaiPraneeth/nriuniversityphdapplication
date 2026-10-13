import { describe, it, expect } from 'vitest';
import { sanitizeCellValue, buildCsvContent } from '../lib/csvExporter';

describe('CSV Exporter Security and Escaping', () => {
  it('should neutralize spreadsheet formula injection vulnerabilities', () => {
    // Formula starting characters: =, +, -, @, \t, \r
    expect(sanitizeCellValue('=1+1')).toBe("'=1+1");
    expect(sanitizeCellValue('+cmd|/c calc')).toBe("'+cmd|/c calc");
    expect(sanitizeCellValue('-100')).toBe("'-100");
    expect(sanitizeCellValue('@SUM(A1:A10)')).toBe("'@SUM(A1:A10)");
    expect(sanitizeCellValue('\tTAB_INJECT')).toBe("'\tTAB_INJECT");
  });

  it('should correctly escape commas, quotes and newlines according to RFC 4180', () => {
    expect(sanitizeCellValue('Hello, World')).toBe('"Hello, World"');
    expect(sanitizeCellValue('Dr. "RVR" NRIIT')).toBe('"Dr. ""RVR"" NRIIT"');
    expect(sanitizeCellValue('Line 1\nLine 2')).toBe('"Line 1\nLine 2"');
  });

  it('should combine formula injection protection with RFC 4180 quotes when commas/quotes are present', () => {
    // Starts with = and contains comma
    const result = sanitizeCellValue('=SUM(A1, B2)');
    expect(result).toBe('"\'=SUM(A1, B2)"');
  });

  it('should handle null and undefined safely', () => {
    expect(sanitizeCellValue(null)).toBe('');
    expect(sanitizeCellValue(undefined)).toBe('');
  });

  it('should build valid UTF-8 CSV content with Byte Order Mark (BOM)', () => {
    const headers = ['Name', 'Score', 'Status'];
    const rows = [
      ['John Doe', '85.5', 'Qualified'],
      ['Jane Smith', '92.0', 'Valid'],
    ];

    const csv = buildCsvContent(headers, rows);
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('Name,Score,Status\r\n');
    expect(csv).toContain('John Doe,85.5,Qualified\r\n');
  });
});
