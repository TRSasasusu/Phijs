// EMD for IIT.
var emd = function(wp, wq, d) {
    var length = d.length * d[0].length;
    var table = [Array.apply(null, Array(length + wp.length * 2)).map(function(value, index) {
        if(index >= length) {
            return 1;
        }
        return 0;
    }), []];
    var consts = [0, 0];
    var subscripts = Array.apply(null, Array(wp.length * 2 + 2)).map(function(value, index) {
        return wp.length * 2 + index - 2;
    });
    for(var i = 0; i < d.length; ++i) {
        for(var j = 0; j < d[i].length; ++j) {
            table[1].push(d[i][j]);
        }
    }
    for(var i = 0; i < d.length * 2; ++i) {
        table[1].push(0);
    }

    for(var i = 0; i < wp.length; ++i) {
        table.push(Array.apply(null, Array(length)).map(function(value, index) {
            if(index >= i * wp.length && index < (i + 1) * wp.length) {
                return 1;
            }
            return 0;
        }).concat(Array.apply(null, Array(wp.length * 2)).map(function(value, index) {
            if(index == i) {
                return 1;
            }
            return 0;
        })));
        consts.push(wp[i]);
    }
    for(var i = 0; i < wq.length; ++i) {
        table.push(Array.apply(null, Array(length)).map(function(value, index) {
            if(index % wq.length == i) {
                return 1;
            }
            return 0;
        }).concat(Array.apply(null, Array(wp.length * 2)).map(function(value, index) {
            if(index == i + wp.length) {
                return 1;
            }
            return 0;
        })));
        consts.push(wq[i]);
    }

    for(var i = 2; i < wp.length * 2 + 2; ++i) {
        table[0] = table[0].map(function(value, index) {
            return value - table[i][index];
        });
    }

    var state = 0;
    while(true) {
        var selected_col_index = null;
        var selected_col_subscript = null;
        for(var i = 0; i < table[0].length; ++i) {
            if(table[0][i] < 0 && (selected_col_subscript == null || subscripts[i] < selected_col_subscript)) {
                selected_col_subscript = subscripts[i];
                selected_col_index = i;
            }
        }
        if(selected_col_index == null) {
            if(state == 0) {
                state = 1;
                table = table.slice(1);
                for(var i = 0; i < table.length; ++i) {
                    table[i] = table[i].slice(0, length);
                }
                consts = consts.slice(1);
                continue;
            }

            return -consts[0];
        }

        var selected_row_index = null;
        var selected_divided_const = null;
        var selected_row_subscript = null;
        for(var i = 2; i < table.length; ++i) {
            if(table[i][selected_col_index] <= 0) {
                continue;
            }
            if(selected_row_index == null ||
                    consts[i] / table[i][selected_col_index] < selected_divided_const ||
                    (consts[i] / table[i][selected_col_index] == selected_divided_const && subscripts[i] < selected_row_subscript)) {
                selected_row_subscript = subscripts[i];
                selected_row_index = i;
                selected_divided_const = consts[i] / table[i][selected_col_index];
            }
        }
        if(selected_row_index == null) {
            throw new Error('selected_row_index == null!');
        }

        var origin_coefficient = table[selected_row_index][selected_col_index];
        table[selected_row_index] = table[selected_row_index].map(function(value) {
            return value / origin_coefficient;
        });
        consts[selected_row_index] /= origin_coefficient;

        for(var i = 0; i < table.length; ++i) {
            if(i == selected_row_index) {
                continue;
            }
            var coefficient = table[i][selected_col_index];
            table[i] = table[i].map(function(value, index) {
                return value - table[selected_row_index][index] * coefficient;
            });
            consts[i] -= consts[selected_row_index] * coefficient;
        }

        var tmp = subscripts[selected_col_index];
        subscripts[selected_col_index] = subscripts[selected_row_index - 2 + wp.length * 2];
        subscripts[selected_row_index - 2 + wp.length * 2] = tmp;
    }
};

onmessage = function(e) {
    try {
        postMessage(emd(e.data['wp'], e.data['wq'], e.data['d']));
    }
    catch(e) {
        postMessage(null);
    }
    close();
};
