import dbConnect from './mongoose';
import User from '@/models/User';
import Package from '@/models/Package';
import Contact from '@/models/Contact';
import Brochure from '@/models/Brochure';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Helper to seed data if empty
async function seedIfEmpty() {
  await dbConnect();
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    try {
        const dbPath = path.join(process.cwd(), 'data', 'db.json');
        if (fs.existsSync(dbPath)) {
            const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            if (data.users && data.users.length > 0) await User.insertMany(data.users);
            if (data.packages && data.packages.length > 0) await Package.insertMany(data.packages);
            if (data.contacts && data.contacts.length > 0) await Contact.insertMany(data.contacts);
            console.log("Seeded database from db.json");
        }
    } catch (e) {
        console.error("Error seeding database:", e);
    }
  }
}

// User Auth
export async function createUser({ username, mobile, password }) {
  await seedIfEmpty();
  await dbConnect();
  const existingUser = await User.findOne({ username });
  if (existingUser) return { error: 'Username exists' };
  
  const newUser = await User.create({
    id: uuidv4(),
    username,
    mobile,
    password, // In prod, hash this!
    role: 'user'
  });
  return { success: true, user: { username: newUser.username, role: newUser.role } };
}

export async function verifyUser(username, password) {
  await seedIfEmpty();
  await dbConnect();
  // Note: Plain text password check as per original code
  const user = await User.findOne({ username, password });
  if (user) {
    return { success: true, user: { username: user.username, role: user.role, mobile: user.mobile } };
  }
  return { success: false };
}

// Packages
export async function getPackages() {
  await seedIfEmpty();
  await dbConnect();
  const packages = await Package.find({});
  return packages.map(p => {
      const obj = p.toObject();
      delete obj._id;
      delete obj.__v;
      return obj;
  });
}

export async function addPackage(pkg) {
  await dbConnect();
  const newPkg = await Package.create({ ...pkg, id: uuidv4() });
  const obj = newPkg.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
}

export async function deletePackage(id) {
  await dbConnect();
  await Package.deleteOne({ id });
  return true;
}

// Contacts
export async function addContact(contact) {
  await dbConnect();
  const newContact = await Contact.create({ ...contact, id: uuidv4(), date: new Date() });
   const obj = newContact.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
}

export async function getContacts() {
    await seedIfEmpty();
    await dbConnect();
    const contacts = await Contact.find({});
    return contacts.map(c => {
         const obj = c.toObject();
      delete obj._id;
      delete obj.__v;
      return obj;
    });
}

// Brochures
export async function getBrochures() {
    await seedIfEmpty();
    await dbConnect();
    const brochures = await Brochure.find({});
    return brochures.map(b => {
         const obj = b.toObject();
      delete obj._id;
      delete obj.__v;
      return obj;
    });
}

export async function addBrochure(brochure) {
  await dbConnect();
  const newBrochure = await Brochure.create({ ...brochure, id: uuidv4() });
  const obj = newBrochure.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
}

export async function deleteBrochure(id) {
  await dbConnect();
  await Brochure.deleteOne({ id });
  return true;
}

export async function updateBrochure(id, data) {
    await dbConnect();
    await Brochure.updateOne({ id }, { $set: data });
    return true;
}

export async function getUsers() {
    await seedIfEmpty();
    await dbConnect();
    const users = await User.find({});
    return users.map(u => {
         const obj = u.toObject();
      delete obj._id;
      delete obj.__v;
      return obj;
    });
}
