/*
 * passFun.js
 *
 * Author
 * Igor Sawczuk <isawczuk at gmail dot com> -- agniwa.pl
 *
 *
 * License
 * MIT License (see below)
 *
 * ---------------------------------------------------------------
 * Copyright (c) 2012 Igor Sawczuk <isawczuk at gmail dot com>
 * 
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation 
 * files (the "Software"), to deal in the Software without 
 * restriction, including without limitation the rights to use, 
 * copy, modify, merge, publish, distribute, sublicense, and/or 
 * sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following 
 * conditions:
 * 
 * The above copyright notice and this permission notice shall 
 * be included in all copies or substantial portions of the 
 * Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY 
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE 
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
 * OR OTHER DEALINGS IN THE SOFTWARE. 
 * ---------------------------------------------------------------
 * 
 * Displaying password strength should be fun and understandable for every one.
 * ===========================================================================
 * v0.1 - my first attempt. it uses external lib to meter your password
 *			and display pixelized image based on how strong is password
 * 
 * 
 * FAST START
 * ==========
 * <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
 * $(document).ready(function() {
 *			$('#nicepass').passFun();
 *	});
 * <canvas id="passfun_canvas" class="tip" width="360", height="360"></canvas>
 */

(function( $ ){
  var methods = {
     init : function( options ) {

       return this.each(function(){
         $(this).bind('focus', methods.focus);
         $(this).bind('keyup', methods.keyup);
		 $(this).bind('blur', methods.blur);
		 //stworz obiekt
       });

     },
     destroy : function( ) {
       return this.each(function(){
         //$(window).unbind('.tooltip');
       })
     },
	 keyup : function( ) {
		passwordCheck($(this).val(), function(result) { 
					var canvas = document.getElementById("passfun_canvas");
					var context = canvas.getContext("2d");
					var pixx = 45 - result.score;
					var myImage = new Image();
					myImage.onload = function() {
						var sourceWidth = myImage.width;
						var sourceHeight = myImage.height;
						var destX = canvas.width / 2 - sourceWidth / 2;
						var destY = canvas.height / 2 - sourceHeight / 2;
						context.drawImage(myImage, destX, destY);
						if(pixx > 5) {
						focusImage(context, myImage, sourceWidth, sourceHeight, destX, destY,pixx);
							context.fillStyle = '#f00';
							context.font = 'italic bold 10px sans-serif';
							context.textBaseline = 'bottom';
							context.fillText('Password is ' + result.verdict + '. Improve password to see image.', 10, 10);
						}
					}
					myImage.src = "test.jpg";
				});
	 },
     focus : function( ) { 
		var tipY = $(this).position().top;
		var tipX = $(this).position().left+$(this).width()+10;    
		$('#passfun_canvas').css({  top: tipY, left: tipX });
		$('#passfun_canvas').show();
     },
     show : function( ) { 
       // ... 
     },
     hide : function( ) {
       // ... 
     },
     update : function( content ) { 
       // ...
     }
  };

  $.fn.passFun = function( method ) {
    
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.passFun' );
    }    
  
  };

})( jQuery );

function focusImage(context, imageObj, sourceWidth, sourceHeight, destX, destY,pix){
    var sourceX = destX;
    var sourceY = destY;
    var imageData = context.getImageData(sourceX, sourceY, sourceWidth, sourceHeight);
    var data = imageData.data;
    for (var y = 0; y < sourceHeight; y += pix) {
        for (var x = 0; x < sourceWidth; x += pix) {
            var red = data[((sourceWidth * y) + x) * 4];
            var green = data[((sourceWidth * y) + x) * 4 + 1];
            var blue = data[((sourceWidth * y) + x) * 4 + 2];
 
            for (var n = 0; n < pix; n++) {
                for (var m = 0; m < pix; m++) {
                    if (x + m < sourceWidth) {
                        data[((sourceWidth * (y + n)) + (x + m)) * 4] = red;
                        data[((sourceWidth * (y + n)) + (x + m)) * 4 + 1] = green;
                        data[((sourceWidth * (y + n)) + (x + m)) * 4 + 2] = blue;
                    }
                }
            }
        }
    }
    context.putImageData(imageData, destX, destY);
}
