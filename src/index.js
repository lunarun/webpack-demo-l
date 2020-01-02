var a = require('./a.js');
require('./style/index.css');
require('./style/a.less');

const fn = () => {
  console.log('es6')
}
fn();

@log
class A {
  a = 1;
}
let b = new A();
console.log(b.a);
a();

function log(target) {
  console.log(target)
}

// require('@babel/polyfill');
// 'aaa'.include('a');
// import $ from 'jquery';
// console.log($)

import icon from './img1.jpg';
let myicon = new Image();
myicon.src = icon;
myicon.style.width = '100%';
myicon.style.height = 'auto';
document.body.appendChild(myicon);