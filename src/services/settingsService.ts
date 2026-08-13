import { db } from '../db/database';

export class SettingsService {
  static async getSetting(key: string): Promise<string | boolean | number | null> {
    const setting = await db.settings.get(key);
    return setting?.value ?? null;
  }

  static async setSetting(key: string, value: string | boolean | number) {
    const existing = await db.settings.get(key);
    if (existing) {
      return db.settings.update(key, { value });
    }
    return db.settings.add({ key, value });
  }

  static async getAllSettings(): Promise<Record<string, string | boolean | number>> {
    const settings = await db.settings.toArray();
    const result: Record<string, string | boolean | number> = {};
    settings.forEach((setting) => {
      result[setting.key] = setting.value;
    });
    return result;
  }

  static async toggleDarkMode() {
    const current = await this.getSetting('darkMode');
    const newValue = !current;
    await this.setSetting('darkMode', newValue);
    return newValue;
  }

  static async getDarkMode(): Promise<boolean> {
    const value = await this.getSetting('darkMode');
    return value === true;
  }

  static async setCurrency(currency: string) {
    return this.setSetting('currency', currency);
  }

  static async getCurrency(): Promise<string> {
    const value = await this.getSetting('currency');
    return typeof value === 'string' ? value : '$';
  }

  static async setMonthlyBudget(amount: number) {
    return this.setSetting('monthlyBudget', amount);
  }

  static async getMonthlyBudget(): Promise<number> {
    const value = await this.getSetting('monthlyBudget');
    return typeof value === 'number' ? value : 0;
  }
}
