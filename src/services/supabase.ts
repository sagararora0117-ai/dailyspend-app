import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Supabase configuration is missing. Please check the .env file.'
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

export const registerUserName = async (name: string): Promise<void> => {
  const cleanName = name.trim();

  if (!cleanName) {
    throw new Error('Please enter your name.');
  }

  if (cleanName.length > 100) {
    throw new Error('Name must be 100 characters or less.');
  }

  const { error } = await supabase
    .from('DailySpend Users')
    .insert({
      Name: cleanName,
    });

  if (error) {
    console.error('User registration failed:', error);
    throw new Error('Unable to register your name. Please try again.');
  }
};