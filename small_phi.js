var SmallPhi = function(graph_conns, graph_kinds, current_on, calc_emd, default_cause_rep, emd_js) {
    this.graph_conns = graph_conns;
    this.graph_kinds = graph_kinds;
    this.current_on = current_on;

    this.calc_emd = calc_emd;
    this.default_cause_rep = default_cause_rep;

    this.emd_js = emd_js;
};

SmallPhi.prototype.calculate = function() {
    function calcNext(x) {
        var next = "";
        for(var i = 0; i < x.length; ++i) {
            var next_end = 0;
            if(this.graph_kinds[i] == "OR") {
                for(var j = 0; j < x.length; ++j) {
                    if(i == j) {
                        continue;
                    }
                    if(this.graph_conns[j][i] == 1 && x[j] == 1) {
                        next_end = 1;
                        break;
                    }
                }
            }
            else if(this.graph_kinds[i] == "AND") {
                for(var j = 0; j < x.length; ++j) {
                    if(i == j) {
                        continue;
                    }
                    if(this.graph_conns[j][i] == 1) {
                        if(x[j] == 1) {
                            next_end = 1;
                        }
                        else {
                            next_end = 0;
                            break;
                        }
                    }
                }
            }
            else if(this.graph_kinds[i] == "XOR") {
                var number_of_on = 0;
                for(var j = 0; j < x.length; ++j) {
                    if(i == j) {
                        continue;
                    }
                    if(this.graph_conns[j][i] == 1) {
                        if(x[j] == 1) {
                            ++number_of_on;
                        }
                    }
                }
                next_end = number_of_on % 2;
            }
            next += next_end;
        }
        return next;
    }
    function calcDistance(a, b) {
        var num = 0;
        for(var i = 0; i < a.length; ++i) {
            if(a != b) {
                ++num;
            }
        }
        return num;
    }
    function cause_repartoire() {
        console.log(this);
        cause_rep = {}
        max_number = parseInt(this.current_on.replace(/0/g, '1'), 2);
        sum = 0;
        for(var i = 0; i <= max_number; ++i) {
            past_on = i.toString(2);
            while(past_on.length < this.current_on.length) {
                past_on = '0' + past_on;
            }
            console.log(past_on);

            var next = calcNext.call(this, past_on);
            console.log("next: " + next);

            if(next == this.current_on) {
                cause_rep[past_on] = 1;
                ++sum;
            }
            else {
                cause_rep[past_on] = 0;
            }
        }

        for(key in cause_rep) {
            cause_rep[key] /= sum;
        }

        console.log(cause_rep);

        if(!this.calc_emd) {
            postMessage(cause_rep);
        }

        var wp = [];
        var wq = [];
        var keys = Object.keys(cause_rep);
        for(key of keys) {
            wp.push(cause_rep[key]);
            wq.push(this.default_cause_rep[key]);
        }
        d = [];
        for(var i = 0; i < wp.length; ++i) {
            d.push([]);
            for(var j = 0; j < wq.length; ++j) {
                d[i].push(calcDistance(keys[i], keys[j]));
            }
        }

        importScripts(this.emd_js);
        var phi = emd(wp, wq, d);
        postMessage(phi);

        /*var a_rep = {}, b_rep = {};
        if(Math.max.apply(null, Object.values(cause_rep)) < Math.max.apply(null, Object.values(this.default_cause_rep))) {
            Object.keys(cause_rep),forEach(function(key) {
                a_rep[key] = cause_rep[key];
            });
            Object.keys(this.default_cause_rep),forEach(function(key) {
                b_rep[key] = this.default_cause_rep[key];
            });
        }
        else {
            Object.keys(cause_rep),forEach(function(key) {
                b_rep[key] = cause_rep[key];
            });
            Object.keys(this.default_cause_rep),forEach(function(key) {
                a_rep[key] = this.default_cause_rep[key];
            });
        }

        var emd = 0;
        for(var i = 0; i < this.current_on.length; ++i) {
            for(b_key in b_rep) {
                var a_keys = []
                for(a_key in a_rep) {
                    if(i != calcDistance(b_key, a_key)) {
                        continue;
                    }
                    a_keys.push(a_key);
                }
                var value = Math.max(b_rep[b_key] / a_keys.length, a_rep
                for(var j = 0; j < a_keys.length; ++j) {
                    
                }
            }
        }*/
    }
    cause_repartoire.call(this);
};

onmessage = function(e) {
    var small_phi = new SmallPhi(e.data['graph_conns'], e.data['graph_kinds'], e.data['current_on'], e.data['calc_emd'], e.data['emd_js']);
    small_phi.calculate();
}
