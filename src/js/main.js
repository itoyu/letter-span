import './polyfill'
// import $ from 'jquery';
import SplitLetter from './modules/SplitLetter.js';

const init = function(){
  window.onload = function(){
    new SplitLetter('.js-split');
  };
};

init();
