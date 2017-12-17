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

    /*table.push(Array.apply(null, Array(length + wp.length *)).map(function(value) {
        if(
        return 1;
    }));
    consts.push(wp.reduce(function(prev, curr) { return prev + curr; }));*/

    var jj = 0;
    var state = 0;
    while(true) {
        //console.log(state);
        //console.log(table);
        //console.log(consts);

        var min_col_index;

        if(state == 0) {
            min_col_index = table[0].findIndex(function(value, index) {
                if(index < length) {
                    return false;
                }
                return value > 0;
            });
            if(min_col_index == -1) {
                state = 1;
            }
        }
        if(state == 1) {
            min_col_index = table[0].findIndex(function(value, index) {
                if(index >= length) {
                    return false;
                }
                return value < 0;
            });
            if(min_col_index == -1) {
                state = 2;
                table = table.slice(1);
                for(var i = 0; i < table.length; ++i) {
                    table[i] = table[i].slice(0, length);
                }
                consts = consts.slice(1);
            }
        }
        if(state == 2) {
            /*if(wp.findIndex(function(value) { return value == 0.25; }) != -1) {
    console.log(table);
    console.log(consts);
            }*/
            /*min_col_index = table[0].findIndex(function(value, index) {
                return value < 0;
            });
            if(min_col_index == -1) {
                break;
            }*/
            var min_value = Math.min(...table[0]);
            if(min_value >= 0) {
                for(var i = 1; i < table.length; ++i) {
                    var post_const = consts[0] - consts[i];
                    if(post_const >= consts[0]) {
                        continue;
                    }
                    var tmp = [].concat(table[0]);
                    var has_negative = false;
                    tmp = tmp.map(function(value, index) {
                        var diff = value - table[i][index];
                        if(diff < 0) {
                            has_negative = true;
                        }
                        return diff;
                    });
                    if(has_negative) {
                        continue;
                    }
                    table[0] = tmp;
                    consts[0] = post_const;
                }
                for(var i = 1; i < table.length; ++i) {
                    var post_const = consts[0] + consts[i];
                    if(post_const >= consts[0]) {
                        continue;
                    }
                    var tmp = [].concat(table[0]);
                    var has_negative = false;
                    tmp = tmp.map(function(value, index) {
                        var diff = value + table[i][index];
                        if(diff < 0) {
                            has_negative = true;
                        }
                        return diff;
                    });
                    if(has_negative) {
                        continue;
                    }
                    table[0] = tmp;
                    consts[0] = post_const;
                }
                break;
            }

            min_col_index = table[0].indexOf(min_value);
        }
        /*min_col_index = table[0].findIndex(function(value) { return value > 0; });
        if(min_col_index == -1) {
            break;
        }*/
        /*if(Math.random() < 0.05) {
            //min_col_index = table[0].findIndex(function(value) { return value < 0; });
            //if(min_col_index == -1) {
            //    break;
            //}
            indexes = [];
            for(var i = 0; i < table[0].length; ++i) {
                if(table[0][i] < 0) {
                    indexes.push(i);
                }
            }
            min_col_index = indexes[Math.floor(Math.random() * indexes.length)];
            console.log('RANDOM!')
        }
        else {
            var min_value = Math.min(...table[0]);
            if(min_value < 0) {
                break;
            }

            min_col_index = table[0].indexOf(min_value);
        //}*/


        var min_divided_const = null;
        /*if(table[1][min_col_index] == 0) {
            min_divided_const = null;
        }
        else {
            min_divided_const = consts[1] / table[1][min_col_index];
            if(min_divided_const < 0) {
                min_divided_const = null;
            }
        }*/
        var min_row_index = null;
        for(var i = (state == 2 ? 1 : 2); i < table.length; ++i) {
            if(table[i][min_col_index] == 0) {
                continue;
            }
            var tmp = consts[i] / table[i][min_col_index];
            if(tmp < 0) {
                continue;
            }
            if(min_divided_const == null || tmp < min_divided_const) {
                min_divided_const = tmp;
                min_row_index = i;
                if(state == 1) {
                    break;
                }
                /*if(tmp < 0) {
                    break;
                }*/
            }
        }
        if(min_divided_const == null) {
            throw new Error('all zero!, min_col_index: ' + min_col_index);
        }

        //console.log('min_(row, col)_index: (' + min_row_index + ', ' + min_col_index + ')');

        var previous_d = table[min_row_index][min_col_index];
        table[min_row_index] = table[min_row_index].map(function(value) {
            return value / previous_d;
        });
        consts[min_row_index] /= previous_d;
        for(var i = 0; i < table.length; ++i) {
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
            consts[i] -= coefficient * consts[min_row_index];
        }
        ++jj;
        if(jj > 80) {
            console.log(table);
            console.log(consts);
            throw new Error('hogehoge~');
            break;
        }
    }

    /*if(-consts[0] - 0.33333 < 0.0001) {
            console.log(table);
            console.log(consts);
    }*/
    return -consts[0];
};

onmessage = function(e) {
    postMessage(emd(e.data['wp'], e.data['wq'], e.data['d']));
    close();
};
