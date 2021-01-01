import { chrtGeneric } from "chrt-core";
import { isNull } from "./helpers";
import { createSVG as create } from "./layout";
import {
  lineWidth,
  lineColor,
  lineOpacity,
  area,
  fillColor,
  fillOpacity,
  zero,
} from "./lib";

const DEFAULT_LINE_WIDTH = 1;
const DEAULT_LINE_COLOR = "#000";
const DEFAULT_LINE_OPACITY = 1;
const DEAULT_FILL_COLOR = "#000";
const DEFAULT_FILL_OPACITY = 1;

function chrtLine() {
  chrtGeneric.call(this);
  // console.log(chrtGeneric)
  // console.log(this.render)
  this.type = "series";
  this._area = false;

  this._stacked = null;

  // this.fields.y0 = 'y0';

  this.strokeWidth = DEFAULT_LINE_WIDTH;
  this.stroke = DEAULT_LINE_COLOR;
  this.strokeOpacity = DEFAULT_LINE_OPACITY;
  this._fill = DEAULT_FILL_COLOR;
  this._fillOpacity = DEFAULT_FILL_OPACITY;

  this.paths = [];
  this.areaPaths = [];

  this.draw = () => {
    const _data = this._data.length ? this._data : this.parentNode._data;

    //console.log('LINECHART FIELDS', this.fields)
    if (isNull(this.fields.x)) {
      this.fields.x = this.parentNode.scales.x[this.scales.x].field;
    }
    if (isNull(this.fields.y)) {
      //console.log('this.scales', this.scales)
      //console.log('this.parentNode.scales', this.parentNode.scales)
      this.fields.y = this.parentNode.scales.y[this.scales.y].field;
    }
    if (isNull(this.fields.y0)) {
      this.fields.y0 = `${this.parentNode.scales.y[this.scales.y].field}0`;
    }
    // console.log('LINECHART FIELDS', this.fields)

    if (!isNull(_data)) {
      this.hasCustomBaseline =
        this._area && _data.some((d) => !isNull(d[this.fields.y0]));
      // console.log('hasCustomBaseline', this.hasCustomBaseline)

      let datasetsForLine = _data.reduce((acc, d, i) => {
        if (isNull(d[this.fields.y])) {
          acc.push([]);
          return acc;
        }
        if (!acc.length) {
          acc.push([]);
        }
        const datumForLine =
          this._stacked || this.hasCustomBaseline
            ? {
                x: d[this.fields.x],
                y: this._stacked
                  ? d[`stacked_${this.fields.y}`]
                  : d[this.fields.y],
                y0: d[this.fields.y0],
              }
            : d;
        acc[acc.length - 1].push(datumForLine);
        return acc;
      }, []);

      const datasetsForPoints = datasetsForLine.filter(dataset => dataset.length === 1);
      datasetsForLine = datasetsForLine.filter(dataset => dataset.length > 1);

      datasetsForLine.forEach((dataset, i) => {
        if (!this.paths[i]) {
          this.paths[i] = create("path");
          this.paths[i].setAttribute('data-id', `path-${i}`)
          this.g.appendChild(this.paths[i]);
        }
        if (this._area && !this.areaPaths[i]) {
          this.areaPaths[i] = create("path");
          this.areaPaths[i].setAttribute('data-id', `area-path-${i}`)
          this.g.appendChild(this.areaPaths[i]);
        }
      })

      const datasetsForArea = [];
      if (this._area) {
        const yDomain = this.parentNode.scales.y[this.scales.y].domain;
        let zero = yDomain[0] < 0 || yDomain[1] < 0 ? 0 : Math.min(...yDomain);
        zero = !isNull(this._zero) ? this._zero : zero;

        datasetsForLine.forEach(dataset => {
          const dataForAreaBaseline =
            this._stacked || this.hasCustomBaseline
              ? [...dataset].reverse().map((d) => ({
                  x: d[this.fields.x],
                  y: d[this.fields.y0],
                }))
              : [
                  {
                    x: dataset[dataset.length - 1][this.fields.x],
                    y: zero,
                  },
                  {
                    x: dataset[0][this.fields.x],
                    y: zero,
                  },
                ];
            datasetsForArea.push(dataForAreaBaseline);
        })
      }
      if (this._area && this.areaPaths.length > 0) {
        datasetsForArea.forEach((dataset, i) => {
          const areaPath = this.areaPaths[i];
          const dArea = this.interpolationFunction(
            [].concat(datasetsForLine[i], dataset)
          );
          areaPath.setAttribute("d", dArea.join(""));
          areaPath.setAttribute("fill", this._fill);
          areaPath.setAttribute("fill-opacity", this._fillOpacity);
          areaPath.setAttribute("stroke", "none");
        })

      }
      // console.log('LINE CHART', dataForLine)
      // console.log(this)
      datasetsForLine
        .forEach((dataset, i) => {
          const d = this.interpolationFunction([].concat(dataset));
          const path = this.paths[i];
          path.setAttribute("d", d.join(""));
          path.setAttribute("stroke", this.stroke);
          path.setAttribute("stroke-width", this.strokeWidth);
          path.setAttribute("stroke-opacity", this.strokeOpacity);
          path.setAttribute("stroke-linejoin", "round");
          path.setAttribute("fill", "none");
        });

      datasetsForPoints
        .forEach((dataset) => {
          const singlePoints = dataset.filter((d, i, points) => {
            return (
              (isNull(points[i - 1]) || isNull(points[i - 1][this.fields.y])) &&
              !isNull(d[this.fields.y]) &&
              (isNull(points[i + 1]) || isNull(points[i + 1][this.fields.y]))
            );
          });

          // TODO: if the data changes and new single points are added they won't be rendered
          if (!this.points) {
            this.points = [];
            singlePoints.forEach((point) => {
              const circle = create("circle");
              this.points.push({
                circle,
                point,
              });
              this.g.appendChild(circle);
            });
          }
          this.points.forEach((d) => {
            d.circle.setAttribute(
              "cx",
              this.parentNode.scales.x[this.scales.x](d.point[this.fields.x])
            );
            d.circle.setAttribute(
              "cy",
              this.parentNode.scales.y[this.scales.y](d.point[this.fields.y])
            );
            d.circle.setAttribute("fill", this.stroke);
            d.circle.setAttribute("r", this.strokeWidth);
          });
        });
    }

    this.objects.forEach((obj) => obj.draw());

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
  zero,
});

// export default chrtLine;

export default function () {
  return new chrtLine();
}
