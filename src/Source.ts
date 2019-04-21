import { Property } from './Property';

export interface Source {
  load(): Promise<Property[]>;
}
