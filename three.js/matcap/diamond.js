var makeDiamondMaterial = (function () {

	var texture = new THREE.CubeTexture (), material;

	var manager = new THREE.LoadingManager (function () {

		for (var i = 0; i < 6; i++) {
			texture.images[i] = diamond.image;
		}

		texture.needsUpdate = true;

		material && material.dispatchEvent ({
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
					vec4 e = modelViewMatrix * p;\n\
					n = normalize (normalMatrix * normal);\n\
					r = reflect (normalize (vec3 (e)), n);\n\
					\n\
					gl_Position = projectionMatrix * e;\n\
				}',
			fragmentShader : '\n\
				uniform samplerCube map;\n\
				\n\
				varying vec3 n;\n\
				varying vec3 r;\n\
				\n\
				void main () {\n\
					gl_FragColor = textureCube (map, r - 0.5 * n) * 0.5 + textureCube (map, r - 1.5 * n) * 1.5 + vec4 (-0.1 - 0.4 * n.x, 0.0, 0.4 * n.y, 0.0);\n\
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