# chrt-line
Component for the creation of **Line charts** and **Area charts** in `chrt`.   Line charts are used to display data as a series of points connected by line segments. A line chart is often used to visualize a trend in data over intervals of time.

In Area charts, the area between axis and line are painted with colors, textures or hatchings, they facilitate the comparison of two or more quantities.

## How to build

###  Install the dependencies
```
npm install
```

###  Build the package
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

####  Create a global node module
```
npm link
```
This creates `chrt-line` module inside your global `node_modules` so that you can import it with `import {chrtLine} from 'chrt-line';`

####  Use the module in a different app
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
