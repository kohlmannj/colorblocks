var Level = function(objects) {
	var that = {};
	
	// For visibility and access purposes.
	var allMeshes = [];
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].hasOwnProperty("mesh")) {
			allMeshes.push(objects[i].mesh);
		} else if (objects[i].hasOwnProperty("geometry") && objects[i].hasOwnProperty("position")) {
			allMeshes.push(objects[i]);
		}
	}
	
	that.meshes = allMeshes;
	
	var tempSize = playerSize * .25;
	that.exit = new Exit(tempSize, tempSize*2, tempSize*3);
	// Place the exit above the last cube.
	var lastCube = objects[objects.length - 1];
	that.exit.setPosition(lastCube.position.x, lastCube.position.y + lastCube.settings.h / 2 + tempSize, 0);
	// objects.push(theExit);
	
	that.addToScene = function(scene) {
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].hasOwnProperty("addToScene")) {
				// Handles CustomCube objects
				objects[i].addToScene(scene);
			} else if (objects[i].hasOwnProperty("geometry") && objects[i].hasOwnProperty("position")) {
				// Handles Mesh objects (by "duck" typing)
				scene.add(objects[i]);
			}
		}
		// Don't forget to add the Exit.
		scene.add(that.exit.door);
	};
	
	that.removeFromScene = function(scene) {
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].hasOwnProperty("removeFromScene")) {
				// Handles CustomCube objects
				objects[i].removeFromScene(scene);
			} else if (objects[i].hasOwnProperty("geometry") && objects[i].hasOwnProperty("position")) {
				// Handles Mesh objects (by "duck" typing)
				scene.remove(objects[i]);
			}
		}
		// Don't forget to add the Exit.
		scene.remove(that.exit.door);
	};
	
	that.playerIsInExit = function(player) {
		var playerPosition = player.mesh.position;
		console.log(playerPosition);
	};
	
	var messageBox = null;
	
	that.setMessageBox = function(message) {
		messageBox = message;
	}
	
	that.showMessageBox = function() {
		if (messageBox != null) {
			messageBox();
		}
		return messageBox != null;
	}
	return that;
}
