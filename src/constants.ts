export const AUTH_ENDPOINT = 'login';
export const USER_INFO_ENDPOINT = 'user';
export const VENDORS_ENDPOINT = 'vendors';
export const GET_DISCOUNTS_ENDPOINT = 'discounts';
export const GET_TOWNS_ENDPOINT = 'towns';
export const GET_TAGS_ENDPOINT = 'tags';
export const KEY_AUTH_TOKEN = 'key_auth_token';
export const KEY_ACTIVE_USER = 'key_active_user';

export const SORT_BY =[
  {
    name: 'По возрастанию рейтинга',
    sortBy: 'DiscountRatingAsc',
  },
  {
    name: 'По убыванию рейтинга',
    sortBy: 'DiscountRatingDesc',
  },
  {
    name: 'По расстоянию',
    sortBy: 'DistanceAsc',
  },
  {
    name: 'По расстоянию',
    sortBy: 'DistanceDesc',
  },
  {
    name: 'По алфавиту',
    sortBy: 'AlphabetAsc',
  },
  {
    name: 'По алфавиту',
    sortBy: 'AlphabetDesc',
  },
];
