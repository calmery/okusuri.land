var bsw_images = new Array('229038.gif','229006.gif','229004.gif','229000.gif');
var bsw_amount = 2;
var bsw_speed = 1;
var bsw_amplitude = 3;
var bsw_direction = 'top';
var bsw_design = 12;
var bsw_base = "http://www.blog-switch.com/images/";
var bsw_debug = 0;
var bsw_off = 0;
var bsw_deleted = 0;
var bsw_dx, bsw_xp, bsw_yp, bsw_am, bsw_stx, bsw_sty; 
var bsw_window_width, bsw_window_height, bsw_scroll_height;

var bsw_flakes = new Array();
var bsw_dy = new Array();
var bsw_dx = new Array();
var bsw_xp = new Array();
var bsw_yp = new Array();
var bsw_am = new Array();
var bsw_stx = new Array();
var bsw_sty = new Array();

if(bsw_speed == 0) 
	bsw_speed = 1;
else
	bsw_speed = bsw_speed+bsw_speed;
bsw_amplitude = bsw_amplitude*10;
bsw_no = bsw_amount * 5;
var bsw_started = 0;

function bsw_switch_on()
{
	document.getElementById('bsw_switch_off').style.display = "none";	
	document.getElementById('bsw_switch_on').style.display = "block";
}

function bsw_switch_off()
{
	document.getElementById('bsw_switch_on').style.display = "none";	
	document.getElementById('bsw_switch_off').style.display = "block";
}

function bsw_add_onload_event(fnc)
{
  if ( typeof window.addEventListener != "undefined" )
    window.addEventListener( "load", fnc, false );
  else if ( typeof window.attachEvent != "undefined" ) {
    window.attachEvent( "onload", fnc );
  }
  else {
    if ( window.onload != null ) {
      var oldOnload = window.onload;
      window.onload = function ( e ) {
        oldOnload( e );
        window[fnc]();
      };
    }
    else
      window.onload = fnc;
  }
}

function bsw_start(sw)
{
	if(bsw_deleted == 1) return;

	var myWidth = 0, myHeight = 0;
	if(bsw_debug == 1)
	{
		if(typeof(parent.window.innerWidth) == 'number')
		{
			myWidth = parent.window.innerWidth;
			myHeight = parent.window.innerHeight;
		} 
		else if(parent.document.documentElement && (parent.document.documentElement.clientWidth || parent.document.documentElement.clientHeight))
		{
			myWidth = parent.document.documentElement.clientWidth;
			myHeight = parent.document.documentElement.clientHeight;
		} 
		else if(parent.document.body && (parent.document.body.clientWidth || parent.document.body.clientHeight))
		{
			myWidth = parent.document.body.clientWidth;
			myHeight = parent.document.body.clientHeight;
		}
	}
	else
	{
		if(typeof(window.innerWidth) == 'number')
		{
			myWidth = window.innerWidth;
			myHeight = window.innerHeight;
		} 
		else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight))
		{
			myWidth = document.documentElement.clientWidth;
			myHeight = document.documentElement.clientHeight;
		} 
		else if(document.body && (document.body.clientWidth || document.body.clientHeight))
		{
			myWidth = document.body.clientWidth;
			myHeight = document.body.clientHeight;
		}	
	}
	
	bsw_window_width = myWidth;
	bsw_window_height = myHeight; 

	var i = 0;
	
	if(bsw_started == 1)
	{
		if(sw == 1) bsw_switch_off();
		bsw_started = 0;
		
		if(bsw_debug == 1)
		{
			for (i = 0; i < bsw_no; ++i) 
				parent.document.body.removeChild(bsw_flakes[i]);
			
			//parent.document.body.style.overflow="visible";
		}
		else
		{
			for (i = 0; i < bsw_no; ++i) 
				document.body.removeChild(bsw_flakes[i]);
			
			//document.body.style.overflow="visible";		
		}
		
		return;
	}

	bsw_started = 1;
	if(sw == 1) bsw_switch_on();

	//if(bsw_debug == 1)
	//	parent.document.body.style.overflow="hidden";
	//else
	//	document.body.style.overflow="hidden";

	if(bsw_debug == 1)	
		var h = parent.window.pageYOffset || parent.document.body.scrollTop || parent.document.documentElement.scrollTop;
	else
		var h = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
		
	bsw_scroll_height = h ? h : 0;
	
	var img_max = bsw_images.length;
	var img = 0;
	
	for (i = 0; i < bsw_no; ++i) 
	{
		if(bsw_direction == 'top')
		{
			bsw_dx[i] = 0; 
			bsw_xp[i] = Math.random()*(bsw_window_width-100);
			bsw_yp[i] = bsw_scroll_height + Math.random()*bsw_window_height;
			bsw_am[i] = Math.random()*bsw_amplitude;
			bsw_stx[i] = 0.02 + Math.random()/10;
			bsw_sty[i] = 0.5*bsw_speed + Math.random();
		}

		if(bsw_direction == 'bottom')
		{
			bsw_dx[i] = 0; 
			bsw_xp[i] = Math.random()*(bsw_window_width-100);
			bsw_yp[i] = bsw_scroll_height + Math.random()*bsw_window_height-70;
			bsw_am[i] = Math.random()*bsw_amplitude;
			bsw_stx[i] = 0.02 + Math.random()/10;
			bsw_sty[i] = 0.5*bsw_speed + Math.random();
		}

		if(bsw_direction == 'rt2lb')
		{
			bsw_dx[i] = 0; 
			bsw_dy[i] = 0; 
			bsw_am[i] = Math.random()*bsw_amplitude;
			bsw_xp[i] = Math.random()*(bsw_window_width-90);
			bsw_yp[i] = bsw_scroll_height + Math.random()*(bsw_window_height-bsw_am[i]-70);
			bsw_stx[i] = 0.5*bsw_speed + Math.random();
			bsw_sty[i] = 0.5*bsw_speed + Math.random();
		}

		if(bsw_direction == 'rb2lt')
		{
			bsw_dx[i] = 0; 
			bsw_dy[i] = 0; 
			bsw_am[i] = Math.random()*bsw_amplitude;
			bsw_xp[i] = Math.random()*(bsw_window_width-90);
			bsw_yp[i] = bsw_scroll_height + Math.random()*(bsw_window_height-bsw_am[i]-70);
			bsw_stx[i] = 0.5*bsw_speed + Math.random();
			bsw_sty[i] = 0.5*bsw_speed + Math.random();
		}

		if(bsw_direction == 'lt2rb')
		{
			bsw_dx[i] = 0; 
			bsw_dy[i] = 0; 
			bsw_am[i] = Math.random()*bsw_amplitude;
			bsw_xp[i] = Math.random()*(bsw_window_width-90);
			bsw_yp[i] = bsw_scroll_height + Math.random()*(bsw_window_height-bsw_am[i]-70);
			bsw_stx[i] = 0.5*bsw_speed + Math.random();
			bsw_sty[i] = 0.5*bsw_speed + Math.random();
		}

		if(bsw_direction == 'lb2rt')
		{
			bsw_dx[i] = 0; 
			bsw_dy[i] = 0; 
			bsw_am[i] = Math.random()*bsw_amplitude;
			bsw_xp[i] = Math.random()*(bsw_window_width-90);
			bsw_yp[i] = bsw_scroll_height + Math.random()*(bsw_window_height-bsw_am[i]-70);
			bsw_stx[i] = 0.5*bsw_speed + Math.random();
			bsw_sty[i] = 0.5*bsw_speed + Math.random();
		}

		if(bsw_direction == 'left')
		{
			bsw_dx[i] = 0; 
			bsw_dy[i] = 0; 
			bsw_am[i] = Math.random()*bsw_amplitude;
			bsw_xp[i] = Math.random()*(bsw_window_width-90);
			bsw_yp[i] = bsw_scroll_height + Math.random()*(bsw_window_height-bsw_am[i]-70);
			bsw_stx[i] = 0.5*bsw_speed + Math.random();
			bsw_sty[i] = 0.02 + Math.random()/10;
		}

		if(bsw_direction == 'right')
		{
			bsw_dx[i] = 0; 
			bsw_dy[i] = 0; 
			bsw_am[i] = Math.random()*bsw_amplitude;
			bsw_xp[i] = Math.random()*(bsw_window_width-60);
			bsw_yp[i] = bsw_scroll_height + Math.random()*(bsw_window_height-bsw_am[i]-70);
			bsw_stx[i] = 0.5*bsw_speed + Math.random();
			bsw_sty[i] = 0.02 + Math.random()/10;
		}

		if(bsw_debug == 1)		
			var flake = parent.document.createElement('img');
		else
			var flake = document.createElement('img');

		flake.setAttribute('id', "bsw_flake" + i);
		flake.setAttribute('src', bsw_base + bsw_images[img]);
		
		if(bsw_debug == 1)
			parent.flake_append(flake);
		else
			document.body.appendChild(flake);
			
		flake.style.position = "absolute";
		flake.style.zIndex = 100 + i;
		flake.style.visibility = "visible";
		bsw_flakes[i] = flake;
		
		if(img == img_max-1)
			img = 0;
		else
			img++;
	}

	bsw_animate();	
}

function bsw_animate() 
{
	if(bsw_started == 0)
		return;

	if(bsw_direction == 'top')
	{
		for (var i = 0; i < bsw_no; ++i) 
		{
			bsw_yp[i] += bsw_sty[i];
				
			if (bsw_yp[i] > bsw_scroll_height + bsw_window_height-70) 
			{
				bsw_xp[i] = Math.random()*(bsw_window_width-bsw_am[i]-100);
				bsw_yp[i] = bsw_scroll_height;
				bsw_stx[i] = 0.02 + Math.random()/10;
				bsw_sty[i] = 0.5*bsw_speed + Math.random();
			}

			bsw_dx[i] += bsw_stx[i];

			bsw_flakes[i].style.top = bsw_yp[i] + "px";
			bsw_flakes[i].style.left = bsw_xp[i] + bsw_am[i]*Math.sin(bsw_dx[i]) + "px";
		}
	}

	if(bsw_direction == 'bottom')
	{
		for (var i = 0; i < bsw_no; ++i) 
		{
			bsw_yp[i] -= bsw_sty[i];
					
			if (bsw_yp[i] < bsw_scroll_height + 10) 
			{
				bsw_xp[i] = Math.random()*(bsw_window_width-bsw_am[i]-100);
				bsw_yp[i] = bsw_scroll_height + bsw_window_height-70;
				bsw_stx[i] = 0.02 + Math.random()/10;
				bsw_sty[i] = 0.5*bsw_speed + Math.random();
			}
			
			bsw_dx[i] += bsw_stx[i];

			bsw_flakes[i].style.top = bsw_yp[i] + "px";
			bsw_flakes[i].style.left = bsw_xp[i] + bsw_am[i]*Math.sin(bsw_dx[i]) + "px";
		}
	}

	if(bsw_direction == 'rt2lb')
	{
		for (var i = 0; i < bsw_no; ++i) 
		{
			bsw_yp[i] += bsw_sty[i];
			bsw_xp[i] -= bsw_stx[i];
				
			if (bsw_xp[i] < 10 || bsw_yp[i] > bsw_scroll_height + bsw_window_height-70) 
			{
				bsw_xp[i] = Math.random()*(bsw_window_width-bsw_am[i]-100);
				if (bsw_xp[i] < bsw_window_width*0.2)
				{
					bsw_xp[i] = bsw_window_width-70;
					bsw_yp[i] = bsw_scroll_height + Math.random()*(bsw_window_height-bsw_window_height*0.33);
				}
				else
					bsw_yp[i] = bsw_scroll_height;
					
				bsw_stx[i] = 0.5*bsw_speed + Math.random();
				bsw_sty[i] = 0.5*bsw_speed + Math.random();
			}

			bsw_dx[i] += bsw_stx[i];
			bsw_dy[i] += bsw_sty[i];

			bsw_flakes[i].style.top = bsw_yp[i] + "px";
			bsw_flakes[i].style.left = bsw_xp[i] + "px";
		}
	}


	if(bsw_direction == 'rb2lt')
	{
		for (var i = 0; i < bsw_no; ++i) 
		{
			bsw_yp[i] -= bsw_sty[i];
			bsw_xp[i] -= bsw_stx[i];
				
			if (bsw_xp[i] < 10 || bsw_yp[i] < bsw_scroll_height + 10) 
			{
				bsw_xp[i] = Math.random()*(bsw_window_width-bsw_am[i]-100);
				if (bsw_xp[i] < bsw_window_width*0.3)
				{
					bsw_xp[i] = bsw_window_width-70;
					bsw_yp[i] = bsw_scroll_height + bsw_window_height*0.33 + Math.random()*(bsw_window_height-bsw_window_height*0.33-70);
				}
				else
					bsw_yp[i] = bsw_scroll_height + bsw_window_height-70;
					
				bsw_stx[i] = 0.5*bsw_speed + Math.random();
				bsw_sty[i] = 0.5*bsw_speed + Math.random();
			}

			bsw_dx[i] += bsw_stx[i];
			bsw_dy[i] += bsw_sty[i];

			bsw_flakes[i].style.top = bsw_yp[i] + "px";
			bsw_flakes[i].style.left = bsw_xp[i] + "px";
		}
	}

	if(bsw_direction == 'lt2rb')
	{
		for (var i = 0; i < bsw_no; ++i) 
		{
			bsw_yp[i] += bsw_sty[i];
			bsw_xp[i] += bsw_stx[i];
				
			if (bsw_xp[i] > bsw_window_width-90 || bsw_yp[i] > bsw_scroll_height + bsw_window_height-70) 
			{
				bsw_xp[i] = Math.random()*(bsw_window_width-bsw_am[i]-100);
				if (bsw_xp[i] > bsw_window_width*0.7)
				{
					bsw_xp[i] = 10;
					bsw_yp[i] = bsw_scroll_height + Math.random()*(bsw_window_height-bsw_window_height*0.33);
				}
				else
					bsw_yp[i] = bsw_scroll_height;
					
				bsw_stx[i] = 0.5*bsw_speed + Math.random();
				bsw_sty[i] = 0.5*bsw_speed + Math.random();
			}

			bsw_dx[i] += bsw_stx[i];
			bsw_dy[i] += bsw_sty[i];

			bsw_flakes[i].style.top = bsw_yp[i] + "px";
			bsw_flakes[i].style.left = bsw_xp[i] + "px";
		}
	}

	if(bsw_direction == 'lb2rt')
	{
		for (var i = 0; i < bsw_no; ++i) 
		{
			bsw_yp[i] -= bsw_sty[i];
			bsw_xp[i] += bsw_stx[i];
				
			if (bsw_xp[i] > bsw_window_width-90 || bsw_yp[i] < bsw_scroll_height + 10) 
			{
				bsw_xp[i] = Math.random()*(bsw_window_width-bsw_am[i]-100);
				if (bsw_xp[i] > bsw_window_width*0.7)
				{
					bsw_xp[i] = 10;
					bsw_yp[i] = bsw_scroll_height + bsw_window_height*0.33 + Math.random()*(bsw_window_height-bsw_window_height*0.33-70);
				}
				else
					bsw_yp[i] = bsw_scroll_height + bsw_window_height-70;
					
				bsw_stx[i] = 0.5*bsw_speed + Math.random();
				bsw_sty[i] = 0.5*bsw_speed + Math.random();
			}

			bsw_dx[i] += bsw_stx[i];
			bsw_dy[i] += bsw_sty[i];

			bsw_flakes[i].style.top = bsw_yp[i] + "px";
			bsw_flakes[i].style.left = bsw_xp[i] + "px";
		}
	}

	if(bsw_direction == 'left')
	{
		for (var i = 0; i < bsw_no; ++i) 
		{
			bsw_xp[i] += bsw_stx[i];
				
			if (bsw_xp[i] > bsw_window_width-90) 
			{
				bsw_xp[i] = 10;
				bsw_yp[i] = bsw_scroll_height + Math.random()*(bsw_window_height-bsw_am[i]-70);
				bsw_stx[i] = 0.5*bsw_speed + Math.random();
				bsw_sty[i] = 0.02 + Math.random()/10;
			}

			bsw_dy[i] += bsw_sty[i];

			bsw_flakes[i].style.top = bsw_yp[i] + bsw_am[i]*Math.sin(bsw_dy[i]) + "px";
			bsw_flakes[i].style.left = bsw_xp[i] + "px";
		}
	}

	if(bsw_direction == 'right')
	{
		for (var i = 0; i < bsw_no; ++i) 
		{
			bsw_xp[i] -= bsw_stx[i];
				
			if (bsw_xp[i] < 10) 
			{
				bsw_xp[i] = bsw_window_width-70;
				bsw_yp[i] = bsw_scroll_height + Math.random()*(bsw_window_height-bsw_am[i]-70);
				bsw_stx[i] = 0.5*bsw_speed + Math.random();
				bsw_sty[i] = 0.02 + Math.random()/10;
			}

			bsw_dy[i] += bsw_sty[i];

			bsw_flakes[i].style.top = bsw_yp[i] + bsw_am[i]*Math.sin(bsw_dy[i]) + "px";
			bsw_flakes[i].style.left = bsw_xp[i] + "px";
		}
	}

	setTimeout("bsw_animate()", 20);
}

if (bsw_off == 0) bsw_add_onload_event(function () { if(bsw_started == 0) { if(bsw_design == 0){ bsw_start(0);} else { bsw_start(1);}}});
document.write("<div style=\"width: 160px; text-align: center; line-height: 100%; margin: 0 auto;\">  	<div id=\"bsw_switch_on\" style=\"display:none;\"> 		<div style=\"background: url(/externals/blog-switch.com/12_on.png) no-repeat; width: 160px; height: 100px\"> 			<img src=\"/externals/blog-switch.com/sp.gif\" border=\"0\" width=\"160\" height=\"68\" usemap=\"#switch\"> 			<map name=\"switch\"> 			<area href=\"javascript:bsw_start(1);\" coords=\"14,23,143,62\" alt=\"スイッチON/OFF\"> 			</map> 			<div style=\"line-height: 100%; text-align: center; padding-top: 2px\"><a target=\"_blank\" href=\"http://www.blog-switch.com/widget/83753\" style=\"color: #666; font-size: 10px; text-decoration: none; border: none; line-height: 100%\" title=\"お花\">お花</a></div> 			<div style=\"line-height: 100%; text-align: center;\"><a target=\"_blank\" href=\"http://www.blog-switch.com/\" title=\"BLOG SWITCH\"><img src=\"/externals/blog-switch.com/sp.gif\" border=\"0\" width=\"160\" height=\"24\" alt=\"BLOG SWITCH\"></a></div> 		</div> 	</div>  	<div id=\"bsw_switch_off\"> 		<div style=\"background: url(/externals/blog-switch.com/12_off.png) no-repeat; width: 160px; height: 100px\"> 			<img src=\"/externals/blog-switch.com/sp.gif\" border=\"0\" width=\"160\" height=\"68\" usemap=\"#switch\"> 			<map name=\"switch\"> 			<area href=\"javascript:bsw_start(1);\" coords=\"14,23,143,62\" alt=\"スイッチON/OFF\"> 			</map> 			<div style=\"line-height: 100%; text-align: center; padding-top: 2px\"><a target=\"_blank\" href=\"http://www.blog-switch.com/widget/83753\" style=\"color: #666; font-size: 10px; text-decoration: none; border: none; line-height: 100%\" title=\"お花\">お花</a></div> 			<div style=\"line-height: 100%; text-align: center;\"><a target=\"_blank\" href=\"http://www.blog-switch.com/\" title=\"BLOG SWITCH\"><img src=\"/externals/blog-switch.com/sp.gif\" border=\"0\" width=\"160\" height=\"24\" alt=\"BLOG SWITCH\"></a></div> 		</div> 	</div> 	 </div> ");
