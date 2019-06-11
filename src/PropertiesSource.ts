import { Source } from './Source';
import { Property } from './Property';
import { readFileSync } from 'fs';
import { Logger } from './Logger';

export class PropertiesSource implements Source {
  constructor(private readonly path: string, private readonly logger: Logger) {}

  load(): Property[] {
    try {
      const data = readFileSync(this.path, 'utf-8');
      const lines = data
        .split(/[\r\n]/)
        .map(line => line.trim())
        .filter(line => !!line)
        .filter(line => !line.startsWith('#'));

      return lines.map(line => {
        const eqlIndex = line.indexOf('=');
        if (eqlIndex >= 0) {
          return {
            key: line.substr(0, eqlIndex),
            value: line.substr(eqlIndex + 1),
          };
        } else {
          return { key: line, value: true };
        }
      });
    } catch (e) {
      this.logger.debug(`Failed to read json from ${this.path}: ${e}`);
      return [];
    }
  }
}
