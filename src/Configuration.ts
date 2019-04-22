import { Source } from './Source';
import { JsonSource } from './JsonSource';
import { CommandLineSource } from './CommandLineSource';
import { EnvironmentSource } from './EnvironmentSource';
import { YamlSource } from './YamlSource';
import { Options } from './Options';
import { Logger } from './Logger';
import { PropertiesSource } from './PropertiesSource';

export class Configuration {
  private readonly sources: Source[] = [];
  private readonly properties: any = {};
  private readonly logger: Logger;

  constructor(options: Options = {}) {
    this.logger = options.logger || console;
    const env = process.env.NODE_ENV || 'development';

    this.sources = options.sources || [
      new JsonSource('defaults.json', this.logger),
      new YamlSource('defaults.yaml', this.logger),
      new PropertiesSource('defaults.env', this.logger),
      new JsonSource('config/defaults.json', this.logger),
      new YamlSource('config/defaults.yaml', this.logger),
      new PropertiesSource('config/defaults.env', this.logger),
      new JsonSource(`${env}.json`, this.logger),
      new YamlSource(`${env}.yaml`, this.logger),
      new PropertiesSource(`${env}.env`, this.logger),
      new JsonSource(`config/${env}.json`, this.logger),
      new YamlSource(`config/${env}.yaml`, this.logger),
      new PropertiesSource(`config/${env}.env`, this.logger),
      new EnvironmentSource(),
      new CommandLineSource(),
    ];
  }

  private static normalizeKey(key: string): string {
    return key.toLowerCase().replace(/[^a-z0-9]/g, '.');
  }

  init(): void {
    this.load(...this.sources);
  }

  load(...sources: Source[]): void {
    sources.forEach(s => {
      const props = s.load();
      for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        this.set(prop.key, prop.value);
      }
    });
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
