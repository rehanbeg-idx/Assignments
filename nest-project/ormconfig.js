const { DataSource } = require('typeorm');
const path = require('path');

const dbConfig = {
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: false,
  entities: [path.join(__dirname, '**/*.entity.js')],
  migrations: [path.join(__dirname, 'migrations/*.js')],
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [path.join(__dirname, '**/*.entity.js')],
      synchronize: true, 
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: [path.join(__dirname, '**/*.entity.ts')],
      migrationsRun: true,
      synchronize: true,
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('Unknown Environment');
}

const AppDataSource = new DataSource(dbConfig);

module.exports = { dbConfig, AppDataSource };
