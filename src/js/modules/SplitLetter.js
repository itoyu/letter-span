'use strict'

import _ from 'lodash';

const SplitLetter = class {
  constructor(el) {
    this.tgt = {
      txt: document.querySelectorAll(el),
    }
    window.addEventListener('scroll', _.throttle(this.init.bind(this), 200));
    this.init();
  }
  init() {
    const txtList = this.tgt.txt;

    txtList.forEach(function(item){
      if(!item.classList.contains('show')) {
        async function renderTit() {
          const chars = String(item.textContent).split('');
          const titChars = _.map(chars, function(el, idx) {
            return '<span>' + el + '</span>';
          });
          item.innerHTML = titChars.join('');

          // # Set charctor width
          // const spanChars = item.children;
          // _.each(spanChars, function(el) {
          //   el.style.width = el.clientWidth + 'px';
          // });
          // item.classList.add('tit-hide');
          return titChars;
        }

        const triggerMargin = window.innerHeight / 5; // over top 20%
        renderTit().then(value => {
          if (window.innerHeight > item.getBoundingClientRect().top + triggerMargin) {
            item.classList.add('show');
          }
        });
      }
    });
  }
};
export default SplitLetter;
