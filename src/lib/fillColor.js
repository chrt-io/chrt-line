import { isNull } from '~/helpers';
export default function fillColor(value) {
  if(isNull(value)) {
    return this._fill;
  }

  if (typeof value === 'function') {
    // something will go here
  } else {
    this._fill = value;
  }
  return this;
}
