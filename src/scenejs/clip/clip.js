/**
 * @class A scene node that defines an arbitrary clipping plane for nodes in its sub graph.

 */
new (function() {

    var idStack = [];
    var clipStack = [];
    var stackLen = 0;
    var dirty;

    SceneJS_eventModule.addListener(
            SceneJS_eventModule.SCENE_COMPILING,
            function() {
                stackLen = 0;
                dirty = true;
            });

    SceneJS_eventModule.addListener(
            SceneJS_eventModule.SCENE_RENDERING,
            function() {
                if (dirty) {
                    if (stackLen > 0) {
                        SceneJS_DrawList.setClips(idStack[stackLen - 1], clipStack.slice(0, stackLen));
                    } else {
                        SceneJS_DrawList.setClips();
                    }
                    dirty = false;
                }
            });

    var Clip = SceneJS.createNodeType("clip");

    Clip.prototype._init = function(params) {
        if (this.core._nodeCount == 1) {
            this.setMode(params.mode);
            this.setA(params.a);
            this.setB(params.b);
            this.setC(params.c);
            this.setD(params.d);
            this.setE(params.e);
            this.setF(params.f);

//            this.core.doClean = function() {
//                var modelMat = SceneJS_modelTransformModule.transform.matrix;
//                var worldA = SceneJS_math_transformPoint3(modelMat, this.a);
//                var worldB = SceneJS_math_transformPoint3(modelMat, this.b);
//                var worldC = SceneJS_math_transformPoint3(modelMat, this.c);
//                var normal = SceneJS_math_normalizeVec3(
//                        SceneJS_math_cross3Vec4(
//                                SceneJS_math_normalizeVec3(
//                                        SceneJS_math_subVec3(worldB, worldA, [0,0,0]), [0,0,0]),
//                                SceneJS_math_normalizeVec3(
//                                        SceneJS_math_subVec3(worldB, worldC, [0,0,0]), [0,0,0])));
//                var dist = SceneJS_math_dotVector3(normal, worldA);
//                this.normalAndDist = [normal[0], normal[1], normal[2], dist];
//            };
        }
    };

    /**
    * Sets the clipping mode. Default is "disabled".
    * The following modes use two clipping planes (abc and def):
    * "outsideOne": everything is clipped what is outside one of the planes
    *               (equivalent to activating 2 independent clpping planes)
    * "outsideBoth": everything is clipped what is outside both of the planes
    *               (this can not be achieved with independent planes)
    */
    Clip.prototype.setMode = function (mode) {
        mode = mode || "outside";
        if (mode != "disabled" && mode != "inside" && mode != "outside" &&
            mode != "outsideOne" && mode != "outsideBoth") {
            throw SceneJS_errorModule.fatalError(
                    SceneJS.errors.ILLEGAL_NODE_CONFIG,
                    "SceneJS.clip has a mode of unsupported type: '" + mode +
                    " - should be 'disabled', 'inside', 'outside', 'outsideOne' or 'outsideBoth'");
        }
        this.core.mode = mode;
    };

    Clip.prototype.getMode = function() {
        return this.core.mode;
    };

    Clip.prototype.setAbc = function(abc) {
        abc = abc || {};
        this.setA(abc.a);
        this.setB(abc.b);
        this.setC(abc.c);
    };

    Clip.prototype.getAbc = function() {
        return {
            a: this.getA(),
            b: this.getB(),
            c: this.getC()
        };
    };

    Clip.prototype.setA = function(a) {
        a = a || {};
        this.core.a = [
            a.x != undefined ? a.x : 0.0,
            a.y != undefined ? a.y : 0.0,
            a.z != undefined ? a.z : 0.0,
            1
        ];
    };

    Clip.prototype.getA = function() {
        return {
            x: this.core.a[0],
            y: this.core.a[1],
            z: this.core.a[2]
        };
    };

    Clip.prototype.setB = function(b) {
        b = b || {};
        this.core.b = [
            b.x != undefined ? b.x : 0.0,
            b.y != undefined ? b.y : 0.0,
            b.z != undefined ? b.z : 0.0,
            1
        ];
    };

    Clip.prototype.getB = function() {
        return {
            x: this.core.b[0],
            y: this.core.b[1],
            z: this.core.b[2]
        };
    };

    Clip.prototype.setC = function(c) {
        c = c || {};
        this.core.c = [
            c.x != undefined ? c.x : 0.0,
            c.y != undefined ? c.y : 0.0,
            c.z != undefined ? c.z : 0.0,
            1
        ];
    };

    Clip.prototype.getC = function() {
        return {
            x: this.core.c[0],
            y: this.core.c[1],
            z: this.core.c[2]
        };
    };

    Clip.prototype.setDef = function(def) {
        def = def || {};
        this.setD(def.d);
        this.setE(def.e);
        this.setF(def.f);
    };

    Clip.prototype.getDef = function() {
        return {
            d: this.getD(),
            e: this.getE(),
            f: this.getF()
        };
    };

    Clip.prototype.setD = function(d) {
        this.core.d = d && [d.x, d.y, d.z, 1];
    };

    Clip.prototype.getD = function() {
        return this.core.d && {
            x: this.core.d[0],
            y: this.core.d[1],
            z: this.core.d[2]
        };
    };

    Clip.prototype.setE = function(e) {
        this.core.e = e && [e.x, e.y, e.z, 1];
    };

    Clip.prototype.getE = function() {
        return this.core.e && {
            x: this.core.e[0],
            y: this.core.e[1],
            z: this.core.e[2]
        };
    };

    Clip.prototype.setF = function(f) {
        this.core.f = f && [f.x, f.y, f.z, 1];
    };

    Clip.prototype.getF = function() {
        return this.core.f && {
            x: this.core.f[0],
            y: this.core.f[1],
            z: this.core.f[2]
        };
    };

    Clip.prototype.getAttributes = function() {
        return {
            mode: this.core.mode,
            a: this.getA(),
            b: this.getB(),
            c: this.getC(),
            d: this.getD(),
            e: this.getE(),
            f: this.getF()
        };
    };

    Clip.prototype._compile = function() {

        var core = this.core;

        var modelMat = SceneJS_modelTransformModule.transform.matrix;
        var worldA = SceneJS_math_transformPoint3(modelMat, core.a);
        var worldB = SceneJS_math_transformPoint3(modelMat, core.b);
        var worldC = SceneJS_math_transformPoint3(modelMat, core.c);
        var normal = SceneJS_math_normalizeVec3(
                SceneJS_math_cross3Vec4(
                        SceneJS_math_normalizeVec3(
                                SceneJS_math_subVec3(worldB, worldA, [0, 0, 0]), [0, 0, 0]),
                        SceneJS_math_normalizeVec3(
                                SceneJS_math_subVec3(worldB, worldC, [0, 0, 0]), [0, 0, 0])));

        var dist = SceneJS_math_dotVector3(normal, worldA);

        core.normalAndDist = [normal[0], normal[1], normal[2], dist];

        if (core.d && core.e && core.f) {
            worldA = SceneJS_math_transformPoint3(modelMat, core.d);
            worldB = SceneJS_math_transformPoint3(modelMat, core.e);
            worldC = SceneJS_math_transformPoint3(modelMat, core.f);
            normal = SceneJS_math_normalizeVec3(
                SceneJS_math_cross3Vec4(
                    SceneJS_math_normalizeVec3(
                        SceneJS_math_subVec3(worldB, worldA, [0, 0, 0]), [0, 0, 0]),
                    SceneJS_math_normalizeVec3(
                        SceneJS_math_subVec3(worldB, worldC, [0, 0, 0]), [0, 0, 0])));

            dist = SceneJS_math_dotVector3(normal, worldA);

            core.normalAndDist2 = [normal[0], normal[1], normal[2], dist];
        }

        clipStack[stackLen] = core;
        idStack[stackLen] = this.attr.id;
        stackLen++;
        dirty = true;

        this._compileNodes();
    };

})();