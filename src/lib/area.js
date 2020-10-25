export default function area(value = true) {
  if (typeof value === 'function') {
    // something will go here
  } else {
    this._area = value;
  }
  return this;
}
