import type { Nutrition } from "../types";

/* 
   Format Time
 */

export const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return mins === 0 ? `${hours} hr` : `${hours} hr ${mins} min`;
};

/* 
   Format Number
 */

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/* 
   Nutrition Per Serving
 */

export const calculatePerServing = (
  nutrition: Nutrition,
  servings: number,
  targetServings: number
): Nutrition => {
  const ratio = targetServings / servings;

  return {
    calories: Math.round(nutrition.calories * ratio),
    protein: Math.round(nutrition.protein * ratio * 10) / 10,
    carbs: Math.round(nutrition.carbs * ratio * 10) / 10,
    fat: Math.round(nutrition.fat * ratio * 10) / 10,
    fiber:
      nutrition.fiber !== undefined
        ? Math.round(nutrition.fiber * ratio * 10) / 10
        : undefined,
  };
};

/* 
   Difficulty Color
 */

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    case "Hard":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/* 
   Dietary Tag Color
 */

export const getDietaryTagColor = (tag: string): string => {
  const colors: Record<string, string> = {
    Vegetarian: "bg-green-100 text-green-700 border-green-200",
    Vegan: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Gluten-Free": "bg-amber-100 text-amber-700 border-amber-200",
    "Dairy-Free": "bg-blue-100 text-blue-700 border-blue-200",
    Keto: "bg-purple-100 text-purple-700 border-purple-200",
    "Low-Carb": "bg-cyan-100 text-cyan-700 border-cyan-200",
    "High-Protein": "bg-rose-100 text-rose-700 border-rose-200",
    "Nut-Free": "bg-orange-100 text-orange-700 border-orange-200",
    Spicy: "bg-red-100 text-red-700 border-red-200",
    "Low-Calorie": "bg-teal-100 text-teal-700 border-teal-200",
  };

  return colors[tag] || "bg-gray-100 text-gray-700 border-gray-200";
};

/* 
   Cuisine Emoji
 */

export const getCuisineEmoji = (cuisine: string): string => {
  const emojis: Record<string, string> = {
    Italian: "🍝",
    Indian: "🍛",
    Chinese: "🥡",
    Mexican: "🌮",
    American: "🍔",
    Mediterranean: "🥗",
    Thai: "🍜",
    Japanese: "🍱",
    French: "🥐",
    Other: "🍽️",
  };

  return emojis[cuisine] || "🍽️";
};

/* 
   Star Generator
 */

export const generateStars = (
  rating: number
): ("full" | "half" | "empty")[] => {
  const stars: ("full" | "half" | "empty")[] = [];

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) stars.push("full");
  if (hasHalfStar) stars.push("half");

  while (stars.length < 5) stars.push("empty");

  return stars;
};

/* 
   Debounce (SSR Safe)
 */

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/* 
   Capitalize
 */

export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/* 
   Truncate
 */

export const truncate = (str: string, maxLength: number): string => {
  return str.length <= maxLength
    ? str
    : str.slice(0, maxLength) + "...";
};

/* 
   Parse Ingredients
 */

export const parseIngredients = (text: string): string[] => {
  return text
    .split(/[,\n]+/)
    .map((ing) => ing.trim())
    .filter(Boolean);
};

/* 
   Ingredient Icon
 */

export const getIngredientIcon = (ingredient: string): string => {
  const icons: Record<string, string> = {
    tomato: "🍅",
    onion: "🧅",
    garlic: "🧄",
    potato: "🥔",
    carrot: "🥕",
    spinach: "🥬",
    broccoli: "🥦",
    pepper: "🫑",
    cucumber: "🥒",
    lettuce: "🥬",
    mushroom: "🍄",
    corn: "🌽",
    eggplant: "🍆",
    avocado: "🥑",
    chicken: "🍗",
    beef: "🥩",
    pork: "🥓",
    fish: "🐟",
    egg: "🥚",
    cheese: "🧀",
    milk: "🥛",
    butter: "🧈",
    bread: "🍞",
    rice: "🍚",
    pasta: "🍝",
    lemon: "🍋",
    lime: "🍈",
    apple: "🍎",
    banana: "🍌",
    orange: "🍊",
    strawberry: "🍓",
  };

  const lower = ingredient.toLowerCase();

  const match = Object.entries(icons).find(([key]) =>
    lower.includes(key)
  );

  return match ? match[1] : "🥄";
};

/* 
   Match Color
 */

export const getMatchColor = (percentage: number): string => {
  if (percentage >= 80) return "text-green-600 bg-green-100";
  if (percentage >= 60) return "text-yellow-600 bg-yellow-100";
  if (percentage >= 40) return "text-orange-600 bg-orange-100";
  return "text-red-600 bg-red-100";
};

/* 
   Scroll To Top (SSR Safe)
 */

export const scrollToTop = (): void => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

/* 
   Local Storage (SSR Safe)
 */

export const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }
};

export const loadFromStorage = <T>(
  key: string,
  defaultValue: T
): T => {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error("Error loading from localStorage:", e);
    return defaultValue;
  }
};
