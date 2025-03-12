const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category must have a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'A category name cannot be more than 50 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  image: {
    url: String,
    alt: String
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  ancestors: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  featuredOrder: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimization
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ isFeatured: 1 });
categorySchema.index({ displayOrder: 1 });
categorySchema.index({ featuredOrder: 1 });

// Virtual populate - get all products in this category
categorySchema.virtual('products', {
  ref: 'Product',
  foreignField: 'category',
  localField: '_id'
});

// Generate slug from name before save
categorySchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
    
    // Check if slug exists and make it unique
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const categoriesWithSlug = await this.constructor.find({ slug: slugRegEx });
    
    if (categoriesWithSlug.length) {
      this.slug = `${this.slug}-${categoriesWithSlug.length + 1}`;
    }
  }
  
  // Handle category ancestors
  if (this.parent && this.isModified('parent')) {
    const parent = await this.constructor.findById(this.parent);
    
    if (parent) {
      this.ancestors = [
        ...parent.ancestors,
        {
          _id: parent._id,
          name: parent.name,
          slug: parent.slug
        }
      ];
    }
  } else if (!this.parent) {
    this.ancestors = [];
  }
  
  next();
});

// Cascade update to subcategories when parent is updated
categorySchema.post('save', async function() {
  if (this.isModified('name') || this.isModified('slug')) {
    // Update all child categories that have this category in their ancestors
    await this.constructor.updateMany(
      { 'ancestors._id': this._id },
      {
        $set: {
          'ancestors.$.name': this.name,
          'ancestors.$.slug': this.slug
        }
      }
    );
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;