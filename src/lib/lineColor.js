import { isNull } from '~/helpers';
export default function lineColor(value) {
  if(isNull(value)) {
    return this.stroke;
  }

  if (typeof value === 'function') {
    // something will go here
  } else {
    this.stroke = value;
  }
  return this;
}
