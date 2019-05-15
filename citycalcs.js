
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
		} else {
			cityspots[theID]['buil'] = "";
		}

	}

	updateResources();

}


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

		var building = cityspots[mapspot]['buil'];

		if  (building.length > 0) { // regular buildings

			if (building == 'foresters') {
				numberbuildings += 1;
				var amt = woodtotalprod;
				woodtotalprod = woodProduction(mapspot, amt);
			}
			else if (building == 'stonemine') {
				numberbuildings += 1;
				var amt = stonetotalprod;
				stonetotalprod = stoneProduction(mapspot, amt);
			}
			else if (building == 'ironmine') {
				numberbuildings += 1;
				var amt = irontotalprod;
				irontotalprod = ironProduction(mapspot, amt);
			}
			else if (building == 'farm') {
				numberbuildings += 1;
				var amt = foodtotalprod;
				foodtotalprod = foodProduction(mapspot, amt);
				updateFields(mapspot);
			}
			else if (building == 'villa') {
				numberbuildings += 1;
				var amt = goldtotalprod;
				goldtotalprod = goldProduction(mapspot, amt);
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
				var amt = resprotected;
				resprotected = hideawayAmount(mapspot, amt);
			}
			else if (building == 'forum') {
				numberbuildings += 1;
				numbercarts += buildingsobject['forum']['stats']['tradecarts'];
			}
			else if (building == 'port') {
				numberbuildings += 1;
				numbertrships += buildingsobject['port']['stats']['tradeships'];
			}
			else if (building == 'cabin') {
				numberbuildings += 1;
				construcspeed += 100;
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


	runOptimizer();

}


function woodProduction (thisdiv, woodtotalprod) {

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

	woodtotalprod += finalcount;
	return woodtotalprod;
}

function stoneProduction (thisdiv, stonetotalprod) {

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

	stonetotalprod += finalcount;
	return stonetotalprod;
}

function ironProduction (thisdiv, irontotalprod) {

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

	irontotalprod += finalcount;
	return irontotalprod;
}

function foodProduction (thisdiv, foodtotalprod) {

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

	foodtotalprod += finalcount;
	return foodtotalprod;
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
	var plusforums = toadd + addforums;
	var addports = ( toadd * ( buildingsobject['port']['stats']['goldtaxbonus'] / 100 ) ) * portbuildings;
	var plusports = plusforums + addports;

	goldtotalprod += plusports;
	return goldtotalprod;
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

	resprotected += plusnodes;
	return resprotected;
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
	return neighbours;
}

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


function runOptimizer () {

}





























