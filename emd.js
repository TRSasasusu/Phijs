// EMD for IIT.
var emd = function(wp, wq, d) {
    var table = [[]];
    var consts = [0];
    for(var i = 0; i < d.length; ++i) {
        for(var j = 0; j < d[i].length; ++j) {
            table[0].push(-d[i][j]);
        }
    }
    var length = d.length * d[0].length;

    for(var i = 0; i < wp.length; ++i) {
        table.push(Array.apply(null, Array(length)).map(function(value, index) {
            if(index >= i * wp.length && index < (i + 1) * wp.length) {
                return 1;
            }
            return 0;
        }));
        consts.push(wp[i]);
    }
    for(var i = 0; i < wq.length; ++i) {
        table.push(Array.apply(null, Array(length)).map(function(value, index) {
            if(index % wq.length == i) {
                return 1;
            }
            return 0;
        }));
        consts.push(wq[i]);
    }

    while(true) {
        var min_value = Math.min(...table[0]);
        if(min_value >= 0) {
            break;
        }

        var min_col_index = table[0].indexOf(min_value);
        var min_divided_const = consts[1] / table[1][min_col_index];
        var min_row_index = 1;
        for(var i = 2; i < wp.length; ++i) {
            var tmp = consts[i] / table[i][min_col_index];
            if(tmp < min_divided_const) {
                min_divided_const = tmp;
                min_row_index = i;
            }
        }

        var previous_d = table[min_row_index][min_col_index];
        table[i] = table[i].map(function(value) {
            return value / previous_d;
        });
        for(var i = 0; i < wp.length; ++i) {
            if(i == min_row_index) {
                continue;
            }
            var coefficient = table[i][min_col_index];
            table[i] = table[i].map(function(value, index) {
                if(index == min_col_index) {
                    return 0;
                }
                return value - coefficient * table[min_row_index][index];
            });
        }
    }

    return consts[0];
    /*fs = [];
    for(var i = 0; i < wp.length; ++i) {
        fs.push(table[0].slice(i * wp.length, (i + 1) * wp.length));
    }*/
}
