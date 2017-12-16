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

    this.mip_cause_phi = null;
    this.end = false;

    var main_worker = new Worker(small_phi_js);
    main_worker.addEventListener('message', function(msg) {
        console.log(msg.data);

        var max_number = parseInt(this.current_on.replace(/0/g, '1'), 2);
        var left_group_number = 0;
        var right_group_number = 1;
        function calcDistance(a, b) {
            var num = 0;
            for(var i = 0; i < a.length; ++i) {
                if(a != b) {
                    ++num;
                }
            }
            return num;
        }
        var partitionFunc = function() {
            if(right_group_number == max_number && left_group_number == max_number) {
                this.end = true;
                console.log('phi^MIP_cause = ' + this.mip_cause_phi);
                return;
            }
            if(right_group_number == max_number + 1) {
                right_group_number = 0;
                ++left_group_number;
            }
            var left_group = left_group_number.toString(2);
            var right_group = right_group_number.toString(2);
            while(left_group.length < this.current_on.length) {
                left_group = '0' + left_group;
            }
            while(right_group.length < this.current_on.length) {
                right_group = '0' + right_group;
            }

            var partition_cause_rep = [null, null];
            var partition_worker = [new Worker(small_phi_js), new Worker(small_phi_js)];
            partition_worker[0].addEventListener('message', function(partition_msg) {
                partition_cause_rep[0] = partition_msg.data;
                if(partition_cause_rep[1] == null) {
                    return;
                }
                calcCausePhi.call(this, partition_cause_rep);
            }.bind(this));
            partition_worker[1].addEventListener('message', function(partition_msg) {
                partition_cause_rep[1] = partition_msg.data;
                if(partition_cause_rep[0] == null) {
                    return;
                }
                calcCausePhi.call(this, partition_cause_rep);
            }.bind(this));

            var partition_conns = [[], []];
            for(var i = 0; i < this.graph_conns.length; ++i) {
                partition_conns[0].push('');
                partition_conns[1].push('');
                for(var j = 0; j < this.current_on.length; ++j) {
                    if(left_group[i] == 0) {
                        partition_conns[0][i] += 0;
                        if(right_group[j] == 0) {
                            partition_conns[1][i] += this.graph_conns[i][j];
                        }
                        else {
                            partition_conns[1][i] += 0;
                        }
                    }
                    else {
                        if(right_group[j] == 0) {
                            partition_conns[0][i] += 0;
                        }
                        else {
                            partition_conns[0][i] += this.graph_conns[i][j];
                        }
                        partition_conns[1][i] += 0;
                    }
                }
            }
            partition_worker[0].postMessage({
                graph_conns: partition_conns[0],
                graph_kinds: this.graph_kinds,
                current_on: this.current_on,
                calc_emd: false,
            });
            partition_worker[1].postMessage({
                graph_conns: partition_conns[1],
                graph_kinds: this.graph_kinds,
                current_on: this.current_on,
                calc_emd: false,
            });

            ++right_group_number;
        };

        var calcCausePhi = function(partition_cause_rep) {
            var cause_rep = [].concat(partition_cause_rep[0]).map(function(value, index) {
                return value + partition_cause_rep[1][index];
            });

            var wp = [];
            var wq = [];
            var keys = Object.keys(cause_rep);
            for(key of keys) {
                wp.push(cause_rep[key]);
                wq.push(msg.data[key]);
            }
            d = [];
            for(var i = 0; i < wp.length; ++i) {
                d.push([]);
                for(var j = 0; j < wq.length; ++j) {
                    d[i].push(calcDistance(keys[i], keys[j]));
                }
            }

            var emd_worker = new Worker(emd_js);
            emd_worker.addEventListener('message', function(emd_msg) {
                if(this.mip_cause_phi == null || this.mip_cause_phi > emd_msg.data) {
                    this.mip_cause_phi = emd_msg.data;
                }
                partitionFunc.call(this);
            }.bind(this));
            emd_worker.postMessage({
                wp: wp,
                wq: wq,
                d: d,
            });
        };

        partitionFunc.call(this);

        /*
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
        */
    }.bind(this));
    main_worker.postMessage({
        graph_conns: this.graph_conns,
        graph_kinds: this.graph_kinds,
        current_on: this.current_on,
        calc_emd: false,
    });
};
