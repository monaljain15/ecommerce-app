const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Database configuration
const sequelize = new Sequelize({
    database: process.env.DB_NAME || 'ecommerce_app',
    username: process.env.DB_USER || 'monal',
    password: process.env.DB_PASSWORD || 'qwerty123',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: false,
});

// Get all migration files
const getMigrationFiles = () => {
    const migrationsDir = __dirname;
    return fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.js') && file !== 'migrate.js')
        .sort()
        .map(file => ({
            name: file,
            path: path.join(migrationsDir, file)
        }));
};

// Run migrations
const runMigrations = async () => {
    try {
        console.log('🔄 Starting database migrations...');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established');

        // Create migrations table if it doesn't exist
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
                "name" VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY
            );
        `);

        const migrationFiles = getMigrationFiles();
        console.log(`📁 Found ${migrationFiles.length} migration files`);

        for (const migration of migrationFiles) {
            const migrationName = migration.name;
            
            // Check if migration already ran
            const [results] = await sequelize.query(
                'SELECT name FROM "SequelizeMeta" WHERE name = ?',
                { replacements: [migrationName] }
            );

            if (results.length > 0) {
                console.log(`⏭️  Skipping ${migrationName} (already executed)`);
                continue;
            }

            console.log(`🔄 Running migration: ${migrationName}`);
            
            // Load and run migration
            const migrationModule = require(migration.path);
            await migrationModule.up(sequelize.getQueryInterface(), Sequelize);
            
            // Record migration as completed
            await sequelize.query(
                'INSERT INTO "SequelizeMeta" (name) VALUES (?)',
                { replacements: [migrationName] }
            );
            
            console.log(`✅ Completed migration: ${migrationName}`);
        }

        console.log('🎉 All migrations completed successfully!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
};

// Rollback migrations
const rollbackMigrations = async () => {
    try {
        console.log('🔄 Starting database rollback...');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established');

        const migrationFiles = getMigrationFiles().reverse();
        console.log(`📁 Found ${migrationFiles.length} migration files to rollback`);

        for (const migration of migrationFiles) {
            const migrationName = migration.name;
            
            // Check if migration was run
            const [results] = await sequelize.query(
                'SELECT name FROM "SequelizeMeta" WHERE name = ?',
                { replacements: [migrationName] }
            );

            if (results.length === 0) {
                console.log(`⏭️  Skipping ${migrationName} (not executed)`);
                continue;
            }

            console.log(`🔄 Rolling back migration: ${migrationName}`);
            
            // Load and run rollback
            const migrationModule = require(migration.path);
            await migrationModule.down(sequelize.getQueryInterface(), Sequelize);
            
            // Remove migration record
            await sequelize.query(
                'DELETE FROM "SequelizeMeta" WHERE name = ?',
                { replacements: [migrationName] }
            );
            
            console.log(`✅ Rolled back migration: ${migrationName}`);
        }

        console.log('🎉 All migrations rolled back successfully!');
        
    } catch (error) {
        console.error('❌ Rollback failed:', error.message);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
};

// Main execution
const command = process.argv[2];

if (command === 'up') {
    runMigrations();
} else if (command === 'down') {
    rollbackMigrations();
} else {
    console.log('Usage: node migrate.js [up|down]');
    console.log('  up   - Run all pending migrations');
    console.log('  down - Rollback all migrations');
    process.exit(1);
}
