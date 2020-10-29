import { chrtGeneric } from 'chrt-core';
import { isNull } from '~/helpers';
import { createSVG as create } from '~/layout';
import { lineWidth, lineColor, lineOpacity, area, fillColor, fillOpacity } from './lib';

const DEFAULT_LINE_WIDTH = 1;
const DEAULT_LINE_COLOR = '#000';
const DEFAULT_LINE_OPACITY = 1;
const DEAULT_FILL_COLOR = '#000';
const DEFAULT_FILL_OPACITY = 1;

function chrtLine() {
  chrtGeneric.call(this);
  // console.log(this.render)
  this.type = 'series';
  this._area = false;

  this._stacked = null;

  this.fields.y0 = 'y0';

  this.strokeWidth = DEFAULT_LINE_WIDTH;
  this.stroke = DEAULT_LINE_COLOR;
  this.strokeOpacity = DEFAULT_LINE_OPACITY;
  this._fill = DEAULT_FILL_COLOR;
  this._fillOpacity = DEFAULT_FILL_OPACITY;

  this.draw = () => {
    const _data = this._data.length ? this._data : this.parentNode._data;
    // console.log('this.draw', _data)
    if (!isNull(_data)) {
      if (!this.path) {
        this.path = create('path');
        this.g.appendChild(this.path);
      }
      if (this._area && !this.areaPath) {
        this.areaPath = create('path');
        this.g.appendChild(this.areaPath);
      }


      const dataForLine = this._stacked ?
      _data.map(d => ({
        x: d[this.fields.x],
        y: d[`stacked_${this.fields.y}`],
        y0: d[this.fields.y0],
      })) :
      _data;

      let dataForAreaBaseline = [];
      if(this._area) {
        dataForAreaBaseline = this._stacked ? [...dataForLine].reverse().map(d => ({
          x: d[this.fields.x],
          y: d[this.fields.y0],
        })) : [
          {
            x: _data[_data.length - 1][this.fields.x],
            y: this.parentNode.scales[this.fields.y].domain[0],
          },
          {
            x: _data[0][this.fields.x],
            y: this.parentNode.scales[this.fields.y].domain[0],
          },];
      }

      // console.log('dataForLine',dataForLine)
      // console.log('dataForAreaBaseline',dataForAreaBaseline)

      const dArea = this.interpolationFunction([].concat(dataForLine, dataForAreaBaseline));
      this.areaPath.setAttribute('d', dArea.join(''));
      this.areaPath.setAttribute('fill', this._fill);
      this.areaPath.setAttribute('fill-opacity', this._fillOpacity);
      this.areaPath.setAttribute('stroke', 'none');

      const d = this.interpolationFunction([].concat(dataForLine));
      this.path.setAttribute('d', d.join(''));
      this.path.setAttribute('stroke', this.stroke);
      this.path.setAttribute('stroke-width', this.strokeWidth);
      this.path.setAttribute('stroke-opacity', this.strokeOpacity);
      this.path.setAttribute('stroke-linejoin', 'round');
      this.path.setAttribute('fill', 'none');

      const singlePoints = dataForLine.filter((d, i, points) => {
        return (isNull(points[i - 1]) || isNull(points[i - 1][this.fields.y]))
                &&
                !isNull(d[this.fields.y])
                &&
                (isNull(points[i + 1]) || isNull(points[i + 1][this.fields.y]));
      });

      // TODO: if the data changes and new single points are added they won't be rendered
      if (!this.points) {
        this.points = [];
        singlePoints.forEach((point) => {
          const circle = create('circle');
          this.points.push({
            circle,
            point,
          });
          this.g.appendChild(circle);
        });
      }
      this.points.forEach(d => {
        d.circle.setAttribute('cx', this.parentNode.scales['x'](d.point[this.fields.x]));
        d.circle.setAttribute('cy', this.parentNode.scales['y'](d.point[this.fields.y]));
        d.circle.setAttribute('fill', this.stroke);
        d.circle.setAttribute('r', this.strokeWidth);
      })
    }

    this.objects.forEach(obj => obj.draw())

    return this.parentNode;
  };
}

chrtLine.prototype = Object.create(chrtGeneric.prototype);
chrtLine.prototype.constructor = chrtLine;
chrtLine.parent = chrtGeneric.prototype;

chrtLine.prototype = Object.assign(chrtLine.prototype, {
  width: lineWidth,
  color: lineColor,
  opacity: lineOpacity,
  area,
  fill: fillColor,
  fillOpacity,
});

export default chrtLine;
