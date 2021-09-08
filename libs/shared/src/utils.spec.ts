import { sha256 } from './utils';

it('sha256 ', function () {
  const a = sha256('123123');
  expect(a).toEqual(
    '96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e',
  );
});
