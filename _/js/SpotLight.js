/**
 * A SpotLighth object has a base (with geometry and materials)
 * and a beam of light (with geometry and materials)
 * @author Dan
 */

function SpotLight(images, spotLightColor, dY, dX) {

	this.yOffset = dY;
	this.xOffset = dX;
	//Utility functions:
	this.moveVertexY = function(vertices, dy) {
		for(var v = 0; v < vertices.length; v++)
		vertices[v].position.y += dy;
	}
	//----------Base--------//
	this.radius = 8;
	var baseColor = new THREE.Color(0x000000), whiteColor = new THREE.Color(0xFFFFFF), i, il, faces, material;

	// Base Geometry
	this.baseGeometry = new CapsuleGeometry(this.radius, this.radius, this.radius, 16, [0, 1], true, this.radius, 3, true, this.radius, 4);
	this.baseGeometry.dynamic = true;
	faces = this.baseGeometry.faces;

	for( i = 0, il = faces.length; i < il; i++) {
		faces[i].color = baseColor;
	}

	//top of the base that "emits" the light
	for( i = 16 * 3, il = 16 * 4; i < il; i++) {
		faces[i].color = whiteColor;
	}

	var envMap = new THREE.Texture([images.envMapLeftRight, images.envMapLeftRight, images.envMapTop, images.envMapBottom, images.envMapFrontBack, images.envMapFrontBack]);

	envMap.needsUpdate = true;

	//Base Material
	this.baseMaterial = new THREE.MeshBasicMaterial({
		color : 0xFFFFFF,
		vertexColors : THREE.FaceColors,
		//envMap:         envMap,
		reflectivity : 0.4,
		combine : THREE.MultiplyOperation,
		shading : THREE.SmoothShading
	});

	this.base = new THREE.Mesh(this.baseGeometry, this.baseMaterial);

	//-----------Light------------
	//Light Geometry
	//this.spotGeometry = new SpotGeometry(this.radius * 1.5, this.radius * 3, 192);
	//									  base width, end width, height, #times to apply texmap, size of bright center
	this.spotGeometry = new SpotGeometry(this.radius * 2.5, this.radius * 6, 300, 1, 3);
	this.spotGeometry.dynamic = true;

	//      THREE.MeshUtils.createVertexColorGradient( this.spotGeometry, [ 0xFFFFFF, 0x000000 ] );
	this.moveVertexY(this.spotGeometry.vertices, this.radius);

	//possible colors of the light
	this.spotColor = spotLightColor;
	/*[ 0xFF0F0F,
	 0x40FF40,
	 0x4040FF,
	 0xFFFF40,
	 0x40FFFF,
	 0xFF40FF ]*/

	var texture = new THREE.Texture(images.spot4);
	texture.needsUpdate = true;

	//Light Material
	this.spotMaterial = new THREE.MeshBasicMaterial({
		//map : texture,
		color : this.spotColor,
		blending : THREE.AdditiveBlending,
		transparent : true,
		shading : THREE.SmoothShading
	});

	this.light = new THREE.Mesh(this.spotGeometry, this.spotMaterial);

	this.light.doubleSided = true;

	//lower the beam a bit so it looks like it comes from the
	//spotlight.base
	for(var i = 0; i < this.light.geometry.vertices.length; i++) {
		this.light.geometry.vertices[i].position.y -= 20;
	}
	//lengthen the beam a bit
	for(var i = 0; i < 12; i++) {
		if(i % 4 >= 2) {
			this.light.geometry.vertices[i].position.y -= 100;
		}
	}

	this.initialLightYPos = this.light.geometry.vertices[2].position.y;

	//Rays for collision
	//Add the rays used in collision detection
	var rightRayGeometry = new THREE.Geometry();
	rightRayGeometry.vertices.push(new THREE.Vertex(this.light.position));
	rightRayGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(this.light.position.x, this.initialLightYPos, this.light.position.z)));
	this.rightRay = new THREE.Line(rightRayGeometry, new THREE.LineBasicMaterial({
		color : 0xff0000,
		linewidth : 4
	}));

	var leftRayGeometry = new THREE.Geometry();
	leftRayGeometry.vertices.push(new THREE.Vertex(this.light.position));
	leftRayGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(this.light.position.x, this.initialLightYPos, this.light.position.z)));
	this.leftRay = new THREE.Line(leftRayGeometry, new THREE.LineBasicMaterial({
		color : 0xff0000,
		linewidth : 4
	}));

	var centerRayGeometry = new THREE.Geometry();
	centerRayGeometry.vertices.push(new THREE.Vertex(this.light.position));
	centerRayGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(this.light.position.x, this.initialLightYPos, this.light.position.z)));
	this.centerRay = new THREE.Line(centerRayGeometry, new THREE.LineBasicMaterial({
		color : 0xff0000,
		linewidth : 4
	}));

	// set the geometry to dynamic to allow updates
	this.rightRay.dynamic = true;
	this.leftRay.dynamic = true;
	this.centerRay.dynamic = true;

	this.collisions = function(cubes) {
		this.base.geometry.__dirtyVertices = true;
		this.base.geometry.__dirtyNormals = true;
		//spotlight.base.materials[0].envMap.needsUpdate = true;
		
		this.light.geometry.__dirtyVertices = true;
		this.light.geometry.__dirtyNormals = true;
		//spotlight.light.materials[0].map.needsUpdate = true;

		//Collision detection
		this.rightRay.geometry.__dirtyVertices = true;
		this.leftRay.geometry.__dirtyVertices = true;
		this.centerRay.geometry.__dirtyVertices = true;

		var rightAngleDeg = this.base.rotation.z + Math.PI / 48;
		var rightCollision = this.detectCollision(rightAngleDeg, this.rightRay);
		var leftAngleDeg = this.base.rotation.z - Math.PI / 48;
		var leftCollision = this.detectCollision(leftAngleDeg, this.leftRay);
		var centerAngleDeg = this.base.rotation.z;
		var centerCollision = this.detectCollision(centerAngleDeg, this.centerRay);

		//check for a collision amongst all cubes
		for(var i = 0; i < cubes.length; i++) {
			if((rightCollision && rightCollision.mesh == cubes[i] &&
				this.colorsEqual(this.spotMaterial.color, cubes[i].materials[0].color)) || 
				(leftCollision && leftCollision.mesh == cubes[i] &&
				this.colorsEqual(this.spotMaterial.color, cubes[i].materials[0].color)) || 
				(centerCollision && centerCollision.mesh == cubes[i] && 
				this.colorsEqual(this.spotMaterial.color, cubes[i].materials[0].color))) 
			{
				cubes[i].materials[0].wireframe = false;
				//console.log("the opacity is: " + cubes[i].materials[0].opacity);
				//cubes[i].materials[0].opacity = .15;
			} 
			else if (this.colorsEqual(this.spotMaterial.color, cubes[i].materials[0].color)){
				cubes[i].materials[0].wireframe = true;
			}
		}

		//do the occlusion so the light doesn't go through the objects
		//basically all this does is move various verts at the bottom
		//of the light mesh up to the y location of the collision
		if(rightCollision || leftCollision || centerCollision) {
			if(leftCollision) {
				var higherVertex = this.leftRay.geometry.vertices[1].position.y;
				for(var i = 0; i < 12; i++) {
					if(i % 4 == 2) {
						this.light.geometry.vertices[i].position.y = higherVertex - this.yOffset - leftCollision.mesh.radius / 2;

						//should probably offset x too but couldn't figure out how...
						//spotlight.light.geometry.vertices[i].position.x =
						//cube.geometry.vertices[0].position.x + cubeRadius;
					}
				}
			} else {
				for(var i = 0; i < 12; i++) {
					if(i % 4 == 2) {
						this.light.geometry.vertices[i].position.y = this.initialLightYPos;
					}
				}
			}
			if(rightCollision) {
				//v - 3, 7
				for(var i = 0; i < 4; i++) {
					var higherVertex = this.rightRay.geometry.vertices[1].position.y;
					if(i % 4 > 2) {
						this.light.geometry.vertices[i].position.y = higherVertex - this.yOffset - rightCollision.mesh.radius / 2;
					}
				}
			} else {
				for(var i = 0; i < 12; i++) {
					if(i % 4 > 2) {
						this.light.geometry.vertices[i].position.y = this.initialLightYPos;
					}
				}
			}
			if(centerCollision) {
				if(leftCollision) {
					var higherVertex = this.centerRay.geometry.vertices[1].position.y;
					for(var i = 4; i < 12; i++) {
						if(i % 4 >= 2) {
							this.light.geometry.vertices[i].position.y = higherVertex - this.yOffset - leftCollision.mesh.radius / 2;
						}
					}
				}
				if(rightCollision) {
					var higherVertex = this.centerRay.geometry.vertices[1].position.y;
					for(var i = 4; i < 12; i++) {
						if(i % 4 >= 2) {
							this.light.geometry.vertices[i].position.y = higherVertex - this.yOffset - rightCollision.mesh.radius / 2;
						}
					}
				}
			}
		} else {
			for(var i = 0; i < 12; i++) {
				if(i % 4 >= 2) {
					this.light.geometry.vertices[i].position.y = this.initialLightYPos;
				}
			}
		}
		
	}
	
	this.detectCollision = function(angleRad, rayObj)
	{
		var startPos = this.light.position;
		//angleRad = angleDeg * Math.PI / 180;
		ray = new THREE.Ray( startPos, new THREE.Vector3(
			-Math.sin(angleRad), Math.cos(angleRad), 0));
			
		c = THREE.Collisions.rayCastNearest( ray );
		if (c && c.normal) {
			poi = ray.origin.clone().addSelf( 
				ray.direction.clone().multiplyScalar( c.distance ) );
			var newPos = poi.clone();
			rayObj.geometry.vertices[1].position = newPos;
		} else {
			//300 = arbitrary distant point
			poi = ray.origin.clone().addSelf( ray.direction.clone().multiplyScalar( 300 ) ); // arbitrarily large distance
			var newPos = poi.clone();
			rayObj.geometry.vertices[1].position = newPos;
		}
		return c;
	}
	
	this.colorsEqual = function(color1, color2) {
		return color1.r == color2.r && color1.g == color2.g &&
			color1.b == color2.b;
	}
	
	this.intersectsWithRay = function(theRay) {
		return (theRay.intersectObject(this.base).length > 0) || (theRay.intersectObject(this.light).length > 0);
	}
}