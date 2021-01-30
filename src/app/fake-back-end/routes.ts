import { ok } from './helpers';

import { Discount, Tag, Town } from '../models';
import { discounts } from './data/discounts';
import { tags } from './data/tags';
import { towns } from './data/towns';

export function getTowns(): any {
  return ok<Town[]>(towns);
}

export function getTags(): any {
  return ok<Tag[]>(tags);
}

export function getDiscounts(): any {
  return ok<Discount[]>(discounts);
}
