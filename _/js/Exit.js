/**
 * @author Dan
 */

function Exit(width, height, depth, color) {

	this.width = width;
	this.height = height;
	this.depth = depth;
	this.winCount = 0;
		
		
		
		uniforms = {
			uvScale: { type: "v2", value: new THREE.Vector2( .5, .45 ) },
			texture1: { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( "_/images/cloud3.png" ) },
		};

		uniforms.texture1.texture.wrapS = uniforms.texture1.texture.wrapT = THREE.Repeat;
	
	

	this.cubeMaterial = new THREE.ShaderMaterial( {
			blending: THREE.AdditiveBlending,
			uniforms: uniforms,
			vertexShader: document.getElementById( 'samsVertexShader' ).textContent,
			fragmentShader: document.getElementById( 'samsFragmentShader' ).textContent,
			color: 0xffffff,
			fog: true,
			wireframe: false,
			wireframe_linewidth: 20,
			transparent: false
	} );

	this.door = new THREE.Mesh(new THREE.CubeGeometry(this.width, this.height, this.depth), this.cubeMaterial);

	this.setPosition = function( x, y, z) {
		this.door.position.x = x;
		this.door.position.y = y;
		this.door.position.z = z;
	};
	
	
	this.endLevelCheck = function(player) {
		var pPos = player.mesh.position;
		
		return (pPos.x >= this.door.position.x - this.width / 2 &&
			pPos.x <= this.door.position.x + this.width / 2 &&
			pPos.y >= this.door.position.y - this.height / 2 &&
			pPos.y <= this.door.position.y + this.height / 2 &&
			pPos.z >= this.door.position.z - this.depth / 2 &&
			pPos.z <= this.door.position.z + this.depth / 2 &&
			player.velocity.y < 0.5 && player.velocity.y > -0.5
		);
	};
}