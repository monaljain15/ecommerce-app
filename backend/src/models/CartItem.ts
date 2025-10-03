import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// CartItem attributes interface
interface CartItemAttributes {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

// Optional attributes for creation
interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

// CartItem model class
class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
    public id!: string;
    public userId!: string;
    public productId!: string;
    public quantity!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Instance methods
    public toJSON() {
        return this.get();
    }
}

// Initialize the model
CartItem.init(
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
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id',
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1,
            },
        },
    },
    {
        sequelize,
        modelName: 'CartItem',
        tableName: 'cart_items',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'productId'],
            },
            {
                fields: ['userId'],
            },
            {
                fields: ['productId'],
            },
        ],
    }
);

export default CartItem;
