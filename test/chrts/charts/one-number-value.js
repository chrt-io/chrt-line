import * as chrt from 'chrt';
import chrtLine from '../../../src/chrtLine'

const data = [
  {
    x: 10,
    y: 10
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
