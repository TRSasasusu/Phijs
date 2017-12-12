var IIT = function(graph_conns, graph_kinds, current_on, small_phi_js) {
    this.graph_conns = graph_conns;
    this.graph_kinds = graph_kinds;
    this.current_on = current_on;

    if(small_phi_js == undefined) {
        small_phi_js = 'small_phi.js';
    }

    var main_worker = new Worker(small_phi_js);
    main_worker.addEventListener('message', function(msg) {
        console.log(msg.data);
    });
    main_worker.postMessage({
        graph_conns: this.graph_conns,
        graph_kinds: this.graph_kinds,
        current_on: this.current_on,
        calc_emd: false,
    });
};
