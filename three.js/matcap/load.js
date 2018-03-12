function loadFile (url, process, container) {
	var dispatcher = new THREE.EventDispatcher;

	(new THREE.OBJLoader).load (url, function (group) {

		var renderer = new THREE.WebGLRenderer ({ antialias: true, alpha: true });
		renderer.setClearColor (0xffffff);
		renderer.setClearAlpha (0);
		container.appendChild (renderer.domElement);

		// center the group

		var box = new THREE.Box3;
		box.setFromObject (group);

		var sphere = box.getBoundingSphere ();
		group.position.copy (sphere.center).multiplyScalar (-1);

		// create scene

		var scene = new THREE.Scene;
		scene.add (group);

		var camera = new THREE.PerspectiveCamera (75, 1, 0.1 * sphere.radius, 10 * sphere.radius);
		camera.position.z = -2 * sphere.radius;
		scene.add (camera);

		camera.add (new THREE.AmbientLight (0x404040));

		var light = new THREE.DirectionalLight (0xffffff, 0.6);
		light.position.set (-1, 1, -1);
		camera.add (light);

		// process the scene

		scene.traverse (process);

		// controls

		var render = function () {
			renderer.render (scene, camera);

			// inform them we rendered stuff

			dispatcher.dispatchEvent ({
				type: 'rendered'
			});
		};

		var discardClick = false;

		var controls = new THREE.OrbitControls (camera, renderer.domElement);
		controls.addEventListener ('start', function () {
			discardClick = false;
		});
		controls.addEventListener ('change', function () {
			discardClick = true;
			render ();
		});

		dispatcher.addEventListener ('resize', function (event) {
			var width = event.width || container.offsetWidth;
			var height = event.height || container.offsetHeight;
			camera.aspect = width / height;
			camera.updateProjectionMatrix ();
			renderer.setSize (width, height);
			render ();
		});

		var raycaster = new THREE.Raycaster;

		renderer.domElement.addEventListener ('click', function (event) {
			// remove orbit controls noise
			if (discardClick) return;

			var rect = renderer.domElement.getBoundingClientRect ();

			raycaster.ray.origin.set (0, 0, 0);
			camera.localToWorld (raycaster.ray.origin);
			raycaster.ray.direction.set (
				((event.clientX - rect.left) / rect.width) * 2 - 1,
				((rect.top - event.clientY) / rect.height) * 2 + 1,
			0.5).unproject (camera).sub (raycaster.ray.origin).normalize ();

			var intersects = raycaster.intersectObject (scene, true);
			if (intersects && intersects[0]) {

				// return world point

				dispatcher.dispatchEvent ({
					type: 'click',
					object: intersects[0].object,
					normal: intersects[0].face.normal,
					point: intersects[0].point
				});
			}
		});

		// add, remove and other manipulation tasks shall go there

		dispatcher.addEventListener ('add', function (event) {
			scene.add (event.object);
			render ();
		});

		dispatcher.addEventListener ('render', function () {
			render ();
		});

		// ready

		dispatcher.dispatchEvent ({
			type: 'ready'
		});
	}, function (event) {

		// progress

		dispatcher.dispatchEvent (event);
	});

	return dispatcher;
}