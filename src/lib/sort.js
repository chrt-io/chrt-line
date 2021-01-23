import { isNull } from '~/helpers';
export default function sort(value) {
  if(isNull(value)) {
    return this._sortedData;
  }
  if (typeof value === 'function') {
    // something will go here
  } else {
    this._sortedData = value;
  }
  return this;
}
