import { db, Category } from '../db/database';

export class CategoryService {
  static async addCategory(category: Omit<Category, 'id'>) {
    return db.categories.add(category);
  }

  static async updateCategory(id: number, updates: Omit<Category, 'id'>) {
    return db.categories.update(id, updates);
  }

  static async deleteCategory(id: number) {
    return db.categories.delete(id);
  }

  static async getAllCategories() {
    return db.categories.toArray();
  }

  static async getCategoryById(id: number) {
    return db.categories.get(id);
  }

  static async getCategoryByName(name: string) {
    return db.categories.where('name').equals(name).first();
  }
}
