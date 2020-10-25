import { isNull } from '~/helpers';
export default function lineWidth(value) {
  if(isNull(value)) {
    return this.strokeWidth;
  }

  if (typeof value === 'function') {
    // something will go here
  } else {
    this.strokeWidth = value;
  }
  return this;
}
