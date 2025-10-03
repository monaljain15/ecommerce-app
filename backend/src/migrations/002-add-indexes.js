'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add indexes for users table
    await queryInterface.addIndex('users', ['email'], {
      unique: true,
      name: 'users_email_unique'
    });
    
    await queryInterface.addIndex('users', ['role'], {
      name: 'users_role_index'
    });
    
    await queryInterface.addIndex('users', ['isActive'], {
      name: 'users_is_active_index'
    });
    
    await queryInterface.addIndex('users', ['emailVerified'], {
      name: 'users_email_verified_index'
    });

    // Add indexes for categories table
    await queryInterface.addIndex('categories', ['slug'], {
      unique: true,
      name: 'categories_slug_unique'
    });
    
    await queryInterface.addIndex('categories', ['parentId'], {
      name: 'categories_parent_id_index'
    });
    
    await queryInterface.addIndex('categories', ['isActive'], {
      name: 'categories_is_active_index'
    });
    
    await queryInterface.addIndex('categories', ['sortOrder'], {
      name: 'categories_sort_order_index'
    });

    // Add indexes for brands table
    await queryInterface.addIndex('brands', ['slug'], {
      unique: true,
      name: 'brands_slug_unique'
    });
    
    await queryInterface.addIndex('brands', ['isActive'], {
      name: 'brands_is_active_index'
    });
    
    await queryInterface.addIndex('brands', ['sortOrder'], {
      name: 'brands_sort_order_index'
    });

    // Add indexes for products table
    await queryInterface.addIndex('products', ['slug'], {
      unique: true,
      name: 'products_slug_unique'
    });
    
    await queryInterface.addIndex('products', ['sku'], {
      unique: true,
      name: 'products_sku_unique',
      where: {
        sku: {
          [Sequelize.Op.ne]: null
        }
      }
    });
    
    await queryInterface.addIndex('products', ['barcode'], {
      unique: true,
      name: 'products_barcode_unique',
      where: {
        barcode: {
          [Sequelize.Op.ne]: null
        }
      }
    });
    
    await queryInterface.addIndex('products', ['categoryId'], {
      name: 'products_category_id_index'
    });
    
    await queryInterface.addIndex('products', ['brandId'], {
      name: 'products_brand_id_index'
    });
    
    await queryInterface.addIndex('products', ['isActive'], {
      name: 'products_is_active_index'
    });
    
    await queryInterface.addIndex('products', ['isFeatured'], {
      name: 'products_is_featured_index'
    });
    
    await queryInterface.addIndex('products', ['price'], {
      name: 'products_price_index'
    });
    
    await queryInterface.addIndex('products', ['rating'], {
      name: 'products_rating_index'
    });
    
    await queryInterface.addIndex('products', ['stock'], {
      name: 'products_stock_index'
    });

    // Add indexes for addresses table
    await queryInterface.addIndex('addresses', ['userId'], {
      name: 'addresses_user_id_index'
    });
    
    await queryInterface.addIndex('addresses', ['userId', 'isDefault'], {
      name: 'addresses_user_id_is_default_index'
    });
    
    await queryInterface.addIndex('addresses', ['type'], {
      name: 'addresses_type_index'
    });

    // Add indexes for cart_items table
    await queryInterface.addIndex('cart_items', ['userId', 'productId'], {
      unique: true,
      name: 'cart_items_user_product_unique'
    });
    
    await queryInterface.addIndex('cart_items', ['userId'], {
      name: 'cart_items_user_id_index'
    });
    
    await queryInterface.addIndex('cart_items', ['productId'], {
      name: 'cart_items_product_id_index'
    });

    // Add indexes for orders table
    await queryInterface.addIndex('orders', ['orderNumber'], {
      unique: true,
      name: 'orders_order_number_unique'
    });
    
    await queryInterface.addIndex('orders', ['userId'], {
      name: 'orders_user_id_index'
    });
    
    await queryInterface.addIndex('orders', ['status'], {
      name: 'orders_status_index'
    });
    
    await queryInterface.addIndex('orders', ['createdAt'], {
      name: 'orders_created_at_index'
    });

    // Add indexes for order_items table
    await queryInterface.addIndex('order_items', ['orderId'], {
      name: 'order_items_order_id_index'
    });
    
    await queryInterface.addIndex('order_items', ['productId'], {
      name: 'order_items_product_id_index'
    });

    // Add indexes for reviews table
    await queryInterface.addIndex('reviews', ['userId', 'productId'], {
      unique: true,
      name: 'reviews_user_product_unique'
    });
    
    await queryInterface.addIndex('reviews', ['productId'], {
      name: 'reviews_product_id_index'
    });
    
    await queryInterface.addIndex('reviews', ['userId'], {
      name: 'reviews_user_id_index'
    });
    
    await queryInterface.addIndex('reviews', ['rating'], {
      name: 'reviews_rating_index'
    });
    
    await queryInterface.addIndex('reviews', ['isApproved'], {
      name: 'reviews_is_approved_index'
    });
    
    await queryInterface.addIndex('reviews', ['isVerified'], {
      name: 'reviews_is_verified_index'
    });

    // Add indexes for favorites table
    await queryInterface.addIndex('favorites', ['userId', 'productId'], {
      unique: true,
      name: 'favorites_user_product_unique'
    });
    
    await queryInterface.addIndex('favorites', ['userId'], {
      name: 'favorites_user_id_index'
    });
    
    await queryInterface.addIndex('favorites', ['productId'], {
      name: 'favorites_product_id_index'
    });

    // Add indexes for payments table
    await queryInterface.addIndex('payments', ['orderId'], {
      name: 'payments_order_id_index'
    });
    
    await queryInterface.addIndex('payments', ['status'], {
      name: 'payments_status_index'
    });
    
    await queryInterface.addIndex('payments', ['paymentMethod'], {
      name: 'payments_payment_method_index'
    });
    
    await queryInterface.addIndex('payments', ['stripePaymentIntentId'], {
      unique: true,
      name: 'payments_stripe_payment_intent_id_unique',
      where: {
        stripePaymentIntentId: {
          [Sequelize.Op.ne]: null
        }
      }
    });
    
    await queryInterface.addIndex('payments', ['stripeChargeId'], {
      unique: true,
      name: 'payments_stripe_charge_id_unique',
      where: {
        stripeChargeId: {
          [Sequelize.Op.ne]: null
        }
      }
    });
    
    await queryInterface.addIndex('payments', ['stripeRefundId'], {
      unique: true,
      name: 'payments_stripe_refund_id_unique',
      where: {
        stripeRefundId: {
          [Sequelize.Op.ne]: null
        }
      }
    });

    // Add indexes for refresh_tokens table
    await queryInterface.addIndex('refresh_tokens', ['token'], {
      unique: true,
      name: 'refresh_tokens_token_unique'
    });
    
    await queryInterface.addIndex('refresh_tokens', ['userId'], {
      name: 'refresh_tokens_user_id_index'
    });
    
    await queryInterface.addIndex('refresh_tokens', ['expiresAt'], {
      name: 'refresh_tokens_expires_at_index'
    });
    
    await queryInterface.addIndex('refresh_tokens', ['isRevoked'], {
      name: 'refresh_tokens_is_revoked_index'
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop indexes in reverse order
    await queryInterface.removeIndex('refresh_tokens', 'refresh_tokens_is_revoked_index');
    await queryInterface.removeIndex('refresh_tokens', 'refresh_tokens_expires_at_index');
    await queryInterface.removeIndex('refresh_tokens', 'refresh_tokens_user_id_index');
    await queryInterface.removeIndex('refresh_tokens', 'refresh_tokens_token_unique');

    await queryInterface.removeIndex('payments', 'payments_stripe_refund_id_unique');
    await queryInterface.removeIndex('payments', 'payments_stripe_charge_id_unique');
    await queryInterface.removeIndex('payments', 'payments_stripe_payment_intent_id_unique');
    await queryInterface.removeIndex('payments', 'payments_payment_method_index');
    await queryInterface.removeIndex('payments', 'payments_status_index');
    await queryInterface.removeIndex('payments', 'payments_order_id_index');

    await queryInterface.removeIndex('favorites', 'favorites_product_id_index');
    await queryInterface.removeIndex('favorites', 'favorites_user_id_index');
    await queryInterface.removeIndex('favorites', 'favorites_user_product_unique');

    await queryInterface.removeIndex('reviews', 'reviews_is_verified_index');
    await queryInterface.removeIndex('reviews', 'reviews_is_approved_index');
    await queryInterface.removeIndex('reviews', 'reviews_rating_index');
    await queryInterface.removeIndex('reviews', 'reviews_user_id_index');
    await queryInterface.removeIndex('reviews', 'reviews_product_id_index');
    await queryInterface.removeIndex('reviews', 'reviews_user_product_unique');

    await queryInterface.removeIndex('order_items', 'order_items_product_id_index');
    await queryInterface.removeIndex('order_items', 'order_items_order_id_index');

    await queryInterface.removeIndex('orders', 'orders_created_at_index');
    await queryInterface.removeIndex('orders', 'orders_status_index');
    await queryInterface.removeIndex('orders', 'orders_user_id_index');
    await queryInterface.removeIndex('orders', 'orders_order_number_unique');

    await queryInterface.removeIndex('cart_items', 'cart_items_product_id_index');
    await queryInterface.removeIndex('cart_items', 'cart_items_user_id_index');
    await queryInterface.removeIndex('cart_items', 'cart_items_user_product_unique');

    await queryInterface.removeIndex('addresses', 'addresses_type_index');
    await queryInterface.removeIndex('addresses', 'addresses_user_id_is_default_index');
    await queryInterface.removeIndex('addresses', 'addresses_user_id_index');

    await queryInterface.removeIndex('products', 'products_stock_index');
    await queryInterface.removeIndex('products', 'products_rating_index');
    await queryInterface.removeIndex('products', 'products_price_index');
    await queryInterface.removeIndex('products', 'products_is_featured_index');
    await queryInterface.removeIndex('products', 'products_is_active_index');
    await queryInterface.removeIndex('products', 'products_brand_id_index');
    await queryInterface.removeIndex('products', 'products_category_id_index');
    await queryInterface.removeIndex('products', 'products_barcode_unique');
    await queryInterface.removeIndex('products', 'products_sku_unique');
    await queryInterface.removeIndex('products', 'products_slug_unique');

    await queryInterface.removeIndex('brands', 'brands_sort_order_index');
    await queryInterface.removeIndex('brands', 'brands_is_active_index');
    await queryInterface.removeIndex('brands', 'brands_slug_unique');

    await queryInterface.removeIndex('categories', 'categories_sort_order_index');
    await queryInterface.removeIndex('categories', 'categories_is_active_index');
    await queryInterface.removeIndex('categories', 'categories_parent_id_index');
    await queryInterface.removeIndex('categories', 'categories_slug_unique');

    await queryInterface.removeIndex('users', 'users_email_verified_index');
    await queryInterface.removeIndex('users', 'users_is_active_index');
    await queryInterface.removeIndex('users', 'users_role_index');
    await queryInterface.removeIndex('users', 'users_email_unique');
  }
};
