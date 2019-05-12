
// main buildings object
var buildingsobject = {
	'forest': {
		'key': '1',
		'loukey': '.',
		'name': 'Forest Node',
		'stats': {
			'woodresnodebonus': 45
		}
	},
	'stone': {
		'key': '2',
		'loukey': ':',
		'name': 'Stone Node',
		'stats': {
			'stoneresnodebonus': 45
		}
	},
	'iron': {
		'key': '3',
		'loukey': ',',
		'name': 'Iron Node',
		'stats': {
			'ironresnodebonus': 45
		}
	},
	'lake': {
		'key': '4',
		'loukey': ';',
		'name': 'Lake Node',
		'stats': {
			'foodresnodebonus': 45
		}
	},
	'port': {
		'key': 'o',
		'loukey': 'r',
		'name': 'Port',
		'stats': {
			'tradeships': 30,
			'goldtaxbonus': 50
		}
	},
	'foresters': {
		'key': 'f',
		'loukey': '2',
		'name': 'Foresters Hut',
		'stats': {
			'woodproduction': 300
		}
	},
	'stonemine': {
		'key': 's',
		'loukey': '3',
		'name': 'Stone Mine',
		'stats': {
			'stoneproduction': 300
		}
	},
	'ironmine': {
		'key': 'i',
		'loukey': '4',
		'name': 'Iron Mine',
		'stats': {
			'ironproduction': 300
		}
	},
	'farm': {
		'key': 'a',
		'loukey': '1',
		'name': 'Farm Estate',
		'stats': {
			'foodproduction': 300
		}
	},
	'villa': {
		'key': 'v',
		'loukey': 'u',
		'name': 'Villa',
		'stats': {
			'goldproduction': 400
		}
	},
	'sawmill': {
		'key': 'l',
		'loukey': 'l',
		'name': 'Sawmill',
		'stats': {
			'woodprocessingbonus': 75,
			'woodstoragebonus': 200
		}
	},
	'masons': {
		'key': 'h',
		'loukey': 'a',
		'name': 'Masons Hut',
		'stats': {
			'stoneprocessingbonus': 75,
			'stonestoragebonus': 200
		}
	},
	'smelter': {
		'key': 'z',
		'loukey': 'd',
		'name': 'Smelter',
		'stats': {
			'ironprocessingbonus': 75,
			'ironstoragebonus': 200
		}
	},
	'grainmill': {
		'key': 'g',
		'loukey': 'm',
		'name': 'Grain Mill',
		'stats': {
			'foodprocessingbonus': 75,
			'foodstoragebonus': 200
		}
	},
	'forum': {
		'key': 'm',
		'loukey': 'p',
		'name': 'Forum',
		'stats': {
			'tradecarts': 200,
			'goldtaxbonus': 20
		}
	},
	'storehouse': {
		'key': 'r',
		'loukey': 's',
		'name': 'Storehouse',
		'stats': {
			'storage': 200000
		}
	},
	'hide': {
		'key': 'q',
		'loukey': 'h',
		'name': 'Hideaway',
		'stats': {
			'reshidden': 15000
		}
	},
	'cabin': {
		'key': 'c',
		'loukey': 'c',
		'name': 'Cabin',
		'stats': {
			'constructspeed': 100,
			'cabinproductionbonus': 30
		}
	},
	'barracks': {
		'key': 'b',
		'loukey': 'b',
		'name': 'Barracks',
		'stats': {
			'armysize': 1000,
			'enlistmentspeedbonus': 25
		}
	},
	'guardhouse': {
		'key': 'u',
		'loukey': 'k',
		'name': 'Guardhouse',
		'stats': {
			'guardenlistmentspeed': 150
		}
	},
	'arena': {
		'key': 't',
		'loukey': 'g',
		'name': 'Training Arena',
		'stats': {
			'infenlistmentspeed': 150
		}
	},
	'academy': {
		'key': 'y',
		'loukey': 'z',
		'name': 'Academy',
		'stats': {
			'sacredenlistmentspeed': 150
		}
	},
	'castle': {
		'key': 'x',
		'loukey': 'x',
		'name': 'Castle',
		'stats': {
			'armysizeexpon': 300
		}
	},
	'shipyard': {
		'key': 'y',
		'loukey': 'v',
		'name': 'Shipyard',
		'stats': {
			'navyenlistmentspeed': 150
		}
	},
	'stable': {
		'key': 'e',
		'loukey': 'e',
		'name': 'Stable',
		'stats': {
			'cavenlistmentspeed': 150
		}
	},
	'blacksmith': {
		'key': 'k',
		'loukey': 'y',
		'name': 'Blacksmith',
		'stats': {
			'artienlistmentspeed': 150
		}
	},
	'sorctower': {
		'key': 'w',
		'loukey': 'j',
		'name': 'Sorcerers Tower',
		'stats': {
			'mysticenlistmentspeed': 150
		}
	}

}

// reference object for hotkeys
var hotkeys = {
	1: 'forest',
	2: 'stone',
	3: 'iron',
	4: 'lake',
	o: "port",
	f: 'foresters',
	s: 'stonemine',
	i: 'ironmine',
	a: 'farm',
	v: 'villa',
	l: 'sawmill',
	h: 'masons',
	z: 'smelter',
	g: 'grainmill',
	m: 'forum',
	r: 'storehouse',
	q: 'hide',
	c: 'cabin',
	b: 'barracks',
	u: 'guardhouse',
	t: 'arena',
	y: 'academy',
	x: 'castle',
	p: 'shipyard',
	e: 'stable',
	k: 'blacksmith',
	w: 'sorctower'
}

// reference object for lou sharestrings
var louhotkeys = {
	'.': 'forest',
	':': 'stone',
	',': 'iron',
	';': 'lake',
	'r': "port",
	'2': 'foresters',
	'3': 'stonemine',
	'4': 'ironmine',
	'1': 'farm',
	'u': 'villa',
	'l': 'sawmill',
	'a': 'masons',
	'd': 'smelter',
	'm': 'grainmill',
	'p': 'forum',
	's': 'storehouse',
	'h': 'hide',
	'c': 'cabin',
	'b': 'barracks',
	'k': 'guardhouse',
	'g': 'arena',
	'z': 'academy',
	'x': 'castle',
	'v': 'shipyard',
	'e': 'stable',
	'y': 'blacksmith',
	'j': 'sorctower'
}

