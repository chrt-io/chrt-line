import chrtObject, { utils, cssDisplay } from 'chrt-object';
import { linear } from 'chrt-interpolations';
import {
  lineWidth,
  lineColor,
  lineOpacity,
  area,
  fillColor,
  fillOpacity,
  zero,
  sort
} from './lib';

const { isNull, createSVG: create } = utils;

const DEFAULT_LINE_WIDTH = 1;
const DEAULT_LINE_COLOR = '#000';
const DEFAULT_LINE_OPACITY = 1;
const DEAULT_FILL_COLOR = '#000';
const DEFAULT_FILL_OPACITY = 1;

function chrtLine() {
  chrtObject.call(this);
  this.type = 'series';
  // _area = false;
  this.attr('area', false);

  this._stacked = null;

  this.attr('sortedData', true);

  const coords = {
    x: 'x',
    y: 'y',
    x0: 'x0',
    y0: 'y0'
  };

  this.interpolationFunction = linear;

  this.attr('strokeWidth', DEFAULT_LINE_WIDTH);
  this.attr('stroke', DEAULT_LINE_COLOR);
  this.attr('strokeOpacity', DEFAULT_LINE_OPACITY);
  this.attr('fill', DEAULT_FILL_COLOR);
  this.attr('fillOpacity', DEFAULT_FILL_OPACITY);

  this.paths = [];
  this.areaPaths = [];

  this._classNames = ['chrt-line'];

  this.draw = () => {
    const _data = this._data.length ? this._data : this.parentNode._data;
    const _area = this.attr('area')();

    cssDisplay.call(this, this.attr('display')());

    this.g.setAttribute('id', `${_area ? 'area' : 'line'}-${this.id()}`);
    console.log('PARENT', this.parent().objects)

    console.log('THIS', this.constructor.name)
    this.g.setAttribute('data-id', `${this.constructor.name}-${this.parent().objects.filter(d => d.constructor.name === this.constructor.name).indexOf(this)}`);
    this.g.classList.remove(...this.g.classList)
    this.g.classList.add(...this._classNames);

    if (isNull(this.fields[coords.x])) {
      this.fields[coords.x] = this.parentNode.scales[coords.x][
        this.scales[coords.x]
      ].field;
    }
    if (isNull(this.fields[coords.y])) {
      //console.log('this.scales', this.scales)
      //console.log('this.parentNode.scales', this.parentNode.scales)
      this.fields[coords.y] = this.parentNode.scales[coords.y][
        this.scales[coords.y]
      ].field;
    }
    if (isNull(this.fields[coords.y0])) {
      this.fields[coords.y0] = `${this.parentNode.scales[coords.y][this.scales[coords.y]].field
        }0`;
    }
    // console.log('LINECHART FIELDS', this.fields)
    // console.log('LINECHART COORDS:', coords)
    // console.log('_data', _data)
    if (!isNull(_data)) {
      const yDomain = this.parentNode.scales[coords.y][this.scales[coords.y]]
        .domain;
      const xDomain = this.parentNode.scales[coords.x][this.scales[coords.x]]
        .domain;
      // console.log(this.fields.x,coords.x,this.scales,'---->',this.scales[coords.x])
      let zero = 0;
      switch (_area) {
        case 'left':
          zero = xDomain[0] < 0 || xDomain[1] < 0 ? 0 : Math.min(...xDomain);
          break;
        case 'right':
          zero = xDomain[0] < 0 || xDomain[1] < 0 ? 0 : Math.max(...xDomain);
          break;
        case 'top':
          zero = yDomain[0] < 0 || yDomain[1] < 0 ? 0 : Math.max(...yDomain);
          break;
        case 'bottom':
        default:
          zero = yDomain[0] < 0 || yDomain[1] < 0 ? 0 : Math.min(...yDomain);
      }

      zero = this.attr('zero')() ?? zero;
      this.hasCustomBaseline =
        _area && _data.some(d => !isNull(d[this.fields[coords.y0]]));
      const _scaleY = this.parentNode.scales[coords.y][this.scales[coords.y]];
      let datasetsForLine = _data.reduce((acc, d) => {
        if (
          isNull(d) ||
          isNull(d[this.fields[coords.y]]) ||
          isNaN(_scaleY(d[this.fields[coords.y]]))
        ) {
          acc.push([]);
          return acc;
        }
        if (!acc.length) {
          acc.push([]);
        }
        const datumForLine =
          this._stacked || this.hasCustomBaseline
            ? {
              [this.fields[coords.x]]: d[this.fields[coords.x]],
              [this.fields[coords.y]]: d[this.fields[coords.y]],
              x: d[this.fields[coords.x]],
              y: d[`${this._stacked ? 'stacked_' : ''}${this.fields[coords.y]}`],
              y0: !isNull(d[`${this._stacked ? 'stacked_' : ''}${this.fields[coords.y0]}`])
                ? d[`${this._stacked ? 'stacked_' : ''}${this.fields[coords.y0]}`]
                : zero,
            }
            : d;
        acc[acc.length - 1].push(datumForLine);
        return acc;
      }, []);

      if (this.attr('sortedData')()) {
        const _scaleX = this.parentNode.scales[coords.x][this.scales[coords.x]];
        datasetsForLine.forEach(dataset => {
          dataset.sort((a, b) => {
            if (_scaleX.transformation === 'ordinal') {
              return (
                (coords.x === 'y' ? -1 : 1) *
                (_scaleX.domain.indexOf(a[this.fields[coords.x]]) -
                  _scaleX.domain.indexOf(b[this.fields[coords.x]]))
              );
            } else {
              return (
                (coords.x === 'y' ? -1 : 1) *
                (a[this.fields[coords.x]] - b[this.fields[coords.x]])
              );
            }
          });
        });
      }

      const datasetsForPoints = datasetsForLine.filter(
        dataset => dataset.length === 1
      );
      datasetsForLine = datasetsForLine.filter(dataset => dataset.length > 1);

      datasetsForLine.forEach((dataset, i) => {
        if (!this.paths[i]) {
          this.paths[i] = create('path');
          this.paths[i].setAttribute('data-id', `path-${i}`);
          this.g.appendChild(this.paths[i]);
        }
        if (_area && !this.areaPaths[i]) {
          this.areaPaths[i] = create('path');
          this.areaPaths[i].setAttribute('data-id', `area-path-${i}`);
          this.g.appendChild(this.areaPaths[i]);
        }
      });

      const datasetsForArea = [];
      if (_area) {
        const horizontalArea = ['left', 'right'].indexOf(_area) > -1;
        // console.log(
        //   "AREA",
        //   _area,
        //   "zero",
        //   zero,
        //   "xDomain:",
        //   xDomain,
        //   "yDomain:",
        //   yDomain
        // );
        datasetsForLine.forEach(dataset => {
          const dataForAreaBaseline =
            this._stacked || this.hasCustomBaseline
              ? [...dataset].reverse().map(d =>
                horizontalArea
                  ? {
                    x: d[this.fields[coords.x0]],
                    y: d[this.fields[coords.y]],
                    [this.fields[coords.x0]]: d[`${this._stacked ? 'stacked_' : ''}${this.fields[coords.x0]}`],
                    [this.fields[coords.y]]: d[this.fields[coords.y]]
                  }
                  : {
                    x: d[this.fields[coords.x]],
                    y: d[this.fields[coords.y0]],
                    [this.fields[coords.x]]: d[this.fields[coords.x]],
                    [this.fields[coords.y0]]: d[`${this._stacked ? 'stacked_' : ''}${this.fields[coords.y0]}`]
                  }
              )
              : [
                horizontalArea
                  ? {
                    x: zero,
                    y: dataset[dataset.length - 1][this.fields[coords.y]],
                    [this.fields[coords.x]]: zero,
                    [this.fields[coords.y]]:
                      dataset[dataset.length - 1][this.fields[coords.y]]
                  }
                  : {
                    x: dataset[dataset.length - 1][this.fields[coords.x]],
                    y: zero,
                    [this.fields[coords.x]]:
                      dataset[dataset.length - 1][this.fields[coords.x]],
                    [this.fields[coords.y]]: zero
                  },
                horizontalArea
                  ? {
                    x: zero,
                    y: dataset[0][this.fields[coords.y]],
                    [this.fields[coords.x]]: zero,
                    [this.fields[coords.y]]:
                      dataset[0][this.fields[coords.y]]
                  }
                  : {
                    x: dataset[0][this.fields[coords.x]],
                    y: zero,
                    [this.fields[coords.x]]:
                      dataset[0][this.fields[coords.x]],
                    [this.fields[coords.y]]: zero
                  }
              ];
          // console.log('dataForAreaBaseline', dataForAreaBaseline)
          datasetsForArea.push(dataForAreaBaseline);
          // console.log('NOW datasetsForArea is', datasetsForArea)
        });
      }
      if (_area && this.areaPaths.length > 0) {
        // console.log("datasetsForArea", datasetsForArea);
        datasetsForArea.forEach((dataset, i) => {
          const areaPath = this.areaPaths[i];
          // const dArea = this.interpolationFunction(
          //   //[].concat(datasetsForLine[i])
          //   [].concat(datasetsForLine[i], dataset)
          // );
          const dAreas = [
            this.interpolationFunction([].concat(datasetsForLine[i])),
            this.interpolationFunction([].concat(dataset)),
          ]
          dAreas[1][0] = dAreas?.[1]?.[0].replace(/M/, 'L') || [];
          //console.log("dArea", dArea, 'from', datasetsForLine[i], dataset);
          // console.log('dAreas', dAreas)
          areaPath.setAttribute('d', ([...dAreas[0], ...dAreas[1]]).join(''));
          areaPath.setAttribute('fill', this.attr('fill')());
          areaPath.setAttribute('fill-opacity', this.attr('fillOpacity')());
          areaPath.setAttribute('stroke', 'none');
        });
      }
      // console.log('LINE CHART', datasetsForLine)
      // console.log(this)
      datasetsForLine.forEach((dataset, i) => {
        // console.log('interpolationFunction', this.interpolationFunction)
        const d = this.interpolationFunction([].concat(dataset));
        const path = this.paths[i];
        path.setAttribute('d', d.join(''));
        path.setAttribute('stroke', this.attr('stroke')());
        path.setAttribute('stroke-width', this.attr('strokeWidth')());
        path.setAttribute('stroke-opacity', this.attr('strokeOpacity')());
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('fill', 'none');
      });
      datasetsForPoints.forEach(dataset => {
        const singlePoints = dataset.filter((d, i, points) => {
          return (
            (isNull(points[i - 1]) ||
              isNull(points[i - 1][this.fields[coords.y]])) &&
            !isNull(d[this.fields[coords.y]]) &&
            (isNull(points[i + 1]) ||
              isNull(points[i + 1][this.fields[coords.y]]))
          );
        });
        // TODO: if the data changes and new single points are added they won't be rendered
        if (!this.points) {
          this.points = [];
          this.g.querySelectorAll('circle').forEach(d => d.remove());
          singlePoints.forEach(point => {
            const circle = create('circle');
            this.points.push({
              circle,
              point
            });
            this.g.appendChild(circle);
          });
        }
        this.points.forEach(d => {
          const cx = this.parentNode.scales[coords.x][this.scales[coords.x]](
            d.point[this.fields[coords.x]]
          );
          if (!isNaN(cx)) {
            d.circle.setAttribute(
              'cx', cx
            );
          }
          const cy = this.parentNode.scales[coords.y][this.scales[coords.y]](
            d.point[this.fields[coords.y]]
          );
          if (!isNaN(cy)) {
            d.circle.setAttribute(
              'cy',
              cy
            );
          }
          d.circle.setAttribute('fill', this.attr('stroke')());
          d.circle.setAttribute('r', this.attr('strokeWidth')());
        });
      });

      // Setting anchors
      // console.log('anchors', _data)
      _data.filter(d => d).forEach(d => {
        const cx = this.parentNode.scales[coords.x][this.scales[coords.x]](
          this._stacked
            ? d[`stacked_${this.fields[coords.x]}`]
            : d?.[this.fields[coords.x]],
        );
        const cy = this.parentNode.scales[coords.y][this.scales[coords.y]](
          this._stacked
            ? d[`stacked_${this.fields[coords.y]}`]
            : d?.[this.fields[coords.y]],
        );
        d.anchorPoints = {
          x: cx,
          width: 0,
          y: cy,
          height: 0,
          relativePosition: [0, -1],
          directions: {
            x: 1,
            y: 1,
          },
          alignment: {
            horizontal: 'middle',
            vertical: 'top',
          }
        };

      });

      if (this.paths.length || this.areaPaths.length) {
        this.objects.forEach(obj => obj.draw());
      }
    }

    return this;
  };
}

chrtLine.prototype = Object.create(chrtObject.prototype);
chrtLine.prototype.constructor = chrtLine;
chrtLine.parent = chrtObject.prototype;

chrtLine.prototype = Object.assign(chrtLine.prototype, {
  width: lineWidth,
  strokeWidth: lineWidth,
  color: lineColor,
  stroke: lineColor,
  opacity: lineOpacity,
  strokeOpacity: lineOpacity,
  area,
  fill: fillColor,
  fillOpacity,
  zero,
  sort
});

// export default chrtLine;

export default function() {
  return new chrtLine();
}
