// global variable for last clicked/hovered spot on map
var clickedspot = "";
var hoveredspot = "";

// generated object of all map spots
var cityspots = {};


$( document ).ready(function() {

	// init stuff
	isLand();
	runCity();
	runOptimizer();


	// tooptips on build menu
	$('.tooltipcl').mouseover(function() {
		var tooltiptext = $(this).attr('data-tooltip');
		var position = $(this).offset();
		$('#maintooltip').css({"top": (position.top + 3), "left": (position.left + 50)});
		$('#maintooltip').text(tooltiptext);
		$('#maintooltip').show();
	}).mouseout(function () {
		$('#maintooltip').text('').hide();
	});

	// land and water buttons in topbar
	$('#watermap').click(function () {
		isWater();
	});
	$('#landmap').click(function () {
		isLand();
	});

	// yellow hover effect on map
	$('#cityholder td').mouseover(function () {
		if ( $('#cityholder').hasClass('landlocked') && $(this).hasClass('la') ) {
			$(this).css("background-color","rgba(246,221,149,0.2)");
		}
		if ( $('#cityholder').hasClass('waterside') && $(this).hasClass('wa') ) {
			$(this).css("background-color","rgba(246,221,149,0.2)");
		}
	}).mouseout(function () {
			$(this).css("background-color","transparent");
	});

	// updating clickedspot, and opening build menu, on click
	$('#cityholder td').click(function () {
		$('td.activetd').removeClass('activetd');
		if ( $('#cityholder').hasClass('landlocked') && $(this).hasClass('la') ) {
			clickedspot = $( $(this).children('div') ).attr('ID');
			$(this).addClass('activetd');
			$('#selectabuildingmenu').show();
		}
		if ( $('#cityholder').hasClass('waterside') && $(this).hasClass('wa') ) {
			clickedspot = $( $(this).children('div') ).attr('ID');
			$(this).addClass('activetd');
			$('#selectabuildingmenu').show();
		}
	});
	// when a building on the build menu gets clicked, place the building on the map, and clear clickedspot
	$('.b').click(function() {
		placeBuildingFromMenu(clickedspot, this);
		$('#selectabuildingmenu').hide();
		$( $("#" + clickedspot).parent() ).removeClass('activetd');
		clickedspot = '';
	});
	// x button to close build menu
	$('#xbselmenu').click(function () {
		$('#selectabuildingmenu').hide();
	});

	// updating hoveredspot, on mouseover
	$('#cityholder td').mouseover(function () {
		if (hoveredspot == "") {
			if ( $('#cityholder').hasClass('landlocked') && $(this).hasClass('la') ) {
				hoveredspot = $( $(this).children('div') ).attr('ID');
			}
			if ( $('#cityholder').hasClass('waterside') && $(this).hasClass('wa') ) {
				hoveredspot = $( $(this).children('div') ).attr('ID');
			}
		} else {}
	}).mouseout(function () {
		hoveredspot = '';
	});;

	// when a hotkey is pressed, if clickedspot or hoveredspot have values, then place the building on the map
	$(document).keydown(function(e) {
		if (clickedspot.length > 0) {
			placeBuildingFromHotkey(clickedspot, e);
			$( $("#" + clickedspot).parent() ).removeClass('activetd');
			clickedspot = '';
		} else if (hoveredspot.length > 0) {
			placeBuildingFromHotkey(hoveredspot, e);
			hoveredspot = '';
		}

		else {}
	});


	// opening and closing the import/export window
	$('#importmap').click(function () {
		loadMapStrings();
		$('#cotgsharestringb').addClass('activebttn');
		$('#importexportwindow').show();
	});
	$('#impexpclose').click(function () {
		$('#importexportwindow').hide();
	});


	// error window x button
	$('#errorwindowclose').click(function () {
		$('#errorwindow').hide();
	});


	// changing sharestring tabs
	$('#cotgsharestringb').click(function () {
		$('#cotgsharestringb').addClass('activebttn');
		$('#lousharestringb').removeClass('activebttn');
		$('#sharestringinputlou').hide();
		$('#sharestringinputcotg').show();
		$('#loadloustringbutton').hide();
		$('#loadcotgstringbutton').show();
	});
	$('#lousharestringb').click(function () {
		$('#cotgsharestringb').removeClass('activebttn');
		$('#lousharestringb').addClass('activebttn');
		$('#sharestringinputcotg').hide();
		$('#sharestringinputlou').show();
		$('#loadcotgstringbutton').hide();
		$('#loadloustringbutton').show();
	});

	//switching between res tab and mil tab
	$('#resourcetabbutton').click(function () {
		resTab();
	});
	$('#militarytabbutton').click(function () {
		milTab();
	});


	$('#loadcotgstringbutton').click(function () {
		var thesharestring = $('#sharestringinputcotg').val();
		loadCotGSharestring(thesharestring);
	});


});



// check for bay spots, then place building
function placeBuilding (clickedspot, buildtype) {

	if ( $('#cityholder').hasClass('landlocked') && cityspots[clickedspot]['la'] == true ) {
		$("#" + clickedspot)
		.removeClass()
		.removeAttr('data-building')
		.addClass(buildtype)
		.addClass('buildingmap')
		.attr('data-building', buildtype);
		cityspots[clickedspot]['buil'] = buildtype;
	}
	else if ( $('#cityholder').hasClass('waterside') && cityspots[clickedspot]['wa'] == true && cityspots[clickedspot]['ws'] == true ) { // bay spot in water city
		if ( buildtype == 'port' || buildtype == 'shipyard' ) {
			$("#" + clickedspot)
			.removeClass()
			.removeAttr('data-building')
			.addClass(buildtype)
			.addClass('buildingmap')
			.attr('data-building', buildtype);
			cityspots[clickedspot]['buil'] = buildtype;
		} else {}
	}
	else if ( $('#cityholder').hasClass('waterside') && cityspots[clickedspot]['wa'] == true && cityspots[clickedspot]['ws'] == false ) { // regular spot in water city
		if ( buildtype != 'port' && buildtype != 'shipyard' ) {
			$("#" + clickedspot)
			.removeClass()
			.removeAttr('data-building')
			.addClass(buildtype)
			.addClass('buildingmap')
			.attr('data-building', buildtype);
			cityspots[clickedspot]['buil'] = buildtype;
		}
	}
	updateResources();
	runOptimizer(clickedspot);
}

// place the building on the map using the hotkeys
function placeBuildingFromHotkey (clickedspot, e) {

	var key = e.key;

	// regular hotkeys
	if(hotkeys.hasOwnProperty(key)) {
		if ( !$("#" + clickedspot).hasClass('maplock') ) {
			var matchingbuilding = hotkeys[key];
			placeBuilding(clickedspot, matchingbuilding);
		}
		$('#selectabuildingmenu').hide();
	}

	// spacebar for lock
	if (e.code == 'Space') {
		e.preventDefault();
		lockspot(clickedspot);
		$('#selectabuildingmenu').hide();
	} else {}

	// remove building
	if (e.code == 'Delete' || e.code == 'Backspace' || e.key == '0') {
		if ( !$("#" + clickedspot).hasClass('maplock') ) {
			$("#" + clickedspot).removeClass().removeAttr('data-building');
			cityspots[clickedspot]['buil'] = '';
			updateResources();
			runOptimizer(clickedspot);
		}
	} else {}

	$( $("#" + clickedspot).parent() ).removeClass('activetd');
	clickedspot = '';
}

// place the building on the map using the left-hand menu
function placeBuildingFromMenu (clickedspot, building) {
	if ( !$("#" + clickedspot).hasClass('maplock') ) {
		var buildtype = $( $(building).children('div') ).attr('ID');
		placeBuilding(clickedspot, buildtype);
	}
	$( $("#" + clickedspot).parent() ).removeClass('activetd');
	clickedspot = '';
}

// lock a spot/building with spacebar
function lockspot (clickedspot) {
	cityspots[clickedspot]['lck'] = true;
	var locked = 'maplock';
	var lockcss = 'url(images/icons/locksmall.png) no-repeat';

	if ( $("#" + clickedspot).hasClass('maplock') ) {
		unlockspot(clickedspot);
	}
	else if ( $("#" + clickedspot).hasClass('buildingmap') ) {
		var currbuilding = $("#" + clickedspot).attr('data-building');
		var background = buildingsobject[currbuilding]['background'];
		var newbackground = lockcss + "," + background;
		$("#" + clickedspot).css('background', newbackground);
		$("#" + clickedspot).addClass(locked).attr('data-lock', locked);
	} else {
		$("#" + clickedspot).css('background', lockcss);
		$("#" + clickedspot).addClass(locked).attr('data-lock', locked);
	}
}

// unlock the spot/building again with spacebar
function unlockspot (clickedspot) {
	cityspots[clickedspot]['lck'] = false;
	var locked = 'maplock';

	if ( $("#" + clickedspot).hasClass('buildingmap') ) {
		var currbuilding = $("#" + clickedspot).attr('data-building');
		var background = buildingsobject[currbuilding]['background'];
		$("#" + clickedspot).css('background', '');
		$("#" + clickedspot).css('background', background);
		$("#" + clickedspot).removeClass(locked).removeAttr('data-lock');
	} else {
		$("#" + clickedspot).css('background', '');
		$("#" + clickedspot).removeClass(locked).removeAttr('data-lock');
	}
}

// load info to res tab (initially, and when res tab button is clicked)
function resTab () {
	$('#resourcetabbutton').addClass('activebttn');
	$('#militarytabbutton').removeClass('activebttn');
	$('#restab').show();
	$('#miltab').hide();
}

// load info to mil tab (when mil tab button is clicked)
function milTab () {
	$('#militarytabbutton').addClass('activebttn');
	$('#resourcetabbutton').removeClass('activebttn');
	$('#restab').hide();
	$('#miltab').show();
}

// making the map strings in the import/export menu
function loadMapStrings () {
	$('#inpexplonglink').val('');
	$('#sharestringinputcotg').val('');

	var longmaplink = "http://cotgoptimizer.com/?map=";
	var sharestringtext = "[ShareString.1.3]";

	if ($('#cityholder').hasClass('waterside')) {
		longmaplink += 'W';
		sharestringtext += ";";
	} else {
		longmaplink += 'L';
		sharestringtext += ":";
	}

	for (var divID in cityspots) {

		if  ( cityspots[divID]['buil'].length > 0) { // regular buildings
			var building = cityspots[divID]['buil'];
			var finalkey = buildingsobject[building]['key'].toUpperCase();
			longmaplink += finalkey;
			sharestringtext += finalkey;
		}
		else if (divID == "b11-11") { // basilica
			longmaplink += "D";
			sharestringtext += "D";
		}
		else if ( cityspots[divID]['ws'] && $('#cityholder').hasClass('waterside')) { // open special spots (waterside)
			sharestringtext += "_";
		}
		else if ( cityspots[divID]['wa'] && $('#cityholder').hasClass('waterside')) { // open spots (waterside)
			longmaplink += "0";
			sharestringtext += "-";
		}
		else if ( cityspots[divID]['la'] && $('#cityholder').hasClass('landlocked')) { // open spots (landlocked)
			longmaplink += "0";
			sharestringtext += "-";
		}
		else if ( cityspots[divID]['buil'].length == 0) {
			longmaplink += "0";
			sharestringtext += "#";
		}
		else {}
	}

	sharestringtext += "[/ShareString]";

	$('#inpexplonglink').val(longmaplink);
	$('#sharestringinputcotg').val(sharestringtext);
}

// loading in an external cotg sharestring
function loadCotGSharestring (string) {
	var removest = string.replace('[ShareString.1.3]','').replace('[/ShareString]','');
	var watercheck = removest.substring(0, 1);
	var finalstring = removest.replace(':','').replace(';','');

	if (finalstring.length == Object.keys(cityspots).length) {

		if (watercheck == ";") {
			isWater();
		}
		else if (watercheck == ":") {
			isLand();
		}
		else {
			errorMessage("Invalid ShareString");
		}

		var i = 0;
		for (var divID in cityspots) { 
			var building = finalstring[i];
			i++;

			if (building == "-") {} 
			else if (building == "#") {}
			else if (building == "_") {}
			else if (building == "D") {} //basilica
			else {					     // normal buildings
				var buildkey = building.toLowerCase();
				if (hotkeys.hasOwnProperty(buildkey)) {
					var matchingbuilding = hotkeys[buildkey];
					$('#' + divID)
					.removeClass()
					.removeAttr('data-building')
					.addClass(matchingbuilding)
					.addClass('buildingmap')
					.attr('data-building', matchingbuilding);
					cityspots[divID]['buil'] = matchingbuilding;
				}
			}
		}
	} else {
		errorMessage("Invalid ShareString");
	}
	runCity();
	runOptimizer();
}

// adding text to error window popup
function errorMessage (text) {
	$('#errorwindow').show();
	$('#errormessage').text(text);
}

//changing map to landlocked
function isLand () {
	$('#cityholder').addClass('landlocked').removeClass('waterside');
	$('.wa').css("border","none");
	$('.la').css("border","1px solid #414141");
}

//changing map to waterside
function isWater () {
	$('#cityholder').addClass('waterside').removeClass('landlocked');
	$('.la').css("border","none");
	$('.wa').css("border","1px solid #414141");
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



