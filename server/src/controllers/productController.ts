import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { initialProducts, isMongoConnected } from '../services/mockDataStore';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, brand, minPrice, maxPrice, rating, sort, featured, newArrival, page = 1, limit = 20 } = req.query;

    if (!isMongoConnected) {
      let filtered = [...initialProducts];

      if (search) {
        const q = (search as string).toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }

      if (category) {
        filtered = filtered.filter((p) => p.category.toLowerCase() === (category as string).toLowerCase());
      }

      if (brand) {
        filtered = filtered.filter((p) => p.brand.toLowerCase() === (brand as string).toLowerCase());
      }

      if (featured === 'true') {
        filtered = filtered.filter((p) => p.isFeatured);
      }

      if (newArrival === 'true') {
        filtered = filtered.filter((p) => p.isNewArrival);
      }

      if (minPrice) filtered = filtered.filter((p) => (p.discountPrice || p.price) >= Number(minPrice));
      if (maxPrice) filtered = filtered.filter((p) => (p.discountPrice || p.price) <= Number(maxPrice));

      res.json({
        success: true,
        count: filtered.length,
        total: filtered.length,
        page: 1,
        pages: 1,
        products: filtered
      });
      return;
    }

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { brand: { $regex: search as string, $options: 'i' } },
        { category: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (brand) {
      query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (featured === 'true') query.isFeatured = true;
    if (newArrival === 'true') query.isNewArrival = true;

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'popular') sortOptions = { reviewCount: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortOptions).skip(skip).limit(limitNum);

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products
    });
  } catch (error) {
    // Fallback to mock catalog
    res.json({
      success: true,
      count: initialProducts.length,
      total: initialProducts.length,
      page: 1,
      pages: 1,
      products: initialProducts
    });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let product = null;

    if (isMongoConnected) {
      product = await Product.findById(id);
      if (!product) {
        product = await Product.findOne({ slug: id });
      }
    }

    if (!product) {
      product = initialProducts.find((p) => p._id === id || p.slug === id);
    }

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    res.json({ success: true, product });
  } catch (error) {
    const fallback = initialProducts.find((p) => p._id === req.params.id || p.slug === req.params.id) || initialProducts[0];
    res.json({ success: true, product: fallback });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body;
    if (!productData.slug && productData.name) {
      productData.slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (isMongoConnected) {
      const product = await Product.create(productData);
      res.status(201).json({ success: true, message: 'Product created successfully.', product });
    } else {
      const newProd = { _id: `prod-${Date.now()}`, ...productData, rating: 5.0, reviewCount: 0, createdAt: new Date().toISOString() };
      initialProducts.unshift(newProd);
      res.status(201).json({ success: true, message: 'Product created successfully.', product: newProd });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      res.json({ success: true, message: 'Product updated successfully.', product });
    } else {
      res.json({ success: true, message: 'Product updated successfully.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Product.findByIdAndDelete(id);
    }
    const idx = initialProducts.findIndex((p) => p._id === id);
    if (idx > -1) initialProducts.splice(idx, 1);
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
