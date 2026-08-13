export interface ExpenseSuggestion {
  category: string;
  subcategory: string;
}

const suggestions: Array<ExpenseSuggestion & { keywords: string[] }> = [
  { keywords: ['swiggy', 'zomato', 'food delivery'], category: 'Food', subcategory: 'Food Delivery' },
  { keywords: ['uber', 'ola', 'taxi', 'cab'], category: 'Transport', subcategory: 'Taxi/Cab' },
  { keywords: ['petrol', 'diesel', 'fuel'], category: 'Transport', subcategory: 'Fuel' },
  { keywords: ['netflix', 'spotify', 'subscription'], category: 'Entertainment', subcategory: 'Subscriptions' },
  { keywords: ['medicine', 'medical', 'pharmacy'], category: 'Health', subcategory: 'Medicines' },
  { keywords: ['electricity bill', 'power bill'], category: 'Bills', subcategory: 'Electricity' },
  { keywords: ['amazon', 'clothes', 'clothing'], category: 'Shopping', subcategory: 'Clothing' },
  { keywords: ['milk', 'grocery', 'groceries'], category: 'Food', subcategory: 'Groceries' },
];

/** A deliberately local, replaceable categorization step; it never changes the form by itself. */
export const suggestExpenseCategory = (description: string): ExpenseSuggestion | undefined => {
  const normalized = description.toLowerCase();
  return suggestions.find((suggestion) => suggestion.keywords.some((keyword) => normalized.includes(keyword)));
};
