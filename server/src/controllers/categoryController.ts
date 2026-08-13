import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { initialCategories, isMongoConnected } from '../services/mockDataStore';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    if (isMongoConnected) {
      const categories = await Category.find({ active: true }).sort({ name: 1 });
      res.json({ success: true, count: categories.length, categories });
    } else {
      res.json({ success: true, count: initialCategories.length, categories: initialCategories });
    }
  } catch (error) {
    res.json({ success: true, count: initialCategories.length, categories: initialCategories });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, image, description } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (isMongoConnected) {
      const category = await Category.create({ name, slug, image, description });
      res.status(201).json({ success: true, category });
    } else {
      const cat = { _id: `cat-${Date.now()}`, name, slug, image, description, active: true };
      initialCategories.push(cat);
      res.status(201).json({ success: true, category: cat });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
