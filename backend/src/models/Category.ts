import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Category attributes interface
interface CategoryAttributes {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

// Optional attributes for creation
interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'description' | 'image' | 'parentId' | 'isActive' | 'sortOrder' | 'createdAt' | 'updatedAt'> { }

// Category model class
class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    public id!: string;
    public name!: string;
    public slug!: string;
    public description?: string;
    public image?: string;
    public parentId?: string;
    public isActive!: boolean;
    public sortOrder!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Instance methods
    public toJSON() {
        return this.get();
    }
}

// Initialize the model
Category.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 100],
            },
        },
        slug: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [2, 100],
                is: /^[a-z0-9-]+$/,
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },
        parentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'id',
            },
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        sortOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['slug'],
            },
            {
                fields: ['parentId'],
            },
            {
                fields: ['isActive'],
            },
            {
                fields: ['sortOrder'],
            },
        ],
    }
);

export default Category;
