
function updateCityRes () {

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


	var numberspots = $('#cityholder').find('div');
	$('.fields').removeClass('fields');

	var i;
	for (i = 0; i < numberspots.length; i++) { 
		var thisdiv = numberspots[i];

		if  ($(thisdiv).hasClass("buildingmap")) { // regular buildings
			var building = $(thisdiv).attr('data-building');

			if (building == 'foresters') {
				var amt = woodtotalprod;
				woodtotalprod = updateWoodProd(thisdiv, amt);
			}
			else if (building == 'stonemine') {
				var amt = stonetotalprod;
				stonetotalprod = updateStoneProd(thisdiv, amt);
			}
			else if (building == 'ironmine') {
				var amt = irontotalprod;
				irontotalprod = updateIronProd(thisdiv, amt);
			}
			else if (building == 'farm') {
				var amt = foodtotalprod;
				foodtotalprod = updateFoodProd(thisdiv, amt);
				updateFields(thisdiv);
			}
			else if (building == 'villa') {
				var amt = goldtotalprod;
				goldtotalprod = updateGoldProd(thisdiv, amt);
			}
			else if (building == 'storehouse') {
				var wstor = woodstorage;
				var sstore = stonestorage;
				var istore = ironstorage;
				var fstore = foodstorage;
				var newamts = updateStorage(thisdiv, wstor, sstore, istore, fstore);
				woodstorage = newamts[0];
				stonestorage = newamts[1];
				ironstorage = newamts[2];
				foodstorage = newamts[3];
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

	$('#woodproductiontd').text(woodtotalprod);
	$('#stoneproductiontd').text(stonetotalprod);
	$('#ironproductiontd').text(irontotalprod);
	$('#foodproductiontd').text(foodtotalprod);
	$('#goldproductiontd').text(goldtotalprod);
	$('#totalproductiontd').text( (woodtotalprod + stonetotalprod + irontotalprod + foodtotalprod + goldtotalprod) );

	$('#woodstoragetd').text(woodstorage);
	$('#stonestoragetd').text(stonestorage);
	$('#ironstoragetd').text(ironstorage);
	$('#foodstoragetd').text(foodstorage);

}

// update storage values for wood, stone, iron and food
function updateStorage(thisdiv, woodstorage, stonestorage, ironstorage, foodstorage) {

	var toadd = buildingsobject['storehouse']['stats']['storage'];
	var neighbours = getEightNeighbours(thisdiv);
	var sawmillsno = 0;
	var masonsno = 0;
	var smelterssno = 0;
	var grainmillsno = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			if ($('#' + current).hasClass('sawmill')) {
				sawmillsno += 1;
			}
			else if ($('#' + current).hasClass('masons')) {
				masonsno += 1;
			}
			else if ($('#' + current).hasClass('smelter')) {
				smelterssno += 1;
			}
			else if ($('#' + current).hasClass('grainmill')) {
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

// update city wood production value
function updateGoldProd(thisdiv, goldtotalprod) {

	var toadd = buildingsobject['villa']['stats']['goldproduction'];
	var neighbours = getEightNeighbours(thisdiv);

	var forumbuildings = 0;
	var portbuildings = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			if ($('#' + current).hasClass('forum')) {
				forumbuildings += 1;
			}
			else if ($('#' + current).hasClass('port')) {
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

// update city wood production value
function updateWoodProd(thisdiv, woodtotalprod) {

	var toadd = buildingsobject['foresters']['stats']['woodproduction'];
	var neighbours = getEightNeighbours(thisdiv);

	var nodes = 0;
	var processorbuilding = 0;
	var cabins = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			if ($('#' + current).hasClass('forest')) {
				nodes += 1;
			}
			else if ($('#' + current).hasClass('sawmill')) {
				processorbuilding = 1;
			}
			else if ($('#' + current).hasClass('cabin')) {
				cabins += 1;
			}
		}
	}
	var addnodes = ( toadd * ( buildingsobject['forest']['stats']['woodresnodebonus'] / 100 ) ) * nodes;
	var plusnodes = toadd + addnodes;
	var addcabins = ( plusnodes * ( buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100 ) ) * cabins;
	var pluscabins = plusnodes + addcabins;
	var addprocessor = pluscabins * ( buildingsobject['sawmill']['stats']['woodprocessingbonus'] / 100 ) * processorbuilding;

	var finalcount = pluscabins + addprocessor;
	woodtotalprod += finalcount;
	return woodtotalprod;
}

// update city stone production value
function updateStoneProd(thisdiv, stonetotalprod) {

	var toadd = buildingsobject['stonemine']['stats']['stoneproduction'];
	var neighbours = getEightNeighbours(thisdiv);

	var nodes = 0;
	var processorbuilding = 0;
	var cabins = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			if ($('#' + current).hasClass('stone')) {
				nodes += 1;
			}
			else if ($('#' + current).hasClass('masons')) {
				processorbuilding = 1;
			}
			else if ($('#' + current).hasClass('cabin')) {
				cabins += 1;
			}
		}
	}
	var addnodes = ( toadd * ( buildingsobject['stone']['stats']['stoneresnodebonus'] / 100 ) ) * nodes;
	var plusnodes = toadd + addnodes;
	var addcabins = ( plusnodes * ( buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100 ) ) * cabins;
	var pluscabins = plusnodes + addcabins;
	var addprocessor = pluscabins * ( buildingsobject['masons']['stats']['stoneprocessingbonus'] / 100 ) * processorbuilding;

	var finalcount = pluscabins + addprocessor;
	stonetotalprod += finalcount;
	return stonetotalprod;
}

// update city iron production value
function updateIronProd(thisdiv, irontotalprod) {

	var toadd = buildingsobject['ironmine']['stats']['ironproduction'];
	var neighbours = getEightNeighbours(thisdiv);

	var nodes = 0;
	var processorbuilding = 0;
	var cabins = 0;

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];

		if ($('#' + current).length > 0) {
			if ($('#' + current).hasClass('iron')) {
				nodes += 1;
			}
			else if ($('#' + current).hasClass('smelter')) {
				processorbuilding = 1;
			}
			else if ($('#' + current).hasClass('cabin')) {
				cabins += 1;
			}
		}
	}
	var addnodes = ( toadd * ( buildingsobject['iron']['stats']['ironresnodebonus'] / 100 ) ) * nodes;
	var plusnodes = toadd + addnodes;
	var addcabins = ( plusnodes * ( buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100 ) ) * cabins;
	var pluscabins = plusnodes + addcabins;
	var addprocessor = pluscabins * ( buildingsobject['smelter']['stats']['ironprocessingbonus'] / 100 ) * processorbuilding;

	var finalcount = pluscabins + addprocessor;
	irontotalprod += finalcount;
	return irontotalprod;
}

// update city food production value
function updateFoodProd(thisdiv, foodtotalprod) {

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
		var thetd = $('#' + current).parent();

		if ($('#' + current).length > 0) {
			if ( !$('#' + current).hasClass('buildingmap') && $(thetd).hasClass('la') && $('#cityholder').hasClass('landlocked') ) {

				if (firstfield == 0) {
					firstfield = 1;
				} else {
					subseqfields += 1;
				}
				$('#' + current).addClass('fields');

			}
			else if ( !$('#' + current).hasClass('buildingmap') && $(thetd).hasClass('wa') && $('#cityholder').hasClass('waterside') ) {

				if (firstfield == 0) {
					firstfield = 1;
				} else {
					subseqfields += 1;
				}
				$('#' + current).addClass('fields');

			}
			else if ($('#' + current).hasClass('lake')) {
				nodes += 1;
			}
			else if ($('#' + current).hasClass('grainmill')) {
				processorbuilding = 1;
			}
			else if ($('#' + current).hasClass('cabin')) {
				cabins += 1;
			}
		}
	}
	var addfirstfield = (toadd * 0.5) * firstfield;
	var addsubseqfields = (toadd * 0.4) * subseqfields;
	var plusfields = toadd + addfirstfield + addsubseqfields;
	var addnodes = ( plusfields * ( buildingsobject['lake']['stats']['foodresnodebonus'] / 100 ) ) * nodes;
	var plusnodes = plusfields + addnodes;
	var addcabins = ( plusnodes * ( buildingsobject['cabin']['stats']['cabinproductionbonus'] / 100 ) ) * cabins;
	var pluscabins = plusnodes + addcabins;
	var addprocessor = pluscabins * ( buildingsobject['grainmill']['stats']['foodprocessingbonus'] / 100 ) * processorbuilding;

	var finalcount = pluscabins + addprocessor;
	foodtotalprod += finalcount;
	return foodtotalprod;
}

// update farm fields on map
function updateFields (thediv) {

	var neighbours = getEightNeighbours(thediv);

	var j;
	for (j = 0; j < neighbours.length; j++) { 
		var current = neighbours[j];
		var thetd = $('#' + current).parent();

		if ( !$('#' + current).hasClass('buildingmap') && $(thetd).hasClass('la') && $('#cityholder').hasClass('landlocked') ) {
			$('#' + current).addClass('fields');
		}
		else if ( !$('#' + current).hasClass('buildingmap') && $(thetd).hasClass('wa') && $('#cityholder').hasClass('waterside') ) {
			$('#' + current).addClass('fields');
		}
	}

}


// get 8 adjacent tiles
function getEightNeighbours(thisdiv) {

	var buildid = $(thisdiv).attr('ID');
	var dash = buildid.search("-");
	var heightpos = parseInt( buildid.substring(1,dash) );
	var widthpos = parseInt( buildid.substring( (dash+1) ) );

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


// hover a spot on the map, get left-hand hover menu telling what would be optimal to put there
function optimalBuilding (mapspot) {

	$('#spothovermenu').text(mapspot).show();

}

// mouseout from spot on the map, hide optimal building menu again
function hideoptBuilding () {

	$('#spothovermenu').text('').hide();

}







