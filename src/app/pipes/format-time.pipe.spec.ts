import { FormatTimePipe } from './format-time.pipe';

describe('FormatTimePipe', () => {

  it('should format time (sec)', () => {
    const value = 30;
    const pipe = new FormatTimePipe();
    const result = pipe.transform(value);
    expect(result).toBe('00:00:30');
  });

  it('should format time (min)', () => {
    const value = 180;
    const pipe = new FormatTimePipe();
    const result = pipe.transform(value);
    expect(result).toBe('00:03:00');
  });

  it('should format time (hours)', () => {
    const value = 3600;
    const pipe = new FormatTimePipe();
    const result = pipe.transform(value);
    expect(result).toBe('01:00:00');
  });

  it('should format time (hours + min)', () => {
    const value = 4800;
    const pipe = new FormatTimePipe();
    const result = pipe.transform(value);
    expect(result).toBe('01:20:00');
  });

  it('should format time (hours + min + sec)', () => {
    const value = 4810;
    const pipe = new FormatTimePipe();
    const result = pipe.transform(value);
    expect(result).toBe('01:20:10');
  });
});
