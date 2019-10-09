console.log('Loading a web page');
var page = require('webpage').create();
var url = './index.html';
page.viewportSize = {
  width: 960,
  height: 700
};
page.open(url, function(status) {
  var maxPageCount, queue = {};

  maxPageCount = page.evaluate(function() {
    return document.querySelector('.slide-number-b').innerText;
  });

  if (maxPageCount <= 0) {
    console.log('failed : cant get total pages');
    phantom.exit();
    return;
  }

  page.evaluate(function() {
    Reveal.configure({ fragments: false });
  });

  console.log('total ' + maxPageCount + ' pages!');

  function createQueue(workIndex) {
    return function() {
      console.log('rendering page of ' + workIndex + ' ..............');
      // waiting transition
      setTimeout(function() {
        page.render('./screenshot/ss-' + ('00' + workIndex).slice(-2) + '.png');
        console.log('done ' + workIndex + '.');
        var next = queue[(workIndex + 1)];
        if (next) {
          page.evaluate(function() {
            Reveal.navigateNext();
          });
          next();
        } else {
          phantom.exit();
        }
      }, 2000);
    };
  }

  for (var index = 0; index < maxPageCount; index++) {
    queue[index] = createQueue(index);
  }
  queue[0]();
});