import * as chrt from 'chrt';
import chrtLine from '../../../src/chrtLine'

const data = [
  {
    x: new Date('2021-11-13'),
    y: 10
  },
];

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    .x({scale: 'time'})
    .add(
      chrt.xAxis()
        .format(d => new Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(d))
        .interval('day')
    )
    .add(chrt.yAxis().hideAxis())
    .add(
      chrtLine()
        .data(data, d => (d ? {
          x: d.x,
          y: d.y,
        } : null))
        .width(3)
        .color('#f00')
        .opacity(0.8)
        .area()
    );
}
