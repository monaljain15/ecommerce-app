const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('payment_methods', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            stripePaymentMethodId: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            type: {
                type: DataTypes.ENUM('card', 'bank_account'),
                allowNull: false,
                defaultValue: 'card',
            },
            last4: {
                type: DataTypes.STRING(4),
                allowNull: false,
            },
            brand: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            expMonth: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            expYear: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            isDefault: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            metadata: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        });

        // Add indexes
        await queryInterface.addIndex('payment_methods', ['userId']);
        await queryInterface.addIndex('payment_methods', ['stripePaymentMethodId'], { unique: true });
        await queryInterface.addIndex('payment_methods', ['userId', 'isDefault']);
        await queryInterface.addIndex('payment_methods', ['userId', 'isActive']);
        await queryInterface.addIndex('payment_methods', ['type']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('payment_methods');
    },
};
