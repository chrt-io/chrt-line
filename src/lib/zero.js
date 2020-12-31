import { isNull } from '~/helpers';
export default function zero(value) {
  if(isNull(value)) {
    return this._zero;
  }
  if (typeof value === 'function') {
    // something will go here
  } else {
    this._zero = value;
  }
  return this;
}
