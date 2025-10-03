import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Favorite attributes interface
interface FavoriteAttributes {
    id: string;
    userId: string;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Optional attributes for creation
interface FavoriteCreationAttributes extends Optional<FavoriteAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

// Favorite model class
class Favorite extends Model<FavoriteAttributes, FavoriteCreationAttributes> implements FavoriteAttributes {
    public id!: string;
    public userId!: string;
    public productId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Instance methods
    public toJSON() {
        return this.get();
    }
}

// Initialize the model
Favorite.init(
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
    },
    {
        sequelize,
        modelName: 'Favorite',
        tableName: 'favorites',
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

export default Favorite;
