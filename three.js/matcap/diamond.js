var makeDiamondMaterial = (function () {

	var texture = new THREE.CubeTexture (), material;

	var manager = new THREE.LoadingManager (function () {

		for (var i = 0; i < 6; i++) {
			texture.images[i] = diamond.image;
		}

		texture.needsUpdate = true;

		material.dispatchEvent ({
			type : 'ready'
		});
	});

	var loader = new THREE.TextureLoader (manager);

	var diamond = loader.load ('diamond.jpg');

	return function () {

		return (material = new THREE.ShaderMaterial ({
			vertexShader : '\n\
				varying vec3 n;\n\
				varying vec3 r;\n\
				\n\
				void main () {\n\
					vec4 p = vec4 (position, 1.0);\n\
					\n\
					vec3 e = normalize (vec3 (modelViewMatrix * p));\n\
					n = normalize (normalMatrix * normal);\n\
					r = reflect (e, n) - 0.9 * n;\n\
					\n\
					gl_Position = projectionMatrix * modelViewMatrix * p;\n\
				}',
			fragmentShader : '\n\
				uniform samplerCube map;\n\
				\n\
				varying vec3 n;\n\
				varying vec3 r;\n\
				\n\
				void main () {\n\
					gl_FragColor = textureCube (map, r - 1.5 * n) * 0.7 + textureCube (map, r - 0.8 * n) * 2.0 + vec4 (-0.2 * n.y, 0.0, 0.6 * n.y, 0.0);\n\
				}',
			uniforms : {
				map  : {
					type  : 't',
					value : texture
				}
			}
		}));
	};
}) ();