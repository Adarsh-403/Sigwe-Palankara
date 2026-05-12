import mongoose from 'mongoose';

const CATEGORIES = [
  'all',
  'curry-powders',
  'whole-spices',
  'masala-blends',
  'pepper',
  'cardamom',
  'turmeric',
];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: 'all',
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
