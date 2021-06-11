import * as chrt from 'chrt';
import chrtLine from '~/chrtLine'

const data = [0,3,5,3,7,9,2,5].map((d,i) => ({x:i,y:d}));

export default async function(container) {
  const chart = chrt.Chrt()
    .node(container)
    .data(data)
    .size(600, 200)
    .add(chrt.xAxis(8))
    .add(chrt.yAxis())
    .add(
      chrtLine().data(data)
    );
  return chart
}
