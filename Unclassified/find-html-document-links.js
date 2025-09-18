function URLFinder(_document) {
  this.elements = Array.concat(
    Array.from(_document.getElementsByTagName('img')),
    Array.from(_document.getElementsByTagName('a')),
    Array.from(_document.getElementsByTagName('link')),
    Array.from(_document.getElementsByTagName('script'))
  );
  this.getRelativeURLs = function() {
    var urls = [];
    this.elements.forEach(
      function(element) {
        var str = '';
        console.log(element.name);
        if (element.tagName === 'A' || element.tagName === 'LINK')
          str = element.getAttribute('href');
        else if (element.tagName === 'IMG' || element.tagName === 'SCRIPT')
          str = element.getAttribute('src');
          
        if (str != null && str !== '' && !str.startsWith('http'))
          urls.push(str);
      }
    );
    return urls;
  };
  this.getAbsoluteURLs = function() {
    var urls = [];
    this.elements.forEach(
      function(element) {
        var str = '';
        console.log(element.name);
        if (element.tagName === 'A' || element.tagName === 'LINK')
          str = element.href;
        else if (element.tagName === 'IMG' || element.tagName === 'SCRIPT')
          str = element.src;

        if (str != null && str !== '' && str.startsWith('http'))
          urls.push(str);
      }
    );
    return urls;
  };
};
