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
    y: 14
  },
  {
    x: 'd',
    y: 22
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
      chrt.chrtStack()
        .add(
          chrtLine()
            .data(data, d => ({
              x: d.x,
              y: d.y,
            }))
            .width(0)
            .area()
            .fill('#f00')
            .fillOpacity(0.5)
            .curve(chrt.interpolations.spline)
        )
        .add(
          chrtLine()
            .data(data, d => ({
              x: d.x,
              y: d.y,
            }))
            // better method names for stroke: strokeWidth, stroke, strokeOpacity
            .strokeWidth(0)
            .area()
            .fill('#00f')
            .fillOpacity(0.5)
            .curve(chrt.interpolations.spline)
        )
        .add(
          chrtLine()
            .data(data, d => ({
              x: d.x,
              y: d.y,
            }))
            .width(0)
            .area()
            .fill('#0f0')
            .fillOpacity(0.5)
            .curve(chrt.interpolations.spline)
        )
    )

}
