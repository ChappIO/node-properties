import { Source } from './Source';
import { Property } from './Property';

export class EnvironmentSource implements Source {
  constructor(private readonly env: { [key: string]: string | undefined } = process.env) {
  }

  load(): Property[] {
    const result: Property[] = [];

    for (let key in this.env) {
      result.push({ key, value: this.env[key] });
    }

    return result;
  }

}
