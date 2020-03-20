var de =

// below is haxe build of dummy class using polygonal/ds and polygonal/ai
// stripped of useless stuff like most of haxe boilerplate and interfaces
(function () { "use strict";
var AStar = function(graph) {
	this._graph = graph;
	this._que = new de.polygonal.ds.Heap();
};
AStar.prototype = {
	free: function() {
		this._graph.free();
		this._que.free();
		this._graph = null;
		this._que = null;
	}
	,find: function(graph,source,target,path) {
		var pathExists = false;
		var walker = graph._nodeList;
		while(walker != null) {
			walker.marked = false;
			walker.parent = null;
			walker.val.reset();
			walker = walker.next;
		}
		var q = this._que;
		q.clear(null);
		q.add(source);
		while(q._size > 0) {
			var waypoint1 = q.pop();
			waypoint1.onQue = false;
			var node1 = waypoint1.node;
			if(node1.marked) continue;
			node1.marked = true;
			if(node1 == target.node) {
				pathExists = true;
				break;
			}
			var arc = node1.arcList;
			while(arc != null) {
				var node2 = arc.node;
				if(node2.marked) {
					arc = arc.next;
					continue;
				}
				var waypoint2 = node2.val;
				var distance = waypoint1.distance + waypoint1.distanceTo(waypoint2) * arc.cost;
				if(node2.parent != null) {
					if(distance < waypoint2.distance) {
						node2.parent = node1;
						waypoint2.distance = distance;
					} else {
						arc = arc.next;
						continue;
					}
				} else {
					node2.parent = node1;
					waypoint2.distance = distance;
				}
				var heuristics = waypoint2.distanceTo(target) + distance;
				waypoint2.heuristic = heuristics;
				if(!waypoint2.onQue) {
					waypoint2.onQue = true;
					q.add(waypoint2);
				}
				arc = arc.next;
			}
		}
		if(pathExists) {
			var walker1 = target;
			while(walker1 != source) {
				path.set(path._size,walker1);
				walker1 = walker1.node.parent.val;
			}
			path.set(path._size,source);
			path.reverse();
		}
		return pathExists;
	}
};
var de = {};
de.polygonal = {};
de.polygonal.ds = {};
var AStarWaypoint = function() {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.position = -1;
	this.distance = Math.NaN;
	this.heuristic = Math.NaN;
	this.onQue = false;
	this.node = null;
};
AStarWaypoint.prototype = {
	reset: function() {
		this.distance = 0;
		this.heuristic = 0;
		this.onQue = false;
	}
	,distanceTo: function(wp) {
		var dx = wp.x - this.x;
		var dy = wp.y - this.y;
		var dz = wp.z - this.z;
		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}
	,compare: function(other) {
		var x = other.heuristic - this.heuristic;
		if(x > 0.) return 1; else if(x < 0.) return -1; else return 0;
	}
	,toString: function() {
		return "{ AStarWaypoint x: " + this.x + ", y: " + this.y + " }";
	}
};
var HxOverrides = function() { };
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};

var Std = function() { };
Std.string = function(s) {
	return s.toString();
};
Std["int"] = function(x) {
	return x | 0;
};

var Type = function() { };
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
};
de.polygonal.ds.ArrayUtil = function() { };
de.polygonal.ds.ArrayUtil.alloc = function(x) {
	var a;
	a = new Array(x);
	return a;
};
de.polygonal.ds.ArrayUtil.shrink = function(a,x) {
	if(a.length > x) a.length = x;
	return a;
};
de.polygonal.ds.ArrayUtil.copy = function(src,dst,min,max) {
	if(max == null) max = -1;
	if(min == null) min = 0;
	if(max == -1) max = src.length;
	var j = 0;
	var _g = min;
	while(_g < max) {
		var i = _g++;
		dst[j++] = src[i];
	}
	return dst;
};
de.polygonal.ds.ArrayUtil.fill = function(dst,x,k) {
	if(k == null) k = -1;
	if(k == -1) k = dst.length;
	var _g = 0;
	while(_g < k) {
		var i = _g++;
		dst[i] = x;
	}
};
de.polygonal.ds.ArrayUtil.assign = function(dst,C,args,k) {
	if(k == null) k = -1;
	if(k == -1) k = dst.length;
	if(args == null) args = [];
	var _g = 0;
	while(_g < k) {
		var i = _g++;
		dst[i] = Type.createInstance(C,args);
	}
};
de.polygonal.ds.ArrayUtil.memmove = function(a,destination,source,n) {
	if(source == destination) return; else if(source <= destination) {
		var i = source + n;
		var j = destination + n;
		var _g = 0;
		while(_g < n) {
			var k = _g++;
			i--;
			j--;
			a[j] = a[i];
		}
	} else {
		var i1 = source;
		var j1 = destination;
		var _g1 = 0;
		while(_g1 < n) {
			var k1 = _g1++;
			a[j1] = a[i1];
			i1++;
			j1++;
		}
	}
};
de.polygonal.ds.ArrayUtil.bsearchComparator = function(a,x,min,max,comparator) {
	var l = min;
	var m;
	var h = max + 1;
	while(l < h) {
		m = l + (h - l >> 1);
		if(comparator(a[m],x) < 0) l = m + 1; else h = m;
	}
	if(l <= max && comparator(a[l],x) == 0) return l; else return ~l;
};
de.polygonal.ds.ArrayUtil.bsearchInt = function(a,x,min,max) {
	var l = min;
	var m;
	var h = max + 1;
	while(l < h) {
		m = l + (h - l >> 1);
		if(a[m] < x) l = m + 1; else h = m;
	}
	if(l <= max && a[l] == x) return l; else return ~l;
};
de.polygonal.ds.ArrayUtil.bsearchFloat = function(a,x,min,max) {
	var l = min;
	var m;
	var h = max + 1;
	while(l < h) {
		m = l + (h - l >> 1);
		if(a[m] < x) l = m + 1; else h = m;
	}
	if(l <= max && a[l] == x) return l; else return ~l;
};
de.polygonal.ds.ArrayUtil.shuffle = function(a,rval) {
	var s = a.length;
	if(rval == null) {
		var m = Math;
		while(--s > 1) {
			var i = Std["int"](m.random() * s);
			var t = a[s];
			a[s] = a[i];
			a[i] = t;
		}
	} else {
		var j = 0;
		while(--s > 1) {
			var i1 = Std["int"](rval[j++] * s);
			var t1 = a[s];
			a[s] = a[i1];
			a[i1] = t1;
		}
	}
};
de.polygonal.ds.ArrayUtil.sortRange = function(a,compare,useInsertionSort,first,count) {
	var k = a.length;
	if(k > 1) {
		if(useInsertionSort) de.polygonal.ds.ArrayUtil._insertionSort(a,first,count,compare); else de.polygonal.ds.ArrayUtil._quickSort(a,first,count,compare);
	}
};
de.polygonal.ds.ArrayUtil.quickPerm = function(n) {
	var results = [];
	var a = [];
	var p = [];
	var i;
	var j;
	var tmp;
	var _g = 0;
	while(_g < n) {
		var i1 = _g++;
		a[i1] = i1 + 1;
		p[i1] = 0;
	}
	results.push(a.slice());
	i = 1;
	while(i < n) if(p[i] < i) {
		j = i % 2 * p[i];
		tmp = a[j];
		a[j] = a[i];
		a[i] = tmp;
		results.push(a.slice());
		p[i]++;
		i = 1;
	} else {
		p[i] = 0;
		i++;
	}
	return results;
};
de.polygonal.ds.ArrayUtil.equals = function(a,b) {
	if(a.length != b.length) return false;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(a[i] != b[i]) return false;
	}
	return true;
};
de.polygonal.ds.ArrayUtil.split = function(a,n,k) {
	var output = new Array();
	var b = null;
	var _g = 0;
	while(_g < n) {
		var i = _g++;
		if(i % k == 0) output[i / k | 0] = b = [];
		b.push(a[i]);
	}
	return output;
};
de.polygonal.ds.ArrayUtil._insertionSort = function(a,first,k,cmp) {
	var _g1 = first + 1;
	var _g = first + k;
	while(_g1 < _g) {
		var i = _g1++;
		var x = a[i];
		var j = i;
		while(j > first) {
			var y = a[j - 1];
			if(cmp(y,x) > 0) {
				a[j] = y;
				j--;
			} else break;
		}
		a[j] = x;
	}
};
de.polygonal.ds.ArrayUtil._quickSort = function(a,first,k,cmp) {
	var last = first + k - 1;
	var lo = first;
	var hi = last;
	if(k > 1) {
		var i0 = first;
		var i1 = i0 + (k >> 1);
		var i2 = i0 + k - 1;
		var t0 = a[i0];
		var t1 = a[i1];
		var t2 = a[i2];
		var mid;
		var t = cmp(t0,t2);
		if(t < 0 && cmp(t0,t1) < 0) if(cmp(t1,t2) < 0) mid = i1; else mid = i2; else if(cmp(t1,t0) < 0 && cmp(t1,t2) < 0) if(t < 0) mid = i0; else mid = i2; else if(cmp(t2,t0) < 0) mid = i1; else mid = i0;
		var pivot = a[mid];
		a[mid] = a[first];
		while(lo < hi) {
			while(cmp(pivot,a[hi]) < 0 && lo < hi) hi--;
			if(hi != lo) {
				a[lo] = a[hi];
				lo++;
			}
			while(cmp(pivot,a[lo]) > 0 && lo < hi) lo++;
			if(hi != lo) {
				a[hi] = a[lo];
				hi--;
			}
		}
		a[lo] = pivot;
		de.polygonal.ds.ArrayUtil._quickSort(a,first,lo - first,cmp);
		de.polygonal.ds.ArrayUtil._quickSort(a,lo + 1,last - lo,cmp);
	}
};
de.polygonal.ds.Bits = function() { };
de.polygonal.ds.Bits.getBits = function(x,mask) {
	return x & mask;
};
de.polygonal.ds.Bits.hasBits = function(x,mask) {
	return (x & mask) != 0;
};
de.polygonal.ds.Bits.incBits = function(x,mask) {
	return (x & mask) == mask;
};
de.polygonal.ds.Bits.setBits = function(x,mask) {
	return x | mask;
};
de.polygonal.ds.Bits.clrBits = function(x,mask) {
	return x & ~mask;
};
de.polygonal.ds.Bits.invBits = function(x,mask) {
	return x ^ mask;
};
de.polygonal.ds.Bits.setBitsIf = function(x,mask,expr) {
	if(expr) return x | mask; else return x & ~mask;
};
de.polygonal.ds.Bits.hasBitAt = function(x,i) {
	return (x & 1 << i) != 0;
};
de.polygonal.ds.Bits.setBitAt = function(x,i) {
	return x | 1 << i;
};
de.polygonal.ds.Bits.clrBitAt = function(x,i) {
	return x & ~(1 << i);
};
de.polygonal.ds.Bits.invBitAt = function(x,i) {
	return x ^ 1 << i;
};
de.polygonal.ds.Bits.setBitsRange = function(x,min,max) {
	var _g = min;
	while(_g < max) {
		var i = _g++;
		x = x | 1 << i;
	}
	return x;
};
de.polygonal.ds.Bits.mask = function(n) {
	return (1 << n) - 1;
};
de.polygonal.ds.Bits.ones = function(x) {
	x -= x >> 1 & 1431655765;
	x = (x >> 2 & 858993459) + (x & 858993459);
	x = (x >> 4) + x & 252645135;
	x += x >> 8;
	x += x >> 16;
	return x & 63;
};
de.polygonal.ds.Bits.ntz = function(x) {
	var n = 0;
	if(x != 0) {
		x = (x ^ x - 1) >>> 1;
		while(x != 0) {
			x >>= 1;
			n++;
		}
	}
	return n;
};
de.polygonal.ds.Bits.nlz = function(x) {
	if(x < 0) return 0; else {
		x |= x >> 1;
		x |= x >> 2;
		x |= x >> 4;
		x |= x >> 8;
		x |= x >> 16;
		return 32 - de.polygonal.ds.Bits.ones(x);
	}
};
de.polygonal.ds.Bits.msb = function(x) {
	x |= x >> 1;
	x |= x >> 2;
	x |= x >> 4;
	x |= x >> 8;
	x |= x >> 16;
	return x & ~(x >>> 1);
};
de.polygonal.ds.Bits.rol = function(x,n) {
	return x << n | x >>> 32 - n;
};
de.polygonal.ds.Bits.ror = function(x,n) {
	return x >>> n | x << 32 - n;
};
de.polygonal.ds.Bits.reverse = function(x) {
	var y = 1431655765;
	x = x >> 1 & y | (x & y) << 1;
	y = 858993459;
	x = x >> 2 & y | (x & y) << 2;
	y = 252645135;
	x = x >> 4 & y | (x & y) << 4;
	y = 16711935;
	x = x >> 8 & y | (x & y) << 8;
	return x >> 16 | x << 16;
};
de.polygonal.ds.Bits.flipWORD = function(x) {
	return x << 8 | x >> 8;
};
de.polygonal.ds.Bits.flipDWORD = function(x) {
	return x << 24 | x << 8 & 16711680 | x >> 8 & 65280 | x >> 24;
};
de.polygonal.ds.Bits.packI16 = function(lo,hi) {
	return hi + 32768 << 16 | lo + 32768;
};
de.polygonal.ds.Bits.packUI16 = function(lo,hi) {
	return hi << 16 | lo;
};
de.polygonal.ds.Bits.unpackI16Lo = function(x) {
	return (x & 65535) - 32768;
};
de.polygonal.ds.Bits.unpackI16Hi = function(x) {
	return (x >>> 16) - 32768;
};
de.polygonal.ds.Bits.unpackUI16Lo = function(x) {
	return x & 65535;
};
de.polygonal.ds.Bits.unpackUI16Hi = function(x) {
	return x >>> 16;
};
de.polygonal.ds.DA = function(reservedSize,maxSize) {
	if(maxSize == null) maxSize = -1;
	if(reservedSize == null) reservedSize = 0;
	this._size = 0;
	this._iterator = null;
	this.maxSize = -1;
	if(reservedSize > 0) this._a = de.polygonal.ds.ArrayUtil.alloc(reservedSize); else this._a = new Array();
	this.key = de.polygonal.ds.HashKey._counter++;
	this.reuseIterator = false;
};
de.polygonal.ds.DA.prototype = {
	pack: function() {
		var s = this._a.length;
		if(s == this._size) return;
		var tmp = this._a;
		this._a = de.polygonal.ds.ArrayUtil.alloc(this._size);
		var _g1 = 0;
		var _g = this._size;
		while(_g1 < _g) {
			var i = _g1++;
			this._a[i] = tmp[i];
		}
		var _g11 = this._size;
		var _g2 = tmp.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			tmp[i1] = null;
		}
	}
	,reserve: function(x) {
		if(this._size == x) return;
		var tmp = this._a;
		this._a = de.polygonal.ds.ArrayUtil.alloc(x);
		if(this._size < x) {
			var _g1 = 0;
			var _g = this._size;
			while(_g1 < _g) {
				var i = _g1++;
				this._a[i] = tmp[i];
			}
		}
	}
	,trim: function(x) {
		this._size = x;
	}
	,get: function(i) {
		return this._a[i];
	}
	,getNext: function(i) {
		return this._a[i + 1 == this._size?0:i + 1];
	}
	,getPrev: function(i) {
		return this._a[i - 1 == -1?this._size - 1:i - 1];
	}
	,set: function(i,x) {
		this._a[i] = x;
		if(i >= this._size) this._size++;
	}
	,swp: function(i,j) {
		var tmp = this._a[i];
		this._a[i] = this._a[j];
		if(i >= this._size) this._size++;
		this._a[j] = tmp;
		if(j >= this._size) this._size++;
	}
	,cpy: function(i,j) {
		this._a[i] = this._a[j];
		if(i >= this._size) this._size++;
	}
	,front: function() {
		return this._a[0];
	}
	,back: function() {
		return this._a[this._size - 1];
	}
	,popBack: function() {
		var x = this._a[this._size - 1];
		this._size--;
		return x;
	}
	,pushBack: function(x) {
		this.set(this._size,x);
	}
	,popFront: function() {
		return this.removeAt(0);
	}
	,pushFront: function(x) {
		this.insertAt(0,x);
	}
	,insertAt: function(i,x) {
		var p = this._size;
		while(p > i) this.__cpy(p--,p);
		this._a[i] = x;
		this._size++;
	}
	,removeAt: function(i) {
		var x = this._a[i];
		var k = this._size - 1;
		var p = i;
		while(p < k) this.__cpy(p++,p);
		this._size--;
		return x;
	}
	,swapPop: function(i) {
		this.__set(i,this.__get(--this._size));
	}
	,removeRange: function(i,n,output) {
		if(output == null) {
			var s = this._size;
			var p = i + n;
			while(p < s) {
				this._a[p - n] = this._a[p];
				p++;
			}
		} else {
			var s1 = this._size;
			var p1 = i + n;
			var e;
			var j;
			while(p1 < s1) {
				j = p1 - n;
				e = this._a[j];
				output.set(output._size,e);
				this.__cpy(j,p1++);
			}
		}
		this._size -= n;
		return output;
	}
	,concat: function(x,copy) {
		if(copy == null) copy = false;
		if(copy) {
			var copy1 = new de.polygonal.ds.DA();
			copy1._size = this._size + x._size;
			var _g1 = 0;
			var _g = this._size;
			while(_g1 < _g) {
				var i = _g1++;
				copy1._a[i] = this._a[i];
				if(i >= copy1._size) copy1._size++;
			}
			var _g11 = this._size;
			var _g2 = this._size + x._size;
			while(_g11 < _g2) {
				var i1 = _g11++;
				copy1._a[i1] = x._a[i1 - this._size];
				if(i1 >= copy1._size) copy1._size++;
			}
			return copy1;
		} else {
			var j = this._size;
			this._size += x._size;
			var _g12 = 0;
			var _g3 = x._size;
			while(_g12 < _g3) {
				var i2 = _g12++;
				this.__set(j++,x._a[i2]);
			}
			return this;
		}
	}
	,indexOf: function(x,from,binarySearch,comparator) {
		if(binarySearch == null) binarySearch = false;
		if(from == null) from = 0;
		if(this._size == 0) return -1; else if(binarySearch) {
			if(comparator != null) return de.polygonal.ds.ArrayUtil.bsearchComparator(this._a,x,from,this._size - 1,comparator); else {
				var k = this._size;
				var l = from;
				var m;
				var h = k;
				while(l < h) {
					m = l + (h - l >> 1);
					if(this._a[m].compare(x) < 0) l = m + 1; else h = m;
				}
				if(l <= k && (this._a[l].compare(x) == 0)) return l; else return -l;
			}
		} else {
			var i = from;
			var j = -1;
			var k1 = this._size - 1;
			do if(this._a[i] == x) {
				j = i;
				break;
			} while(i++ < k1);
			return j;
		}
	}
	,lastIndexOf: function(x,from) {
		if(from == null) from = -1;
		if(this._size == 0) return -1; else {
			if(from < 0) from = this._size + from;
			var j = -1;
			var i = from;
			do if(this._a[i] == x) {
				j = i;
				break;
			} while(i-- > 0);
			return j;
		}
	}
	,reverse: function() {
		if(this._a.length > this._size) this._a = de.polygonal.ds.ArrayUtil.shrink(this._a,this._size);
		this._a.reverse();
	}
	,assign: function(C,args,n) {
		if(n == null) n = 0;
		if(n > 0) this._size = n; else n = this._size;
		if(args == null) args = [];
		var _g = 0;
		while(_g < n) {
			var i = _g++;
			this.__set(i,Type.createInstance(C,args));
		}
	}
	,fill: function(x,n) {
		if(n == null) n = 0;
		if(n > 0) this._size = n; else n = this._size;
		var _g = 0;
		while(_g < n) {
			var i = _g++;
			this._a[i] = x;
		}
		return this;
	}
	,memmove: function(destination,source,n) {
		if(source == destination) return; else if(source <= destination) {
			var i = source + n;
			var j = destination + n;
			var _g = 0;
			while(_g < n) {
				var k = _g++;
				i--;
				j--;
				this._a[j] = this._a[i];
			}
		} else {
			var i1 = source;
			var j1 = destination;
			var _g1 = 0;
			while(_g1 < n) {
				var k1 = _g1++;
				this._a[j1] = this._a[i1];
				i1++;
				j1++;
			}
		}
	}
	,join: function(x) {
		if(this._size == 0) return "";
		if(this._size == 1) return Std.string(this._a[0]);
		var s = Std.string(this._a[0]) + x;
		var _g1 = 1;
		var _g = this._size - 1;
		while(_g1 < _g) {
			var i = _g1++;
			s += Std.string(this._a[i]);
			s += x;
		}
		s += Std.string(this._a[this._size - 1]);
		return s;
	}
	,sort: function(compare,useInsertionSort,first,count) {
		if(count == null) count = -1;
		if(first == null) first = 0;
		if(useInsertionSort == null) useInsertionSort = false;
		if(this._size > 1) {
			if(count == -1) count = this._size - first;
			if(compare == null) {
				if(useInsertionSort) this._insertionSortComparable(first,count); else this._quickSortComparable(first,count);
			} else if(useInsertionSort) this._insertionSort(first,count,compare); else if(first == 0 && count == this._size) {
				de.polygonal.ds.ArrayUtil.shrink(this._a,this._size);
				this._a.sort(compare);
			} else this._quickSort(first,count,compare);
		}
	}
	,inRange: function(i) {
		return i >= 0 && i < this._size;
	}
	,getArray: function() {
		return this._a;
	}
	,free: function() {
		var _g1 = 0;
		var _g = this._a.length;
		while(_g1 < _g) {
			var i = _g1++;
			this._a[i] = null;
		}
		this._a = null;
		this._iterator = null;
	}
	,contains: function(x) {
		var found = false;
		var _g1 = 0;
		var _g = this._size;
		while(_g1 < _g) {
			var i = _g1++;
			if(this._a[i] == x) {
				found = true;
				break;
			}
		}
		return found;
	}
	,remove: function(x) {
		if(this._size == 0) return false;
		var i = 0;
		var s = this._size;
		while(i < s) {
			if(this._a[i] == x) {
				s--;
				var p = i;
				while(p < s) {
					this._a[p] = this._a[p + 1];
					++p;
				}
				continue;
			}
			i++;
		}
		var found = this._size - s != 0;
		this._size = s;
		return found;
	}
	,clear: function(purge) {
		if(purge == null) purge = false;
		if(purge) {
			var _g1 = 0;
			var _g = this._a.length;
			while(_g1 < _g) {
				var i = _g1++;
				this._a[i] = null;
			}
		}
		this._size = 0;
	}
	,iterator: function() {
		if(this.reuseIterator) {
			if(this._iterator == null) this._iterator = new de.polygonal.ds.DAIterator(this); else this._iterator.reset();
			return this._iterator;
		} else return new de.polygonal.ds.DAIterator(this);
	}
	,size: function() {
		return this._size;
	}
	,isEmpty: function() {
		return this._size == 0;
	}
	,toArray: function() {
		var a = de.polygonal.ds.ArrayUtil.alloc(this._size);
		var _g1 = 0;
		var _g = this._size;
		while(_g1 < _g) {
			var i = _g1++;
			a[i] = this._a[i];
		}
		return a;
	}
	,clone: function(assign,copier) {
		if(assign == null) assign = true;
		var copy = new de.polygonal.ds.DA(this._size,this.maxSize);
		copy._size = this._size;
		if(assign) {
			var _g1 = 0;
			var _g = this._size;
			while(_g1 < _g) {
				var i = _g1++;
				copy._a[i] = this._a[i];
			}
		} else if(copier == null) {
			var c = null;
			var _g11 = 0;
			var _g2 = this._size;
			while(_g11 < _g2) {
				var i1 = _g11++;
				c = this._a[i1];
				copy.__set(i1,c.clone());
			}
		} else {
			var _g12 = 0;
			var _g3 = this._size;
			while(_g12 < _g3) {
				var i2 = _g12++;
				copy.__set(i2,copier(this._a[i2]));
			}
		}
		return copy;
	}
	,shuffle: function(rval) {
		var s = this._size;
		if(rval == null) {
			var m = Math;
			while(--s > 1) {
				var i = Std["int"](m.random() * s);
				var t = this._a[s];
				this._a[s] = this._a[i];
				this._a[i] = t;
			}
		} else {
			var j = 0;
			while(--s > 1) {
				var i1 = Std["int"](rval.get(j++) * s);
				var t1 = this._a[s];
				this._a[s] = this._a[i1];
				this._a[i1] = t1;
			}
		}
	}
	,toString: function() {
		var s = "{ DA size: " + this._size + " }";
		if(this._size == 0) return s;
		s += "\n[\n";
		var _g1 = 0;
		var _g = this._size;
		while(_g1 < _g) {
			var i = _g1++;
			s += "  " + i + " -> " + Std.string(this._a[i]) + "\n";
		}
		s += "]";
		return s;
	}
	,_quickSort: function(first,k,cmp) {
		var last = first + k - 1;
		var lo = first;
		var hi = last;
		if(k > 1) {
			var i0 = first;
			var i1 = i0 + (k >> 1);
			var i2 = i0 + k - 1;
			var t0 = this._a[i0];
			var t1 = this._a[i1];
			var t2 = this._a[i2];
			var mid;
			var t = cmp(t0,t2);
			if(t < 0 && cmp(t0,t1) < 0) if(cmp(t1,t2) < 0) mid = i1; else mid = i2; else if(cmp(t1,t0) < 0 && cmp(t1,t2) < 0) if(t < 0) mid = i0; else mid = i2; else if(cmp(t2,t0) < 0) mid = i1; else mid = i0;
			var pivot = this._a[mid];
			this._a[mid] = this._a[first];
			while(lo < hi) {
				while(cmp(pivot,this._a[hi]) < 0 && lo < hi) hi--;
				if(hi != lo) {
					this._a[lo] = this._a[hi];
					lo++;
				}
				while(cmp(pivot,this._a[lo]) > 0 && lo < hi) lo++;
				if(hi != lo) {
					this._a[hi] = this._a[lo];
					hi--;
				}
			}
			this._a[lo] = pivot;
			this._quickSort(first,lo - first,cmp);
			this._quickSort(lo + 1,last - lo,cmp);
		}
	}
	,_quickSortComparable: function(first,k) {
		var last = first + k - 1;
		var lo = first;
		var hi = last;
		if(k > 1) {
			var i0 = first;
			var i1 = i0 + (k >> 1);
			var i2 = i0 + k - 1;
			var t0;
			t0 = this._a[i0];
			var t1;
			t1 = this._a[i1];
			var t2;
			t2 = this._a[i2];
			var mid;
			var t = t0.compare(t2);
			if(t < 0 && t0.compare(t1) < 0) if(t1.compare(t2) < 0) mid = i1; else mid = i2; else if(t0.compare(t1) < 0 && t1.compare(t2) < 0) if(t < 0) mid = i0; else mid = i2; else if(t2.compare(t0) < 0) mid = i1; else mid = i0;
			var pivot;
			pivot = this._a[mid];
			this._a[mid] = this._a[first];
			while(lo < hi) {
				while(pivot.compare(this._a[hi]) < 0 && lo < hi) hi--;
				if(hi != lo) {
					this._a[lo] = this._a[hi];
					lo++;
				}
				while(pivot.compare(this._a[lo]) > 0 && lo < hi) lo++;
				if(hi != lo) {
					this._a[hi] = this._a[lo];
					hi--;
				}
			}
			this._a[lo] = pivot;
			this._quickSortComparable(first,lo - first);
			this._quickSortComparable(lo + 1,last - lo);
		}
	}
	,_insertionSort: function(first,k,cmp) {
		var _g1 = first + 1;
		var _g = first + k;
		while(_g1 < _g) {
			var i = _g1++;
			var x = this._a[i];
			var j = i;
			while(j > first) {
				var y = this._a[j - 1];
				if(cmp(y,x) > 0) {
					this._a[j] = y;
					j--;
				} else break;
			}
			this._a[j] = x;
		}
	}
	,_insertionSortComparable: function(first,k) {
		var _g1 = first + 1;
		var _g = first + k;
		while(_g1 < _g) {
			var i = _g1++;
			var x = this._a[i];
			var j = i;
			while(j > first) {
				var y = this._a[j - 1];
				if(y.compare(x) > 0) {
					this._a[j] = y;
					j--;
				} else break;
			}
			this._a[j] = x;
		}
	}
	,__get: function(i) {
		return this._a[i];
	}
	,__set: function(i,x) {
		this._a[i] = x;
	}
	,__cpy: function(i,j) {
		this._a[i] = this._a[j];
	}
};
de.polygonal.ds.DAIterator = function(f) {
	this._f = f;
	{
		this._a = this._f._a;
		this._s = this._f._size;
		this._i = 0;
		this;
	}
};
de.polygonal.ds.DAIterator.prototype = {
	reset: function() {
		this._a = this._f._a;
		this._s = this._f._size;
		this._i = 0;
		return this;
	}
	,hasNext: function() {
		return this._i < this._s;
	}
	,next: function() {
		return this._a[this._i++];
	}
	,remove: function() {
		this._f.removeAt(--this._i);
		this._s--;
	}
	,__a: function(f) {
		return f._a;
	}
	,__size: function(f) {
		return f._size;
	}
};
de.polygonal.ds.Graph = function(maxSize) {
	if(maxSize == null) maxSize = -1;
	this.maxSize = -1;
	this.clear();
	this._size = 0;
	this._iterator = null;
	this.autoClearMarks = false;
	this.key = de.polygonal.ds.HashKey._counter++;
	this.reuseIterator = false;
};
de.polygonal.ds.Graph.prototype = {
	getNodeList: function() {
		return this._nodeList;
	}
	,findNode: function(x) {
		var found = false;
		var n = this._nodeList;
		while(n != null) {
			if(n.val == x) {
				found = true;
				break;
			}
			n = n.next;
		}
		if(found) return n; else return null;
	}
	,createNode: function(x) {
		return new de.polygonal.ds.GraphNode(this,x);
	}
	,addNode: function(x) {
		this._size++;
		x.next = this._nodeList;
		if(x.next != null) x.next.prev = x;
		this._nodeList = x;
		return x;
	}
	,removeNode: function(x) {
		this.unlink(x);
		if(x.prev != null) x.prev.next = x.next;
		if(x.next != null) x.next.prev = x.prev;
		if(this._nodeList == x) this._nodeList = x.next;
		this._size--;
	}
	,addSingleArc: function(source,target,cost) {
		if(cost == null) cost = 1.;
		var walker = this._nodeList;
		while(walker != null) {
			if(walker == source) {
				var sourceNode = walker;
				walker = this._nodeList;
				while(walker != null) {
					if(walker == target) {
						sourceNode.addArc(walker,cost);
						break;
					}
					walker = walker.next;
				}
				break;
			}
			walker = walker.next;
		}
	}
	,addMutualArc: function(source,target,cost) {
		if(cost == null) cost = 1.;
		var walker = this._nodeList;
		while(walker != null) {
			if(walker == source) {
				var sourceNode = walker;
				walker = this._nodeList;
				while(walker != null) {
					if(walker == target) {
						sourceNode.addArc(walker,cost);
						walker.addArc(sourceNode,cost);
						break;
					}
					walker = walker.next;
				}
				break;
			}
			walker = walker.next;
		}
	}
	,unlink: function(node) {
		var arc0 = node.arcList;
		while(arc0 != null) {
			var node1 = arc0.node;
			var arc1 = node1.arcList;
			while(arc1 != null) {
				var hook = arc1.next;
				if(arc1.node == node) {
					if(arc1.prev != null) arc1.prev.next = hook;
					if(hook != null) hook.prev = arc1.prev;
					if(node1.arcList == arc1) node1.arcList = hook;
					arc1.free();
					if(this.returnArc != null) this.returnArc(arc1);
				}
				arc1 = hook;
			}
			var hook1 = arc0.next;
			if(arc0.prev != null) arc0.prev.next = hook1;
			if(hook1 != null) hook1.prev = arc0.prev;
			if(node.arcList == arc0) node.arcList = hook1;
			arc0.free();
			if(this.returnArc != null) this.returnArc(arc0);
			arc0 = hook1;
		}
		node.arcList = null;
		return node;
	}
	,clearMarks: function() {
		var node = this._nodeList;
		while(node != null) {
			node.marked = false;
			node = node.next;
		}
	}
	,clearParent: function() {
		var node = this._nodeList;
		while(node != null) {
			node.parent = null;
			node = node.next;
		}
	}
	,DFS: function(preflight,seed,process,userData,recursive) {
		if(recursive == null) recursive = false;
		if(preflight == null) preflight = false;
		if(this._size == 0) return;
		if(this.autoClearMarks) this.clearMarks();
		var c = 1;
		if(seed == null) seed = this._nodeList;
		this._stack[0] = seed;
		seed.parent = seed;
		seed.depth = 0;
		if(preflight) {
			if(process == null) {
				if(recursive) {
					var v = seed.val;
					if(v.visit(true,userData)) this._DFSRecursiveVisit(seed,true,userData);
				} else {
					var v1 = null;
					var n = this._stack[0];
					v1 = n.val;
					if(!v1.visit(true,userData)) return;
					while(c > 0) {
						var n1 = this._stack[--c];
						if(n1.marked) continue;
						n1.marked = true;
						v1 = n1.val;
						if(!v1.visit(false,userData)) break;
						var a = n1.arcList;
						while(a != null) {
							v1 = n1.val;
							a.node.parent = n1;
							a.node.depth = n1.depth + 1;
							if(v1.visit(true,userData)) this._stack[c++] = a.node;
							a = a.next;
						}
					}
				}
			} else if(recursive) {
				if(process(seed,true,userData)) this._DFSRecursiveProcess(seed,process,true,userData);
			} else {
				var n2 = this._stack[0];
				if(!process(n2,true,userData)) return;
				while(c > 0) {
					var n3 = this._stack[--c];
					if(n3.marked) continue;
					n3.marked = true;
					if(!process(n3,false,userData)) break;
					var a1 = n3.arcList;
					while(a1 != null) {
						a1.node.parent = n3;
						a1.node.depth = n3.depth + 1;
						if(process(a1.node,true,userData)) this._stack[c++] = a1.node;
						a1 = a1.next;
					}
				}
			}
		} else if(process == null) {
			if(recursive) this._DFSRecursiveVisit(seed,false,userData); else {
				var v2 = null;
				while(c > 0) {
					var n4 = this._stack[--c];
					if(n4.marked) continue;
					n4.marked = true;
					v2 = n4.val;
					if(!v2.visit(false,userData)) break;
					var a2 = n4.arcList;
					while(a2 != null) {
						this._stack[c++] = a2.node;
						a2.node.parent = n4;
						a2.node.depth = n4.depth + 1;
						a2 = a2.next;
					}
				}
			}
		} else if(recursive) this._DFSRecursiveProcess(seed,process,false,userData); else while(c > 0) {
			var n5 = this._stack[--c];
			if(n5.marked) continue;
			n5.marked = true;
			if(!process(n5,false,userData)) break;
			var a3 = n5.arcList;
			while(a3 != null) {
				this._stack[c++] = a3.node;
				a3.node.parent = n5;
				a3.node.depth = n5.depth + 1;
				a3 = a3.next;
			}
		}
	}
	,BFS: function(preflight,seed,process,userData) {
		if(preflight == null) preflight = false;
		if(this._size == 0) return;
		if(this.autoClearMarks) this.clearMarks();
		var front = 0;
		var c = 1;
		if(seed == null) seed = this._nodeList;
		this._que[0] = seed;
		seed.marked = true;
		seed.parent = seed;
		seed.depth = 0;
		if(preflight) {
			if(process == null) {
				var v = null;
				var n = this._que[front];
				v = n.val;
				if(!v.visit(true,userData)) return;
				while(c > 0) {
					n = this._que[front];
					v = n.val;
					if(!v.visit(false,userData)) return;
					var a = n.arcList;
					while(a != null) {
						var m = a.node;
						if(m.marked) {
							a = a.next;
							continue;
						}
						m.marked = true;
						m.parent = n;
						m.depth = n.depth + 1;
						v = m.val;
						if(v.visit(true,userData)) this._que[c++ + front] = m;
						a = a.next;
					}
					front++;
					c--;
				}
			} else {
				var n1 = this._que[front];
				if(!process(n1,true,userData)) return;
				while(c > 0) {
					n1 = this._que[front];
					if(!process(n1,false,userData)) return;
					var a1 = n1.arcList;
					while(a1 != null) {
						var m1 = a1.node;
						if(m1.marked) {
							a1 = a1.next;
							continue;
						}
						m1.marked = true;
						m1.parent = n1;
						m1.depth = n1.depth + 1;
						if(process(m1,true,userData)) this._que[c++ + front] = m1;
						a1 = a1.next;
					}
					front++;
					c--;
				}
			}
		} else if(process == null) {
			var v1 = null;
			while(c > 0) {
				var n2 = this._que[front];
				v1 = n2.val;
				if(!v1.visit(false,userData)) return;
				var a2 = n2.arcList;
				while(a2 != null) {
					var m2 = a2.node;
					if(m2.marked) {
						a2 = a2.next;
						continue;
					}
					m2.marked = true;
					m2.parent = n2;
					m2.depth = n2.depth + 1;
					this._que[c++ + front] = m2;
					a2 = a2.next;
				}
				front++;
				c--;
			}
		} else while(c > 0) {
			var n3 = this._que[front];
			if(!process(n3,false,userData)) return;
			var a3 = n3.arcList;
			while(a3 != null) {
				var m3 = a3.node;
				if(m3.marked) {
					a3 = a3.next;
					continue;
				}
				m3.marked = true;
				m3.parent = n3;
				m3.depth = n3.depth + 1;
				this._que[c++ + front] = m3;
				a3 = a3.next;
			}
			front++;
			c--;
		}
	}
	,DLBFS: function(maxDepth,preflight,seed,process,userData) {
		if(preflight == null) preflight = false;
		if(this._size == 0) return;
		if(this.autoClearMarks) this.clearMarks();
		var front = 0;
		var c = 1;
		var node = this._nodeList;
		while(node != null) {
			node.depth = 0;
			node = node.next;
		}
		if(seed == null) seed = this._nodeList;
		this._que[0] = seed;
		seed.marked = true;
		seed.parent = seed;
		if(preflight) {
			if(process == null) {
				var v = null;
				var n = this._que[front];
				v = n.val;
				if(!v.visit(true,userData)) return;
				while(c > 0) {
					n = this._que[front];
					v = n.val;
					if(!v.visit(false,userData)) return;
					var a = n.arcList;
					while(a != null) {
						var m = a.node;
						if(m.marked) {
							a = a.next;
							continue;
						}
						m.marked = true;
						m.parent = n;
						m.depth = n.depth + 1;
						if(m.depth <= maxDepth) {
							v = m.val;
							if(v.visit(true,userData)) this._que[c++ + front] = m;
						}
						a = a.next;
					}
					front++;
					c--;
				}
			} else {
				var n1 = this._que[front];
				if(!process(n1,true,userData)) return;
				while(c > 0) {
					n1 = this._que[front];
					if(!process(n1,false,userData)) return;
					var a1 = n1.arcList;
					while(a1 != null) {
						var m1 = a1.node;
						if(m1.marked) {
							a1 = a1.next;
							continue;
						}
						m1.marked = true;
						m1.parent = n1;
						m1.depth = n1.depth + 1;
						if(m1.depth <= maxDepth) {
							if(process(m1,true,userData)) this._que[c++ + front] = m1;
						}
						a1 = a1.next;
					}
					front++;
					c--;
				}
			}
		} else if(process == null) {
			var v1 = null;
			while(c > 0) {
				var n2 = this._que[front];
				v1 = n2.val;
				if(!v1.visit(false,userData)) return;
				var a2 = n2.arcList;
				while(a2 != null) {
					var m2 = a2.node;
					if(m2.marked) {
						a2 = a2.next;
						continue;
					}
					m2.marked = true;
					m2.depth = n2.depth + 1;
					m2.parent = n2.parent;
					if(m2.depth <= maxDepth) this._que[c++ + front] = m2;
					a2 = a2.next;
				}
				front++;
				c--;
			}
		} else while(c > 0) {
			var n3 = this._que[front];
			if(n3.depth > maxDepth) continue;
			if(!process(n3,false,userData)) return;
			var a3 = n3.arcList;
			while(a3 != null) {
				var m3 = a3.node;
				if(m3.marked) {
					a3 = a3.next;
					continue;
				}
				m3.marked = true;
				m3.depth = n3.depth + 1;
				m3.parent = n3.parent;
				if(m3.depth <= maxDepth) this._que[c++ + front] = m3;
				a3 = a3.next;
			}
			front++;
			c--;
		}
	}
	,toString: function() {
		var s = "{ Graph size: " + this._size + " }";
		if(this._size == 0) return s;
		s += "\n[\n";
		var node = this._nodeList;
		while(node != null) {
			s += "  " + node.toString() + "\n";
			node = node.next;
		}
		s += "]";
		return s;
	}
	,free: function() {
		var node = this._nodeList;
		while(node != null) {
			var nextNode = node.next;
			var arc = node.arcList;
			while(arc != null) {
				var nextArc = arc.next;
				arc.next = arc.prev = null;
				arc.node = null;
				arc = nextArc;
			}
			node.free();
			node = nextNode;
		}
		this._nodeList = null;
		var _g1 = 0;
		var _g = this._stack.length;
		while(_g1 < _g) {
			var i = _g1++;
			this._stack[i] = null;
		}
		this._stack = null;
		var _g11 = 0;
		var _g2 = this._que.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			this._que[i1] = null;
		}
		this._que = null;
		this._iterator = null;
	}
	,contains: function(x) {
		var found = false;
		var node = this._nodeList;
		while(node != null) {
			if(node.val == x) return true;
			node = node.next;
		}
		return false;
	}
	,remove: function(x) {
		var found = false;
		var node = this._nodeList;
		while(node != null) {
			var nextNode = node.next;
			if(node.val == x) {
				this.unlink(node);
				node.val = null;
				node.next = node.prev = null;
				node.arcList = null;
				found = true;
				this._size--;
			}
			node = nextNode;
		}
		return found;
	}
	,clear: function(purge) {
		if(purge == null) purge = false;
		if(purge) {
			var node = this._nodeList;
			while(node != null) {
				var hook = node.next;
				var arc = node.arcList;
				while(arc != null) {
					var hook1 = arc.next;
					arc.free();
					arc = hook1;
				}
				node.free();
				node = hook;
			}
		}
		this._nodeList = null;
		this._size = 0;
		this._stack = new Array();
		this._que = new Array();
	}
	,iterator: function() {
		if(this.reuseIterator) {
			if(this._iterator == null) this._iterator = new de.polygonal.ds.GraphIterator(this); else this._iterator.reset();
			return this._iterator;
		} else return new de.polygonal.ds.GraphIterator(this);
	}
	,nodeIterator: function() {
		return new de.polygonal.ds.GraphNodeIterator(this);
	}
	,arcIterator: function() {
		return new de.polygonal.ds.GraphArcIterator(this);
	}
	,size: function() {
		return this._size;
	}
	,isEmpty: function() {
		return this._size == 0;
	}
	,toArray: function() {
		var a = de.polygonal.ds.ArrayUtil.alloc(this._size);
		var node = this._nodeList;
		while(node != null) {
			a.push(node.val);
			node = node.next;
		}
		return a;
	}
	,clone: function(assign,copier) {
		if(assign == null) assign = true;
		var copy = new de.polygonal.ds.Graph(this.maxSize);
		if(this._nodeList == null) return copy;
		var t = new Array();
		var i = 0;
		var n = this._nodeList;
		if(assign) while(n != null) {
			var m = copy.addNode(copy.createNode(n.val));
			t[i++] = m;
			n = n.next;
		} else if(copier == null) {
			var c = null;
			while(n != null) {
				c = n.val;
				var m1 = copy.addNode(copy.createNode(c.clone()));
				t[i++] = m1;
				n = n.next;
			}
		} else while(n != null) {
			var m2 = copy.addNode(copy.createNode(copier(n.val)));
			t[i++] = m2;
			n = n.next;
		}
		i = 0;
		n = this._nodeList;
		while(n != null) {
			var m3 = t[i++];
			var a = n.arcList;
			while(a != null) {
				m3.addArc(a.node,a.cost);
				a = a.next;
			}
			n = n.next;
		}
		return copy;
	}
	,_DFSRecursiveVisit: function(node,preflight,userData) {
		node.marked = true;
		var v = node.val;
		if(!v.visit(false,userData)) return false;
		var a = node.arcList;
		while(a != null) {
			var m = a.node;
			if(m.marked) {
				a = a.next;
				continue;
			}
			a.node.parent = node;
			a.node.depth = node.depth + 1;
			if(preflight) {
				v = m.val;
				if(v.visit(true,userData)) {
					if(!this._DFSRecursiveVisit(m,true,userData)) return false;
				}
			} else if(!this._DFSRecursiveVisit(m,false,userData)) return false;
			a = a.next;
		}
		return true;
	}
	,_DFSRecursiveProcess: function(node,process,preflight,userData) {
		node.marked = true;
		if(!process(node,false,userData)) return false;
		var a = node.arcList;
		while(a != null) {
			var m = a.node;
			if(m.marked) {
				a = a.next;
				continue;
			}
			a.node.parent = node;
			a.node.depth = node.depth + 1;
			if(preflight) {
				if(process(m,true,userData)) {
					if(!this._DFSRecursiveProcess(m,process,true,userData)) return false;
				}
			} else if(!this._DFSRecursiveProcess(m,process,false,userData)) return false;
			a = a.next;
		}
		return true;
	}
};
de.polygonal.ds.GraphIterator = function(f) {
	this._f = f;
	{
		this._node = this._f._nodeList;
		this;
	}
};
de.polygonal.ds.GraphIterator.prototype = {
	reset: function() {
		this._node = this._f._nodeList;
		return this;
	}
	,hasNext: function() {
		return this._node != null;
	}
	,next: function() {
		var x = this._node.val;
		this._node = this._node.next;
		return x;
	}
	,remove: function() {
		throw "unsupported operation";
	}
	,__nodeList: function(f) {
		return f._nodeList;
	}
};
de.polygonal.ds.GraphNodeIterator = function(f) {
	this._f = f;
	{
		this._node = this._f._nodeList;
		this;
	}
};
de.polygonal.ds.GraphNodeIterator.prototype = {
	reset: function() {
		this._node = this._f._nodeList;
		return this;
	}
	,hasNext: function() {
		return this._node != null;
	}
	,next: function() {
		var x = this._node;
		this._node = this._node.next;
		return x;
	}
	,remove: function() {
		throw "unsupported operation";
	}
	,__nodeList: function(f) {
		return f._nodeList;
	}
};
de.polygonal.ds.GraphArcIterator = function(f) {
	this._f = f;
	{
		this._node = this._f._nodeList;
		this._arc = this._node.arcList;
		this;
	}
};
de.polygonal.ds.GraphArcIterator.prototype = {
	reset: function() {
		this._node = this._f._nodeList;
		this._arc = this._node.arcList;
		return this;
	}
	,hasNext: function() {
		return this._arc != null && this._node != null;
	}
	,next: function() {
		var x = this._arc;
		this._arc = this._arc.next;
		if(this._arc == null) {
			this._node = this._node.next;
			if(this._node != null) this._arc = this._node.arcList;
		}
		return x;
	}
	,remove: function() {
		throw "unsupported operation";
	}
	,__nodeList: function(f) {
		return f._nodeList;
	}
};
de.polygonal.ds.GraphArc = function(node,cost) {
	this.node = node;
	this.cost = cost;
	this.next = null;
	this.prev = null;
	this.key = de.polygonal.ds.HashKey._counter++;
};
de.polygonal.ds.GraphArc.prototype = {
	free: function() {
		this.node = null;
		this.next = this.prev = null;
	}
	,val: function() {
		return this.node.val;
	}
};
de.polygonal.ds.GraphNode = function(graph,x) {
	this.val = x;
	this.arcList = null;
	this.marked = false;
	this.key = de.polygonal.ds.HashKey._counter++;
	this._graph = graph;
};
de.polygonal.ds.GraphNode.prototype = {
	free: function() {
		this.val = null;
		this.next = this.prev = null;
		this.arcList = null;
		this._graph = null;
	}
	,iterator: function() {
		return new de.polygonal.ds.NodeValIterator(this);
	}
	,isConnected: function(target) {
		return this.getArc(target) != null;
	}
	,isMutuallyConnected: function(target) {
		return this.getArc(target) != null && target.getArc(this) != null;
	}
	,getArc: function(target) {
		var found = false;
		var a = this.arcList;
		while(a != null) {
			if(a.node == target) {
				found = true;
				break;
			}
			a = a.next;
		}
		if(found) return a; else return null;
	}
	,addArc: function(target,cost) {
		if(cost == null) cost = 1.;
		var arc;
		if(this._graph.borrowArc != null) arc = this._graph.borrowArc(target,cost); else arc = new de.polygonal.ds.GraphArc(target,cost);
		arc.next = this.arcList;
		if(this.arcList != null) this.arcList.prev = arc;
		this.arcList = arc;
	}
	,removeArc: function(target) {
		var arc = this.getArc(target);
		if(arc != null) {
			if(arc.prev != null) arc.prev.next = arc.next;
			if(arc.next != null) arc.next.prev = arc.prev;
			if(this.arcList == arc) this.arcList = arc.next;
			arc.next = null;
			arc.prev = null;
			arc.node = null;
			if(this._graph.returnArc != null) this._graph.returnArc(arc);
			return true;
		}
		return false;
	}
	,removeSingleArcs: function() {
		var arc = this.arcList;
		while(arc != null) {
			this.removeArc(arc.node);
			arc = arc.next;
		}
	}
	,removeMutualArcs: function() {
		var arc = this.arcList;
		while(arc != null) {
			arc.node.removeArc(this);
			this.removeArc(arc.node);
			arc = arc.next;
		}
		this.arcList = null;
	}
	,getArcCount: function() {
		var c = 0;
		var arc = this.arcList;
		while(arc != null) {
			c++;
			arc = arc.next;
		}
		return c;
	}
	,toString: function() {
		var t = new Array();
		if(this.arcList != null) {
			var arc = this.arcList;
			while(arc != null) {
				t.push(Std.string(arc.node.val));
				arc = arc.next;
			}
		}
		if(t.length > 0) return "{ GraphNode val: " + Std.string(this.val) + ", connected to: " + t.join(",") + " }"; else return "{ GraphNode val: " + Std.string(this.val) + " }";
	}
};
de.polygonal.ds.NodeValIterator = function(node) {
	this._node = node;
	{
		this._arcList = this._node.arcList;
		this;
	}
};
de.polygonal.ds.NodeValIterator.prototype = {
	reset: function() {
		this._arcList = this._node.arcList;
		return this;
	}
	,hasNext: function() {
		return this._arcList != null;
	}
	,next: function() {
		var val = this._arcList.node.val;
		this._arcList = this._arcList.next;
		return val;
	}
	,remove: function() {
		throw "unsupported operation";
	}
};
de.polygonal.ds.HashKey = function() { };
de.polygonal.ds.HashKey.next = function() {
	return de.polygonal.ds.HashKey._counter++;
};
de.polygonal.ds.Heap = function(reservedSize,maxSize) {
	if(maxSize == null) maxSize = -1;
	if(reservedSize == null) reservedSize = 0;
	this.maxSize = -1;
	if(reservedSize > 0) this._a = de.polygonal.ds.ArrayUtil.alloc(reservedSize + 1); else this._a = new Array();
	this._a[0] = null;
	this._size = 0;
	this._iterator = null;
	this.key = de.polygonal.ds.HashKey._counter++;
	this.reuseIterator = false;
};
de.polygonal.ds.Heap.prototype = {
	pack: function() {
		if(this._a.length - 1 == this._size) return;
		var tmp = this._a;
		this._a = de.polygonal.ds.ArrayUtil.alloc(this._size + 1);
		this._a[0] = null;
		var _g1 = 1;
		var _g = this._size + 1;
		while(_g1 < _g) {
			var i = _g1++;
			this._a[i] = tmp[i];
		}
		var _g11 = this._size + 1;
		var _g2 = tmp.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			tmp[i1] = null;
		}
	}
	,reserve: function(x) {
		if(this._size == x) return;
		var tmp = this._a;
		this._a = de.polygonal.ds.ArrayUtil.alloc(x + 1);
		this._a[0] = null;
		if(this._size < x) {
			var _g1 = 1;
			var _g = this._size + 1;
			while(_g1 < _g) {
				var i = _g1++;
				this._a[i] = tmp[i];
			}
		}
	}
	,top: function() {
		return this._a[1];
	}
	,bottom: function() {
		if(this._size == 1) return this._a[1];
		var a = this._a[1];
		var b;
		var _g1 = 2;
		var _g = this._size + 1;
		while(_g1 < _g) {
			var i = _g1++;
			b = this._a[i];
			if(a.compare(b) > 0) a = b;
		}
		return a;
	}
	,add: function(x) {
		this.__set(++this._size,x);
		x.position = this._size;
		this._upheap(this._size);
	}
	,pop: function() {
		var x = this._a[1];
		this._a[1] = this._a[this._size];
		this._downheap(1);
		this._size--;
		return x;
	}
	,replace: function(x) {
		this._a[1] = x;
		this._downheap(1);
	}
	,change: function(x,hint) {
		if(hint >= 0) this._upheap(x.position); else {
			this._downheap(x.position);
			this._upheap(this._size);
		}
	}
	,sort: function() {
		if(this._size == 0) return new Array();
		var a = de.polygonal.ds.ArrayUtil.alloc(this._size);
		var h = de.polygonal.ds.ArrayUtil.alloc(this._size + 1);
		de.polygonal.ds.ArrayUtil.copy(this._a,h,0,this._size + 1);
		var k = this._size;
		var j = 0;
		while(k > 0) {
			a[j++] = h[1];
			h[1] = h[k];
			var i = 1;
			var c = i << 1;
			var v = h[i];
			var s = k - 1;
			while(c < k) {
				if(c < s) {
					if(h[c].compare(h[c + 1]) < 0) c++;
				}
				var u = h[c];
				if(v.compare(u) < 0) {
					h[i] = u;
					i = c;
					c <<= 1;
				} else break;
			}
			h[i] = v;
			k--;
		}
		return a;
	}
	,height: function() {
		return 32 - de.polygonal.ds.Bits.nlz(this._size);
	}
	,toString: function() {
		var s = "{ Heap size: " + this._size + " }";
		if(this._size == 0) return s;
		var tmp = new de.polygonal.ds.Heap();
		var _g1 = 1;
		var _g = this._size + 1;
		while(_g1 < _g) {
			var i = _g1++;
			var w = new de.polygonal.ds._Heap.HeapElementWrapper(this._a[i]);
			tmp._a[i] = w;
		}
		tmp._size = this._size;
		s += "\n[ front\n";
		var i1 = 0;
		while(tmp._size > 0) s += "  " + (i1++) + " -> " + Std.string(tmp.pop()) + "\n";
		s += "]";
		return s;
	}
	,repair: function() {
		var i = this._size >> 1;
		while(i >= 1) {
			this._heapify(i,this._size);
			i--;
		}
	}
	,free: function() {
		var _g1 = 0;
		var _g = this._a.length;
		while(_g1 < _g) {
			var i = _g1++;
			this._a[i] = null;
		}
		this._a = null;
		if(this._iterator != null) {
			this._iterator.free();
			this._iterator = null;
		}
	}
	,contains: function(x) {
		var position = x.position;
		return position > 0 && position <= this._size && this._a[position] == x;
	}
	,remove: function(x) {
		if(this._size == 0) return false; else {
			if(x.position == 1) this.pop(); else {
				var p = x.position;
				this._a[p] = this._a[this._size];
				this._downheap(p);
				this._upheap(p);
				this._size--;
			}
			return true;
		}
	}
	,clear: function(purge) {
		if(purge == null) purge = false;
		if(purge) {
			var _g1 = 1;
			var _g = this._a.length;
			while(_g1 < _g) {
				var i = _g1++;
				this._a[i] = null;
			}
		}
		this._size = 0;
	}
	,iterator: function() {
		if(this.reuseIterator) {
			if(this._iterator == null) this._iterator = new de.polygonal.ds.HeapIterator(this); else this._iterator.reset();
			return this._iterator;
		} else return new de.polygonal.ds.HeapIterator(this);
	}
	,size: function() {
		return this._size;
	}
	,isEmpty: function() {
		return this._size == 0;
	}
	,toArray: function() {
		var a = de.polygonal.ds.ArrayUtil.alloc(this._size);
		var _g1 = 1;
		var _g = this._size + 1;
		while(_g1 < _g) {
			var i = _g1++;
			a[i - 1] = this._a[i];
		}
		return a;
	}
	,clone: function(assign,copier) {
		if(assign == null) assign = true;
		var copy = new de.polygonal.ds.Heap(this._size,this.maxSize);
		if(this._size == 0) return copy;
		if(assign) {
			var _g1 = 1;
			var _g = this._size + 1;
			while(_g1 < _g) {
				var i = _g1++;
				copy._a[i] = this._a[i];
			}
		} else if(copier == null) {
			var _g11 = 1;
			var _g2 = this._size + 1;
			while(_g11 < _g2) {
				var i1 = _g11++;
				var e = this._a[i1];
				var c = e.clone();
				c.position = e.position;
				copy._a[i1] = c;
			}
		} else {
			var _g12 = 1;
			var _g3 = this._size + 1;
			while(_g12 < _g3) {
				var i2 = _g12++;
				var e1 = this._a[i2];
				var c1 = copier(e1);
				c1.position = e1.position;
				copy._a[i2] = c1;
			}
		}
		copy._size = this._size;
		return copy;
	}
	,_upheap: function(i) {
		var p = i >> 1;
		var a = this._a[i];
		var b;
		while(p > 0) {
			b = this._a[p];
			if(a.compare(b) > 0) {
				this._a[i] = b;
				b.position = i;
				i = p;
				p >>= 1;
			} else break;
		}
		a.position = i;
		this._a[i] = a;
	}
	,_downheap: function(i) {
		var c = i << 1;
		var a = this._a[i];
		var s = this._size - 1;
		while(c < this._size) {
			if(c < s) {
				if(this._a[c].compare(this._a[c + 1]) < 0) c++;
			}
			var b = this._a[c];
			if(a.compare(b) < 0) {
				this._a[i] = b;
				b.position = i;
				a.position = c;
				i = c;
				c <<= 1;
			} else break;
		}
		a.position = i;
		this._a[i] = a;
	}
	,_heapify: function(p,s) {
		var l = p << 1;
		var r = l + 1;
		var max = p;
		if(l <= s && this._a[l].compare(this._a[max]) > 0) max = l;
		if(l + 1 <= s && this._a[l + 1].compare(this._a[max]) > 0) max = r;
		if(max != p) {
			var a = this._a[max];
			var b = this._a[p];
			this._a[max] = b;
			this._a[p] = a;
			var tmp = a.position;
			a.position = b.position;
			b.position = tmp;
			this._heapify(max,s);
		}
	}
	,__get: function(i) {
		return this._a[i];
	}
	,__set: function(i,x) {
		this._a[i] = x;
	}
};
de.polygonal.ds.HeapIterator = function(f) {
	this._f = f;
	this._a = new Array();
	this._a[0] = null;
	this.reset();
};
de.polygonal.ds.HeapIterator.prototype = {
	free: function() {
		this._a = null;
	}
	,reset: function() {
		this._s = this._f._size + 1;
		this._i = 1;
		var a = this._f._a;
		var _g1 = 1;
		var _g = this._s;
		while(_g1 < _g) {
			var i = _g1++;
			this._a[i] = a[i];
		}
		return this;
	}
	,hasNext: function() {
		return this._i < this._s;
	}
	,next: function() {
		return this._a[this._i++];
	}
	,remove: function() {
		this._f.remove(this._a[this._i - 1]);
	}
	,__a: function(f) {
		return f._a;
	}
};
de.polygonal.ds._Heap = {};
de.polygonal.ds._Heap.HeapElementWrapper = function(e) {
	this.e = e;
	this.position = e.position;
};
de.polygonal.ds._Heap.HeapElementWrapper.prototype = {
	compare: function(other) {
		return this.e.compare(other.e);
	}
	,toString: function() {
		return Std.string(this.e);
	}
};

Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};

de.polygonal.ds.Bits.BIT_01 = 1;
de.polygonal.ds.Bits.BIT_02 = 2;
de.polygonal.ds.Bits.BIT_03 = 4;
de.polygonal.ds.Bits.BIT_04 = 8;
de.polygonal.ds.Bits.BIT_05 = 16;
de.polygonal.ds.Bits.BIT_06 = 32;
de.polygonal.ds.Bits.BIT_07 = 64;
de.polygonal.ds.Bits.BIT_08 = 128;
de.polygonal.ds.Bits.BIT_09 = 256;
de.polygonal.ds.Bits.BIT_10 = 512;
de.polygonal.ds.Bits.BIT_11 = 1024;
de.polygonal.ds.Bits.BIT_12 = 2048;
de.polygonal.ds.Bits.BIT_13 = 4096;
de.polygonal.ds.Bits.BIT_14 = 8192;
de.polygonal.ds.Bits.BIT_15 = 16384;
de.polygonal.ds.Bits.BIT_16 = 32768;
de.polygonal.ds.Bits.BIT_17 = 65536;
de.polygonal.ds.Bits.BIT_18 = 131072;
de.polygonal.ds.Bits.BIT_19 = 262144;
de.polygonal.ds.Bits.BIT_20 = 524288;
de.polygonal.ds.Bits.BIT_21 = 1048576;
de.polygonal.ds.Bits.BIT_22 = 2097152;
de.polygonal.ds.Bits.BIT_23 = 4194304;
de.polygonal.ds.Bits.BIT_24 = 8388608;
de.polygonal.ds.Bits.BIT_25 = 16777216;
de.polygonal.ds.Bits.BIT_26 = 33554432;
de.polygonal.ds.Bits.BIT_27 = 67108864;
de.polygonal.ds.Bits.BIT_28 = 134217728;
de.polygonal.ds.Bits.BIT_29 = 268435456;
de.polygonal.ds.Bits.BIT_30 = 536870912;
de.polygonal.ds.Bits.BIT_31 = 1073741824;
de.polygonal.ds.Bits.BIT_32 = -2147483648;
de.polygonal.ds.Bits.ALL = -1;
de.polygonal.ds.HashKey._counter = 0;

// restore original AStar package names
de.polygonal.ai = { pathfinding: { AStar: AStar, AStarWaypoint: AStarWaypoint }};

return de;

})();