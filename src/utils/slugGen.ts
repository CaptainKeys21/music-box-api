import { random } from './random';
export const slugGen = () => String(Date.now()) + String(random());
