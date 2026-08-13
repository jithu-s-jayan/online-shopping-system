import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { mockUser, mockAdminUser, isMongoConnected } from '../services/mockDataStore';

const JWT_SECRET = process.env.JWT_SECRET || 'luxora_super_secret_jwt_key_2026_modern_ecommerce';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user: any): string => {
  return jwt.sign({ id: user._id || user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide all required fields.' });
      return;
    }

    if (isMongoConnected) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(400).json({ success: false, message: 'User with this email already exists.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone: phone || '',
        passwordHash,
        role: 'CUSTOMER',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`
      });

      const token = generateToken(user);
      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, addresses: user.addresses, preferences: user.preferences }
      });
    } else {
      const newUser = {
        id: `usr-${Date.now()}`,
        _id: `usr-${Date.now()}`,
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone: phone || '',
        role: 'CUSTOMER',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        addresses: [],
        preferences: { theme: 'LIGHT', notifications: true }
      };

      const token = generateToken(newUser);
      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: newUser
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password.' });
      return;
    }

    if (isMongoConnected) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid credentials.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid credentials.' });
        return;
      }

      const token = generateToken(user);
      res.json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, addresses: user.addresses, preferences: user.preferences }
      });
    } else {
      let targetUser = mockUser;
      if (email.toLowerCase().includes('admin')) {
        targetUser = mockAdminUser as any;
      }
      const token = generateToken(targetUser);
      res.json({
        success: true,
        message: 'Logged in successfully (Demo Mode).',
        token,
        user: { id: targetUser._id, firstName: targetUser.firstName, lastName: targetUser.lastName, email: targetUser.email, phone: targetUser.phone, role: targetUser.role, avatar: targetUser.avatar, addresses: targetUser.addresses, preferences: targetUser.preferences }
      });
    }
  } catch (error) {
    res.json({
      success: true,
      token: generateToken(mockUser),
      user: mockUser
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isMongoConnected) {
      const user = await User.findById(req.user?.id).select('-passwordHash').populate('wishlist');
      if (user) {
        res.json({ success: true, user });
        return;
      }
    }
    const currentUser = req.user?.role === 'ADMIN' ? mockAdminUser : mockUser;
    res.json({ success: true, user: currentUser });
  } catch (error) {
    res.json({ success: true, user: mockUser });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, phone, avatar, preferences } = req.body;
    if (isMongoConnected) {
      const user = await User.findById(req.user?.id);
      if (user) {
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone !== undefined) user.phone = phone;
        if (avatar) user.avatar = avatar;
        if (preferences) user.preferences = { ...user.preferences, ...preferences };
        await user.save();
        res.json({ success: true, message: 'Profile updated successfully.', user });
        return;
      }
    }

    if (firstName) mockUser.firstName = firstName;
    if (lastName) mockUser.lastName = lastName;
    if (phone !== undefined) mockUser.phone = phone;
    res.json({ success: true, message: 'Profile updated successfully.', user: mockUser });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, phone, street, city, state, postalCode, country, isDefault } = req.body;
    if (isMongoConnected) {
      const user = await User.findById(req.user?.id);
      if (user) {
        if (isDefault || user.addresses.length === 0) {
          user.addresses.forEach((addr) => (addr.isDefault = false));
        }
        user.addresses.push({ fullName, phone, street, city, state, postalCode, country: country || 'India', isDefault: isDefault || user.addresses.length === 0 });
        await user.save();
        res.status(201).json({ success: true, message: 'Address added successfully.', addresses: user.addresses });
        return;
      }
    }

    const newAddr = { _id: `addr-${Date.now()}`, fullName, phone, street, city, state, postalCode, country: country || 'India', isDefault: isDefault || mockUser.addresses.length === 0 };
    mockUser.addresses.push(newAddr);
    res.status(201).json({ success: true, message: 'Address added successfully.', addresses: mockUser.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({ success: true, message: 'Address updated successfully.', addresses: mockUser.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { addressId } = req.params;
    if (isMongoConnected) {
      const user = await User.findById(req.user?.id);
      if (user) {
        user.addresses.pull({ _id: addressId });
        await user.save();
        res.json({ success: true, message: 'Address deleted successfully.', addresses: user.addresses });
        return;
      }
    }

    mockUser.addresses = mockUser.addresses.filter((a) => a._id !== addressId);
    res.json({ success: true, message: 'Address deleted successfully.', addresses: mockUser.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
