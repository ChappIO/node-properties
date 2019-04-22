import { Source } from './Source';
import { Property } from './Property';

export class CommandLineSource implements Source {
  constructor(private readonly args: string[] = process.argv) {
  }

  load(): Property[] {
    const result: Property[] = [];

    let dashProp = '';

    for (let i = 0; i < this.args.length; i++) {
      const arg = this.args[i];

      if (arg.startsWith('-')) {
        if (dashProp) {
          // The last one had no argument
          result.push({ key: dashProp, value: true });
        }
        dashProp = arg.replace(/^-+/, '');
      } else if (dashProp) {
        result.push({ key: dashProp, value: arg });
        dashProp = '';
      }
    }

    if (dashProp) {
      result.push({ key: dashProp, value: true });
    }

    return result;
  }

}
