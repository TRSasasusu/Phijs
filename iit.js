var IIT = function(graph_conns, graph_kinds, current_on, small_phi_js, emd_js) {
    this.graph_conns = graph_conns;
    this.graph_kinds = graph_kinds;
    this.current_on = current_on;

    if(small_phi_js == undefined) {
        small_phi_js = 'small_phi.js';
    }
    if(emd_js == undefined) {
        emd_js = 'emd.js';
    }

    var main_worker = new Worker(small_phi_js);
    main_worker.addEventListener('message', function(msg) {
        console.log(msg.data);
        var row = 1, col = 0;
        var partition_func = function(msg) {
            while(this.graph_conns[row][col] == 0) {
                ++col;
                if(col == row) {
                    col = 0;
                    ++row;
                }

                if(row == this.current_on.length) {
                    // TODO
                }
            }

            var partition_worker = new Worker(small_phi_js);
            partition_worker.addEventListener('message', partition_func.bind(this));
            partition_worker.postMessage({
                graph_conns: this.graph_conns,
                graph_kinds: this.graph_kinds,
                current_on: this.current_on,
                calc_emd: true,
                emd_js: emd_js,
            });
        };
    }.bind(this));
    main_worker.postMessage({
        graph_conns: this.graph_conns,
        graph_kinds: this.graph_kinds,
        current_on: this.current_on,
        calc_emd: false,
    });
};
