import * as chrt from 'chrt';
// import { yAxis } from 'chrt-axis';
import chrtLine from '~/chrtLine'
//import Chrt from 'chrt-core';

export default async function(container) {
  const chart = chrt.Chrt()
    .node(container)
    .size(600, 200)
    .data([5,5,5,0,10,10,10])
    .y({ scale:'log'})
    //.add(chrt.xAxis(8))
    .add(chrt.yAxis())
    .add(
      chrtLine()
    );

  return chart
}
