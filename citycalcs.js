// runs at init 
// fill object function. runs updateResources() at end.
function runCity () {
	var numberspots = $('#cityholder').find('div');

	var i;
	for (i = 0; i < numberspots.length; i++) { 
		var thisdiv = numberspots[i];

		var theID = $(thisdiv).attr('ID');

		cityspots[theID] = {};


		if ( $( $(thisdiv).parent() ).hasClass("la") ) {
			cityspots[theID]['la'] = true;
		} else {
			cityspots[theID]['la'] = false;
		}

		if ( $( $(thisdiv).parent() ).hasClass("wa") ) {
			cityspots[theID]['wa'] = true;
		} else {
			cityspots[theID]['wa'] = false;
		}

		if ( $( $(thisdiv).parent() ).hasClass("ws") ) {
			cityspots[theID]['ws'] = true;
		} else {
			cityspots[theID]['ws'] = false;
		}

		if ( $(thisdiv).hasClass("maplock") ) {
			cityspots[theID]['lck'] = true;
		} else {
			cityspots[theID]['lck'] = false;
		}

		if ( $(thisdiv).hasClass("buildingmap") ) {
			var building = $(thisdiv).attr('data-building');
			cityspots[theID]['buil'] = building;
			var neighbours = getEightNeighbours(theID)

			if (cityspots[theID]['buil'] == 'foresters') {
				var j;
				for (j = 0; j < neighbours.length; j++) { 
					var current = neighbours[j];
					var building = cityspots[current]['buil']

					if (building == 'sawmill') {
						cityspots[theID]['proc'] = 1;
					}
					else {
						cityspots[theID]['proc'] = 0;
					}
				}
			}
			else if (cityspots[theID]['buil'] == 'stonemine') {
				var j;
				for (j = 0; j < neighbours.length; j++) { 
					var current = neighbours[j];
					var building = cityspots[current]['buil']

					if (building == 'masons') {
						cityspots[theID]['proc'] = 1;
					}
					else {
						cityspots[theID]['proc'] = 0;
					}
				}
			}
			else if (cityspots[theID]['buil'] == 'ironmine') {
				var j;
				for (j = 0; j < neighbours.length; j++) { 
					var current = neighbours[j];
					var building = cityspots[current]['buil']

					if (building == 'smelter') {
						cityspots[theID]['proc'] = 1;
					}
					else {
						cityspots[theID]['proc'] = 0;
					}
				}
			}
			else if (cityspots[theID]['buil'] == 'farm') {
				var j;
				for (j = 0; j < neighbours.length; j++) { 
					var current = neighbours[j];
					var building = cityspots[current]['buil']

					if (building == 'grainmill') {
						cityspots[theID]['proc'] = 1;
					}
					else {
						cityspots[theID]['proc'] = 0;
					}
				}
			}
		} else {
			cityspots[theID]['buil'] = "";
		}
	}

	updateResources();
}

// populate res tab, and add lockedspots and processing-building y/n to main object.
// runs at end of runCity(), and after a building is placed or removed.
function updateResources () {
	// init
	var woodtotalprod = 300;
	var stonetotalprod = 0;
	var irontotalprod = 0;
	var foodtotalprod = 0;
	var goldtotalprod = 0;

	var woodstorage = 175000;
	var stonestorage = 175000;
	var ironstorage = 175000;
	var foodstorage = 175000;
	var resprotected = 0;

	var numberbuildings = 0;
	var numbercarts = 0;
	var numbertrships = 0;
	var construcspeed = 100;

	$('.fields').removeClass('fields');


	for (var mapspot in cityspots) {

		cityspots[mapspot]['curr'] = {};
		var building = cityspots[mapspot]['buil'];
		var thisdiv = $('#' + mapspot);
		var neighbours = getEightNeighbours(mapspot);

		if ( $(thisdiv).hasClass("maplock") ) {
			cityspots[mapspot]['lck'] = true;
		} else {
			cityspots[mapspot]['lck'] = false;
		}

		if  (building.length > 0) { // regular buildings

			if (building == 'foresters') {
				numberbuildings += 1;
				var wprod = woodProduction(mapspot);
				woodtotalprod += wprod;
				cityspots[mapspot]['curr']['w'] = wprod;
				cityspots[mapspot]['proc'] = 0;

				var j;
				for (j = 0; j < neighbours.length; j++) { 
					var current = neighbours[j];
					var tbuilding = cityspots[current]['buil'];

					if (tbuilding == 'sawmill') {
						cityspots[mapspot]['proc'] = 1;
					}
				}
			}
			else if (building == 'stonemine') {
				numberbuildings += 1;
				var sprod = stoneProduction(mapspot);
				stonetotalprod += sprod;
				cityspots[mapspot]['curr']['s'] = sprod;
				cityspots[mapspot]['proc'] = 0;

				var j;
				for (j = 0; j < neighbours.length; j++) { 
					var current = neighbours[j];
					var tbuilding = cityspots[current]['buil'];;

					if (tbuilding == 'masons') {
						cityspots[mapspot]['proc'] = 1;
					}
				}
			}
			else if (building == 'ironmine') {
				numberbuildings += 1;
				var iprod = ironProduction(mapspot);
				irontotalprod += iprod;
				cityspots[mapspot]['curr']['i'] = iprod;
				cityspots[mapspot]['proc'] = 0;

				var j;
				for (j = 0; j < neighbours.length; j++) { 
					var current = neighbours[j];
					var tbuilding = cityspots[current]['buil'];

					if (tbuilding == 'smelter') {
						cityspots[mapspot]['proc'] = 1;
					}
				}
			}
			else if (building == 'farm') {
				numberbuildings += 1;
				var fprod = foodProduction(mapspot);
				foodtotalprod += fprod;
				cityspots[mapspot]['curr']['f'] = fprod;
				cityspots[mapspot]['proc'] = 0;
				updateFields(mapspot);

				var j;
				for (j = 0; j < neighbours.length; j++) { 
					var current = neighbours[j];
					var tbuilding = cityspots[current]['buil'];

					if (tbuilding == 'grainmill') {
						cityspots[mapspot]['proc'] = 1;
					}
				}
			}
			else if (building == 'forest') {
				var wprod = runForestNode(mapspot);
				cityspots[mapspot]['curr']['w'] = wprod;
			}
			else if (building == 'stone') {
				var sprod = runStoneNode(mapspot);
				cityspots[mapspot]['curr']['s'] = sprod;
			}
			else if (building == 'iron') {
				var iprod = runIronNode(mapspot);
				cityspots[mapspot]['curr']['i'] = iprod;
			}
			else if (building == 'lake') {
				var fprod = runLakeNode(mapspot);
				cityspots[mapspot]['curr']['f'] = fprod;
			}
			else if (building == 'villa') {
				numberbuildings += 1;
				var gprod = goldProduction(mapspot);
				goldtotalprod += gprod;
				cityspots[mapspot]['curr']['g'] = gprod;
			}
			else if (building == 'storehouse') {
				numberbuildings += 1;
				var wstor = woodstorage;
				var sstore = stonestorage;
				var istore = ironstorage;
				var fstore = foodstorage;
				var newamts = totalStorage(mapspot, wstor, sstore, istore, fstore);
				woodstorage = newamts[0];
				stonestorage = newamts[1];
				ironstorage = newamts[2];
				foodstorage = newamts[3];
			}
			else if (building == 'hide') {
				numberbuildings += 1;
				resprotected += hideawayAmount(mapspot);
			}
			else if (building == 'forum') {
				var gprod = runForum(mapspot);
				cityspots[mapspot]['curr']['g'] = gprod;
				numberbuildings += 1;
				numbercarts += buildingsobject['forum']['stats']['tradecarts'];
			}
			else if (building == 'port') {
				var gprod = runPort(mapspot);
				cityspots[mapspot]['curr']['g'] = gprod;
				numberbuildings += 1;
				numbertrships += buildingsobject['port']['stats']['tradeships'];
			}
			else if (building == 'cabin') {
				var cabinb = runCabinPseudo( getEightNeighbours(mapspot) );
				cityspots[mapspot]['curr']['w'] = cabinb[1];
				cityspots[mapspot]['curr']['s'] = cabinb[2];
				cityspots[mapspot]['curr']['i'] = cabinb[3];
				cityspots[mapspot]['curr']['f'] = cabinb[4];
				numberbuildings += 1;
				construcspeed += 100;
			}
			else if (building == 'sawmill') {
				var wprod = runSawmill(mapspot);
				cityspots[mapspot]['curr']['w'] = wprod;
				numberbuildings += 1;
			}
			else if (building == 'masons') {
				var sprod = runMasons(mapspot);
				cityspots[mapspot]['curr']['s'] = sprod;
				numberbuildings += 1;
			}
			else if (building == 'smelter') {
				var iprod = runSmelter(mapspot);
				cityspots[mapspot]['curr']['i'] = iprod;
				numberbuildings += 1;
			}
			else if (building == 'grainmill') {
				var fprod = runGMill(mapspot);
				cityspots[mapspot]['curr']['f'] = fprod;
				numberbuildings += 1;
			}
			else if (building == 'barracks') {
				numberbuildings += 1;
			}
			else if (building == 'castle') {
				numberbuildings += 1;
			}
			else if (building == 'guardhouse' || building == 'arena' || building == 'stable' || building == 'sorctower' || building == 'academy' || building == 'blacksmith' || building == 'shipyard') {
				numberbuildings += 1;
			}
		}

	}

	woodtotalprod = Math.round(woodtotalprod);
	stonetotalprod = Math.round(stonetotalprod);
	irontotalprod = Math.round(irontotalprod);
	foodtotalprod = Math.round(foodtotalprod);
	goldtotalprod = Math.round(goldtotalprod);
	woodstorage = Math.round(woodstorage);
	stonestorage = Math.round(stonestorage);
	ironstorage = Math.round(ironstorage);
	foodstorage = Math.round(foodstorage);

	$('#woodproductiontd').text(numberWithCommas(woodtotalprod));
	$('#stoneproductiontd').text(numberWithCommas(stonetotalprod));
	$('#ironproductiontd').text(numberWithCommas(irontotalprod));
	$('#foodproductiontd').text(numberWithCommas(foodtotalprod));
	$('#goldproductiontd').text(numberWithCommas(goldtotalprod));
	$('#totalproductiontd').text( numberWithCommas((woodtotalprod + stonetotalprod + irontotalprod + foodtotalprod + goldtotalprod)) );
	$('#woodprotectedtd, #stoneprotectedtd, #ironprotectedtd, #foodprotectedtd').text(numberWithCommas(resprotected));

	$('#woodstoragetd').text(numberWithCommas(woodstorage));
	$('#stonestoragetd').text(numberWithCommas(stonestorage));
	$('#ironstoragetd').text(numberWithCommas(ironstorage));
	$('#foodstoragetd').text(numberWithCommas(foodstorage));

	$('#constrspeedp').text( (numberWithCommas(construcspeed) + '%') );
	$('#numberbuildings').text(numberbuildings);
	$('#numbercarts').text(numberWithCommas(numbercarts));
	$('#numbertradeships').text(numberWithCommas(numbertrships));
}

// 7 offshoot updateResources functions
function woodProduction (thisdiv) {

	var toadd = buildingsobject['foresters']['stats']['woodproduction'];
	var neighbours = getEightNeighbours(thisdiv);

	var nodes = 0;
	var processorbuilding = 0;
	var cabins = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];
		var building = cityspots[current]['buil']

		if (building.length > 0) {
			if (building == 'forest') {
				nodes += 1;
			}
			else if (building == 'sawmill') {
				processorbuilding = 1;
			}
			else if (building == 'cabin') {
				cabins += 1;
			}
		}
	}
	var addnodes = toadd + ((toadd * (buildingsobject['forest']['stats']['woodresnodebonus'] / 100)) * nodes);
	var addcabins = addnodes + ((addnodes * (buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100)) * cabins);
	var finalcount = addcabins + ((addcabins * (buildingsobject['sawmill']['stats']['woodprocessingbonus'] / 100)) * processorbuilding);
	return finalcount;
}

function stoneProduction (thisdiv) {

	var toadd = buildingsobject['stonemine']['stats']['stoneproduction'];
	var neighbours = getEightNeighbours(thisdiv);

	var nodes = 0;
	var processorbuilding = 0;
	var cabins = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];
		var building = cityspots[current]['buil']

		if (building.length > 0) {
			if (building == 'stone') {
				nodes += 1;
			}
			else if (building == 'masons') {
				processorbuilding = 1;
			}
			else if (building == 'cabin') {
				cabins += 1;
			}
		}
	}
	var addnodes = toadd + ((toadd * (buildingsobject['stone']['stats']['stoneresnodebonus'] / 100)) * nodes);
	var addcabins = addnodes + ((addnodes * (buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100)) * cabins);
	var finalcount = addcabins + ((addcabins * (buildingsobject['masons']['stats']['stoneprocessingbonus'] / 100)) * processorbuilding);
	return finalcount;
}

function ironProduction (thisdiv) {

	var toadd = buildingsobject['ironmine']['stats']['ironproduction'];
	var neighbours = getEightNeighbours(thisdiv);

	var nodes = 0;
	var processorbuilding = 0;
	var cabins = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];
		var building = cityspots[current]['buil']

		if (building.length > 0) {
			if (building == 'iron') {
				nodes += 1;
			}
			else if (building == 'smelter') {
				processorbuilding = 1;
			}
			else if (building == 'cabin') {
				cabins += 1;
			}
		}
	}
	var addnodes = toadd + ((toadd * (buildingsobject['iron']['stats']['ironresnodebonus'] / 100)) * nodes);
	var addcabins = addnodes + ((addnodes * (buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100)) * cabins);
	var finalcount = addcabins + ((addcabins * (buildingsobject['smelter']['stats']['ironprocessingbonus'] / 100)) * processorbuilding);
	return finalcount;
}

function foodProduction (thisdiv) {

	var toadd = buildingsobject['farm']['stats']['foodproduction'];
	var neighbours = getEightNeighbours(thisdiv);

	var firstfield = 0
	var subseqfields = 0;
	var nodes = 0;
	var processorbuilding = 0;
	var cabins = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];
		var building = cityspots[current]['buil']

		if ( building.length == 0 && cityspots[current]['la'] && $('#cityholder').hasClass('landlocked') ) {

			if (firstfield == 0) {
				firstfield = 1;
			} else {
				subseqfields += 1;
			}
			$('#' + current).addClass('fields');

		}
		else if ( building.length == 0 && cityspots[current]['wa'] && !cityspots[current]['ws'] && $('#cityholder').hasClass('waterside') ) {

			if (firstfield == 0) {
				firstfield = 1;
			} else {
				subseqfields += 1;
			}
			$('#' + current).addClass('fields');

		}
		else if (building == 'lake') {
			nodes += 1;
		}
		else if (building == 'grainmill') {
			processorbuilding = 1;
		}
		else if (building == 'cabin') {
			cabins += 1;
		}
	}
	var addfields = toadd + ((toadd * 0.5) * firstfield) + ((toadd * 0.4) * subseqfields);
	var addnodes = addfields + ((addfields * (buildingsobject['lake']['stats']['foodresnodebonus'] / 100)) * nodes);
	var addcabins = addnodes + ((addnodes * (buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100)) * cabins);
	var finalcount = addcabins + ((addcabins * (buildingsobject['grainmill']['stats']['foodprocessingbonus'] / 100)) * processorbuilding);
	return finalcount;
}

function goldProduction(thisdiv, goldtotalprod) {

	var toadd = buildingsobject['villa']['stats']['goldproduction'];
	var neighbours = getEightNeighbours(thisdiv);

	var forumbuildings = 0;
	var portbuildings = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];
		var building = cityspots[current]['buil']

		if (building.length > 0) {
			if (building == 'forum') {
				forumbuildings += 1;
			}
			else if (building == 'port') {
				portbuildings += 1;
			}
		}
	}
	var addforums = ( toadd * ( buildingsobject['forum']['stats']['goldtaxbonus'] / 100 ) ) * forumbuildings;
	var addports = ( toadd * ( buildingsobject['port']['stats']['goldtaxbonus'] / 100 ) ) * portbuildings;
	var plusboth = toadd + addforums + addports;
	return plusboth;
}

function hideawayAmount(thisdiv, resprotected) {

	var toadd = buildingsobject['hide']['stats']['reshidden'];
	var neighbours = getEightNeighbours(thisdiv);

	var forestnodes = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];
		var building = cityspots[current]['buil']

		if (building.length > 0) {
			if (building == 'forest') {
				forestnodes += 1;
			}
		}
	}
	var addnodes = ( toadd * ( buildingsobject['forest']['stats']['woodresnodebonus'] / 100 ) ) * forestnodes;
	var plusnodes = toadd + addnodes;
	return plusnodes;
}

function totalStorage(thisdiv, woodstorage, stonestorage, ironstorage, foodstorage) {

	var toadd = buildingsobject['storehouse']['stats']['storage'];
	var neighbours = getEightNeighbours(thisdiv);
	var sawmillsno = 0;
	var masonsno = 0;
	var smelterssno = 0;
	var grainmillsno = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];
		var building = cityspots[current]['buil']

		if (building.length > 0) {
			if (building == 'sawmill') {
				sawmillsno += 1;
			}
			else if (building == 'masons') {
				masonsno += 1;
			}
			else if (building == 'smelter') {
				smelterssno += 1;
			}
			else if (building == 'grainmill') {
				grainmillsno += 1;
			}
		}
	}
	var woodtot = ( toadd * ( buildingsobject['sawmill']['stats']['woodstoragebonus'] / 100 ) ) * sawmillsno;
	var finalwoodtot = woodstorage + toadd + woodtot;
	var stonetot = ( toadd * ( buildingsobject['masons']['stats']['stonestoragebonus'] / 100 ) ) * masonsno;
	var finalstonetot = stonestorage + toadd + stonetot;
	var irontot = ( toadd * ( buildingsobject['smelter']['stats']['ironstoragebonus'] / 100 ) ) * smelterssno;
	var finalirontot = ironstorage + toadd + irontot;
	var foodtot = ( toadd * ( buildingsobject['grainmill']['stats']['foodstoragebonus'] / 100 ) ) * grainmillsno;
	var finalfoodtot = foodstorage + toadd + foodtot;

	var storageamts = [finalwoodtot, finalstonetot, finalirontot, finalfoodtot];
	return storageamts;
}

// get 8 adjacent tiles
function getEightNeighbours(thisdiv) {

	var dash = thisdiv.search("-");
	var heightpos = parseInt( thisdiv.substring(1,dash) );
	var widthpos = parseInt( thisdiv.substring( (dash+1) ) );

	var neighbour1 = "b" + (heightpos - 1) + "-" + (widthpos - 1);
	var neighbour2 = "b" + (heightpos - 1) + "-" + (widthpos);
	var neighbour3 = "b" + (heightpos - 1) + "-" + (widthpos + 1);
	var neighbour4 = "b" + (heightpos) + "-" + (widthpos - 1);
	var neighbour5 = "b" + (heightpos) + "-" + (widthpos + 1);
	var neighbour6 = "b" + (heightpos + 1) + "-" + (widthpos - 1);
	var neighbour7 = "b" + (heightpos + 1) + "-" + (widthpos);
	var neighbour8 = "b" + (heightpos + 1) + "-" + (widthpos + 1);

	var neighbours = [neighbour1, neighbour2, neighbour3, neighbour4, neighbour5, neighbour6, neighbour7, neighbour8];
	var finalneighbours = [];

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var n = neighbours[j];
		if ( $('#' + n).length > 0 ) {
			if ( (cityspots[n]['la'] && $('#cityholder').hasClass('landlocked')) || (cityspots[n]['wa'] && $('#cityholder').hasClass('waterside')) ) {
				finalneighbours.push(n); 
			}
		}
	}
	return finalneighbours;
}

// update farm fields
function updateFields (thediv) {

	var neighbours = getEightNeighbours(thediv);

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];
		var spot = cityspots[current]['buil'];

		if ( spot.length == 0 && cityspots[current]['la'] && $('#cityholder').hasClass('landlocked') ) {
			$('#' + current).addClass('fields');
		}
		else if ( spot.length == 0 && cityspots[current]['wa'] && !cityspots[current]['ws'] && $('#cityholder').hasClass('waterside') ) {
			$('#' + current).addClass('fields');
		}
	}
}

function showOptimization (hovspot) {

	if ( $('#selectabuildingmenu').css('display') == 'none' ) {

		var topvalue = 0;
		var bestbuil = '';
		var currentbuilding = cityspots[hovspot]['buil'];

		for (var q in cityspots[hovspot]['optim']) {
			if (cityspots[hovspot]['optim'][q] > topvalue) {
				topvalue = Math.round(cityspots[hovspot]['optim'][q]);
				bestbuil = q;
			}
		}

		var bbestbuild;
		var woodcurrent;
		var woodoptimal;
		var stonecurrent;
		var stoneoptimal;
		var ironcurrent;
		var ironoptimal;
		var foodcurrent;
		var foodoptimal;
		var goldcurrent;
		var goldoptimal;

		if (bestbuil == 'if-f') {
			bbestbuild = 'foresters';
			woodoptimal = Math.round(cityspots[hovspot]['optim']['if-f']);
			$('#optimbuilwood').text(woodoptimal).addClass('white');
		}
		else if (bestbuil == 'if-s') {
			bbestbuild = 'stonemine';
			stoneoptimal = Math.round(cityspots[hovspot]['optim']['if-s']);
			$('#optimbuilstone').text(stoneoptimal).addClass('white');
		}
		else if (bestbuil == 'if-i') {
			bbestbuild = 'ironmine';
			ironoptimal = Math.round(cityspots[hovspot]['optim']['if-i']);
			$('#optimbuiliron').text(ironoptimal).addClass('white');
		}
		else if (bestbuil == 'if-a') {
			bbestbuild = 'farm';
			foodoptimal = Math.round(cityspots[hovspot]['optim']['if-a']);
			$('#optimbuilfood').text(foodoptimal).addClass('white');
		}
		else if (bestbuil == 'if-l') {
			bbestbuild = 'sawmill';
			woodoptimal = Math.round(cityspots[hovspot]['optim']['if-l']);
			$('#optimbuilwood').text(woodoptimal).addClass('white');
		}
		else if (bestbuil == 'if-h') {
			bbestbuild = 'masons';
			stoneoptimal = Math.round(cityspots[hovspot]['optim']['if-h']);
			$('#optimbuilstone').text(stoneoptimal).addClass('white');
		}
		else if (bestbuil == 'if-z') {
			bbestbuild = 'smelter';
			ironoptimal = Math.round(cityspots[hovspot]['optim']['if-z']);
			$('#optimbuiliron').text(ironoptimal).addClass('white');
		}
		else if (bestbuil == 'if-g') {
			bbestbuild = 'grainmill';
			foodoptimal = Math.round(cityspots[hovspot]['optim']['if-g']);
			$('#optimbuilfood').text(foodoptimal).addClass('white');
		}
		else if (bestbuil == 'if-v') {
			bbestbuild = 'villa';
			goldoptimal = Math.round(cityspots[hovspot]['optim']['if-v']);
			$('#optimbuilgold').text(goldoptimal).addClass('white');
		}
		else if (bestbuil == 'if-m') {
			bbestbuild = 'forum';
			goldoptimal = Math.round(cityspots[hovspot]['optim']['if-m']);
			$('#optimbuilgold').text(goldoptimal).addClass('white');
		}
		else if (bestbuil == 'if-o') {
			bbestbuild = 'port';
			goldoptimal = Math.round(cityspots[hovspot]['optim']['if-o']);
			$('#optimbuilgold').text(goldoptimal).addClass('white');
		}
		else if (bestbuil == 'if-c') {
			bbestbuild = 'cabin';
			woodoptimal = Math.round(cityspots[hovspot]['optim-c']['w']);
			stoneoptimal = Math.round(cityspots[hovspot]['optim-c']['s']);
			ironoptimal = Math.round(cityspots[hovspot]['optim-c']['i']);
			foodoptimal = Math.round(cityspots[hovspot]['optim-c']['f']);
			$('#optimbuilwood').text(woodoptimal).addClass('white');
			$('#optimbuilstone').text(stoneoptimal).addClass('white');
			$('#optimbuiliron').text(ironoptimal).addClass('white');
			$('#optimbuilfood').text(foodoptimal).addClass('white');
		}

		if (!woodoptimal) {
			woodoptimal = 0;
			$('#optimbuilwood').text('-').removeClass('white');
		}
		if (!stoneoptimal) {
			stoneoptimal = 0;
			$('#optimbuilstone').text('-').removeClass('white');
		}
		if (!ironoptimal) {
			ironoptimal = 0;
			$('#optimbuiliron').text('-').removeClass('white');
		}
		if (!foodoptimal) {
			foodoptimal = 0;
			$('#optimbuilfood').text('-').removeClass('white');
		}
		if (!goldoptimal) {
			goldoptimal = 0;
			$('#optimbuilgold').text('-').removeClass('white');
		}

		var finalopttot = woodoptimal + stoneoptimal + ironoptimal + foodoptimal + goldoptimal;
		$('#optimbuiltotal').text(finalopttot).addClass('white');

		$('#optimalbuilname').text(buildingsobject[bbestbuild]['name']);
		$('#optimalbuillarge').css('background', buildingsobject[bbestbuild]['medbackground'])
		$('#optimbuilimg div').css('background', buildingsobject[bbestbuild]['background'])


		if (currentbuilding.length > 0) {
			$('#currbuilimg div').css('background', buildingsobject[currentbuilding]['background']);

			if (currentbuilding == 'foresters' || currentbuilding == 'sawmill' || currentbuilding == 'forest') {
				woodcurrent = Math.round(cityspots[hovspot]['curr']['w']);
				$('#currbuilwood').text(woodcurrent).addClass('white');
			}
			else if (currentbuilding == 'stonemine' || currentbuilding == 'masons' || currentbuilding == 'stone') {
				stonecurrent = Math.round(cityspots[hovspot]['curr']['s']);
				$('#currbuilstone').text(stonecurrent).addClass('white');
			}
			else if (currentbuilding == 'ironmine' || currentbuilding == 'smelter' || currentbuilding == 'iron') {
				ironcurrent = Math.round(cityspots[hovspot]['curr']['i']);
				$('#currbuiliron').text(ironcurrent).addClass('white');
			}
			else if (currentbuilding == 'farm' || currentbuilding == 'grainmill' || currentbuilding == 'lake') {
				foodcurrent = Math.round(cityspots[hovspot]['curr']['f']);
				$('#currbuilfood').text(foodcurrent).addClass('white');
			}
			else if (currentbuilding == 'villa' || currentbuilding == 'forum' || currentbuilding == 'port') {
				goldcurrent = Math.round(cityspots[hovspot]['curr']['g']);
				$('#currbuilgold').text(goldcurrent).addClass('white');
			}
			else if (currentbuilding == 'cabin') {
				woodcurrent = Math.round(cityspots[hovspot]['curr']['w']);
				stonecurrent = Math.round(cityspots[hovspot]['curr']['s']);
				ironcurrent = Math.round(cityspots[hovspot]['curr']['i']);
				foodcurrent = Math.round(cityspots[hovspot]['curr']['f']);
				$('#currbuilwood').text(woodcurrent).addClass('white');
				$('#currbuilstone').text(stonecurrent).addClass('white');
				$('#currbuiliron').text(ironcurrent).addClass('white');
				$('#currbuilfood').text(foodcurrent).addClass('white');
			}

			if (!woodcurrent) {
				woodcurrent = 0;
				$('#currbuilwood').text('-').removeClass('white');
			}
			if (!stonecurrent) {
				stonecurrent = 0;
				$('#currbuilstone').text('-').removeClass('white');
			}
			if (!ironcurrent) {
				ironcurrent = 0;
				$('#currbuiliron').text('-').removeClass('white');
			}
			if (!foodcurrent) {
				foodcurrent = 0;
				$('#currbuilfood').text('-').removeClass('white');
			}
			if (!goldcurrent) {
				goldcurrent = 0;
				$('#currbuilgold').text('-').removeClass('white');
			}

			var finalcurrtot = woodcurrent + stonecurrent + ironcurrent + foodcurrent + goldcurrent;
			if (finalcurrtot > 0) {
				$('#currbuiltotal').text(finalcurrtot).addClass('white');
			} else {
				$('#currbuiltotal').text('-');
			}

		} else {
			$('#currbuilwood').text('-');
			$('#currbuilstone').text('-');
			$('#currbuiliron').text('-');
			$('#currbuilfood').text('-');
			$('#currbuilgold').text('-');
			$('#currbuiltotal').text('-');
			$('#currbuilimg div').css('background', '');			
		}


		$('#spothovermenu').show();

	}
}

function hideOptimization () {
	$('#spothovermenu').hide();
	$('.white').removeClass('white');
}

// from 'Add A Building' button
function addABuilding () {

	var highvalue = 0;
	var highres = '';

	for (var res in topoptimizations) {
		if (topoptimizations[res]['val'] > highvalue) {
			highvalue = topoptimizations[res]['val'];
			highres = res;
		}
	}
	placeBuilding(topoptimizations[highres]['pos'], topoptimizations[highres]['buil']);
}

function removeABuilding () {

	var lowres = 1000000;
	var lowestbuild = '';

	for (var divID in cityspots) {
		if (cityspots[divID]['buil'].length > 0  &&  cityspots[divID]['lck'] == false
		&& cityspots[divID]['buil'] != 'forest' && cityspots[divID]['buil'] != 'stone' && cityspots[divID]['buil'] != 'iron' && cityspots[divID]['buil'] != 'lake') 
		{

			var thistot = 0;

			if (cityspots[divID]['curr']['w']) {
				thistot += cityspots[divID]['curr']['w'];
			}
			if (cityspots[divID]['curr']['s']) {
				thistot += cityspots[divID]['curr']['s'];
			}
			if (cityspots[divID]['curr']['i']) {
				thistot += cityspots[divID]['curr']['i'];
			}
			if (cityspots[divID]['curr']['f']) {
				thistot += cityspots[divID]['curr']['f'];
			}
			if (cityspots[divID]['curr']['g']) {
				thistot += cityspots[divID]['curr']['g'];
			}

			if (thistot < lowres) {
				lowres = thistot;
				lowestbuild = divID;
			}
		}
	}
	if (lowestbuild.length > 0) {
		$("#" + lowestbuild).removeClass().removeAttr('data-building');
		cityspots[lowestbuild]['buil'] = '';
		updateResources();
		runOptimizer();
	}
}

function addACabin () {
	placeBuilding(topoptimizations['cabin']['pos'], 'cabin');
}

function removeACabin () {

	var lowres = 1000000;
	var lowestbuild = '';

	for (var divID in cityspots) {
		if (cityspots[divID]['buil'] == 'cabin'  &&  cityspots[divID]['lck'] == false) {

			var thistot = 0;

			if (cityspots[divID]['curr']['w']) {
				thistot += cityspots[divID]['curr']['w'];
			}
			if (cityspots[divID]['curr']['s']) {
				thistot += cityspots[divID]['curr']['s'];
			}
			if (cityspots[divID]['curr']['i']) {
				thistot += cityspots[divID]['curr']['i'];
			}
			if (cityspots[divID]['curr']['f']) {
				thistot += cityspots[divID]['curr']['f'];
			}
			if (cityspots[divID]['curr']['g']) {
				thistot += cityspots[divID]['curr']['g'];
			}

			if (thistot < lowres) {
				lowres = thistot;
				lowestbuild = divID;
			}
		}
	}
	if (lowestbuild.length > 0) {
		$("#" + lowestbuild).removeClass().removeAttr('data-building');
		cityspots[lowestbuild]['buil'] = '';
		updateResources();
		runOptimizer();
	}
}

// update the optimization recommendation in an object
// runs on init
function runOptimizer () {

	topoptimizations = {'wood': {'val': 0, 'buil': '', 'pos': ''}, 'stone': {'val': 0, 'buil': '', 'pos': ''}, 'iron': {'val': 0, 'buil': '', 'pos': ''}, 'food': {'val': 0, 'buil': '', 'pos': ''}, 'gold': {'val': 0, 'buil': '', 'pos': ''}, 'cabin': {'val': 0, 'pos': ''} };

	for (var mapspot in cityspots) {
		if ( (cityspots[mapspot]['la'] && $('#cityholder').hasClass('landlocked')) || (cityspots[mapspot]['wa'] && $('#cityholder').hasClass('waterside')) ) {

			var neighbours = getEightNeighbours(mapspot);
			cityspots[mapspot]['optim'] = {};
			cityspots[mapspot]['optim']['if-f'] = runForestersPseudo(neighbours);
			cityspots[mapspot]['optim']['if-s'] = runStoneMinePseudo(neighbours);
			cityspots[mapspot]['optim']['if-i'] = runIronMinePseudo(neighbours);
			cityspots[mapspot]['optim']['if-a'] = runFarmPseudo(neighbours);
			cityspots[mapspot]['optim']['if-l'] = runSawmillPseudo(neighbours);
			cityspots[mapspot]['optim']['if-h'] = runMasonsPseudo(neighbours);
			cityspots[mapspot]['optim']['if-z'] = runSmelterPseudo(neighbours);
			cityspots[mapspot]['optim']['if-g'] = runGMillPseudo(neighbours);
			cityspots[mapspot]['optim']['if-v'] = runVillaPseudo(neighbours);
			cityspots[mapspot]['optim']['if-m'] = runForumPseudo(neighbours);

			if ( $('#cityholder').hasClass('waterside') && cityspots[mapspot]['ws'] == true ) {
				cityspots[mapspot]['optim']['if-o'] = runPortPseudo(neighbours);
			}

			var cabinbonuses = runCabinPseudo(neighbours);
			cityspots[mapspot]['optim']['if-c'] = cabinbonuses[0];

			// store the individual cabin optimizations in another object
			cityspots[mapspot]['optim-c'] = {};
			cityspots[mapspot]['optim-c']['w'] = cabinbonuses[1];
			cityspots[mapspot]['optim-c']['s'] = cabinbonuses[2];
			cityspots[mapspot]['optim-c']['i'] = cabinbonuses[3];
			cityspots[mapspot]['optim-c']['f'] = cabinbonuses[4];


			// just cabins
			if (cabinbonuses[0] > topoptimizations['cabin']['val'] && cityspots[mapspot]['buil'] != 'cabin') {
				topoptimizations['cabin']['val'] = cabinbonuses[0];
				topoptimizations['cabin']['pos'] = mapspot;
			}

			// the other 5 res
			if (cityspots[mapspot]['optim']['if-f'] > topoptimizations['wood']['val'] && cityspots[mapspot]['buil'] != 'foresters') {
				topoptimizations['wood']['val'] = cityspots[mapspot]['optim']['if-f'];
				topoptimizations['wood']['buil'] = 'foresters';
				topoptimizations['wood']['pos'] = mapspot;
			}
			if (cityspots[mapspot]['optim']['if-l'] > topoptimizations['wood']['val'] && cityspots[mapspot]['buil'] != 'sawmill') {
				topoptimizations['wood']['val'] = cityspots[mapspot]['optim']['if-l'];
				topoptimizations['wood']['buil'] = 'sawmill';
				topoptimizations['wood']['pos'] = mapspot;
			}
			if (cabinbonuses[1] > topoptimizations['wood']['val'] && cityspots[mapspot]['buil'] != 'cabin') {
				topoptimizations['wood']['val'] = cabinbonuses[1];
				topoptimizations['wood']['buil'] = 'cabin';
				topoptimizations['wood']['pos'] = mapspot;
			}

			if (cityspots[mapspot]['optim']['if-s'] > topoptimizations['stone']['val'] && cityspots[mapspot]['buil'] != 'stonemine') {
				topoptimizations['stone']['val'] = cityspots[mapspot]['optim']['if-s'];
				topoptimizations['stone']['buil'] = 'stonemine';
				topoptimizations['stone']['pos'] = mapspot;
			}
			if (cityspots[mapspot]['optim']['if-h'] > topoptimizations['stone']['val'] && cityspots[mapspot]['buil'] != 'masons') {
				topoptimizations['stone']['val'] = cityspots[mapspot]['optim']['if-h'];
				topoptimizations['stone']['buil'] = 'masons';
				topoptimizations['stone']['pos'] = mapspot;
			}
			if (cabinbonuses[2] > topoptimizations['stone']['val'] && cityspots[mapspot]['buil'] != 'cabin') {
				topoptimizations['stone']['val'] = cabinbonuses[2];
				topoptimizations['stone']['buil'] = 'cabin';
				topoptimizations['stone']['pos'] = mapspot;
			}

			if (cityspots[mapspot]['optim']['if-i'] > topoptimizations['iron']['val'] && cityspots[mapspot]['buil'] != 'ironmine') {
				topoptimizations['iron']['val'] = cityspots[mapspot]['optim']['if-i'];
				topoptimizations['iron']['buil'] = 'ironmine';
				topoptimizations['iron']['pos'] = mapspot;
			}
			if (cityspots[mapspot]['optim']['if-z'] > topoptimizations['iron']['val'] && cityspots[mapspot]['buil'] != 'smelter') {
				topoptimizations['iron']['val'] = cityspots[mapspot]['optim']['if-z'];
				topoptimizations['iron']['buil'] = 'smelter';
				topoptimizations['iron']['pos'] = mapspot;
			}
			if (cabinbonuses[3] > topoptimizations['iron']['val'] && cityspots[mapspot]['buil'] != 'cabin') {
				topoptimizations['iron']['val'] = cabinbonuses[3];
				topoptimizations['iron']['buil'] = 'cabin';
				topoptimizations['iron']['pos'] = mapspot;
			}

			if (cityspots[mapspot]['optim']['if-a'] > topoptimizations['food']['val'] && cityspots[mapspot]['buil'] != 'farm') {
				topoptimizations['food']['val'] = cityspots[mapspot]['optim']['if-a'];
				topoptimizations['food']['buil'] = 'farm';
				topoptimizations['food']['pos'] = mapspot;
			}
			if (cityspots[mapspot]['optim']['if-g'] > topoptimizations['food']['val'] && cityspots[mapspot]['buil'] != 'grainmill') {
				topoptimizations['food']['val'] = cityspots[mapspot]['optim']['if-g'];
				topoptimizations['food']['buil'] = 'grainmill';
				topoptimizations['food']['pos'] = mapspot;
			}
			if (cabinbonuses[4] > topoptimizations['food']['val'] && cityspots[mapspot]['buil'] != 'cabin') {
				topoptimizations['food']['val'] = cabinbonuses[4];
				topoptimizations['food']['buil'] = 'cabin';
				topoptimizations['food']['pos'] = mapspot;
			}

			if (cityspots[mapspot]['optim']['if-v'] > topoptimizations['gold']['val'] && cityspots[mapspot]['buil'] != 'villa') {
				topoptimizations['gold']['val'] = cityspots[mapspot]['optim']['if-v'];
				topoptimizations['gold']['buil'] = 'villa';
				topoptimizations['gold']['pos'] = mapspot;
			}
			if (cityspots[mapspot]['optim']['if-m'] > topoptimizations['gold']['val'] && cityspots[mapspot]['buil'] != 'forum') {
				topoptimizations['gold']['val'] = cityspots[mapspot]['optim']['if-m'];
				topoptimizations['gold']['buil'] = 'forum';
				topoptimizations['gold']['pos'] = mapspot;
			}
			if (cityspots[mapspot]['optim']['if-o'] > topoptimizations['gold']['val'] && cityspots[mapspot]['buil'] != 'port') {
				topoptimizations['gold']['val'] = cityspots[mapspot]['optim']['if-o'];
				topoptimizations['gold']['buil'] = 'port';
				topoptimizations['gold']['pos'] = mapspot;
			}
		}
	}
}

// 12 offshoot runOptimizer functions
function runForestersPseudo ( neighbours) {

	var toadd = buildingsobject['foresters']['stats']['woodproduction'];
	var nodes = 0;
	var processorbuilding = 0;
	var cabins = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ( $('#' + current).length > 0 ) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding.length > 0) {
				if (tbuilding == 'forest') {
					nodes += 1;
				}
				else if (tbuilding == 'sawmill') {
					processorbuilding = 1;
				}
				else if (tbuilding == 'cabin') {
					cabins += 1;
				}
			}
		}
	}
	var addnodes = toadd + ((toadd * (buildingsobject['forest']['stats']['woodresnodebonus'] / 100)) * nodes);
	var addcabins = addnodes + ((addnodes * (buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100)) * cabins);
	var finalcount = addcabins + ((addcabins * (buildingsobject['sawmill']['stats']['woodprocessingbonus'] / 100)) * processorbuilding);
	return finalcount;
}

function runStoneMinePseudo (neighbours) {

	var toadd = buildingsobject['stonemine']['stats']['stoneproduction'];
	var nodes = 0;
	var processorbuilding = 0;
	var cabins = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'stone') {
				nodes += 1;
			}
			else if (tbuilding == 'masons') {
				processorbuilding = 1;
			}
			else if (tbuilding == 'cabin') {
				cabins += 1;
			}
		}
	}
	var addnodes = toadd + ((toadd * (buildingsobject['stone']['stats']['stoneresnodebonus'] / 100)) * nodes);
	var addcabins = addnodes + ((addnodes * (buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100)) * cabins);
	var finalcount = addcabins + ((addcabins * (buildingsobject['masons']['stats']['stoneprocessingbonus'] / 100)) * processorbuilding);
	return finalcount;
}

function runIronMinePseudo (neighbours) {

	var toadd = buildingsobject['ironmine']['stats']['ironproduction'];
	var nodes = 0;
	var processorbuilding = 0;
	var cabins = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'iron') {
				nodes += 1;
			}
			else if (tbuilding == 'smelter') {
				processorbuilding = 1;
			}
			else if (tbuilding == 'cabin') {
				cabins += 1;
			}
		}
	}
	var addnodes = toadd + ((toadd * (buildingsobject['iron']['stats']['ironresnodebonus'] / 100)) * nodes);
	var addcabins = addnodes + ((addnodes * (buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100)) * cabins);
	var finalcount = addcabins + ((addcabins * (buildingsobject['smelter']['stats']['ironprocessingbonus'] / 100)) * processorbuilding);
	return finalcount;
}

function runFarmPseudo (neighbours) {

	var toadd = buildingsobject['farm']['stats']['foodproduction'];
	var firstfield = 0
	var subseqfields = 0;
	var nodes = 0;
	var processorbuilding = 0;
	var cabins = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if ( tbuilding.length == 0 && cityspots[current]['la'] && $('#cityholder').hasClass('landlocked') ) {
				if (firstfield == 0) {
					firstfield = 1;
				} else {
					subseqfields += 1;
				}
			}
			else if ( tbuilding.length == 0 && cityspots[current]['wa'] && !cityspots[current]['ws'] && $('#cityholder').hasClass('waterside') ) {
				if (firstfield == 0) {
					firstfield = 1;
				} else {
					subseqfields += 1;
				}
			}
			else if (tbuilding == 'lake') {
				nodes += 1;
			}
			else if (tbuilding == 'grainmill') {
				processorbuilding = 1;
			}
			else if (tbuilding == 'cabin') {
				cabins += 1;
			}
		}
	}
	var addfields = toadd + ((toadd * 0.5) * firstfield) + ((toadd * 0.4) * subseqfields);
	var addnodes = addfields + ((addfields * (buildingsobject['lake']['stats']['foodresnodebonus'] / 100)) * nodes);
	var addcabins = addnodes + ((addnodes * (buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100)) * cabins);
	var finalcount = addcabins + ((addcabins * (buildingsobject['grainmill']['stats']['foodprocessingbonus'] / 100)) * processorbuilding);
	return finalcount;
}

function runSawmillPseudo (neighbours) {

	var noprocessor = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'foresters') {
				if (cityspots[current]['proc'] == 0) {
					noprocessor += 1;
				}
				else {
				}
			}
		}
	}
	var toadd = buildingsobject['foresters']['stats']['woodproduction'];
	var procbonus = ( toadd * ( buildingsobject['sawmill']['stats']['woodprocessingbonus'] / 100 ) ) * noprocessor;
	if (noprocessor > 0) {
		procbonus += toadd;
	}
	return procbonus;
}

function runMasonsPseudo (neighbours) {

	var noprocessor = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'stonemine') {
				if (cityspots[current]['proc'] == 0) {
					noprocessor += 1;
				}
			}
		}
	}
	var toadd = buildingsobject['stonemine']['stats']['stoneproduction'];
	var procbonus = ( toadd * ( buildingsobject['masons']['stats']['stoneprocessingbonus'] / 100 ) ) * noprocessor;
	if (noprocessor > 0) {
		procbonus += toadd;
	}
	return procbonus;
}

function runSmelterPseudo (neighbours) {

	var noprocessor = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'ironmine') {
				if (cityspots[current]['proc'] == 0) {
					noprocessor += 1;
				}
			}
		}
	}
	var toadd = buildingsobject['ironmine']['stats']['ironproduction'];
	var procbonus = ( toadd * ( buildingsobject['smelter']['stats']['ironprocessingbonus'] / 100 ) ) * noprocessor;
	if (noprocessor > 0) {
		procbonus += toadd;
	}
	return procbonus;
}

function runGMillPseudo (neighbours) {

	var noprocessor = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'farm') {
				if (cityspots[current]['proc'] == 0) {
					noprocessor += 1;
				}
			}
		}
	}
	var toadd = buildingsobject['farm']['stats']['foodproduction'];
	var procbonus = ( toadd * ( buildingsobject['grainmill']['stats']['foodprocessingbonus'] / 100 ) ) * noprocessor;
	if (noprocessor > 0) {
		procbonus += toadd;
	}
	return procbonus;
}

function runVillaPseudo (neighbours) {

	var toadd = buildingsobject['villa']['stats']['goldproduction'];
	var forumbuildings = 0;
	var portbuildings = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil']

			if (tbuilding == 'forum') {
				forumbuildings += 1;
			}
			else if (tbuilding == 'port') {
				portbuildings += 1;
			}
		}
	}
	var addforums = ( toadd * ( buildingsobject['forum']['stats']['goldtaxbonus'] / 100 ) ) * forumbuildings;
	var addports = ( toadd * ( buildingsobject['port']['stats']['goldtaxbonus'] / 100 ) ) * portbuildings;
	var plusboth = toadd + addforums + addports;
	return plusboth;
}

function runCabinPseudo (neighbours) {

	var prodforester = 0;
	var prodstonemine = 0;
	var prodironmine = 0;
	var prodfarm = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'foresters') {
				prodforester += 1;
			}
			else if (tbuilding == 'stonemine') {
				prodstonemine += 1;
			}
			else if (tbuilding == 'ironmine') {
				prodironmine += 1;
			}
			else if (tbuilding == 'farm') {
				prodfarm += 1;
			}
		}
	}

	var initial = buildingsobject['foresters']['stats']['woodproduction'];
	var foresterbonus = ( buildingsobject['foresters']['stats']['woodproduction'] * ( buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100 ) ) * prodforester;
	var stonebonus = ( buildingsobject['stonemine']['stats']['stoneproduction'] * ( buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100 ) ) * prodstonemine;
	var ironbonus = ( buildingsobject['ironmine']['stats']['ironproduction'] * ( buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100 ) ) * prodironmine;
	var foodbonus = ( buildingsobject['farm']['stats']['foodproduction'] * ( buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100 ) ) * prodfarm;
	
	var tots = foresterbonus + stonebonus + ironbonus + foodbonus;
	if (tots > 0) {
		tots += initial;
	}

	if (foresterbonus > 0) {
		foresterbonus += initial;
	}
	if (stonebonus > 0) {
		stonebonus += initial;
	}
	if (ironbonus > 0) {
		ironbonus += initial;
	}
	if (foodbonus > 0) {
		foodbonus += initial;
	}

	var finaltots = [tots, foresterbonus, stonebonus, ironbonus, foodbonus];
	return finaltots;
}

function runForumPseudo (neighbours) {
	var prodbuils = 0;
	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'villa') {
				prodbuils += 1;
			}
		}
	}
	var toadd = buildingsobject['villa']['stats']['goldproduction'];
	var forumbonus = ( toadd * ( buildingsobject['forum']['stats']['goldtaxbonus'] / 100 ) ) * prodbuils;
	if (forumbonus > 0) {
		forumbonus += toadd;
	}
	return forumbonus;
}

function runPortPseudo (neighbours) {
	var prodbuils = 0;
	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'villa') {
				prodbuils += 1;
			}
		}
	}
	var toadd = buildingsobject['villa']['stats']['goldproduction'];
	var portbonus = ( toadd * ( buildingsobject['port']['stats']['goldtaxbonus'] / 100 ) ) * prodbuils;
	if (portbonus > 0) {
		portbonus += toadd;
	}
	return portbonus;
}

// for current buildings
function runForestNode(thisdiv) {

	var neighbours = getEightNeighbours(thisdiv);
	var prodb = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'foresters') {
				prodb += 1;
			}
		}
	}
	var toadd = buildingsobject['foresters']['stats']['woodproduction'];
	var nodebonus = ( toadd * ( buildingsobject['forest']['stats']['woodresnodebonus'] / 100 ) ) * prodb;
	if (nodebonus > 0) {
		nodebonus += toadd;
	}
	return nodebonus;
}
function runStoneNode(thisdiv) {

	var neighbours = getEightNeighbours(thisdiv);
	var prodb = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'stonemine') {
				prodb += 1;
			}
		}
	}
	var toadd = buildingsobject['stonemine']['stats']['stoneproduction'];
	var nodebonus = ( toadd * ( buildingsobject['stone']['stats']['stoneresnodebonus'] / 100 ) ) * prodb;
	if (nodebonus > 0) {
		nodebonus += toadd;
	}
	return nodebonus;
}
function runIronNode(thisdiv) {

	var neighbours = getEightNeighbours(thisdiv);
	var prodb = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'ironmine') {
				prodb += 1;
			}
		}
	}
	var toadd = buildingsobject['ironmine']['stats']['ironproduction'];
	var nodebonus = ( toadd * ( buildingsobject['iron']['stats']['ironresnodebonus'] / 100 ) ) * prodb;
	if (nodebonus > 0) {
		nodebonus += toadd;
	}
	return nodebonus;
}
function runLakeNode(thisdiv) {

	var neighbours = getEightNeighbours(thisdiv);
	var prodb = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'farm') {
				prodb += 1;
			}
		}
	}
	var toadd = buildingsobject['farm']['stats']['foodproduction'];
	var nodebonus = ( toadd * ( buildingsobject['lake']['stats']['foodresnodebonus'] / 100 ) ) * prodb;
	if (nodebonus > 0) {
		nodebonus += toadd;
	}
	return nodebonus;
}
function runSawmill (thisdiv) {

	var neighbours = getEightNeighbours(thisdiv);
	var processor = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'foresters') {
				processor += 1;
			}
		}
	}
	var toadd = buildingsobject['foresters']['stats']['woodproduction'];
	var procbonus = ( toadd * ( buildingsobject['sawmill']['stats']['woodprocessingbonus'] / 100 ) ) * processor;
	if (procbonus > 0) {
		procbonus += toadd;
	}
	return procbonus;
}
function runMasons (thisdiv) {

	var neighbours = getEightNeighbours(thisdiv);
	var processor = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'stonemine') {
				processor += 1;
			}
		}
	}
	var toadd = buildingsobject['stonemine']['stats']['stoneproduction'];
	var procbonus = ( toadd * ( buildingsobject['masons']['stats']['stoneprocessingbonus'] / 100 ) ) * processor;
	if (procbonus > 0) {
		procbonus += toadd;
	}
	return procbonus;
}
function runSmelter (thisdiv) {

	var neighbours = getEightNeighbours(thisdiv);
	var processor = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'ironmine') {
				processor += 1;
			}
		}
	}
	var toadd = buildingsobject['ironmine']['stats']['ironproduction'];
	var procbonus = ( toadd * ( buildingsobject['smelter']['stats']['ironprocessingbonus'] / 100 ) ) * processor;
	if (procbonus > 0) {
		procbonus += toadd;
	}
	return procbonus;
}
function runGMill (thisdiv) {

	var neighbours = getEightNeighbours(thisdiv);
	var processor = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'farm') {
				processor += 1;
			}
		}
	}
	var toadd = buildingsobject['farm']['stats']['foodproduction'];
	var procbonus = ( toadd * ( buildingsobject['grainmill']['stats']['foodprocessingbonus'] / 100 ) ) * processor;
	if (procbonus > 0) {
		procbonus += toadd;
	}
	return procbonus;
}
function runForum (thisdiv) {
	var neighbours = getEightNeighbours(thisdiv);
	var prodbuils = 0;
	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'villa') {
				prodbuils += 1;
			}
		}
	}
	var toadd = buildingsobject['villa']['stats']['goldproduction'];
	var forumbonus = ( toadd * ( buildingsobject['forum']['stats']['goldtaxbonus'] / 100 ) ) * prodbuils;
	if (forumbonus > 0) {
		forumbonus += toadd;
	}
	return forumbonus;
}
function runPort (thisdiv) {
	var neighbours = getEightNeighbours(thisdiv);
	var prodbuils = 0;
	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			var tbuilding = cityspots[current]['buil'];

			if (tbuilding == 'villa') {
				prodbuils += 1;
			}
		}
	}
	var toadd = buildingsobject['villa']['stats']['goldproduction'];
	var portbonus = ( toadd * ( buildingsobject['port']['stats']['goldtaxbonus'] / 100 ) ) * prodbuils;
	if (portbonus > 0) {
		portbonus += toadd;
	}
	return portbonus;
}





























