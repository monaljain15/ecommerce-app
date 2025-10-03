import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// PaymentMethod attributes interface
interface PaymentMethodAttributes {
    id: string;
    userId: string;
    stripePaymentMethodId: string;
    type: 'card' | 'bank_account';
    last4: string;
    brand?: string; // visa, mastercard, amex, etc.
    expMonth?: number;
    expYear?: number;
    name?: string; // Cardholder name
    isDefault: boolean;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}

// Optional attributes for creation
interface PaymentMethodCreationAttributes extends Optional<PaymentMethodAttributes, 'id' | 'brand' | 'expMonth' | 'expYear' | 'name' | 'isDefault' | 'isActive' | 'metadata' | 'createdAt' | 'updatedAt'> {
    createdAt?: Date;
    updatedAt?: Date;
}

// PaymentMethod model class
class PaymentMethod extends Model<PaymentMethodAttributes, PaymentMethodCreationAttributes> implements PaymentMethodAttributes {
    public id!: string;
    public userId!: string;
    public stripePaymentMethodId!: string;
    public type!: 'card' | 'bank_account';
    public last4!: string;
    public brand?: string;
    public expMonth?: number;
    public expYear?: number;
    public name?: string;
    public isDefault!: boolean;
    public isActive!: boolean;
    public metadata?: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Initialize the model
PaymentMethod.init(
    {
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
            validate: {
                notEmpty: true,
            },
        },
        type: {
            type: DataTypes.ENUM('card', 'bank_account'),
            allowNull: false,
            defaultValue: 'card',
        },
        last4: {
            type: DataTypes.STRING(4),
            allowNull: false,
            validate: {
                len: [4, 4],
                isNumeric: true,
            },
        },
        brand: {
            type: DataTypes.STRING(50),
            allowNull: true,
            validate: {
                isIn: [['visa', 'mastercard', 'amex', 'discover', 'diners', 'jcb', 'unionpay']],
            },
        },
        expMonth: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 12,
            },
        },
        expYear: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: new Date().getFullYear(),
            },
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                len: [1, 255],
            },
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
    },
    {
        sequelize,
        modelName: 'PaymentMethod',
        tableName: 'payment_methods',
        timestamps: true,
        indexes: [
            {
                fields: ['userId'],
            },
            {
                unique: true,
                fields: ['stripePaymentMethodId'],
            },
            {
                fields: ['userId', 'isDefault'],
            },
            {
                fields: ['userId', 'isActive'],
            },
            {
                fields: ['type'],
            },
        ],
    }
);

export default PaymentMethod;
