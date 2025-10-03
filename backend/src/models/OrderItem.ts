import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// OrderItem attributes interface
interface OrderItemAttributes {
    id: string;
    orderId: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

// Optional attributes for creation
interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

// OrderItem model class
class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
    public id!: string;
    public orderId!: string;
    public productId!: string;
    public name!: string;
    public price!: number;
    public quantity!: number;
    public image!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Instance methods
    public toJSON() {
        return this.get();
    }

    // Get total price for this item
    public getTotalPrice(): number {
        return this.price * this.quantity;
    }
}

// Initialize the model
OrderItem.init(
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
        productId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id',
            },
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
        image: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                isUrl: true,
            },
        },
    },
    {
        sequelize,
        modelName: 'OrderItem',
        tableName: 'order_items',
        timestamps: true,
        indexes: [
            {
                fields: ['orderId'],
            },
            {
                fields: ['productId'],
            },
        ],
    }
);

export default OrderItem;
