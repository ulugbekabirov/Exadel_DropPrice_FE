import { MetersToKilometersPipe } from './meters-to-kilometers.pipe';

describe('MetersToKilometersPipe', () => {

  it('should convert meters to kilometers: distance > 1000 m.', () => {
    const distNum = '27869';
    const pipe = new MetersToKilometersPipe();
    const result = pipe.transform(distNum);
    expect(result).toBe('27.87 km.');
  });

  it('should convert meters to kilometers: distance < 1000 m.', () => {
    const distNum = '900';
    const pipe = new MetersToKilometersPipe();
    const result = pipe.transform(distNum);
    expect(result).toBe('900 m.');
  });
});
