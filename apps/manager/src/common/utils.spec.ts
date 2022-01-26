import { mappingFlat } from './utils';
import * as data from './__test__/mapping.json';
import * as dataResult from './__test__/mapping.result.json';

it('mappingFlat', function () {
  const result = {};
  mappingFlat(data, result, '');
  expect(result).toEqual(dataResult);
});
