// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var CustomCube = function(options) {
	var that = {};
	
    that.settings = {
		color: 0xff0000,
		position: new THREE.Vector3(0,0,0),
		w: 25,
		h: 25,
		d: 25,
		collides: true
    }

	jQuery.extend(that.settings, options);
	
	// If options had a radius but no x, y, or z values...
	if (options != undefined && options.hasOwnProperty("r")) {
		if (! options.hasOwnProperty("w"))
			that.settings.w = that.settings.r * 2;
		if (! options.hasOwnProperty("h"))
			that.settings.h = that.settings.r * 2;
		if (! options.hasOwnProperty("d"))
			that.settings.d = that.settings.r * 2;
	}
	
	that.position = that.settings.position;
	
	
	var solidTexture = THREE.ImageUtils.loadTexture("_/images/cloudBrighter.png");
	var transTexture = THREE.ImageUtils.loadTexture("_/images/cloudOff.png");
	
	
	that.mesh = new THREE.Mesh(
		new THREE.CubeGeometry(that.settings.w, that.settings.h, that.settings.d),
		new THREE.MeshBasicMaterial({
			blending: THREE.AdditiveBlending,
			color: that.settings.color,
			// fog: true,
			map: solidTexture,
			// transparent: true
			
		})
	);
	
	that.mesh.position = that.settings.position;
	that.mesh.dynamic = true;
	
	that.mesh.isTransparent = true;
	
	that.mesh.lightColor = new THREE.Color(0x000000);
	
	var colliderIndex = THREE.Collisions.colliders.length;
	
	var hasEnoughColorFor = function(availableColor, targetColor) {
		var deltaR = availableColor.r - targetColor.r;
		var deltaG = availableColor.g - targetColor.g;
		var deltaB = availableColor.b - targetColor.b;
		
		return (deltaR >= 0) && (deltaG >= 0) && (deltaB >= 0);
	}
	
	that.mesh.settings = that.settings;
	
	that.addToScene = function(scene) {
		if (that.settings.collides) {
			THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB(that.mesh) );
		}
		scene.add(that.mesh);
	};
	
	that.removeFromScene = function(scene) {
		scene.remove(that.mesh);
		THREE.Collisions.colliders.remove(colliderIndex);
		// Don't think you have to do anything special for collisions.
	};
	
	that.mesh.wireframeReset = function() {
		that.mesh.isTransparent = true;
	}
	
	that.mesh.lightReset = function() {
		that.mesh.lightColor.r = 0;
		that.mesh.lightColor.b = 0;
		that.mesh.lightColor.g = 0;
	};
	
	that.mesh.fullReset = function() {
		that.mesh.isTransparent = true;
		that.mesh.lightColor.r = 0;
		that.mesh.lightColor.b = 0;
		that.mesh.lightColor.g = 0;
	};
	
	that.mesh.animate = function() {
		// console.log(that.mesh.lightColor.r, that.mesh.lightColor.g, that.mesh.lightColor.b);
		// console.log(that.mesh.lightColor.r, that.mesh.lightColor.g, that.mesh.lightColor.b);
		// Assume that the spotlights have already done their first collision
		// pass and have had these CustomCubes' meshes accumulate the light
		// that would potentially hit them.
		if ( hasEnoughColorFor(that.mesh.lightColor, that.mesh.materials[0].color) ) {
			// console.log("Cube has been lit up!");
			that.mesh.isTransparent = false;
		}
		// Reset the lightColor accumulators.
		that.mesh.lightReset();
	}
	
	that.mesh.deAnimate = function() {
		if (! hasEnoughColorFor(that.mesh.lightColor, that.mesh.materials[0].color) ) {
			that.mesh.isTransparent = true;
		}
		
		if (that.mesh.isTransparent) {
			that.mesh.materials[0].map = transTexture;
		} else {
			that.mesh.materials[0].map = solidTexture;
		}
	};
	
	return that;
}
