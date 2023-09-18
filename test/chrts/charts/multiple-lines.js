import * as chrt from 'chrt';
import chrtLine from '../../../src/chrtLine'

const data1 = [
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

const data2 = [
  {
    x: 'a',
    y: 2
  },
  {
    x: 'b',
    y: 6
  },
  {
    x: 'c',
    y: 18
  },
  {
    x: 'd',
    y: 20
  }
];

export default async function(container) {
  return chrt.Chrt()
    .node(container)
    .size(600, 200)
    .x({ scale: 'ordinal' })
    // .y({scale:'linear'})
    // .y({domain:[1,10000], scale:'log'})
    .add(chrt.xAxis())
    .add(chrt.yAxis())
    .add(
      chrtLine()
        .data(data1)
        .width(0.5)
        .color('#f00')
        .opacity(0.8)
        .hide()
        .show()
    )
    .add(
      chrtLine()
        .data(data2)
        .width(0.5)
        .color('#00f')
        .opacity(0.8)
        .hide()
        .show()
    );
}
