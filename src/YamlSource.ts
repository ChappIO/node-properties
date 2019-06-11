import { Source } from './Source';
import { Property } from './Property';
import { readFileSync } from 'fs';
import { explode } from './explode';
import { safeLoad } from 'js-yaml';
import { Logger } from './Logger';

export class YamlSource implements Source {
  constructor(private readonly path: string, private readonly logger: Logger) {}

  load(): Property[] {
    try {
      const data = readFileSync(this.path, 'utf-8');
      const values = safeLoad(data);
      return explode(values);
    } catch (e) {
      this.logger.debug(`Failed to read json from ${this.path}: ${e}`);
      return [];
    }
  }
}
