const envConfig = require('../../config/env.config');

switch (envConfig.PERSISTENCE) {
  case 'MONGO':
    console.log('Persistance with MongoDB');
    break;
  case 'FILESYSTEM':
    console.log('Persistance with FileSystem');
    break;
  case 'MEMORY':
    console.log('Persistance with Memory');
    break;
  default:
    throw new Error('Invalid persistence type');
}
