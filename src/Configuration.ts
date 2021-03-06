import { Source } from './Source';
import { JsonSource } from './JsonSource';
import { CommandLineSource } from './CommandLineSource';
import { EnvironmentSource } from './EnvironmentSource';
import { YamlSource } from './YamlSource';
import { Options } from './Options';
import { Logger } from './Logger';
import { PropertiesSource } from './PropertiesSource';
import { readdirSync } from 'fs';
import { join } from 'path';
import { NullSource } from './NullSource';

const env = process.env.NODE_ENV || 'development';
const configFileNames = [
  'defaults.env',
  'defaults.json',
  'defaults.yaml',
  `${env}.env`,
  `${env}.json`,
  `${env}.yaml`,
];

function loadFileSources(logger: Logger): Source[] {
  try {
    const files = readdirSync('config');
    const configFiles = configFileNames.filter(
      file => files.indexOf(file) >= 0,
    );

    return configFiles
      .map<Source>(
        (file: string): Source => {
          const path = join(process.cwd(), 'config', file);
          const extIndex = file.lastIndexOf('.');
          if (extIndex === -1) {
            return new NullSource();
          }

          switch (file.substr(extIndex).toLowerCase()) {
            case '.env':
              return new PropertiesSource(path, logger);
            case '.json':
              return new JsonSource(path, logger);
            case '.yaml':
            case '.yml':
              return new YamlSource(path, logger);
            default:
              return new NullSource();
          }
        },
      )
      .filter(s => !(s instanceof NullSource));
  } catch (e) {
    logger.info(`Failed to load config files. Skipping... ${e}`);
    return [];
  }
}

export class Configuration {
  private readonly sources: Source[] = [];
  private readonly properties: any = {};
  private readonly logger: Logger;

  constructor(options: Options = {}) {
    this.logger = options.logger || console;

    if (options.sources) {
      this.sources = options.sources;
    } else {
      this.sources = [
        ...loadFileSources(this.logger),
        new EnvironmentSource(),
        new CommandLineSource(),
      ];
    }
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
      if (currentValue instanceof Object && part in currentValue) {
        currentValue = currentValue[part];
      } else {
        return undefined;
      }
    }
    return currentValue;
  }

  set(key: string, value: any) {
    const parts = Configuration.normalizeKey(key).split('.');

    let currentValue = this.properties;

    for (
      let i = 0;
      i < parts.length - 1 && currentValue instanceof Object;
      i++
    ) {
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
