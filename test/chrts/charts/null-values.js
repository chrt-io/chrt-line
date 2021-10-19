import * as chrt from 'chrt';
// import Chrt from 'chrt-core';
import chrtLine from '../../../src/chrtLine'

const data = [
  {
    x: 0,
    y: 10
  },
  {
    x: 1,
    y: 14
  },
  {
    x: 2,
    y: 14
  },
  {
    x: 3,
    y: null
  },
  {
    x: 4,
    y: 22
  },
  {
    x: 5,
    y: 12
  },
  {
    x: 6,
    y: 16
  },
  {
    x: 7,
    y: null
  },
  {
    x: 8,
    y: null
  },
  {
    x: 9,
    y: 22
  },
  {
    x: 10,
    y: 16
  },
  {
    x: 11,
    y: null
  },
  {
    x: 12,
    y: 16
  },
  {
    x: 13,
    y: null
  },
  null,
  {
    x: 15,
    y: 22
  },
  {
    x: 15.5,
    y: 22
  },
  {
    x: 17,
    y: 50
  },
  {
    x: 19,
    y: 16
  },
];

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    .add(chrt.xAxis(16))
    .add(chrt.yAxis())
    .add(
      chrtLine()
        .data(data, d => (d ? {
          x: d.x,
          y: d.y,
        } : null))
        .width(3)
        .color('#f00')
        .opacity(0.8)
    );
}
