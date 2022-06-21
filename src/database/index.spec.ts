/* eslint-disable @typescript-eslint/no-var-requires */
const sequelize = require('./index');
describe('Database connection', () => {
  test('is Connected', async () => {
    expect.assertions(1);
    try {
      await sequelize.authenticate();
    } catch (e) {
      console.log(e);
    }
  });
});
