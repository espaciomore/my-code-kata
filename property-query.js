/**
 * Author:  Manuel Cerda
 * Git:     espaciomore
 * 
 * Description: INDIO can find any xhtml element by its native properties.
 * 
 */
var INDIO = INDIO || (function(){
  this.find = function( element, properties ) {
    for(var i in element.childNodes) {
      var isMatch = true;
      var index = parseInt(i,10);
      if( !isNaN(index) ) {
        var child = element.childNodes[index];
        for(var key in properties) {
          if( key !== 'index' && child[key] !== properties[key] ) {
            isMatch = false;
          }
        }
        if(isMatch){
          if(properties.index > 0){
            properties.index--;
            continue;
          }else{
            return child;
          }
        }
        if(typeof(child) !== 'object') continue;
        if( Object.prototype.hasOwnProperty.call(child,'tagName') && (child.childNodes.length >= 1 || child.tagName === 'FRAME') ) {
          var e = this.find( child.tagName === 'FRAME' ? child.contentWindow.document : child, properties );
          if(e != undefined) return e;
        }
        delete child;
      }
    }
  };
  return this;
})();

//  var e = INDIO.find( window.document, { tagName:'A',innerHTML:'Click Here!' } );
//  if(e) e.click();
