import * as chrt from 'chrt';
import chrtLine from '~/chrtLine'

const data = [
  {
    x: 0,
    y: 10
  },
  {
    x: 2,
    y: 14
  },
  {
    x: 3,
    y: 14
  },
  {
    x: 1,
    y: 22
  }
];

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    // .y({domain:[1,10000], scale:'log'})
    .add(chrt.xAxis(4))
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
        .sort(false)
    );
}
