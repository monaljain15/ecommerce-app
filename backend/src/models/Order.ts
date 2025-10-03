import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Order attributes interface
interface OrderAttributes {
    id: string;
    orderNumber: string;
    userId: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddressId: string;
    billingAddressId: string;
    paymentMethod: string;
    paymentId?: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Optional attributes for creation
interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'paymentId' | 'trackingNumber' | 'estimatedDelivery' | 'notes' | 'createdAt' | 'updatedAt'> { }

// Order model class
class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: string;
    public orderNumber!: string;
    public userId!: string;
    public status!: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    public subtotal!: number;
    public shipping!: number;
    public tax!: number;
    public total!: number;
    public shippingAddressId!: string;
    public billingAddressId!: string;
    public paymentMethod!: string;
    public paymentId?: string;
    public trackingNumber?: string;
    public estimatedDelivery?: Date;
    public notes?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Instance methods
    public toJSON() {
        return this.get();
    }

    // Check if order can be cancelled
    public canBeCancelled(): boolean {
        return ['pending', 'processing'].includes(this.status);
    }

    // Check if order is completed
    public isCompleted(): boolean {
        return this.status === 'delivered';
    }

    // Get status display name
    public getStatusDisplayName(): string {
        const statusMap = {
            pending: 'Pending',
            processing: 'Processing',
            shipped: 'Shipped',
            delivered: 'Delivered',
            cancelled: 'Cancelled',
        };
        return statusMap[this.status] || this.status;
    }
}

// Initialize the model
Order.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        orderNumber: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        status: {
            type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        shipping: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        tax: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        shippingAddressId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'addresses',
                key: 'id',
            },
        },
        billingAddressId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'addresses',
                key: 'id',
            },
        },
        paymentMethod: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        paymentId: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        trackingNumber: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        estimatedDelivery: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['orderNumber'],
            },
            {
                fields: ['userId'],
            },
            {
                fields: ['status'],
            },
            {
                fields: ['createdAt'],
            },
        ],
    }
);

export default Order;
