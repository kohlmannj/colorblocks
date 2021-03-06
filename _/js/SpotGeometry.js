/**
 * This was copied with minor alterations from http://lights.elliegoulding.com/
 * @author Dan
 */

SpotGeometry = function ( b, t, h, s, p ) {

	var rad45 = Math.PI / 4,
    rad90 = Math.PI / 2,
    rad180 = Math.PI,
    rad360 = Math.PI * 2,
    deg2rad = Math.PI / 180,
    rad2deg = 180 / Math.PI,
    phi = 1.618033988749;

    THREE.Geometry.call( this );

    if( s === undefined )
        s = 1;

    if( p === undefined )
        p = 3;

    var b2 = b / 2,
        t2 = t / 2,
        szx = Math.sin( 30 * deg2rad ),
        czx = Math.cos( 30 * deg2rad ),
        sxz = Math.sin( -30 * deg2rad ),
        cxz = Math.cos( -30 * deg2rad ),
        xs = [ [ b2, t2 ], [ b2 * szx, t2 * szx ], [ b2 * sxz, t2 * sxz ] ],
        zs = [ [  0,  0 ], [ b2 * czx, t2 * czx ], [ b2 * cxz, t2 * cxz ] ],
        i, j, xa, xb, za, zb, v, y, xby, zby, i3;

    for( i = 0; i < p; i++ ) {

        i3 = i % 3;
        xa = xs[ i3 ][ 0 ];
        xb = xs[ i3 ][ 1 ];
        za = zs[ i3 ][ 0 ];
        zb = zs[ i3 ][ 1 ];

        this.vertices.push( new THREE.Vertex( new THREE.Vector3( -xa, 0, -za ) ) );
        this.vertices.push( new THREE.Vertex( new THREE.Vector3(  xa, 0,  za ) ) );

        for( j = 0; j < s; j++ ) {

            y = (j + 1) / s;
            xby = xa * (1 - y) + xb * y;
            zby = za * (1 - y) + zb * y;

            this.vertices.push( new THREE.Vertex( new THREE.Vector3( -xby, -y * h, -zby ) ) );
            this.vertices.push( new THREE.Vertex( new THREE.Vector3(  xby, -y * h,  zby ) ) );

            v = this.vertices.length - 4;

            this.faces.push( new THREE.Face4( v, v + 1, v + 3, v + 2 ) );

            this.faceVertexUvs[ 0 ].push( [
                new THREE.UV( 0, y ),
                new THREE.UV( 1, y ),
                new THREE.UV( 1, j / s ),
                new THREE.UV( 0, j / s )
            ] );
        }
    }

    this.computeFaceNormals();
};

SpotGeometry.prototype = new THREE.Geometry();
SpotGeometry.prototype.constructor = SpotGeometry;