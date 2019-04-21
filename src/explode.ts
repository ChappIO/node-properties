import { Property } from './Property';

const flatten = (path: string, data: any): Property[] => {
  const result: Property[] = [];
  if (data instanceof Object) {
    for (let key in data) {
      let newPath = path + '.' + key;
      if (newPath.startsWith('.')) {
        newPath = newPath.substr(1);
      }
      result.push(...flatten(newPath, data[key]));
    }
  } else {
    result.push({ key: path, value: data });
  }
  return result;
};

export const explode = (data: any): Property[] => {
  return flatten('', data);
};
