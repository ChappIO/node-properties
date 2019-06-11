import { Logger } from './Logger';
import { Source } from './Source';

export interface Options {
  logger?: Logger;
  sources?: Source[];
}
