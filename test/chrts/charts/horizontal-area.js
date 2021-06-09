import * as chrt from 'chrt';
import chrtLine from '~/chrtLine'

const data = [
  {
    y: 'a',
    x: 10
  },
  {
    y: 'b',
    x: 14
  },
  {
    y: 'c',
    x: 14
  },
  {
    y: 'd',
    x: 22
  }
];

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    .x({scale:'linear'})
    .y({scale:'ordinal'})
    // .y({domain:[1,10000], scale:'log'})
    .add(chrt.xAxis().hideAxis())
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
        .area('left')
    );
}
