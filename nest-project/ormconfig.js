const { DataSource } = require('typeorm');

const dbConfig = {
  type: 'sqlite',           // default type
  database: 'db.sqlite',    // default database
  synchronize: false,
  entities: ['**/*.entity.js'],
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

// Adjust config based on environment
switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
    });
    break;
  case 'production':
    // add production settings if needed
    break;
  default:
    throw new Error('Unknown Environment');
}

// Create DataSource for TypeORM CLI
const AppDataSource = new DataSource(dbConfig);

module.exports = {
  dbConfig,      // for NestJS runtime
  AppDataSource, // for CLI commands
};
