/** Activates a shader program for sub-nodes.
 *
 */
SceneJs.shader = function() {
    var cfg = SceneJs.utils.getNodeConfig(arguments);
    var programId;
    var backend;

    return function(scope) {
        var params = cfg.getParams(scope);

        if (!backend) {
            if (!params.type) {
                throw new SceneJs.exceptions.NodeConfigExpectedException("Mandatory shader parameter missing: \'type\'");
            }
            backend = SceneJs.backends.getBackend(params.type);
        }

        /* Lazy-load shaders
         */
        if (!programId) {
            programId = backend.loadProgram();
        }

        /* Save any state set by higher shader node
         */
        var previousProgramId = backend.getActiveProgramId(); // Save active shaders
        var previousVars;
        if (previousProgramId) {
            previousVars = backend.getVars();
        }

        /* Activate new shaders and vars
         */
        backend.activateProgram(programId);
        if (params.vars) {
            backend.setVars({
                vars: params.vars,
                fixed : cfg.fixed // Sub-vars are cacheable if these are not dynamically-generated
            });
        }

        SceneJs.utils.visitChildren(cfg, scope);

        /* Restore any state saved for higher
         */
        if (previousProgramId) {
            backend.activateProgram(previousProgramId);
            if (previousVars) {
                backend.setVars(previousVars);
            }
        } else {
            backend.deactivateProgram();
        }
    };
};

