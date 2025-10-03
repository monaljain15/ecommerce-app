import { DataTypes, Model, Optional, Op } from 'sequelize';
import sequelize from '../config/database';

// Payment attributes interface
interface PaymentAttributes {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';
    paymentMethod: string;
    paymentMethodId?: string;
    stripePaymentIntentId?: string;
    stripeChargeId?: string;
    stripeRefundId?: string;
    failureReason?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

// Optional attributes for creation
interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'paymentMethodId' | 'stripePaymentIntentId' | 'stripeChargeId' | 'stripeRefundId' | 'failureReason' | 'metadata' | 'createdAt' | 'updatedAt'> { }

// Payment model class
class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
    public id!: string;
    public orderId!: string;
    public amount!: number;
    public currency!: string;
    public status!: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';
    public paymentMethod!: string;
    public paymentMethodId?: string;
    public stripePaymentIntentId?: string;
    public stripeChargeId?: string;
    public stripeRefundId?: string;
    public failureReason?: string;
    public metadata?: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Instance methods
    public toJSON() {
        const values = this.get();
        // Convert metadata to JSON if it's a string
        if (values.metadata && typeof values.metadata === 'string') {
            try {
                values.metadata = JSON.parse(values.metadata);
            } catch (e) {
                values.metadata = {};
            }
        }
        return values;
    }

    // Check if payment is successful
    public isSuccessful(): boolean {
        return this.status === 'succeeded';
    }

    // Check if payment is pending
    public isPending(): boolean {
        return this.status === 'pending';
    }

    // Check if payment is failed
    public isFailed(): boolean {
        return this.status === 'failed';
    }

    // Check if payment can be refunded
    public canBeRefunded(): boolean {
        return this.status === 'succeeded';
    }

    // Get status display name
    public getStatusDisplayName(): string {
        const statusMap = {
            pending: 'Pending',
            succeeded: 'Succeeded',
            failed: 'Failed',
            cancelled: 'Cancelled',
            refunded: 'Refunded',
        };
        return statusMap[this.status] || this.status;
    }
}

// Initialize the model
Payment.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id',
            },
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        currency: {
            type: DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            validate: {
                len: [3, 3],
                isUppercase: true,
            },
        },
        status: {
            type: DataTypes.ENUM('pending', 'succeeded', 'failed', 'cancelled', 'refunded'),
            allowNull: false,
            defaultValue: 'pending',
        },
        paymentMethod: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        paymentMethodId: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        stripePaymentIntentId: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true,
        },
        stripeChargeId: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true,
        },
        stripeRefundId: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true,
        },
        failureReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: {},
        },
    },
    {
        sequelize,
        modelName: 'Payment',
        tableName: 'payments',
        timestamps: true,
        indexes: [
            {
                fields: ['orderId'],
            },
            {
                fields: ['status'],
            },
            {
                fields: ['paymentMethod'],
            },
            {
                unique: true,
                fields: ['stripePaymentIntentId'],
                where: {
                    stripePaymentIntentId: {
                        [Op.ne]: null,
                    },
                },
            },
            {
                unique: true,
                fields: ['stripeChargeId'],
                where: {
                    stripeChargeId: {
                        [Op.ne]: null,
                    },
                },
            },
            {
                unique: true,
                fields: ['stripeRefundId'],
                where: {
                    stripeRefundId: {
                        [Op.ne]: null,
                    },
                },
            },
        ],
    }
);

export default Payment;
