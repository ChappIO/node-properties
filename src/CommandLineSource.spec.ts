import { CommandLineSource } from './CommandLineSource';

describe('CommandLineSource', () => {
  it('Returns no values when there is no input', async () => {
    const result = new CommandLineSource([]).load();
    expect(result).toHaveLength(0);
  });

  it("Skips input if it wasn't a dashed parameter", async () => {
    const result = new CommandLineSource(['hello-world']).load();
    expect(result).toHaveLength(0);
  });

  it('Sets a boolean flag if there is no argument', async () => {
    const result = new CommandLineSource(['--hello']).load();
    expect(result).toEqual([{ key: 'hello', value: true }]);
  });

  it('Parses the argument if it does not start with dashes', async () => {
    const result = new CommandLineSource(['--hello', 'world']).load();
    expect(result).toEqual([{ key: 'hello', value: 'world' }]);
  });

  it('Parses two flags if the second one also has dashes', async () => {
    const result = new CommandLineSource(['--hello', '--world']).load();
    expect(result).toEqual([
      { key: 'hello', value: true },
      { key: 'world', value: true },
    ]);
  });
});
