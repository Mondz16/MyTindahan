const { Schema, model, Types } = require('mongoose');

// ─── line item sub-schema ─────────────────────────────────────────────────────

const LineSchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      ref:  'Product',
    },
    name:      { type: String, required: true },
    sku:       { type: String, required: true },
    variant:   { type: String, default: null },
    modifiers: { type: [String], default: [] },
    qty:       { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

// ─── order schema ─────────────────────────────────────────────────────────────

const OrderSchema = new Schema(
  {
    orderNumber: {
      type:     String,
      required: true,
      unique:   true,
    },
    lines: {
      type:     [LineSchema],
      required: true,
      validate: { validator: v => v.length > 0, message: 'Order must have at least one line.' },
    },
    subtotal: { type: Number, required: true, min: 0 },
    tax:      { type: Number, required: true, min: 0 },
    tip:      { type: Number, default: 0, min: 0 },
    total:    { type: Number, required: true, min: 0 },
    paymentMethod: {
      type:     String,
      required: true,
      enum:     ['card', 'cash', 'applepay'],
    },
    cashierId: {
      type: Types.ObjectId,
      ref:  'User',
    },
    customerId: {
      type: Types.ObjectId,
    },
    status: {
      type:    String,
      enum:    ['completed', 'voided'],
      default: 'completed',
    },
  },
  { timestamps: true },
);

// orderNumber index created automatically by unique: true
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ cashierId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

// ─── auto-generate orderNumber on new documents ───────────────────────────────

OrderSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  const last = await this.constructor
    .findOne({}, 'orderNumber', { sort: { createdAt: -1 } })
    .lean();

  const lastNum = last ? parseInt(last.orderNumber.replace('T-', ''), 10) : 2800;
  this.orderNumber = `T-${lastNum + 1}`;
  next();
});

module.exports = model('Order', OrderSchema);
