# node-properties

[![NPM](https://nodei.co/npm/node-properties.svg?downloads=true&downloadRank=true)](https://www.npmjs.com/package/node-properties)

Extremely flexible, no-hassle configuration for nodejs applications.

## Install

```bash
npm i node-properties
```

## Usage

*defaults.yaml*
```yaml
user:
  name: John
```

*index.js*
```typescript
import {config} from 'node-properties';

const name = config.get('user.name');
console.log(`Hello ${name}!`);

// Output: Hello John!
```

## Sources

By default, properties are retrieved in the following order:

1. Command line parameters
2. Environment variables
3. `config/${NODE_ENV}` (.yaml, .json, or .env)
4. `config/defaults` (.yaml, .json, or .env)
