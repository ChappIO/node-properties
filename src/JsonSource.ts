import { Source } from './Source';
import { Property } from './Property';
import { readFile } from 'fs';
import { explode } from './explode';

export class JsonSource implements Source {
  constructor(private readonly path: string) {
  }

  load(): Promise<Property[]> {
    return new Promise<string>((resolve, reject) => {
      readFile(this.path, (err, data) => {
        if (err) {
          console.debug(`Failed to read json from ${this.path}: ${err}`);
          resolve('');
        } else {
          resolve(data.toString('utf-8'));
        }
      });
    })
      .then(data => {
        if (data) {
          const values = JSON.parse(data);
          return explode(values);
        } else {
          return [];
        }
      });
  }
}
