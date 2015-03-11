THREE.BufferGeometry.prototype.toBinary = function () {

	var length = 0, name, attribute;
	for (name in this.attributes) {
		length += name.length + 2;

		attribute = this.attributes[name];
		length += attribute.array.byteLength + 2;
	}

	console.log ('Binary length, 1: ' + length);

	var buffer = new ArrayBuffer (length), data = new DataView (buffer), offset = 0, i;
	for (name in this.attributes) {
		data.setUint8 (offset++, name.length);
		for (i = 0; i < name.length; i++) {
			data.setUint8 (offset++, name.charCodeAt (i));
		}

		attribute = this.attributes[name];
		data.setUint8 (offset++, attribute.itemSize);

		var array = attribute.array;
		data.setUint16 (offset, array.length); offset += 2;
		for (i = 0; i < array.length; i++) {
			// this is poor assumption, but...
			switch (attribute.itemSize) {
				case 1:
					// int16 (index)
					data.setUint16 (offset, array[i]); offset += 2; break;
				default:
					// float32
					data.setFloat32 (offset, array[i]); offset += 4; break;
			}
		}
	}

	console.log ('Binary length, 2: ' + offset);

	return buffer;
};

THREE.BufferGeometry.prototype.fromBinary = function (buffer) {

	var data = new DataView (buffer), offset = 0;
	while (offset < data.byteLength) {
		var length = data.getUint8 (offset++), i, name = '';
		for (i = 0; i < length; i++) {
			name += String.fromCharCode (data.getUint8 (offset++));
		}

		var itemSize = data.getUint8 (offset++);

		length = data.getUint16 (offset); offset += 2;

		// see the switch above in toBinary
		var array = (itemSize == 1) ? new Uint16Array (length) : new Float32Array (length);
		for (i = 0; i < length; i++) {
			switch (itemSize) {
				case 1:
					array [i] = data.getUint16 (offset); offset += 2; break;
				default:
					array [i] = data.getFloat32 (offset); offset += 4; break;
			}
		}

		this.addAttribute (name, new THREE.BufferAttribute (array, itemSize));
	}
};