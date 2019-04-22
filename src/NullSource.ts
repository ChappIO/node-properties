import { Source } from './Source';
import { Property } from './Property';

export class NullSource implements Source {
  load(): Property[] {
    return [];
  }
}
