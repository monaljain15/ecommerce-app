import { DataTypes, Model, Optional, Op } from 'sequelize';
import sequelize from '../config/database';

// Product attributes interface
interface ProductAttributes {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    price: number;
    comparePrice?: number;
    costPrice?: number;
    sku?: string;
    barcode?: string;
    image: string;
    images?: string[];
    categoryId: string;
    brandId: string;
    stock: number;
    lowStockThreshold: number;
    weight?: number;
    dimensions?: string;
    rating: number;
    reviewCount: number;
    isActive: boolean;
    isDigital: boolean;
    isFeatured: boolean;
    metaTitle?: string;
    metaDescription?: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

// Optional attributes for creation
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'shortDescription' | 'comparePrice' | 'costPrice' | 'sku' | 'barcode' | 'images' | 'lowStockThreshold' | 'weight' | 'dimensions' | 'isDigital' | 'isFeatured' | 'metaTitle' | 'metaDescription' | 'tags' | 'createdAt' | 'updatedAt'> { }

// Product model class
class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: string;
    public name!: string;
    public slug!: string;
    public description!: string;
    public shortDescription?: string;
    public price!: number;
    public comparePrice?: number;
    public costPrice?: number;
    public sku?: string;
    public barcode?: string;
    public image!: string;
    public images?: string[];
    public categoryId!: string;
    public brandId!: string;
    public stock!: number;
    public lowStockThreshold!: number;
    public weight?: number;
    public dimensions?: string;
    public rating!: number;
    public reviewCount!: number;
    public isActive!: boolean;
    public isDigital!: boolean;
    public isFeatured!: boolean;
    public metaTitle?: string;
    public metaDescription?: string;
    public tags?: string[];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Instance methods
    public toJSON() {
        const values = this.get();
        // Convert images array to JSON if it's a string
        if (values.images && typeof values.images === 'string') {
            try {
                values.images = JSON.parse(values.images);
            } catch (e) {
                values.images = [];
            }
        }
        // Convert tags array to JSON if it's a string
        if (values.tags && typeof values.tags === 'string') {
            try {
                values.tags = JSON.parse(values.tags);
            } catch (e) {
                values.tags = [];
            }
        }
        return values;
    }

    // Check if product is in stock
    public isInStock(): boolean {
        return this.stock > 0;
    }

    // Check if product is low stock
    public isLowStock(): boolean {
        return this.stock <= this.lowStockThreshold;
    }
}

// Initialize the model
Product.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 255],
            },
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [2, 255],
                is: /^[a-z0-9-]+$/,
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        shortDescription: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        comparePrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            validate: {
                min: 0,
            },
        },
        costPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            validate: {
                min: 0,
            },
        },
        sku: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true,
        },
        barcode: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true,
        },
        image: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                isUrl: true,
            },
        },
        images: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        categoryId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id',
            },
        },
        brandId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'brands',
                key: 'id',
            },
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        lowStockThreshold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
            validate: {
                min: 0,
            },
        },
        weight: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
            validate: {
                min: 0,
            },
        },
        dimensions: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        rating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 5,
            },
        },
        reviewCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        isDigital: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        metaTitle: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        metaDescription: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        tags: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
    },
    {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['slug'],
            },
            {
                unique: true,
                fields: ['sku'],
                where: {
                    sku: {
                        [Op.ne]: null,
                    },
                },
            },
            {
                unique: true,
                fields: ['barcode'],
                where: {
                    barcode: {
                        [Op.ne]: null,
                    },
                },
            },
            {
                fields: ['categoryId'],
            },
            {
                fields: ['brandId'],
            },
            {
                fields: ['isActive'],
            },
            {
                fields: ['isFeatured'],
            },
            {
                fields: ['price'],
            },
            {
                fields: ['rating'],
            },
            {
                fields: ['stock'],
            },
        ],
    }
);

export default Product;
