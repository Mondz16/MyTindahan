const { Schema, model } = require('mongoose');

const ProductSchema = new Schema(
  {
    sku: {
      type:      String,
      required:  true,
      unique:    true,
      uppercase: true,
      trim:      true,
    },
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    category: {
      type:     String,
      required: true,
      trim:     true,
    },
    price: {
      type:     Number,
      required: true,
      min:      0,
    },
    stock: {
      type:     Number,
      required: true,
      min:      0,
      default:  0,
    },
    swatch: {
      type:    String,
      trim:    true,
      default: '#888888',
    },
    variants: {
      type:    [String],
      default: [],
    },
    modifiers: {
      type:    [String],
      default: [],
    },
    reorderPoint: {
      type:    Number,
      min:     0,
      default: 5,
    },
  },
  { timestamps: true },
);

// sku index created automatically by unique: true
ProductSchema.index({ category: 1 });
ProductSchema.index({ stock: 1 });   // useful for low-stock queries

module.exports = model('Product', ProductSchema);
