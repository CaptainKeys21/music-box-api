import { random } from './random';
export const slugGen = () => `${Date.now()}_${random()}`;
