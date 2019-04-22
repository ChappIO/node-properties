import { Configuration } from './Configuration';
import { EnvironmentSource } from './EnvironmentSource';

describe('Configuration', () => {
  it('Prioritized defaults when structure conflicts exist', async () => {
    const config = new Configuration({
      sources: [
        new EnvironmentSource({
          VAR_ONE: 'Hello',
          VAR_ONE_VALUE: 'Other',
        }),
      ],
    });
    config.init();

    expect(config.get('var.one')).toBe('Hello');
    expect(config.get('var.one.value')).toBe(undefined);
  });
});
