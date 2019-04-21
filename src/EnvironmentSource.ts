import { Source } from './Source';
import { Property } from './Property';

export class EnvironmentSource implements Source {
  constructor(private readonly env: object = process.env) {
  }

  async load(): Promise<Property[]> {
    const result: Property[] = [];

    for (let key in process.env) {
      result.push({ key, value: process.env[key] });
    }

    return result;
  }

}
