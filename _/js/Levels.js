/**
 * @author Dan
 */

var Levels = function() {
	var red = "0xEE0000";
	var blue = "0x0000EE";
	var green = "0x00EE00";
	var yellow = "0xEEEE00";
	var cyan = "0x00EEEE";
	var magenta = "0xEE00EE";
	var dirtyWhite = "0xEEEEEE";
	
	var levels = [];

	var level1 = Level([CustomCube({
		r : 35,
		color : red,
		position : new THREE.Vector3(-150, -100, 0)
	}),
	CustomCube({
		r: 35,
		color : green,
		position : new THREE.Vector3(0,-100,0)
	}),
	CustomCube({
		r: 35,
		color : blue,
		position : new THREE.Vector3(150, -100, 0)
	})
	]);
	
	var level2 = Level([CustomCube({
		r : 35,
		color : red,
		position : new THREE.Vector3(-150, -100, 0)
	}),
	CustomCube({
		r: 35,
		color : blue,
		position : new THREE.Vector3(0,-100,0)
	}),
	CustomCube({
		r: 35,
		color : green,
		position : new THREE.Vector3(150, -100, 0)
	})
	]);
	
	level2.setMessageBox(
		MessageBox({
			title: "This level looks a bit different&hellip;",
			content: '<p>If you try jumping onto one of those outlined boxes, you&apos;ll fall right through!</p><p style="font-weight: bold">Click and drag on any of the three spotlights above to reposition them!</p>',
			okayLabel: "Continue"
		})
	);
	
	var level3 = Level([CustomCube({
		r : 35,
		color : red,
		position : new THREE.Vector3(-150, -100, 0)
	}),
	CustomCube({
		r: 35,
		color : red,
		position : new THREE.Vector3(-100,-100,0)
	}),
	CustomCube({
		r: 35,
		color : red,
		position : new THREE.Vector3(-50,-100,0)
	}),
	CustomCube({
		r: 35,
		color : red,
		position : new THREE.Vector3(0,-100,0)
	}),
	CustomCube({
		r: 35,
		color : red,
		position : new THREE.Vector3(50,-100,0)
	}),
	CustomCube({
		r: 35,
		color : red,
		position : new THREE.Vector3(100,-100,0)
	}),
	CustomCube({
		r: 35,
		color : red,
		position : new THREE.Vector3(150, -100, 0)
	})
	]);
	
	level3.setMessageBox(
		MessageBox({
			title: "Color &amp; Coordination",
			content: '<p>Looks like you have to cross a series of red cubes.</p><p style="font-weight: bold">Try dragging the red spotlight as you move to the right!</p>',
			okayLabel: "Continue"
		})
	);
	
	var level4 = Level([CustomCube({
		r : 25,
		color : 0xEE0000,
		position : new THREE.Vector3(-200, -100, 0)
	}), CustomCube({
		r : 15,
		color : 0x0000EE,
		position : new THREE.Vector3(0, -50, 0)
	}), CustomCube({
		r : 10,
		color : 0x00EE00,
		position : new THREE.Vector3(50, 50, 0)
	}), CustomCube({
		r : 25,
		color : 0x0000EE,
		position : new THREE.Vector3(200, 25, 0)
	})]);
	
	level4.setMessageBox(
		MessageBox({
			title: "Jump to Conclusions",
			content: '<p>Reposition the lights and then <span style="font-weight: bold"> press the Jump key/s twice to double-jump!</span></p>',
			okayLabel: "Continue"
		})
	);
	
	var level5 = Level([CustomCube({
		r : 35,
		color : red,
		position : new THREE.Vector3(-150, -100, 0)
	}),
	CustomCube({
		r: 35,
		color : red,
		position : new THREE.Vector3(125, -100, 0)
	})
	]);
	
	level5.setMessageBox(
		MessageBox({
			title: "A Leap of Insanity",
			content: '<p>Look, this level&hellip;it ain&apos;t easy, don&apos;t say we didn&apos;t warn you.</p><p>Try starting your first jump just as you fall off the red cube.</p><p style="font-weight: bold">Also, make sure you&apos;re dragging on the light before you make your move!</p>',
			okayLabel: "Continue"
		})
	);
	
	var level6 = Level([CustomCube({
		r : 35,
		color : red,
		position : new THREE.Vector3(-150, -50, 0)
	}),
	CustomCube({
		r: 35,
		color : blue,
		position : new THREE.Vector3(50, -50, 0)
	}),
	CustomCube({
		r: 50,
		color : red,
		position : new THREE.Vector3(150, -50, 0)
	}),
	CustomCube({
		r: 10,
		color : red,
		position : new THREE.Vector3(150, -150, 0)
	})
	]);
	
	level6.setMessageBox(
		MessageBox({
			title: "Occlusions",
			content: '<p>Light goes through unlit blocks, but is stopped by solid blocks.  Use this knowledge to continue your journey</p>',
			okayLabel: "Continue"
		})
	);
	
	var level7 = Level([CustomCube({
		r : 35,
		color : red,
		position : new THREE.Vector3(-150, -100, 0)
	}),
	CustomCube({
		r: 35,
		color : yellow,
		position : new THREE.Vector3(0,-10,0)
	}),
	CustomCube({
		r: 35,
		color : magenta,
		position : new THREE.Vector3(150, -100, 0)
	})
	]);
	
	level7.setMessageBox(
		MessageBox({
			title: "Putting it all together",
			content: '<p>Light can be combined - use your knowledge of colors to pass this level</p>',
			okayLabel: "Continue"
		})
	);

	var level8 = Level([CustomCube({
		r : 35,
		color : red,
		position : new THREE.Vector3(-180, -100, 0)
	}),
	CustomCube({
		r: 35,
		color : dirtyWhite,
		position : new THREE.Vector3(-20,-80,0)
	}),
	CustomCube({
		r: 25,
		color : magenta,
		position : new THREE.Vector3(42,0,0)
	}),
	CustomCube({
		r: 35,
		color : yellow,
		position : new THREE.Vector3(118, 40, 0)
	})
	]);
	
	level8.setMessageBox(
		MessageBox({
			title: "@#$%^&*!!!",
			content: '<p>Save the expletives, compadre. From here on out, you&apos;re gonna have to earn it.</p><p style="font-weight: bold">Keep going!</p>',
			okayLabel: "Continue"
		})
	);

	var level9 = Level([CustomCube({
		r : 35,
		color : red,
		position : new THREE.Vector3(-150, -100, 0)
	}),
	CustomCube({
		r: 35,
		color : yellow,
		position : new THREE.Vector3(0,-10,0)
	}),
	CustomCube({
		r: 30,
		color : green,
		position : new THREE.Vector3(90,-30,0)
	}),
	CustomCube({
		r: 35,
		color : dirtyWhite,
		position : new THREE.Vector3(175, -100, 0)
	})
	]);
	
	var level10 = Level([CustomCube({
		r : 35,
		color : red,
		position : new THREE.Vector3(-180, -80, 0)
	}),
	CustomCube({
		r: 35,
		color : dirtyWhite,
		position : new THREE.Vector3(-90,0,0)
	}),
	CustomCube({
		r: 35,
		color : magenta,
		position : new THREE.Vector3(-10,40,0)
	}),
	CustomCube({
		r: 35,
		color : cyan,
		position : new THREE.Vector3(100, 10, 0)
	}),
	CustomCube({
		r: 35,
		color : yellow,
		position : new THREE.Vector3(90, -130, 0)
	}),
	CustomCube({
		r: 35,
		color : dirtyWhite,
		position : new THREE.Vector3(210, -110, 0)
	})
	]);
	
	var level11 = Level([CustomCube({
		r : 20,
		color : red,
		position : new THREE.Vector3(-190, -50, 0)
	}),
	CustomCube({
		r: 20,
		color : dirtyWhite,
		position : new THREE.Vector3(-75,80,0)
	}),
	CustomCube({
		r: 20,
		color : dirtyWhite,
		position : new THREE.Vector3(75,80,0)
	}),
	CustomCube({
		r: 20,
		color : dirtyWhite,
		position : new THREE.Vector3(-100,-90,0)
	}),
	CustomCube({
		r: 20,
		color : dirtyWhite,
		position : new THREE.Vector3(0, -120, 0)
	}),
	CustomCube({
		r: 20,
		color : dirtyWhite,
		position : new THREE.Vector3(100, -90, 0)
	}),
	CustomCube({
		r: 20,
		color : dirtyWhite,
		position : new THREE.Vector3(190, -50, 0)
	})
	]);
	
	var level12 = Level([CustomCube({
		r : 35,
		color : dirtyWhite,
		position : new THREE.Vector3(-150, -100, 0)
	}),
	CustomCube({
		r: 35,
		color : dirtyWhite,
		position : new THREE.Vector3(125, -100, 0)
	})
	]);
	
	level12.setMessageBox(
		MessageBox({
			title: "The End",
			content: '<p>You made it this far, huh?  Let us know if you beat this level!</p>',
			okayLabel: "Continue"
		})
	);
	
	levels.push(level1);
	levels.push(level2);
	levels.push(level3);
	levels.push(level4);
	levels.push(level5);
	levels.push(level6);
	levels.push(level7);
	levels.push(level8);
	levels.push(level9);
	levels.push(level10);
	levels.push(level11);
	levels.push(level12);

	return levels;
};
