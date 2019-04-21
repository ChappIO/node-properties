import { Configuration } from '../src';


(async () => {
  const config = new Configuration();
  await config.init();

  console.log(config.get());
})();
