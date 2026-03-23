import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedSuperadmin = async () => {
  try {
    const existingAdmin = await User.findOne({ username: 'superadmin' });
    if (existingAdmin) {
      console.log('Superadmin already exists.');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin@123', salt);

    await User.create({
      username: 'superadmin',
      password: 'admin@123', // Pre-save hook will hash this, but I'll make sure it's correct
      contact: {
        email: 'admin@iinventive.com'
      },
      role: 'Superadmin'
    });

    console.log('Superadmin created successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedSuperadmin();
