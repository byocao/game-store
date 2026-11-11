import { describe, expect, it } from 'vitest';
import { htmlToParagraphs, parseRequirements } from './fetch-steam.mjs';

describe('htmlToParagraphs', () => {
  it('keeps the words and drops images and markup', () => {
    const html =
      '<p class="bb_paragraph"><img src="x.avif"></p><h2>Story</h2><p>Night City &amp; you.<br>Second line</p><ul><li>One</li><li>Two</li></ul>';
    expect(htmlToParagraphs(html)).toEqual(['Story', 'Night City & you.', 'Second line', '• One', '• Two']);
  });

  it('cuts an over-long first paragraph at a sentence instead of dropping it', () => {
    const long = Array.from({ length: 80 }, (_, i) => `Sentence number ${i} is here.`).join(' ');
    const [first] = htmlToParagraphs(`<p>${long}</p>`, 600);
    expect(first.length).toBeLessThanOrEqual(600);
    expect(first.endsWith('.')).toBe(true);
  });
});

describe('parseRequirements', () => {
  it('splits labelled lines', () => {
    const html =
      '<strong>Minimum:</strong><br><ul class="bb_ul"><li>Requires a 64-bit processor<br></li><li><strong>OS:</strong> Windows 10<br></li><li><strong>Memory:</strong> 8 GB RAM</li></ul>';
    expect(parseRequirements(html)).toEqual([
      { label: '', value: 'Requires a 64-bit processor' },
      { label: 'OS', value: 'Windows 10' },
      { label: 'Memory', value: '8 GB RAM' },
    ]);
  });
});
