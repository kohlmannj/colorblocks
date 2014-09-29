var LEFT_ARROW_PRESSED  = false;
var RIGHT_ARROW_PRESSED = false;
var DOWN_ARROW_PRESSED = false;

$(document).bind('keydown', 'left', function() {LEFT_ARROW_PRESSED = true;});
$(document).bind('keydown', 'right', function() {RIGHT_ARROW_PRESSED = true;});
$(document).bind('keydown', 'down', function() {DOWN_ARROW_PRESSED = true;});
$(document).bind('keyup', 'left', function() {LEFT_ARROW_PRESSED = false;});
$(document).bind('keyup', 'right', function() {RIGHT_ARROW_PRESSED = false;});
$(document).bind('keyup', 'down', function() {DOWN_ARROW_PRESSED = false;});

$(document).bind('keydown', 'a', function() {LEFT_ARROW_PRESSED = true;});
$(document).bind('keydown', 'd', function() {RIGHT_ARROW_PRESSED = true;});
$(document).bind('keydown', 's', function() {DOWN_ARROW_PRESSED = true;});
$(document).bind('keyup', 'a', function() {LEFT_ARROW_PRESSED = false;});
$(document).bind('keyup', 'd', function() {RIGHT_ARROW_PRESSED = false;});
$(document).bind('keyup', 's', function() {DOWN_ARROW_PRESSED = false;});

var projector;
var camera;

$(document).ready(function() {
	// Just in case!
	var winnerMessage = MessageBox({
		title: "You Won!!!",
		content: '<p style="font-weight: bold">Congrats, you beat every level we threw at you!</p><p>You&apos;re awesome! Go find one of us&mdash;we&apos;d like to shake your hand! :-)</p>',
		okayLabel: "Cool!"
	});
	
	var /*camera, */scene, renderer;// , projector;
	
	var red = "0xEE0000";
	var blue = "0x0000EE";
	var green = "0x00EE00";
	
	var yOffset = 163; //offset of the spotlight
	
	var spotlights = [];
	var spotlightMeshes = [];
	
	var cubeVelocity = 1;
	
	var initialRotationAngle;
	var clickedOnObj;
	
	var mousePosition;
	var mousebuttonDown = false;
	var startMouseX;
	var lastDeltaX;
	var currentSpotlight;
	
	var clickedOnObj;

	var images = {};
	
	var player;
	playerSize = 60;
	var gravity = .098;
	var playerInitPosition = new THREE.Vector3(-180,0,0);
	
	var levelExit;
	var renderWidth = 853, renderHeight = 480;
	
	var levels = Levels();
	
	var currentLevelIndex = 0;
	var currentLevel = levels[currentLevelIndex];
	
	// For message boxes.
	var showHints = true;
	
 	loadImages();
	init();
	animate();
	
	function init() {
		camera = new THREE.PerspectiveCamera(45, renderWidth / renderHeight, 1, 10000);
		
		camera.rotation.x = 0;
		camera.rotation.y = 0;
		camera.rotation.z = 0;
		camera.position.z = 400;
		scene = new THREE.Scene();
		
		// Mouse starts in the center.
		mousePosition = new THREE.Vector3(0,0,camera.position.z);
		
		//initialize all the geometry and materials we will need
		initSpotlights();
		
		//init the player
		player = new Player(playerInitPosition, playerSize, renderHeight);
		
		//new THREE.Particle(playerObj.vertex, playerObj.material);
		//playerMesh.scale.x = playerMesh.scale.y = playerMesh.scale.z = 5;
        
        $(document).bind('keydown', 'space', function(){player.jump();});
		$(document).bind('keydown', 'w', function(){player.jump();});
		$(document).bind('keydown', 'up', function(){player.jump();});
        
        scene.add( player.mesh );
		
		//Add some light		
		ambientLight = new THREE.AmbientLight(0xFFFFFF);
		//ambientLight.intensity = 2;
		scene.add(ambientLight);
		pointLight = new THREE.PointLight(0xffffff);
		pointLight.position.z = 600;
		scene.add(pointLight);
		
		//projector
		projector = new THREE.Projector();

		renderer = new THREE.WebGLRenderer();
		renderer.setClearColorHex(0x222222);
		renderer.setSize(renderWidth, renderHeight);
		// Add an identifier to the renderer's DOM element.
		renderer.domElement.id = "renderCanvas";
		
		document.body.appendChild(renderer.domElement);
	}
	
	function initSpotlights() {
		spotlights.push(LightBeam({
			color: red,
			// debug: true,
			position: new THREE.Vector3(-150, 125, 0),
			scene: scene,
			texture : new THREE.Texture(images.spot4)
		}));
		
		spotlights.push(LightBeam({
			color: green,
			// debug: true,
			position: new THREE.Vector3(0, 125, 0),
			scene: scene,
			texture : new THREE.Texture(images.spot4)
		}));
		
		spotlights.push(LightBeam({
			color: blue,
			// debug: true,
			position: new THREE.Vector3(150, 125, 0),
			scene: scene,
			texture : new THREE.Texture(images.spot4)
		}));
	}
	
	currentLevel.addToScene(scene);
	var hasMessage = currentLevel.showMessageBox();
	if (showHints && hasMessage) {
		$("#hintButton").show().click(currentLevel.showMessageBox);
	} else {
		$("#hintButton").hide();
	}
	
	function initializeNewLevel() {
		// // Remove the old level.
		
		currentLevel.removeFromScene(scene);
		
		// Add the new level (if there are more).
		currentLevelIndex++;
		if (currentLevelIndex < levels.length) {
			currentLevel = levels[currentLevelIndex];
			currentLevel.addToScene(scene);
			
			// Reposition the player.
			player.mesh.position.set(playerInitPosition.x, playerInitPosition.y, playerInitPosition.z);
			
			//reposition the lights
			for(var i = 0; i < spotlights.length; i++) {
				spotlights[i].setAngleDegrees(90);
			}
			
			// Display the Level's message if there is one.
			if (showHints) {
				var hasMessage = currentLevel.showMessageBox();
				if (hasMessage) {
					$("#hintButton").show().click(currentLevel.showMessageBox);
				} else {
					$("#hintButton").hide();
				}
			} else {
				$("#hintButton").hide();
			}
		} else {
			// YOU WON!!!!
			winnerMessage();
		}
	}
	
	function animate() {
		camera.lookAt( scene.position );
		
		//now update the player based on key strokes
        if(RIGHT_ARROW_PRESSED && !LEFT_ARROW_PRESSED)
        	//player.velocity.x += 0.5;
            player.moveRight();
                 
		if(LEFT_ARROW_PRESSED && !RIGHT_ARROW_PRESSED)
        	//player.velocity.x -= 0.5;
            player.moveLeft();
               
		if(DOWN_ARROW_PRESSED)
        	//player.velocity.y -=.01;
        	player.moveDown();
		
		for (var i = 0; i < currentLevel.meshes.length; i++) {
			currentLevel.meshes[i].fullReset();
		}
		
		for (var i = 0; i < spotlights.length; i++) {
			spotlights[i].lightAccumulate();
		}
		
		for (var i = 0; i < currentLevel.meshes.length; i++) {
			currentLevel.meshes[i].animate();
		}
		
		for (var i = 0; i < spotlights.length; i++) {
			spotlights[i].animate();
		}
		
		for (var i = 0; i < currentLevel.meshes.length; i++) {
			currentLevel.meshes[i].deAnimate();
			
		}
		
		player.update(gravity);
		player.collisions(currentLevel.meshes);
		
		if (currentLevel.exit.endLevelCheck(player)) {
			initializeNewLevel();
		};
		requestAnimationFrame(animate);
		
		playerBackupMesh = player.mesh.position.clone();
		player.mesh.position.set(player.mesh.position.x, player.mesh.position.y - playerSize*.58, player.mesh.position.z);
		render();
		player.mesh.position = playerBackupMesh;
	}

	function render() {
		renderer.render(scene, camera);
	}
	
	// Allows the user to click and drag on a spotlight to change its rotation.	
	if ($.browser.safari || $.browser.chrome) {
		$("#renderCanvas").css("background", "#96A9B7");
	}
	
	$("#renderCanvas").mousemove(function(e) {
		if (mousebuttonDown) {
			
			var relativeX = e.pageX - this.offsetLeft;
	        var relativeY = e.pageY - this.offsetTop;

			// Convert canvas-relative coordinates to WebGL world coordinates.
			var newMousePosition = new THREE.Vector3( (relativeX / renderWidth) * 2 - 1, - (relativeY / renderHeight) * 2 + 1, 0 );
			projector.unprojectVector( newMousePosition, camera );
			// mousePosition.set(newMousePosition.x, newMousePosition.y);
			
			// See if there's an intersection between mouse and a spotlight.
			var ray = new THREE.Ray( camera.position, newMousePosition.subSelf( camera.position ).normalize() );
			
			if (currentSpotlight == null) {
				for (var i = 0; i < spotlights.length; i++) {
					var spotlightMeshes = spotlights[i].getMeshObjects();
				
					var intersects = ray.intersectObjects( spotlightMeshes );
				
					if (intersects.length > 0 && spotlights[i].allowsUserRotation()) {
						currentSpotlight = spotlights[i];
						break;
						// console.log("Spotlight " + i + " has been clicked on");
					}
				}
			} else {
				var deltaX = startMouseX - relativeX;
				currentSpotlight.addAngleDegrees(deltaX - lastDeltaX);
				startMouseX = relativeX;
				// if (deltaX > 0) {
				// 	currentSpotlight.addAngleDegrees(1);
				// } else if (deltaX < 0) {
				// 	currentSpotlight.addAngleDegrees(-1);
				// }
			}
			
			// console.log("Mouse at (" + relativeX + ", " + relativeY + ") --> (" + newMousePosition.x + ", " + newMousePosition.y + ")");
		}
		
    }).mousedown(function(e) {
		e.preventDefault();
		mousebuttonDown = true;
		startMouseX = e.pageX - this.offsetLeft;
		currentSpotlight = null;
		lastDeltaX = 0;
	}).mousewheel(function(e, delta) {
		if (delta > 0 && camera.position.z < 600) {
			camera.position.z += delta * 4.0;
		} else if (delta < 0 && camera.position.z > 400) {
			camera.position.z += delta * 4.0;
		}
	});
	$(document).mouseup(function(e) {
		// e.preventDefault();
		mousebuttonDown = false;
		currentSpotlight = null;
		lastDeltaX = 0;
	});
	
	// Message Boxes!
	
	var welcomeMessage = MessageBox({
		title: "Welcome to ColorBlocks!",
		content: '<img src="_/images/playerLB.png" alt="Image of Player Spaceship moving to the right." style="float: left; margin: 0 8px 0 0"><img src="_/images/playerRB.png" alt="Image of Player Spaceship moving to the left." style="float: right; margin: 0 0 0 8px"><p>Okay, so you&apos;re the rocket ship.</p><p style="font-weight: bold">Reach the exit (the gold rectangle) and warp to the next level!</p><p>First time playing? You should check out the controls.</p><img src="_/images/playerB.png" alt="Image of Player Spaceship moving up." style="display: inline-block;">',
		buttons: [
			{
				name: "Controls",
				action: function() {
					controlsMessage();
				}
			},
			{
				name: "Credits",
				action: function() {
					creditsMessage();
				}
			},
			{
				name: "Play w/o Hints!",
				title: "Played a few times already? That's cool by us.",
				action: function() {
					showHints = false;
					$(".message").fadeOut();
				}
			}
		],
		okayLabel: "Play Game!"
	});
	
	$("#welcomeButton").click(welcomeMessage);
	
	var controlsMessage = MessageBox({
		title: "ColorBlocks Controls",
		content: '<img src="_/images/controls.png" style="display: block; margin: 0 auto;">',
		buttons: [
			{
				name: "Return",
				action: function() {
					welcomeMessage();
				}
			}
		],
		okayLabel: "Play Game!"
	});
	
	var creditsMessage = MessageBox({
		title: "ColorBlocks Credits",
		content: '<dl><dt>Game</dt><dd>Joe Kohlmann, Dan Szafir, Sam Wasmundt</dd><dt>Technologies</dt><dd><a href="http://jquery.com/">jQuery</a>, <a href="https://github.com/mrdoob/three.js/">Three.js</a></dd><dt>Special Thanks</dt><dd>bai and chandlerp on <a href="irc://irc.freenode.net#three.js">irc.freenode.net#three.js</a></dd></dl><dl><dt>License</dt><dd><a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">ColorBlocks</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://kohlmannj.github.io/colorblocks" property="cc:attributionName" rel="cc:attributionURL">Joe Kohlmann, Dan Szafir, Sam Wasmundt</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.</dd></dl>',
		buttons: [
			{
				name: "Return",
				action: function() {
					welcomeMessage();
				}
			}
		],
		okayLabel: "Play Game!"
	});
	
	welcomeMessage();
	
	// Load Images Stuff
	
	function loadImages() {

		var loadedImages = 0, numImages = 0;

		var imageSrc = {
			spot : '_/images/spot.png',
			spot2: '_/images/spot2.jpg',
			spot3: '_/images/spot3.jpg',
			spot4: '_/images/spot4.png',
			spotLine : '_/images/spotLine.png',
			spotLineAlpha : '_/images/spotLineAlpha.png',
			envMapTop : '_/images/envMapTop.png',
			envMapBottom : '_/images/envMapBottom.png',
			envMapFrontBack : '_/images/envMapFrontBack.png',
			envMapLeftRight : '_/images/envMapLeftRight.png',
		};

		for(var src in imageSrc ) {
			numImages++;

			images[src] = new Image();
			images[src].src = imageSrc[src];
		}
	};
});
