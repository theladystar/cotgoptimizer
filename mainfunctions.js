// global variable for last clicked/hovered spot on map
var clickedspot = "";
var hoveredspot = "";

// generated object of all map spots
var cityspots = {};
// catalogue of best optimizations
var topoptimizations = {};
// catalogue of actions taken during session, and global variable to keep track of place in object
var actions = {};
var actionpos = 1;


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
			showOptimization( $(this).children('div').attr('ID') );
		}
		if ( $('#cityholder').hasClass('waterside') && $(this).hasClass('wa') ) {
			$(this).css("background-color","rgba(246,221,149,0.2)");
			showOptimization( $(this).children('div').attr('ID') );
		}
	}).mouseout(function () {
			$(this).css("background-color","transparent");
			hideOptimization();
	});

	// updating clickedspot, and opening build menu, on click
	$('#cityholder td').click(function () {
		hideOptimization();
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
		createMapString();
		$('#importexportwindow').show();
	});
	$('#impexpclose').click(function () {
		$('#importexportwindow').hide();
	});


	// error window x button
	$('#errorwindowclose').click(function () {
		$('#errorwindow').hide();
	});


	//switching between res tab and mil tab
	$('#resourcetabbutton').click(function () {
		resTab();
	});
	$('#militarytabbutton').click(function () {
		milTab();
	});


	$('#loadstringbutton').click(function () {
		var thesharestring = $('#sharestringinput').val();
		loadSharestring(thesharestring);
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
		addToActions(clickedspot, buildtype, 'add');
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
			addToActions(clickedspot, buildtype, 'add');
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
			addToActions(clickedspot, buildtype, 'add');
		}
	}
	$('#selectabuildingmenu').hide();
	updateResources();
	runOptimizer();
}

// check for bay spots, then place building
function placeBuildingn (clickedspot, buildtype) {
	$("#" + clickedspot)
	.removeClass()
	.removeAttr('data-building')
	.addClass(buildtype)
	.addClass('buildingmap')
	.attr('data-building', buildtype);
	cityspots[clickedspot]['buil'] = buildtype;
	updateResources();
	runOptimizer();
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
			runOptimizer();
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

// add an action to catalogue of actions taken during session
function addToActions (clickedspot, buildtype, add) {

	var number = 1;
	for (var num in actions) {
		number++;
	}

	if ( (actionpos + 1) < number) {

		for (var numb in actions) {
			if (numb > actionpos) {
				delete actions[numb];
			}
		}

		var newnumber = 1;
		for (var numm in actions) {
			newnumber++;
		}
		actionpos = newnumber;
		number = newnumber;

	} else {
		actionpos = number;
	}

	if ( add == 'add' ) {
		actions[number] = {
			'buil': buildtype,
			'pos': clickedspot,
			'add': 'y'
		}
	}
	else if ( add == 'del' ) {
		actions[number] = {
			'buil': buildtype,
			'pos': clickedspot,
			'add': 'n'
		}
	}
}

function undoAction () {

	if (actionpos <= 0) {
		actionpos = 0;
	}
	else {
		var clickedspot = actions[actionpos]['pos'];
		var build = actions[actionpos]['buil'];

		if (actions[actionpos]['add'] == 'y') {
			$("#" + clickedspot).removeClass().removeAttr('data-building');
			cityspots[clickedspot]['buil'] = '';
			updateResources();
			runOptimizer();
		}
		else if (actions[actionpos]['add'] == 'n') {
			placeBuildingn(clickedspot, build);
		}
	}
	actionpos = actionpos - 1;
}

function redoAction () {
	actionpos = actionpos + 1;

	var number = 0;
	for (var num in actions) {
		number++;
	}

	if (actionpos > number) {
		actionpos = number;
	}
	else {
		var clickedspot = actions[actionpos]['pos'];
		var build = actions[actionpos]['buil'];

		if (actions[actionpos]['add'] == 'y') {
			placeBuildingn(clickedspot, build);
		}
		else if (actions[actionpos]['add'] == 'n') {
			$("#" + clickedspot).removeClass().removeAttr('data-building');
			cityspots[clickedspot]['buil'] = '';
			updateResources();
			runOptimizer();
		}
	}
}

function resetMap () {
	
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
	updateResources();
	runOptimizer();
}

// lock a spot from lockAllBuildings() with no unlock check
function lockspotn (clickedspot) {

	cityspots[clickedspot]['lck'] = true;
	var locked = 'maplock';
	var lockcss = 'url(images/icons/locksmall.png) no-repeat';

	if ( $("#" + clickedspot).hasClass('buildingmap') ) {
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
	$("#" + clickedspot).css('background', '');
	$("#" + clickedspot).removeClass(locked).removeAttr('data-lock');
	updateResources();
	runOptimizer();
}

// unlock a spot from unlockAllBuildings()
function unlockspotn (clickedspot) {
	cityspots[clickedspot]['lck'] = false;
	var locked = 'maplock';
	$("#" + clickedspot).css('background', '');
	$("#" + clickedspot).removeClass(locked).removeAttr('data-lock');
}

function lockAllBuildings () {

	for (var divID in cityspots) {
		if  ( cityspots[divID]['buil'].length > 0) { 
			if (cityspots[divID]['buil'] != 'forest' && cityspots[divID]['buil'] != 'stone' && cityspots[divID]['buil'] != 'iron' && cityspots[divID]['buil'] != 'lake') {
				lockspotn(divID);
			}
		}
	}
	updateResources();
	runOptimizer();
}

function lockAllResources () {

	for (var divID in cityspots) {
		if  ( cityspots[divID]['buil'].length > 0) { 
			if (cityspots[divID]['buil'] == 'forest' || cityspots[divID]['buil'] == 'stone' || cityspots[divID]['buil'] == 'iron' || cityspots[divID]['buil'] == 'lake') {
				lockspotn(divID);
			}
		}
	}
	updateResources();
	runOptimizer();
}

function unlockAll () {

	for (var divID in cityspots) {
		if (cityspots[divID]['lck'] == true) {
			unlockspotn(divID);
		}
	}
	updateResources();
	runOptimizer();
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
function createMapString () {
	$('#inpexplonglink').val('');
	$('#sharestringinput').val('');

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
			var finalkey = buildingsobject[building]['loukey'].toUpperCase();
			longmaplink += finalkey;
			sharestringtext += finalkey;
		}
		else if (divID == "b11-11") { // basilica
			longmaplink += "T";
			sharestringtext += "T";
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
	$('#inpexpshortlink').val('');
	$('#sharestringinput').val(sharestringtext);
}

// loading in an external cotg sharestring
function loadSharestring (string) {

	var stringcheck = string.substring(0, 17);

	if (stringcheck == '[ShareString.1.3]') { // hexists sharestrings
		var removest = string.replace('[ShareString.1.3]','').replace('[/ShareString]','');
		var watercheck = removest.substring(0, 1);
		var finalstring = removest.substring(1, 465); // remove water indicator
		finalstring = finalstring.replace(' ','');  // removing spaces
		finalstring = finalstring.replace(/(\r\n|\n|\r)/gm, ""); // removing linebreaks


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
				else if (building == "T") {} //townhall + waterspots
				else {					     // normal buildings
					var buildkey = building.toLowerCase();
					if (louhotkeys.hasOwnProperty(buildkey)) {
						var matchingbuilding = louhotkeys[buildkey];
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
		$('#importexportwindow').hide();
	}
	else if (stringcheck == '[ShareString.2.0]') { // My sharestrings, which I shelved the idea for. sadface. see the commented out function at bottom of this script.
		var removest = string.replace('[ShareString.2.0]','').replace('[/ShareString]','');
		var watercheck = removest.substring(0, 1);
		var finalstring = removest.substring(1, 465); // remove water indicator
		finalstring = finalstring.replace(' ','');  // removing spaces
		finalstring = finalstring.replace(/(\r\n|\n|\r)/gm, ""); // removing linebreaks

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
		$('#importexportwindow').hide();
	} 
	else {
		errorMessage("Invalid ShareString");
	}
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




// At one point I had a great plan to make this optimizer give the CotG hotkey values as the sharestring, rather than hexist's LoU ones...
// But that would involve the native game changing some stuff. And is just generally not feasable. *sigh* My pipedream...

// function createCotGMapString () {
// 		$('#inpexplonglink').val('');
// 		$('#inpexpshortlink').val('');
// 		$('#sharestringinput').val('');

// 		var longmaplink = "http://cotgoptimizer.com/?cmap=";
// 		var sharestringtext = "[ShareString.2.0]";

// 		if ($('#cityholder').hasClass('waterside')) {
// 			longmaplink += 'W';
// 			sharestringtext += ";";
// 		} else {
// 			longmaplink += 'L';
// 			sharestringtext += ":";
// 		}

// 		for (var divID in cityspots) {

// 			if  ( cityspots[divID]['buil'].length > 0) { // regular buildings
// 				var building = cityspots[divID]['buil'];
// 				var finalkey = buildingsobject[building]['key'].toUpperCase();
// 				longmaplink += finalkey;
// 				sharestringtext += finalkey;
// 			}
// 			else if (divID == "b11-11") { // basilica
// 				longmaplink += "D";
// 				sharestringtext += "D";
// 			}
// 			else if ( cityspots[divID]['ws'] && $('#cityholder').hasClass('waterside')) { // open special spots (waterside)
// 				sharestringtext += "_";
// 			}
// 			else if ( cityspots[divID]['wa'] && $('#cityholder').hasClass('waterside')) { // open spots (waterside)
// 				longmaplink += "0";
// 				sharestringtext += "-";
// 			}
// 			else if ( cityspots[divID]['la'] && $('#cityholder').hasClass('landlocked')) { // open spots (landlocked)
// 				longmaplink += "0";
// 				sharestringtext += "-";
// 			}
// 			else if ( cityspots[divID]['buil'].length == 0) {
// 				longmaplink += "0";
// 				sharestringtext += "#";
// 			}
// 			else {}
// 		}

// 		sharestringtext += "[/ShareString]";

// 		$('#inpexplonglink').val(longmaplink);
// 		$('#sharestringinput').val(sharestringtext);
// }



