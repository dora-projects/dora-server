import { timeFormNow } from './time';

it('timeFormNow ', function () {
  const a = timeFormNow('2020-10-20');
  expect(typeof a).toEqual('string');
});
