import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Review attributes interface
interface ReviewAttributes {
    id: string;
    userId: string;
    productId: string;
    orderId?: string;
    rating: number;
    title?: string;
    comment: string;
    isVerified: boolean;
    isApproved: boolean;
    helpfulCount: number;
    createdAt: Date;
    updatedAt: Date;
}

// Optional attributes for creation
interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id' | 'orderId' | 'title' | 'isVerified' | 'isApproved' | 'helpfulCount' | 'createdAt' | 'updatedAt'> { }

// Review model class
class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
    public id!: string;
    public userId!: string;
    public productId!: string;
    public orderId?: string;
    public rating!: number;
    public title?: string;
    public comment!: string;
    public isVerified!: boolean;
    public isApproved!: boolean;
    public helpfulCount!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Instance methods
    public toJSON() {
        return this.get();
    }

    // Check if review is helpful
    public isHelpful(): boolean {
        return this.helpfulCount > 0;
    }

    // Get rating stars
    public getRatingStars(): string {
        return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
    }
}

// Initialize the model
Review.init(
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
        orderId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'orders',
                key: 'id',
            },
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                len: [1, 255],
            },
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [10, 2000],
            },
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        helpfulCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
    },
    {
        sequelize,
        modelName: 'Review',
        tableName: 'reviews',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'productId'],
            },
            {
                fields: ['productId'],
            },
            {
                fields: ['userId'],
            },
            {
                fields: ['rating'],
            },
            {
                fields: ['isApproved'],
            },
            {
                fields: ['isVerified'],
            },
        ],
    }
);

export default Review;
