function makeMatCapMaterial (map, texture) {

	var manager = new THREE.LoadingManager (function () {
		material.dispatchEvent ({
			type : 'ready'
		});
	});

	var loader = new THREE.TextureLoader (manager);

	var defines = '', uniforms = {
		map : {
			type : 't', value : loader.load (map)
		}
	};

	if (texture) {
		defines = '#define TEXTURE';
		uniforms.texture = {
			type: 't', value : loader.load (texture)
		}
	} else {
		uniforms.color = {
			type: 'v4', value : new THREE.Vector4 (1, 1, 1, 1)
		}
	}

	var material = new THREE.ShaderMaterial ({
		vertexShader : defines + '\n\
			varying vec2 vN;\n\
			#ifdef TEXTURE\n\
				varying vec2 vUv;\n\
			#endif\n\
			\n\
			void main () {\n\
				vec4 p = vec4 (position, 1.0);\n\
				\n\
				vec3 e = normalize (vec3 (modelViewMatrix * p));\n\
				vec3 n = normalize (normalMatrix * normal);\n\
				vec3 r = reflect (e, n);\n\
				// r -> sphere normal\n\
				r.z += 1.0; r = normalize(r);\n\
				// apply where n points to the camera\n\
				float w = max (0.0, n.z);\n\
				r = r * w + n * (1.0 - w);\n\
				vN = r.xy / 2.0 + 0.5;\n\
				\n\
				#ifdef TEXTURE\n\
					vUv = uv;\n\
				#endif\n\
				\n\
				gl_Position = projectionMatrix * modelViewMatrix * p;\n\
			}',
		fragmentShader : defines + '\n\
			uniform sampler2D map;\n\
			#ifdef TEXTURE\n\
				uniform sampler2D texture;\n\
				varying vec2 vUv;\n\
			#else\n\
				uniform vec4 color;\n\
			#endif\n\
			\n\
			varying vec2 vN;\n\
			\n\
			void main () {\n\
				#ifdef TEXTURE\n\
					vec4 color = texture2D (texture, vUv);\n\
				#endif\n\
				//gl_FragColor = texture2D (map, vN) * color;\n\
				float b = 0.2; // black bias\n\
				float a = 3.0 * (0.5 - b); // so that ∫ (ax² + b - x) dx from 0 to 1 is 0\n\
				gl_FragColor = texture2D (map, vN) * (a * color * color + b);\n\
			}',
		uniforms : uniforms
	});

	return material;
}
