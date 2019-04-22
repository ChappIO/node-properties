import { Configuration } from './Configuration';
import { Source } from './Source';
import { Property } from './Property';
import { Options } from './Options';
import { Logger } from './Logger';
import { EnvironmentSource } from './EnvironmentSource';
import { CommandLineSource } from './CommandLineSource';
import { YamlSource } from './YamlSource';
import { JsonSource } from './JsonSource';
import { PropertiesSource } from './PropertiesSource';

const config = new Configuration();
config.init();

export {
  CommandLineSource,
  Configuration,
  EnvironmentSource,
  JsonSource,
  YamlSource,
  Source,
  Property,
  PropertiesSource,
  Logger,
  Options,
  config,
};
