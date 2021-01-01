const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
    },
    categories: {
        type: [String],
        enum: ['shoes', 'watches', 'hoodies', 'jeans', "clothing", "t-shirt", 'jackets', 'tees'],
        required: true
    },
    tags: {
        type: [String],
    },
    section: {
        type: String,
        default: "all"
    },
    productCost: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
  },
);

//Create product slug from the name

ProductSchema.pre('save', function(next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

module.exports = mongoose.model('Product', ProductSchema);
