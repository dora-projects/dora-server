import { hashPassword, verifyPassword } from './auth';

it('should auth  work', async function () {
  const yourPassword = 'someRandomPasswordHere';
  const hashed = await hashPassword(yourPassword);
  const r = await verifyPassword(yourPassword, hashed);
  expect(r).toBeTruthy();
});
