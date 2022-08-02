import sequelize from './index';
describe('Database connection', () => {
  test('is Connected', async () => {
    expect.assertions(1);
    try {
      await sequelize.authenticate();
    } catch (e) {
      expect(e).toMatch('error');
    }
  });
});
