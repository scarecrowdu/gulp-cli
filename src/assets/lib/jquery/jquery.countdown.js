// /**
//  * @name		jQuery Countdown Plugin
//  * @author		Martin Angelov
//  * @version 	1.0
//  * @url			http://tutorialzine.com/2011/12/countdown-jquery/
//  * @license		MIT License
//  */

// (function($){
	
// 	// Number of seconds in every time division
// 	var days	= 24*60*60,
// 		hours	= 60*60,
// 		minutes	= 60;
	
// 	// Creating the plugin
// 	$.fn.countdown = function(prop){
		
// 		var options = $.extend({
// 			callback	: function(){},
// 			timestamp	: 0
// 		},prop);
		
// 		var left, d, h, m, s, positions;

// 		// Initialize the plugin
// 		init(this, options);
		
// 		positions = this.find('.position');
		
// 		(function tick(){
			
// 			// Time left
// 			left = Math.floor((options.timestamp - (new Date())) / 1000);
			
// 			if(left < 0){
// 				left = 0;
// 			}
			
// 			// Number of days left
// 			d = Math.floor(left / days);
// 			updateDuo(0, 1, d);
// 			left -= d*days;
			
// 			// Number of hours left
// 			h = Math.floor(left / hours);
// 			updateDuo(2, 3, h);
// 			left -= h*hours;
			
// 			// Number of minutes left
// 			m = Math.floor(left / minutes);
// 			updateDuo(4, 5, m);
// 			left -= m*minutes;
			
// 			// Number of seconds left
// 			s = left;
// 			updateDuo(6, 7, s);
			
// 			// Calling an optional user supplied callback
// 			options.callback(d, h, m, s);
			
// 			// Scheduling another call of this function in 1s
// 			setTimeout(tick, 1000);
// 		})();
		
// 		// This function updates two digit positions at once
// 		function updateDuo(minor,major,value){
// 			switchDigit(positions.eq(minor),Math.floor(value/10)%10);
// 			switchDigit(positions.eq(major),value%10);
// 		}
		
// 		return this;
// 	};


// 	function init(elem, options){
// 		elem.addClass('countdownHolder');

// 		// Creating the markup inside the container
// 		$.each(['Days','Hours','Minutes','Seconds'],function(i){
// 			$('<span class="count'+this+'">').html(
// 				'<span class="position">\
// 					<span class="digit static">0</span>\
// 				</span>\
// 				<span class="position">\
// 					<span class="digit static">0</span>\
// 				</span>'
// 			).appendTo(elem);

// 			if(this!="Seconds"){
// 				elem.append('<span class="countDiv countDiv'+i+'"></span>');
// 			}
// 		});

// 	}

// 	// Creates an animated transition between the two numbers
// 	function switchDigit(position,number){

// 		var digit = position.find('.digit')

// 		if(digit.is(':animated')){
// 			return false;
// 		}

// 		if(position.data('digit') == number){
// 			// We are already showing this number
// 			return false;
// 		}

// 		position.data('digit', number);

// 		var replacement = $('<span>',{
// 			'class':'digit',
// 			css:{
// 				top:'-2.1em',
// 				opacity:0
// 			},
// 			html:number
// 		});

// 		// The .static class is added when the animation
// 		// completes. This makes it run smoother.

// 		digit
// 			.before(replacement)
// 			.removeClass('static')
// 			.animate({top:'2.5em',opacity:0},'fast',function(){
// 				digit.remove();
// 			})

// 		replacement
// 			.delay(100)
// 			.animate({top:0,opacity:1},'fast',function(){
// 				replacement.addClass('static');
// 			});
// 	}
// })(jQuery);

(function ($) {
		$.fn.countdown = function (options) {
			  // clearTimeout(timer)
				// default options
				var timer = null;
				var defaults = {
						attrName: 'data-diff',
						tmpl: '<span class="hour">%{h}</span><span class="minute">%{m}</span>分钟<span class="sec' +
										'ond">%{s}</span>秒',
						end: 'has ended',
						afterEnd: null
				};
				options = $.extend(defaults, options);

				// trim zero
				function trimZero(str) {
						return parseInt(str.replace(/^0/g, ''));
				}
				// convert string to time
				function getDiffTime(str) {
						var m;
						if ((m = /^(\d{4})[^\d]+(\d{1,2})[^\d]+(\d{1,2})\s+(\d{2})[^\d]+(\d{1,2})[^\d]+(\d{1,2})$/.exec(str))) {
								var year = trimZero(m[1]),
										month = trimZero(m[2]) - 1,
										day = trimZero(m[3]),
										hour = trimZero(m[4]),
										minute = trimZero(m[5]),
										second = trimZero(m[6]);
								return Math.floor((new Date(year, month, day, hour, minute, second).getTime() - new Date().getTime()) / 1000);
						}
						return parseInt(str);
				}
				// format time
				function format(diff) {
						var tmpl = options.tmpl,
								day,
								hour,
								minute,
								second;
						day = /%\{d\}/.test(tmpl)
								? Math.floor(diff / 86400)
								: 0;
						hour = Math.floor((diff - day * 86400) / 3600);
						minute = Math.floor((diff - day * 86400 - hour * 3600) / 60);
						second = diff - day * 86400 - hour * 3600 - minute * 60;
						tmpl = tmpl
								.replace(/%\{d\}/ig, day)
								.replace(/%\{h\}/ig, hour)
								.replace(/%\{m\}/ig, minute)
								.replace(/%\{s\}/ig, second);
						return tmpl;
				}
				// main
				return this.each(function () {
						var el = this,
								diff = getDiffTime($(el).attr(options.attrName));
						function update() {
								if (diff <= 0) {
										$(el).html(options.end);
										if (options.afterEnd) {
												options.afterEnd();
												clearTimeout(timer)
										}
										return;
								}
								$(el).html(format(diff));
								timer = setTimeout(function () {
										diff--;
										update();
								}, 1000);
						}
						update();
				});
		};
})(jQuery);