import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Brand attributes interface
interface BrandAttributes {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    website?: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

// Optional attributes for creation
interface BrandCreationAttributes extends Optional<BrandAttributes, 'id' | 'description' | 'logo' | 'website' | 'isActive' | 'sortOrder' | 'createdAt' | 'updatedAt'> { }

// Brand model class
class Brand extends Model<BrandAttributes, BrandCreationAttributes> implements BrandAttributes {
    public id!: string;
    public name!: string;
    public slug!: string;
    public description?: string;
    public logo?: string;
    public website?: string;
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
Brand.init(
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
        logo: {
            type: DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },
        website: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                isUrl: true,
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
        modelName: 'Brand',
        tableName: 'brands',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['slug'],
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

export default Brand;
