import { Source } from './Source';
import { JsonSource } from './JsonSource';
import { CommandLineSource } from './CommandLineSource';
import { EnvironmentSource } from './EnvironmentSource';

export class Configuration {
  private readonly sources: Source[] = [];
  private readonly properties: any = {};

  private static normalizeKey(key: string): string {
    return key.toLowerCase().replace(/[^a-z0-9]/g, '.');
  }

  init(): Promise<this> {
    return this.load(
      new JsonSource('defaults.json'),
      new JsonSource('config/defaults.json'),
      new EnvironmentSource(),
      new CommandLineSource(),
    );
  }

  async load(...sources: Source[]): Promise<this> {
    const datas = await Promise.all(sources.map(s => s.load()));

    for (let d = 0; d < datas.length; d++) {
      const newProps = datas[d];
      for (let i = 0; i < newProps.length; i++) {
        const prop = newProps[i];
        this.set(prop.key, prop.value);
      }
    }
    return this;
  }

  get(key?: string) {
    if (key === undefined) {
      return this.properties;
    }
    const normalized = Configuration.normalizeKey(key);
    const parts = normalized.split('.');

    let currentValue = this.properties;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!(part in currentValue)) {
        return undefined;
      } else {
        currentValue = currentValue[part];
      }
    }
    return currentValue;
  }

  set(key: string, value: any) {
    const parts = Configuration.normalizeKey(key).split('.');

    let currentValue = this.properties;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in currentValue)) {
        currentValue[part] = {};
      }
      currentValue = currentValue[part];
    }

    if (currentValue instanceof Object) {
      currentValue[parts[parts.length - 1]] = value;
    }
  }
}
