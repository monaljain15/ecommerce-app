import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// RefreshToken attributes interface
interface RefreshTokenAttributes {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    isRevoked: boolean;
    revokedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Optional attributes for creation
interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id' | 'isRevoked' | 'revokedAt' | 'createdAt' | 'updatedAt'> { }

// RefreshToken model class
class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
    public id!: string;
    public userId!: string;
    public token!: string;
    public expiresAt!: Date;
    public isRevoked!: boolean;
    public revokedAt?: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Instance methods
    public toJSON() {
        const values = this.get();
        // Don't expose the actual token in JSON output
        delete (values as any).token;
        return values;
    }

    // Check if token is expired
    public isExpired(): boolean {
        return new Date() > this.expiresAt;
    }

    // Check if token is valid (not expired and not revoked)
    public isValid(): boolean {
        return !this.isExpired() && !this.isRevoked;
    }

    // Revoke the token
    public revoke(): void {
        this.isRevoked = true;
        this.revokedAt = new Date();
    }
}

// Initialize the model
RefreshToken.init(
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
        token: {
            type: DataTypes.STRING(500),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        isRevoked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        revokedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'RefreshToken',
        tableName: 'refresh_tokens',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['token'],
            },
            {
                fields: ['userId'],
            },
            {
                fields: ['expiresAt'],
            },
            {
                fields: ['isRevoked'],
            },
        ],
    }
);

export default RefreshToken;
