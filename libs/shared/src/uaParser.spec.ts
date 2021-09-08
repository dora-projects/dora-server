import { userAgentParser } from './uaParser';

it('should ', function () {
  const result = userAgentParser(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
  );

  const b = { name: 'Chrome', version: '92.0.4515.159', major: '92' };
  expect(result.browser).toEqual(b);
  expect(result.engine).toEqual({ name: 'Blink', version: '92.0.4515.159' });
  expect(result.os).toEqual({ name: 'Mac OS', version: '10.14.6' });
  const d = { vendor: undefined, model: undefined, type: undefined };
  expect(result.device).toEqual(d);
  expect(result.cpu).toEqual({ architecture: undefined });
});
