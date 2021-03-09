import { TruncateStringPipe } from './truncate-string.pipe';

describe('TruncateStringPipe', () => {
  it('transform "abc" to "abc...', () => {
    const pipe = new TruncateStringPipe();
    expect(pipe.transform('Холодильник Bosch Serie 8 VitaFresh Plus KGN39LB32R', 50)).toBe('Холодильник Bosch Serie 8 VitaFresh Plus...');
  });
});
