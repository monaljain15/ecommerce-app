import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// User attributes interface
interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    role: 'user' | 'admin';
    isActive: boolean;
    emailVerified: boolean;
    emailVerificationToken?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    lastLogin?: Date;
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}

// Optional attributes for creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'avatar' | 'emailVerified' | 'emailVerificationToken' | 'passwordResetToken' | 'passwordResetExpires' | 'lastLogin' | 'createdAt' | 'updatedAt'> {
    createdAt?: Date;
    updatedAt?: Date;
}

// User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string;
    public avatar?: string;
    public role!: 'user' | 'admin';
    public isActive!: boolean;
    public emailVerified!: boolean;
    public emailVerificationToken?: string;
    public passwordResetToken?: string;
    public passwordResetExpires?: Date;
    public lastLogin?: Date;
    public metadata?: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Instance methods
    public toJSON() {
        const values = Object.assign({}, this.get());
        delete (values as any).password;
        delete (values as any).emailVerificationToken;
        delete (values as any).passwordResetToken;
        delete (values as any).passwordResetExpires;
        return values;
    }
}

// Initialize the model
User.init(
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
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                len: [6, 255],
            },
        },
        avatar: {
            type: DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user',
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        emailVerificationToken: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        passwordResetToken: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        passwordResetExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['email'],
            },
            {
                fields: ['role'],
            },
            {
                fields: ['isActive'],
            },
            {
                fields: ['emailVerified'],
            },
        ],
    }
);

export default User;
