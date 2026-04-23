import { Signature } from './Signature.js';

export interface Signed {
  signature?: string;
  signatures?: Signature[];
}
