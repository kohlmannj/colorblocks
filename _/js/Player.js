function Player(startingPosition, playerSize, screenLimit) {
	this.onGround = false;
	this.size = playerSize;
	this.startingPosition = startingPosition;
	this.screenBottom = (0-screenLimit);
	
	// Textures for the regular texture and the jumping texture.
	this.playerTexture = THREE.ImageUtils.loadTexture("_/images/player.png");
	this.jumpingTexture = THREE.ImageUtils.loadTexture("_/images/playerB.png");
	this.rightTexture = THREE.ImageUtils.loadTexture("_/images/playerL.png");
	this.leftTexture = THREE.ImageUtils.loadTexture("_/images/playerR.png");
	this.leftJumpTexture = THREE.ImageUtils.loadTexture("_/images/playerRB.png");
	this.rightJumpTexture = THREE.ImageUtils.loadTexture("_/images/playerLB.png");
		
	// Materials
	this.faceMaterial = new THREE.MeshLambertMaterial( {
		map: this.playerTexture,
		transparent: true
	} );
	
	this.clearMaterial = new THREE.MeshBasicMaterial({
		opacity: 0.0
	});
	
	var cubeMaterials = [
		this.clearMaterial, // Left side
		this.clearMaterial, // Right side
		this.clearMaterial, // Top side
		this.clearMaterial, // Bottom side
		this.faceMaterial,  // Front side
		this.clearMaterial  // Back side
	];

	this.mesh = new THREE.Mesh(new THREE.CubeGeometry(playerSize, playerSize, playerSize, 4, 4, 1, cubeMaterials), new THREE.MeshFaceMaterial());
	
	playerMesh = this.mesh;
	
	this.mesh.position = this.startingPosition.clone();
	
	this.velocity = {
		x : .01, //put in place so you don't fall through if you don't move when starting
		y : 0
	};

	this.jumpsRemaining = 2;
	
	this.jump = function() {
		if (this.jumpsRemaining > 0) {
			this.velocity.y = 3;//+= 1;
			//this.velocity.x *= 1.1
			this.jumpsRemaining--;
		}
	};
	
	this.moveRight = function() {
		this.velocity.x = 1.5;
	}
	this.moveLeft = function() {
		this.velocity.x = -1.5;
	}
	this.moveDown = function() {
		//this.velocity.y = -1;
	}
	
	this.update = function(gravity, buttonsPressed) {
		this.mesh.position.y += this.velocity.y;
        this.mesh.position.x += this.velocity.x;
                    
		//check to see if on ground for friction and jumping
        //for now will just assume that you can jump anywhere, and apply a nominal friction value at all times
        this.velocity.x *= .8;
               
		//update for gravity
        this.velocity.y -= gravity;
	
		if(this.mesh.position.y < this.screenBottom)
		{
			this.mesh.position.y = this.startingPosition.y;
			this.mesh.position.x = this.startingPosition.x;
			this.mesh.position.z = this.startingPosition.z;
			this.velocity.y = 0;
			this.velocity.x = .01;
			this.jumpsRemaining = 0;
		}
		
		// Display jumping graphic if the user is moving upwards.
		if (this.velocity.y > 0) {
		
			if(LEFT_ARROW_PRESSED)
			{
				this.faceMaterial.map = this.leftJumpTexture;
			} else if(RIGHT_ARROW_PRESSED) 
			{
				this.faceMaterial.map = this.rightJumpTexture;
			} else 
			{
				this.faceMaterial.map = this.jumpingTexture;
			}
		} else {
			if(LEFT_ARROW_PRESSED)
			{
				this.faceMaterial.map = this.leftTexture;
			} else if(RIGHT_ARROW_PRESSED) 
			{
				this.faceMaterial.map = this.rightTexture;
			} else 
			{
				this.faceMaterial.map = this.playerTexture;
			}
		}
	};
	
	this.collisions = function(cubes) {
		var vector = new THREE.Vector3( this.velocity.x, this.velocity.y, 0 );
        var temp = Math.sqrt( (this.velocity.x * this.velocity.x) + 
        					  (this.velocity.y * this.velocity.y) );

        var velUnitVec = new THREE.Vector3( 0, this.velocity.y / temp, 0);
        var ray = new THREE.Ray( this.mesh.position, velUnitVec );
        var intersects2 = ray.intersectObjects( cubes );
        
        if ( intersects2.length > 0 && !intersects2[0].object.isTransparent) {
			if(this.mesh.position.x <= (intersects2[0].object.geometry.faces[0].centroid.x + intersects2[0].object.position.x) && 
			this.mesh.position.x >= (intersects2[0].object.geometry.faces[1].centroid.x + intersects2[0].object.position.x) ) 
			{
				var temp = this.mesh.position.y - (intersects2[0].object.position.y + intersects2[0].object.geometry.faces[2].centroid.y);
				var temp2 = intersects2[0].object.position.y + intersects2[0].object.geometry.faces[2].centroid.y;
				//if(temp > 5 && temp < 15)
					//player.velocity.y *= .5;
				if(temp > -5 && temp < this.size/2)//1)
				{
					this.velocity.y = .015;//.015;
					this.mesh.position.y = temp2 + this.size/2;//intersects2[0].object.geometry.faces[2].centroid.y + intersects2[0].object.position.y;	 
					this.jumpsRemaining = 2;
					this.onGround = true;
				}
			}                
		} else
			this.onGround = false;
	};
}