// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var LightBeam = function(options) {
	var that = {};
	var theAngleDirection = 1;
	if (Math.random()) theAngleDirection = -1;
	// Handle options and (default) settings.
	var settings = {
		color: 0xffff00,
		angleDegrees: 90,
		angleMovementRadius: 60,
		angleSpreadRadius: 10,
		angleStep: 1,
		debug: false,
		defaultEndDistance: 600,
		position: new THREE.Vector3(0,100,0),
		scene: undefined,
		swing: false,
		swingStep: 0.1,
		texture: undefined
	};
	// A bit of jQuery magic to merge options with settings.
	jQuery.extend(settings, options);
	
	var originalAngle = settings.angleDegrees;
	
	var rays = [];
	var geometry = new THREE.Geometry();
	// Create the mesh, which we'll dynamically update below.
	settings.texture.needsUpdate = true;
	//Light Material
	var material = new THREE.MeshBasicMaterial({
		//map : settings.texture,
		color : settings.color,
		blending : THREE.AdditiveBlending,
		transparent : true,
		shading : THREE.SmoothShading
	});
	
	var mesh = new THREE.Mesh( geometry, material );
	
	/*var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {
		color: settings.color,
		opacity: 0.85,
		blending : THREE.AdditiveBlending,
		map : settings.texture
	} ) );*/
	
	var spotlight;
	
	var directionalLight;
	
	var colorsEqual = function(color1, color2) {
		return color1.r == color2.r && color1.g == color2.g &&
			color1.b == color2.b;
	};
	
	var hasEnoughColorFor = function(availableColor, targetColor) {
		var deltaR = availableColor.r - targetColor.r;
		var deltaG = availableColor.g - targetColor.g;
		var deltaB = availableColor.b - targetColor.b;
		
		return (deltaR >= 0) && (deltaG >= 0) && (deltaB >= 0);
	}
	
	that.intersectsWith = function(ray) {
		return (ray.intersectObject(mesh).length > 0) || (ray.intersectObject(spotlight).length > 0);
	}
	// that.lightMesh = mesh;
	// that.spotMesh = spotlight;
	
	that.isValidAngleDegrees = function(newAngleDegrees) {
		return newAngleDegrees <= originalAngle + settings.angleMovementRadius && newAngleDegrees >= originalAngle - settings.angleMovementRadius;
	}
	
	that.setAngleDegrees = function(newAngleDegrees) {
		if (newAngleDegrees > originalAngle + settings.angleMovementRadius) {
			// Set to maximum angle if newAngleDegrees overshoots.
			newAngleDegrees = originalAngle + settings.angleMovementRadius;
		} else if (newAngleDegrees < originalAngle - settings.angleMovementRadius) {
			// Set to minimum angle if newAngleDegrees undershoots.
			newAngleDegrees = originalAngle - settings.angleMovementRadius;
		}
		
		settings.angleDegrees = newAngleDegrees;
		if (spotlight) {
			spotlight.rotation.z = (-newAngleDegrees + 90) * Math.PI/180;
		}
		// }
	};
	
	that.allowsUserRotation = function() {
		return ! settings.swing;
	};
	
	that.addAngleDegrees = function(newDeltaDegrees) {
		var newAngleDegrees = settings.angleDegrees + newDeltaDegrees;
		that.setAngleDegrees(newAngleDegrees);
		// if (that.isValidAngleDegrees(newAngleDegrees)) {
		// 			settings.angleDegrees = newAngleDegrees;
		// 			if (spotlight) {
		// 				spotlight.rotation.z = (-newAngleDegrees + 90) * Math.PI/180;
		// 			}
		// 		}
	};
	
	that.currentAngle = function() {
		return settings.angleDegrees;
	}
	
	var getColliderMeshes = function() {
		var colliderMeshes = [];
		for (var i = 0; i < THREE.Collisions.colliders.length; i++) {
			colliderMeshes.push(THREE.Collisions.colliders[i].mesh);
		}
		return colliderMeshes;
	}
	
	var intersectionsArray = [];
	
	that.lightAccumulate = function() {
		// Clear out intersectionsArray.
		intersectionsArray = [];
		// // Debugging (or swinging): move the angle.
		if (settings.debug || settings.swing) {
			if (settings.angleDegrees == (originalAngle + settings.angleMovementRadius) || settings.angleDegrees == (originalAngle - settings.angleMovementRadius)) {
				theAngleDirection = -theAngleDirection;
			}
			that.setAngleDegrees(settings.angleDegrees + theAngleDirection * settings.swingStep);
		}
		
		var tempColor = new THREE.Color(settings.color);
		
		var colliderMeshes = getColliderMeshes();
		
		for (var i = 0; i < rays.length; i++) {
			// console.log("For every ray...");
			var theRay = rays[i];
			var theNewAngle = settings.angleDegrees + theRay.deltaAngleDegrees;
			theRay.direction.set(Math.cos(theNewAngle * Math.PI/180), -Math.sin(theNewAngle * Math.PI/180), 0);
			
			var intersections = theRay.intersectObjects(colliderMeshes);
			intersectionsArray.push(intersections);
			
			// Okay, assuming light hits this mesh, how much light?
			if (intersections.length > 0) {
				// console.log("...and its collisions...");
				for (var j = 0; j < intersections.length; j++) {
					var theMesh = intersections[j].object;
					
					if (tempColor.r > 0) {
						theMesh.lightColor.r = 1;
					}
					if (tempColor.g > 0) {
						theMesh.lightColor.g = 1;
					}
					if (tempColor.b > 0) {
						theMesh.lightColor.b = 1;
					}
				}
			}
		}
	}
	
	that.animate = function() {
		// Iterate through each ray and see if it collides with anything.
		// If it does collide, reposition the end point it's keeping track of
		// so that the light beam mesh is occulded by the colliding object/s.
		var tempColor = new THREE.Color(settings.color);
		
		mesh.geometry.__dirtyVertices = true;
		if (settings.debug && theRay.hasOwnProperty("theLine")) {
			theRay.theLine.geometry.__dirtyVertices = true;
		}
		
		for (var i = 0; i < rays.length; i++) {
			var theRay = rays[i];
			
			var updatedRayEnd = false;
			
			var intersections = intersectionsArray[i];
			
			if (intersections == undefined) {
				console.log(intersectionsArray);
			}
			
			// Determine (again!) what's intersecting with this object.
			if (intersections.length > 0) {
				for (var j = 0; j < intersections.length; j++) {
					var theMesh = intersections[j].object;
					
					if (! theMesh.isTransparent) {
						if (tempColor.r > 0) {
							theMesh.lightColor.r = 1;
						}
						if (tempColor.g > 0) {
							theMesh.lightColor.g = 1;
						}
						if (tempColor.b > 0) {
							theMesh.lightColor.b = 1;
						}
						
						// Update the spotlight mesh.
						mesh.geometry.__dirtyVertices = true;
						
						var pointOfImpact = new THREE.Vector3(0,0,0).addSelf( theRay.direction.clone().multiplyScalar( intersections[j].distance ) );
						theRay.endPt.set(pointOfImpact.x, pointOfImpact.y, 0);
						updatedRayEnd = true;
						
						// That's it.
						break;
					}
				}
			}
			
			if (! updatedRayEnd) {
				var newEndPt = new THREE.Vector3(0,0,0).clone().addSelf( theRay.direction.clone().multiplyScalar(settings.defaultEndDistance) );
				theRay.endPt.set(newEndPt.x, newEndPt.y, 0);
			}
			
			mesh.geometry.computeFaceNormals();
		}
	};
	
	var init = function() {
		// Create a directional light.
		directionalLight = new THREE.PointLight(0xffffff);
		directionalLight.position = settings.position;
		directionalLight.intensity = 0.5;
		settings.scene.add(directionalLight);
		
		// Load the spotlight model.
		var loader = new THREE.JSONLoader();
		loader.load( { model: '_/models/Spotlight2.js', callback: function ( modelGeometry ) {
			modelGeometry.computeTangents();

			uniforms = {
					time: { type: "f", value: 1.0 },
					resolution: { type: "v2", value: new THREE.Vector2() }
				};

			red = "0xEE0000";
			blue = "0x0000EE";
			green = "0x00EE00";

			material = new THREE.ShaderMaterial();
			if (settings.color == red) {

			material = new THREE.ShaderMaterial( {
				blending: THREE.AdditiveBlending,
				uniforms: uniforms,
				vertexShader: document.getElementById( 'dansVertexShader' ).textContent,
				fragmentShader: document.getElementById( 'dansRedFragmentShader' ).textContent,
				color: 0xee22aa,
				fog: true,
				wireframe: false,
				wireframe_linewidth: 20,
				//transparent: true
			} );
			}
			else if (settings.color == green) {
				material = new THREE.ShaderMaterial( {
				blending: THREE.AdditiveBlending,
				uniforms: uniforms,
				vertexShader: document.getElementById( 'dansVertexShader' ).textContent,
				fragmentShader: document.getElementById( 'dansGreenFragmentShader' ).textContent,
				color: 0xee22aa,
				fog: true,
				wireframe: false,
				wireframe_linewidth: 20,
				//transparent: true
			} );
			}
			else {
				material = new THREE.ShaderMaterial( {
				blending: THREE.AdditiveBlending,
				uniforms: uniforms,
				vertexShader: document.getElementById( 'dansVertexShader' ).textContent,
				fragmentShader: document.getElementById( 'dansBlueFragmentShader' ).textContent,
				color: 0xee22aa,
				fog: true,
				wireframe: false,
				wireframe_linewidth: 20,
				//transparent: true
			} );
			}

			spotlight = new THREE.Mesh( modelGeometry, material);//new THREE.MeshFaceMaterial() );
			spotlight.position = settings.position;
			// spotlight.rotation.x = spotlight.rotation.y = spotlight.rotation.z = 0;
			// spotlight.rotation.x = settings.angleDegrees * Math.PI/180;
			spotlight.scale.x = spotlight.scale.y = spotlight.scale.z = 15;
			spotlight.matrixAutoUpdate = true;
			spotlight.updateMatrix();
			settings.scene.add(spotlight);
		} } );
		
		// Start the geometry off with the initial position of the light.
		geometry.vertices.push( new THREE.Vertex(new THREE.Vector3(0,0,0)) );
		// Then create several rays.
		
		var zValue = 0;
		
		for (var i = -settings.angleSpreadRadius; i <= settings.angleSpreadRadius; i += settings.angleStep) {
			var theAngle = settings.angleDegrees + i;
			var theDirection = new THREE.Vector3(Math.cos(theAngle * Math.PI/180), -Math.sin(theAngle * Math.PI/180), 0);
			var theRay = new THREE.Ray(settings.position, theDirection);
			theRay.angleDegrees = settings.angleDegrees;
			theRay.deltaAngleDegrees = i;
			// theRay.angle = i;
			
			// if (theAngle > settings.angleDegrees) {
			// 	zValue -= 3;
			// } else {
			// 	zValue += 3;
			// }
			
			// Then project where their end points would be, using settings.defaultEndDistance.
			theRay.zValue = zValue;
			theRay.endPt = new THREE.Vector3(0,0,0).addSelf( theRay.direction.clone().multiplyScalar(settings.defaultEndDistance) );
			// Keep track of this infinity end point so that we don't have to recompute it later...?
			// theRay.infinityEndPt = theRay.endPt.clone();
			geometry.vertices.push( new THREE.Vertex( theRay.endPt ) );
			// Create the necessary faces for the mesh.
			if (geometry.vertices.length > 2) {
				geometry.faces.push( new THREE.Face3( 0, geometry.vertices.length - 1, geometry.vertices.length - 2 ) );
			}
			// Keep track of this ray.
			rays.push(theRay);
			
			// Debug Lines
			if (settings.debug && false) {
				var lineGeo = new THREE.Geometry();
				lineGeo.vertices.push( new THREE.Vertex(settings.position) );
				lineGeo.vertices.push( new THREE.Vertex(theRay.endPt) );
				theRay.theLine = new THREE.Line( lineGeo, new THREE.LineBasicMaterial( {color: settings.color, linewidth: 2} ) );
				theRay.theLine.dynamic = true;
				settings.scene.add(theRay.theLine);
			}
		}
		// Set up the mesh (for success)
		mesh.geometry.dynamic = true;
		mesh.position = settings.position;
		mesh.doubleSided = true;
		settings.scene.add(mesh);
		
		var secondMesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {
			color: settings.color,
			opacity: 10,
			blending : THREE.AdditiveBlending
		} ) );
		secondMesh.geometry.dynamic = true;
		secondMesh.doubleSided = true;
		secondMesh.position = settings.position;
		secondMesh.rotation.y = 90 * Math.PI/180;
		settings.scene.add(secondMesh);
		
		/*var thirdMesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {
			color: settings.color,
			opacity: 0.5,
			blending : THREE.AdditiveBlending,
			map : settings.texture
		} ) );
		thirdMesh.geometry.dynamic = true;
		thirdMesh.doubleSided = true;
		thirdMesh.position = settings.position;
		thirdMesh.rotation.y = -15 * Math.PI/180;
		settings.scene.add(thirdMesh);
		*/
	}
	
	that.getMeshObjects = function() {
		return [mesh, spotlight];
	}
	
	init();
	return that;
};
