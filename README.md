# chrt-line: Line and Area Chart Module

The `chrt-line` module in the Chrt library facilitates the creation of Line charts and Area charts. Line charts visually represent data trends over intervals, connecting data points through line segments. Area charts, on the other hand, paint the area between the axis and line with customizable colors, textures, or hatchings, aiding in the comparison of two or more quantities.

### Key Features:

- **Line Charts:** Utilize the module to create Line charts, suitable for displaying trends in data over time.

- **Area Charts:** Leverage the functionality for Area charts, enhancing the comparison of quantities by filling the area between the axis and line with visual elements.

### Observable Examples and Documentation:

[Chrt Line Charts - Observable](https://observablehq.com/@chrt/line-charts?collection=@chrt/chrt)

## How to build

### Install the dependencies

```
npm install
```

### Build the package

```
npm build
```

### Developing

If you want to develop and see the changes reloaded live into another app you can use the watch script

```
npm run watch
```

## Use it as a module

### Method 1 - tgz package

#### Use the tgz provided in the repository

You can use the `chrt-line-VERSION.tgz` package. The following commands will expand the chrt module in the `node_modules` folder of your project. Ready to be used with the usual `import` command:

```
cp chrt-line-VERSION.tgz SOMEWHERE
cd myproject
npm install SOMEWHERE/chrt-line-VERSION.tgz
```

#### Create a tgz npm package

You can create a package for testing with

```
npm pack
```

This command will create a file called `chrt-line-VERSION.tgz` in the root folder of chrt.

### Method 2 - symlinked package

#### Create a global node module

```
npm link
```

This creates `chrt-line` module inside your global `node_modules` so that you can import it with `import {chrtLine} from 'chrt-line';`

#### Use the module in a different app

```
npm link chrt
```

This will create a sym link to the module created in your global.

## Use it in your code

After having installed or sym-linked the node you can use it as usual

```
import {chrtLine} from 'chrt-line';
```

## Testing

### Unit test with Jest

Run `npm run test` to run all the tests on the code with Jest.

```
npm run test
```

To run only one test:

```
npx jest test/scales/scaleLinear.test.js
```

## API Reference

### Line Chart Methods

The following methods can be used to customize line and area charts:

#### `.width([width])`

Sets or gets the width (stroke thickness) of the line.

```javascript
lineChart.width(2);
```

#### `.color([color])`

Sets or gets the color of the line.

```javascript
lineChart.color("steelblue");
```

#### `.opacity([opacity])`

Sets or gets the opacity of the line, where `1` is fully opaque and `0` is fully transparent.

```javascript
lineChart.opacity(0.8);
```

#### `.area([boolean])`

Enables or disables the area under the line. Pass `true` to enable area shading below the line.

```javascript
lineChart.area(true);
```

#### `.fill([color])`

Sets or gets the fill color for the area under the line, if `area` is enabled.

```javascript
lineChart.fill("lightblue");
```

#### `.fillOpacity([opacity])`

Sets or gets the opacity of the fill color for the area, where `1` is fully opaque and `0` is fully transparent.

```javascript
lineChart.fillOpacity(0.4);
```

#### `.zero([value])`

Sets or gets the baseline value for the area. This baseline is the reference level from which the area starts.

```javascript
lineChart.zero(0);
```

#### `.sort([boolean])`

Enables or disables automatic sorting of the data points by the x-axis values.

```javascript
lineChart.sort(true);
```

#### `.class([classname])`

Assigns a CSS class to the line chart, allowing for customized styling. This method applies a CSS class to the `<path>` element of the line or area chart. For example:

```javascript
import Chrt from "chrt-core";
import lineChart from "chrt-line";

const chart = Chrt()
  .add(
    lineChart().data([-5, 1, 2, 5, 6, -2, -4, -6]).class("custom-line-chart"),
  )
  .node();
```

With the following CSS, the line's color, stroke style, and width can be modified:

```css
.custom-line-chart path {
  stroke: #a38aff;
  stroke-dasharray: 4 2;
  stroke-width: 2;
}
```

This `class` method enables dynamic styling of charts directly via CSS, ideal for theme customization or interactivity.
