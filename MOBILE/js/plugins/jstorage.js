/*!
 * jstorage.js
 * This file helps in using local storage in a better way
 *
 * @project   cartier mobile
 * @date      2014-01-21
 * @author    SapientNitro
 * @licensor  cartier mobile
 * @site      cartier mobile
 * Usage: $.jStorage.get('propertiesNameHere')
 */

(function() {
	function D() {
		var a = "{}";
		if ("userDataBehavior" == k) {
			d.load("jStorage");
			try {
				a = d.getAttribute("jStorage")
			} catch (b) {}
			try {
				r = d.getAttribute("jStorage_update")
			} catch (c) {}
			h.jStorage = a
		}
		E();
		x();
		F()
	}

	function u() {
		var a;
		clearTimeout(G);
		G = setTimeout(function() {
			if ("localStorage" == k || "globalStorage" == k) a = h.jStorage_update;
			else if ("userDataBehavior" == k) {
				d.load("jStorage");
				try {
					a = d.getAttribute("jStorage_update")
				} catch (b) {}
			}
			if (a && a != r) {
				r = a;
				var l = m.parse(m.stringify(c.__jstorage_meta.CRC32)),
					p;
				D();
				p = m.parse(m.stringify(c.__jstorage_meta.CRC32));
				var e, z = [],
					f = [];
				for (e in l) l.hasOwnProperty(e) && (p[e] ? l[e] != p[e] && "2." == String(l[e]).substr(0, 2) && z.push(e) : f.push(e));
				for (e in p) p.hasOwnProperty(e) && (l[e] || z.push(e));
				s(z, "updated");
				s(f, "deleted")
			}
		}, 25)
	}

	function s(a, b) {
		a = [].concat(a || []);
		if ("flushed" == b) {
			a = [];
			for (var c in g) g.hasOwnProperty(c) && a.push(c);
			b = "deleted"
		}
		c = 0;
		for (var p = a.length; c < p; c++) {
			if (g[a[c]])
				for (var e = 0, d = g[a[c]].length; e < d; e++) g[a[c]][e](a[c], b);
			if (g["*"])
				for (e = 0, d = g["*"].length; e < d; e++) g["*"][e](a[c], b)
		}
	}

	function v() {
		var a = (+new Date).toString();
		if ("localStorage" == k || "globalStorage" == k) try {
			h.jStorage_update = a
		} catch (b) {
			k = !1
		} else "userDataBehavior" == k && (d.setAttribute("jStorage_update", a), d.save("jStorage"));
		u()
	}

	function E() {
		if (h.jStorage) try {
			c = m.parse(String(h.jStorage))
		} catch (a) {
			h.jStorage = "{}"
		} else h.jStorage = "{}";
		A = h.jStorage ? String(h.jStorage).length : 0;
		c.__jstorage_meta || (c.__jstorage_meta = {});
		c.__jstorage_meta.CRC32 || (c.__jstorage_meta.CRC32 = {})
	}

	function w() {
		if (c.__jstorage_meta.PubSub) {
			for (var a = +new Date - 2E3, b = 0, l = c.__jstorage_meta.PubSub.length; b <
				l; b++)
				if (c.__jstorage_meta.PubSub[b][0] <= a) {
					c.__jstorage_meta.PubSub.splice(b, c.__jstorage_meta.PubSub.length - b);
					break
				}
			c.__jstorage_meta.PubSub.length || delete c.__jstorage_meta.PubSub
		}
		try {
			h.jStorage = m.stringify(c), d && (d.setAttribute("jStorage", h.jStorage), d.save("jStorage")), A = h.jStorage ? String(h.jStorage).length : 0
		} catch (p) {}
	}

	function q(a) {
		if ("string" != typeof a && "number" != typeof a) throw new TypeError("Key name must be string or numeric");
		if ("__jstorage_meta" == a) throw new TypeError("Reserved key name");
		return !0
	}

	function x() {
		var a, b, l, d, e = Infinity,
			h = !1,
			f = [];
		clearTimeout(H);
		if (c.__jstorage_meta && "object" == typeof c.__jstorage_meta.TTL) {
			a = +new Date;
			l = c.__jstorage_meta.TTL;
			d = c.__jstorage_meta.CRC32;
			for (b in l) l.hasOwnProperty(b) && (l[b] <= a ? (delete l[b], delete d[b], delete c[b], h = !0, f.push(b)) : l[b] < e && (e = l[b]));
			Infinity != e && (H = setTimeout(x, e - a));
			h && (w(), v(), s(f, "deleted"))
		}
	}

	function F() {
		var a;
		if (c.__jstorage_meta.PubSub) {
			var b, l = B;
			for (a = c.__jstorage_meta.PubSub.length - 1; 0 <= a; a--)
				if (b = c.__jstorage_meta.PubSub[a],
					b[0] > B) {
					var l = b[0],
						d = b[1];
					b = b[2];
					if (t[d])
						for (var e = 0, h = t[d].length; e < h; e++) try {
							t[d][e](d, m.parse(m.stringify(b)))
						} catch (f) {}
				}
			B = l
		}
	}
	var y = window.jQuery || window.$ || (window.$ = {}),
		m = {
			parse: window.JSON && (window.JSON.parse || window.JSON.decode) || String.prototype.evalJSON && function(a) {
				return String(a).evalJSON()
			} || y.parseJSON || y.evalJSON,
			stringify: Object.toJSON || window.JSON && (window.JSON.stringify || window.JSON.encode) || y.toJSON
		};
	if (!("parse" in m && "stringify" in m)) throw Error("No JSON support found, include //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js to page");
	var c = {
		__jstorage_meta: {
			CRC32: {}
		}
	}, h = {
			jStorage: "{}"
		}, d = null,
		A = 0,
		k = !1,
		g = {}, G = !1,
		r = 0,
		t = {}, B = +new Date,
		H, C = {
			isXML: function(a) {
				return (a = (a ? a.ownerDocument || a : 0).documentElement) ? "HTML" !== a.nodeName : !1
			},
			encode: function(a) {
				if (!this.isXML(a)) return !1;
				try {
					return (new XMLSerializer).serializeToString(a)
				} catch (b) {
					try {
						return a.xml
					} catch (c) {}
				}
				return !1
			},
			decode: function(a) {
				var b = "DOMParser" in window && (new DOMParser).parseFromString || window.ActiveXObject && function(a) {
						var b = new ActiveXObject("Microsoft.XMLDOM");
						b.async =
							"false";
						b.loadXML(a);
						return b
					};
				if (!b) return !1;
				a = b.call("DOMParser" in window && new DOMParser || window, a, "text/xml");
				return this.isXML(a) ? a : !1
			}
		};
	y.jStorage = {
		version: "0.4.8",
		set: function(a, b, d) {
			q(a);
			d = d || {};
			if ("undefined" == typeof b) return this.deleteKey(a), b;
			if (C.isXML(b)) b = {
				_is_xml: !0,
				xml: C.encode(b)
			};
			else {
				if ("function" == typeof b) return;
				b && "object" == typeof b && (b = m.parse(m.stringify(b)))
			}
			c[a] = b;
			for (var h = c.__jstorage_meta.CRC32, e = m.stringify(b), k = e.length, f = 2538058380 ^ k, g = 0, n; 4 <= k;) n = e.charCodeAt(g) & 255 |
				(e.charCodeAt(++g) & 255) << 8 | (e.charCodeAt(++g) & 255) << 16 | (e.charCodeAt(++g) & 255) << 24, n = 1540483477 * (n & 65535) + ((1540483477 * (n >>> 16) & 65535) << 16), n ^= n >>> 24, n = 1540483477 * (n & 65535) + ((1540483477 * (n >>> 16) & 65535) << 16), f = 1540483477 * (f & 65535) + ((1540483477 * (f >>> 16) & 65535) << 16) ^ n, k -= 4, ++g;
			switch (k) {
				case 3:
					f ^= (e.charCodeAt(g + 2) & 255) << 16;
				case 2:
					f ^= (e.charCodeAt(g + 1) & 255) << 8;
				case 1:
					f ^= e.charCodeAt(g) & 255, f = 1540483477 * (f & 65535) + ((1540483477 * (f >>> 16) & 65535) << 16)
			}
			f ^= f >>> 13;
			f = 1540483477 * (f & 65535) + ((1540483477 * (f >>> 16) &
				65535) << 16);
			h[a] = "2." + ((f ^ f >>> 15) >>> 0);
			this.setTTL(a, d.TTL || 0);
			s(a, "updated");
			return b
		},
		get: function(a, b) {
			q(a);
			return a in c ? c[a] && "object" == typeof c[a] && c[a]._is_xml ? C.decode(c[a].xml) : c[a] : "undefined" == typeof b ? null : b
		},
		deleteKey: function(a) {
			q(a);
			return a in c ? (delete c[a], "object" == typeof c.__jstorage_meta.TTL && a in c.__jstorage_meta.TTL && delete c.__jstorage_meta.TTL[a], delete c.__jstorage_meta.CRC32[a], w(), v(), s(a, "deleted"), !0) : !1
		},
		setTTL: function(a, b) {
			var d = +new Date;
			q(a);
			b = Number(b) || 0;
			return a in
				c ? (c.__jstorage_meta.TTL || (c.__jstorage_meta.TTL = {}), 0 < b ? c.__jstorage_meta.TTL[a] = d + b : delete c.__jstorage_meta.TTL[a], w(), x(), v(), !0) : !1
		},
		getTTL: function(a) {
			var b = +new Date;
			q(a);
			return a in c && c.__jstorage_meta.TTL && c.__jstorage_meta.TTL[a] ? (a = c.__jstorage_meta.TTL[a] - b) || 0 : 0
		},
		flush: function() {
			c = {
				__jstorage_meta: {
					CRC32: {}
				}
			};
			w();
			v();
			s(null, "flushed");
			return !0
		},
		storageObj: function() {
			function a() {}
			a.prototype = c;
			return new a
		},
		index: function() {
			var a = [],
				b;
			for (b in c) c.hasOwnProperty(b) && "__jstorage_meta" !=
				b && a.push(b);
			return a
		},
		storageSize: function() {
			return A
		},
		currentBackend: function() {
			return k
		},
		storageAvailable: function() {
			return !!k
		},
		listenKeyChange: function(a, b) {
			q(a);
			g[a] || (g[a] = []);
			g[a].push(b)
		},
		stopListening: function(a, b) {
			q(a);
			if (g[a])
				if (b)
					for (var c = g[a].length - 1; 0 <= c; c--) g[a][c] == b && g[a].splice(c, 1);
				else delete g[a]
		},
		subscribe: function(a, b) {
			a = (a || "").toString();
			if (!a) throw new TypeError("Channel not defined");
			t[a] || (t[a] = []);
			t[a].push(b)
		},
		publish: function(a, b) {
			a = (a || "").toString();
			if (!a) throw new TypeError("Channel not defined");
			c.__jstorage_meta || (c.__jstorage_meta = {});
			c.__jstorage_meta.PubSub || (c.__jstorage_meta.PubSub = []);
			c.__jstorage_meta.PubSub.unshift([+new Date, a, b]);
			w();
			v()
		},
		reInit: function() {
			D()
		},
		noConflict: function(a) {
			delete window.$.jStorage;
			a && (window.jStorage = this);
			return this
		}
	};
	(function() {
		var a = !1;
		if ("localStorage" in window) try {
			window.localStorage.setItem("_tmptest", "tmpval"), a = !0, window.localStorage.removeItem("_tmptest")
		} catch (b) {}
		if (a) try {
			window.localStorage && (h = window.localStorage, k = "localStorage", r = h.jStorage_update)
		} catch (c) {} else if ("globalStorage" in
			window) try {
			window.globalStorage && (h = "localhost" == window.location.hostname ? window.globalStorage["localhost.localdomain"] : window.globalStorage[window.location.hostname], k = "globalStorage", r = h.jStorage_update)
		} catch (g) {} else if (d = document.createElement("link"), d.addBehavior) {
			d.style.behavior = "url(#default#userData)";
			document.getElementsByTagName("head")[0].appendChild(d);
			try {
				d.load("jStorage")
			} catch (e) {
				d.setAttribute("jStorage", "{}"), d.save("jStorage"), d.load("jStorage")
			}
			a = "{}";
			try {
				a = d.getAttribute("jStorage")
			} catch (m) {}
			try {
				r =
					d.getAttribute("jStorage_update")
			} catch (f) {}
			h.jStorage = a;
			k = "userDataBehavior"
		} else {
			d = null;
			return
		}
		E();
		x();
		"localStorage" == k || "globalStorage" == k ? "addEventListener" in window ? window.addEventListener("storage", u, !1) : document.attachEvent("onstorage", u) : "userDataBehavior" == k && setInterval(u, 1E3);
		F();
		"addEventListener" in window && window.addEventListener("pageshow", function(a) {
			a.persisted && u()
		}, !1)
	})()
})();