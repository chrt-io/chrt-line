export default function area(value = 'bottom') {
  if (typeof value === 'function') {
    // something will go here
  } else {
    this._area = value;
  }
  return this;
}
