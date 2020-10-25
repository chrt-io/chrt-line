import { isNull } from '~/helpers';
export default function fillOpacity(value) {
  if(isNull(value)) {
    return this._fillOpacity;
  }

  if (typeof value === 'function') {
    // something will go here
  } else {
    this._fillOpacity = value;
  }
  return this;
}
