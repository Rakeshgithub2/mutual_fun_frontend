/**
 * Category Normalizer
 *
 * Backend uses:
 * - Categories: lowercase (equity, debt, hybrid, etc.)
 * - SubCategories: Title Case with spaces (Large Cap, Mid Cap, etc.)
 *
 * This utility ensures frontend sends data in the correct format.
 */

/**
 * Normalize category to backend format (lowercase)
 *
 * @param category - Category string in any case
 * @returns Lowercase category string
 *
 * @example
 * normalizeCategory('EQUITY') // 'equity'
 * normalizeCategory('Equity') // 'equity'
 * normalizeCategory('equity') // 'equity'
 */
export const normalizeCategory = (category: string): string => {
  if (!category) return '';
  return category.toLowerCase().trim();
};

/**
 * Normalize subcategory to backend format (Title Case with spaces)
 *
 * @param subCategory - SubCategory string in any format
 * @returns Title Case subcategory with proper spacing
 *
 * @example
 * normalizeSubCategory('LARGE_CAP') // 'Large Cap'
 * normalizeSubCategory('LargeCap') // 'Large Cap'
 * normalizeSubCategory('large cap') // 'Large Cap'
 * normalizeSubCategory('Large Cap') // 'Large Cap' (unchanged)
 */
export const normalizeSubCategory = (subCategory: string): string => {
  if (!subCategory) return '';

  // Backend expected subcategories - return as-is if match
  const validSubCategories = [
    'Large Cap',
    'Mid Cap',
    'Small Cap',
    'Flexi Cap',
    'Multi Cap',
    'Large & Mid Cap',
    'Sectoral/Thematic',
    'Focused',
    'Value',
    'Contra',
    'Dividend Yield',
    'Liquid',
    'Overnight',
    'Ultra Short Duration',
    'Low Duration',
    'Money Market',
    'Short Duration',
    'Medium Duration',
    'Medium to Long Duration',
    'Long Duration',
    'Dynamic Bond',
    'Corporate Bond',
    'Credit Risk',
    'Banking & PSU',
    'Gilt',
    'Floater',
    'Conservative Hybrid',
    'Balanced Hybrid',
    'Aggressive Hybrid',
    'Dynamic Asset Allocation',
    'Multi Asset Allocation',
    'Arbitrage',
    'Equity Savings',
    'Gold',
    'Silver',
    'Fund of Funds - Domestic',
    'Fund of Funds - Overseas',
    'Index',
    'Tax Saving',
    'Retirement',
  ];

  // Check if already in valid format
  if (validSubCategories.includes(subCategory)) {
    return subCategory;
  }

  // Handle special cases first
  const specialCases: Record<string, string> = {
    large_cap: 'Large Cap',
    mid_cap: 'Mid Cap',
    small_cap: 'Small Cap',
    flexi_cap: 'Flexi Cap',
    multi_cap: 'Multi Cap',
    large_and_mid_cap: 'Large & Mid Cap',
    'large_&_mid_cap': 'Large & Mid Cap',
    sectoral_thematic: 'Sectoral/Thematic',
    'sectoral/thematic': 'Sectoral/Thematic',
    dividend_yield: 'Dividend Yield',
    ultra_short_duration: 'Ultra Short Duration',
    low_duration: 'Low Duration',
    money_market: 'Money Market',
    short_duration: 'Short Duration',
    medium_duration: 'Medium Duration',
    medium_to_long_duration: 'Medium to Long Duration',
    long_duration: 'Long Duration',
    dynamic_bond: 'Dynamic Bond',
    corporate_bond: 'Corporate Bond',
    credit_risk: 'Credit Risk',
    'banking_&_psu': 'Banking & PSU',
    banking_and_psu: 'Banking & PSU',
    conservative_hybrid: 'Conservative Hybrid',
    balanced_hybrid: 'Balanced Hybrid',
    aggressive_hybrid: 'Aggressive Hybrid',
    dynamic_asset_allocation: 'Dynamic Asset Allocation',
    multi_asset_allocation: 'Multi Asset Allocation',
    equity_savings: 'Equity Savings',
    fund_of_funds_domestic: 'Fund of Funds - Domestic',
    fund_of_funds_overseas: 'Fund of Funds - Overseas',
    tax_saving: 'Tax Saving',
  };

  const lowerKey = subCategory.toLowerCase().replace(/\s+/g, '_');
  if (specialCases[lowerKey]) {
    return specialCases[lowerKey];
  }

  // Generic transformation
  // LARGE_CAP -> Large Cap
  // LargeCap -> Large Cap
  // large cap -> Large Cap
  return subCategory
    .replace(/_/g, ' ') // LARGE_CAP -> LARGE CAP
    .replace(/([A-Z])/g, ' $1') // LargeCap -> Large Cap
    .trim()
    .split(/\s+/)
    .map((word) => {
      // Handle special lowercase words
      if (['and', 'of', 'to'].includes(word.toLowerCase()) && word.length > 2) {
        return word.toLowerCase();
      }
      // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ')
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
};

/**
 * Get display name for category (for UI)
 *
 * @param category - Category string
 * @returns Capitalized display name
 *
 * @example
 * getCategoryDisplayName('equity') // 'Equity'
 * getCategoryDisplayName('solution_oriented') // 'Solution Oriented'
 */
export const getCategoryDisplayName = (category: string): string => {
  if (!category) return '';

  const displayNames: Record<string, string> = {
    equity: 'Equity',
    debt: 'Debt',
    hybrid: 'Hybrid',
    commodity: 'Commodity',
    etf: 'ETF',
    index: 'Index',
    elss: 'ELSS',
    solution_oriented: 'Solution Oriented',
    international: 'International',
  };

  return (
    displayNames[category.toLowerCase()] ||
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
  );
};

/**
 * Validate if category is valid backend category
 *
 * @param category - Category to validate
 * @returns true if valid backend category
 */
export const isValidCategory = (category: string): boolean => {
  const validCategories = [
    'equity',
    'debt',
    'hybrid',
    'commodity',
    'etf',
    'index',
    'elss',
    'solution_oriented',
    'international',
  ];

  return validCategories.includes(category.toLowerCase());
};

/**
 * Get all valid categories
 *
 * @returns Array of valid category objects with value and display name
 */
export const getAllCategories = () => {
  return [
    { value: 'equity', label: 'Equity' },
    { value: 'debt', label: 'Debt' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'commodity', label: 'Commodity' },
    { value: 'etf', label: 'ETF' },
    { value: 'index', label: 'Index' },
    { value: 'elss', label: 'ELSS' },
    { value: 'solution_oriented', label: 'Solution Oriented' },
    { value: 'international', label: 'International' },
  ];
};

/**
 * Get subcategories for a specific category
 *
 * @param category - Category to get subcategories for
 * @returns Array of valid subcategories
 */
export const getSubCategoriesForCategory = (category: string): string[] => {
  const subCategoriesByCategory: Record<string, string[]> = {
    equity: [
      'Large Cap',
      'Mid Cap',
      'Small Cap',
      'Flexi Cap',
      'Multi Cap',
      'Large & Mid Cap',
      'Sectoral/Thematic',
      'Focused',
      'Value',
      'Contra',
      'Dividend Yield',
    ],
    debt: [
      'Liquid',
      'Overnight',
      'Ultra Short Duration',
      'Low Duration',
      'Money Market',
      'Short Duration',
      'Medium Duration',
      'Medium to Long Duration',
      'Long Duration',
      'Dynamic Bond',
      'Corporate Bond',
      'Credit Risk',
      'Banking & PSU',
      'Gilt',
      'Floater',
    ],
    hybrid: [
      'Conservative Hybrid',
      'Balanced Hybrid',
      'Aggressive Hybrid',
      'Dynamic Asset Allocation',
      'Multi Asset Allocation',
      'Arbitrage',
      'Equity Savings',
    ],
    commodity: ['Gold', 'Silver'],
    etf: ['Index'],
    index: ['Index'],
    elss: ['Tax Saving'],
    solution_oriented: ['Retirement'],
    international: ['Fund of Funds - Overseas'],
  };

  return subCategoriesByCategory[category.toLowerCase()] || [];
};
