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
  sort,
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

  this._sortedData = true;

  const coords = {
    x: "x",
    y: "y",
    x0: "x0",
    y0: "y0",
  };

  // this.fields.y0 = 'y0';

  this.strokeWidth = DEFAULT_LINE_WIDTH;
  this.stroke = DEAULT_LINE_COLOR;
  this.strokeOpacity = DEFAULT_LINE_OPACITY;
  this._fill = DEAULT_FILL_COLOR;
  this._fillOpacity = DEFAULT_FILL_OPACITY;

  this.paths = [];
  this.areaPaths = [];

  this._classNames = ["chrt-line"];

  this.draw = () => {
    const _data = this._data.length ? this._data : this.parentNode._data;

    this._classNames.forEach((d) => this.g.classList.add(d));

    //console.log('LINECHART FIELDS', this.fields)
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
      this.fields[coords.y0] = `${
        this.parentNode.scales[coords.y][this.scales[coords.y]].field
      }0`;
    }
    // console.log('LINECHART FIELDS', this.fields)

    if (!isNull(_data)) {
      const yDomain = this.parentNode.scales[coords.y][this.scales[coords.y]]
        .domain;
      const xDomain = this.parentNode.scales[coords.x][this.scales[coords.x]]
        .domain;
      let zero = 0;
      switch (this._area) {
        case "left":
          zero = xDomain[0] < 0 || xDomain[1] < 0 ? 0 : Math.min(...xDomain);
          break;
        case "right":
          zero = xDomain[0] < 0 || xDomain[1] < 0 ? 0 : Math.max(...xDomain);
          break;
        case "top":
          zero = yDomain[0] < 0 || yDomain[1] < 0 ? 0 : Math.max(...yDomain);
          break;
        case "bottom":
        default:
          zero = yDomain[0] < 0 || yDomain[1] < 0 ? 0 : Math.min(...yDomain);
      }
      // let zero = yDomain[0] < 0 || yDomain[1] < 0 ? 0 : Math.min(...yDomain);
      zero = !isNull(this._zero) ? this._zero : zero;

      this.hasCustomBaseline =
        this._area && _data.some((d) => !isNull(d[this.fields[coords.y0]]));
      // console.log('hasCustomBaseline', this.hasCustomBaseline)

      let datasetsForLine = _data.reduce((acc, d) => {
        if (isNull(d[this.fields[coords.y]])) {
          acc.push([]);
          return acc;
        }
        if (!acc.length) {
          acc.push([]);
        }
        const datumForLine =
          this._stacked || this.hasCustomBaseline
            ? {
                x: d[this.fields[coords.x]],
                y: this._stacked
                  ? d[`stacked_${this.fields[coords.y]}`]
                  : d[this.fields[coords.y]],
                y0: !isNull(d[this.fields[coords.y0]])
                  ? d[this.fields[coords.y0]]
                  : zero,
                // x0: !isNull(d[this.fields[coords.x0]]) ? d[this.fields[coords.x0]] : zero,
              }
            : d;
        acc[acc.length - 1].push(datumForLine);
        return acc;
      }, []);

      if (this._sortedData) {
        const _scaleX = this.parentNode.scales[coords.x][this.scales[coords.x]];
        datasetsForLine.forEach((dataset) => {
          dataset.sort((a, b) => {
            if (_scaleX.transformation === "ordinal") {
              return (
                (coords.x === "y" ? -1 : 1) *
                (_scaleX.domain.indexOf(a[this.fields[coords.x]]) -
                  _scaleX.domain.indexOf(b[this.fields[coords.x]]))
              );
            } else {
              return (
                (coords.x === "y" ? -1 : 1) *
                (a[this.fields[coords.x]] - b[this.fields[coords.x]])
              );
            }
          });
        });
      }

      const datasetsForPoints = datasetsForLine.filter(
        (dataset) => dataset.length === 1
      );
      datasetsForLine = datasetsForLine.filter((dataset) => dataset.length > 1);

      datasetsForLine.forEach((dataset, i) => {
        if (!this.paths[i]) {
          this.paths[i] = create("path");
          this.paths[i].setAttribute("data-id", `path-${i}`);
          this.g.appendChild(this.paths[i]);
        }
        if (this._area && !this.areaPaths[i]) {
          this.areaPaths[i] = create("path");
          this.areaPaths[i].setAttribute("data-id", `area-path-${i}`);
          this.g.appendChild(this.areaPaths[i]);
        }
      });

      const datasetsForArea = [];
      if (this._area) {
        const horizontalArea = ["left", "right"].indexOf(this._area) > -1;
        // console.log(
        //   "AREA",
        //   this._area,
        //   "zero",
        //   zero,
        //   "xDomain:",
        //   xDomain,
        //   "yDomain:",
        //   yDomain
        // );
        datasetsForLine.forEach((dataset) => {
          const dataForAreaBaseline =
            this._stacked || this.hasCustomBaseline
              ? [...dataset].reverse().map((d) =>
                  horizontalArea
                    ? {
                        x: d[this.fields[coords.x0]],
                        y: d[this.fields[coords.y]],
                      }
                    : {
                        x: d[this.fields[coords.x]],
                        y: d[this.fields[coords.y0]],
                      }
                )
              : [
                  horizontalArea
                    ? {
                        x: zero,
                        y: dataset[dataset.length - 1][this.fields[coords.y]],
                      }
                    : {
                        x: dataset[dataset.length - 1][this.fields[coords.x]],
                        y: zero,
                      },
                  horizontalArea
                    ? {
                        x: zero,
                        y: dataset[0][this.fields[coords.y]],
                      }
                    : {
                        x: dataset[0][this.fields[coords.x]],
                        y: zero,
                      },
                ];
          datasetsForArea.push(dataForAreaBaseline);
        });
      }
      if (this._area && this.areaPaths.length > 0) {
        // console.log("datasetsForArea", datasetsForArea);
        datasetsForArea.forEach((dataset, i) => {
          const areaPath = this.areaPaths[i];
          // console.log("areaPath", areaPath);
          const dArea = this.interpolationFunction(
            [].concat(datasetsForLine[i], dataset)
          );
          // console.log("dArea", dArea);
          areaPath.setAttribute("d", dArea.join(""));
          areaPath.setAttribute("fill", this._fill);
          areaPath.setAttribute("fill-opacity", this._fillOpacity);
          areaPath.setAttribute("stroke", "none");
        });
      }
      // console.log('LINE CHART', datasetsForLine)
      // console.log(this)
      datasetsForLine.forEach((dataset, i) => {
        // console.log('interpolationFunction', this.interpolationFunction)
        const d = this.interpolationFunction([].concat(dataset));
        // console.log('d', d)
        const path = this.paths[i];
        path.setAttribute("d", d.join(""));
        path.setAttribute("stroke", this.stroke);
        path.setAttribute("stroke-width", this.strokeWidth);
        path.setAttribute("stroke-opacity", this.strokeOpacity);
        path.setAttribute("stroke-linejoin", "round");
        path.setAttribute("fill", "none");
      });

      datasetsForPoints.forEach((dataset) => {
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
            this.parentNode.scales[coords.x][this.scales[coords.x]](
              d.point[this.fields[coords.x]]
            )
          );
          d.circle.setAttribute(
            "cy",
            this.parentNode.scales[coords.y][this.scales[coords.y]](
              d.point[this.fields[coords.y]]
            )
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
  sort,
});

// export default chrtLine;

export default function () {
  return new chrtLine();
}
