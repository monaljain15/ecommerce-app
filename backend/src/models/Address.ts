import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Address attributes interface
interface AddressAttributes {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
    isDefault: boolean;
    type: 'shipping' | 'billing' | 'both';
    createdAt: Date;
    updatedAt: Date;
}

// Optional attributes for creation
interface AddressCreationAttributes extends Optional<AddressAttributes, 'id' | 'company' | 'address2' | 'phone' | 'isDefault' | 'createdAt' | 'updatedAt'> { }

// Address model class
class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
    public id!: string;
    public userId!: string;
    public firstName!: string;
    public lastName!: string;
    public company?: string;
    public address1!: string;
    public address2?: string;
    public city!: string;
    public state!: string;
    public zipCode!: string;
    public country!: string;
    public phone?: string;
    public isDefault!: boolean;
    public type!: 'shipping' | 'billing' | 'both';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Instance methods
    public toJSON() {
        return this.get();
    }

    // Get full name
    public getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    // Get formatted address
    public getFormattedAddress(): string {
        let address = this.address1;
        if (this.address2) {
            address += `, ${this.address2}`;
        }
        address += `, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
        return address;
    }
}

// Initialize the model
Address.init(
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
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 50],
            },
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 50],
            },
        },
        company: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        address1: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255],
            },
        },
        address2: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100],
            },
        },
        state: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100],
            },
        },
        zipCode: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 20],
            },
        },
        country: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100],
            },
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            validate: {
                len: [10, 20],
            },
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        type: {
            type: DataTypes.ENUM('shipping', 'billing', 'both'),
            allowNull: false,
            defaultValue: 'both',
        },
    },
    {
        sequelize,
        modelName: 'Address',
        tableName: 'addresses',
        timestamps: true,
        indexes: [
            {
                fields: ['userId'],
            },
            {
                fields: ['userId', 'isDefault'],
            },
            {
                fields: ['type'],
            },
        ],
    }
);

export default Address;
