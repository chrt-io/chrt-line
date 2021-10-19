import * as chrt from 'chrt';
import chrtLine from '../../../src/chrtLine'

const data = [
  {
    x: 'a',
    y: 10
  },
  {
    x: 'b',
    y: 14
  },
  {
    x: 'c',
    y: -14
  },
  {
    x: 'd',
    y: -12
  }
];

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    .x({scale:'ordinal'})
    .y({scale:'linear'})
    // .y({domain:[1,10000], scale:'log'})
    .add(chrt.xAxis())
    .add(chrt.yAxis())
    .add(
      chrtLine()
        .data(data, d => ({
          x: d.x,
          y: d.y,
        }))
        .width(0.5)
        .color('#f00')
        .opacity(0.8)
    );
}
