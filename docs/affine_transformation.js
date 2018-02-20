function drawCircle(ctx, x, y, radius, color) {
    ctx.moveTo(x, y);
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}

function normalizePoint(x, y) {
    var max_height = $("#affine-canvas").height();
    var max_width = $("#affine-canvas").width();
    var buffer = 30;

    var real_x = Math.floor(x + buffer);
    var real_y = Math.floor(y + buffer);

    return [real_x, real_y];
}

function drawPoint(ctx, x, y, color) {
    drawCircle(ctx, x, y, 3, color);
}

function linearTransform(T, x, y) {
    var new_x = T[0][0] * x + T[0][1] * y + T[0][2];
    var new_y = T[1][0] * x + T[1][1] * y + T[1][2];

    return [new_x, new_y];
}

// from: https://stackoverflow.com/a/26080467
function drawArrow(ctx, fromx, fromy, tox, toy){
    var headlen = 5;

    var angle = Math.atan2(toy-fromy,tox-fromx);

    //starting path of the arrow from the start square to the end square and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.strokeStyle = "#d1cdcc";
    ctx.lineWidth = 1;
    ctx.stroke();

    //starting a new path from the head of the arrow to one of the sides of the point
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

    //path from the side point of the arrow, to the other side point
    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));

    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

    //draws the paths created above
    ctx.strokeStyle = "#b5b1b1";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#b5b1b1";
    ctx.fill();
}

var canvas = document.getElementById('affine-canvas');
var ctx = canvas.getContext('2d');

function redraw(interval, t_matrix, height, width, separation, max_intervals) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var image_height = height;
    var image_width = width;

    for (var y = 0; y < image_height; y++) {
        for (var x = 0; x < image_width; x++) {
            var orig_x = x * separation;
            var orig_y = y * separation;


            var new_point = linearTransform(t_matrix, orig_x, orig_y);
            var real_new_point = normalizePoint(new_point[0], new_point[1]);

            var real_point = normalizePoint(orig_x, orig_y);
            var real_x = real_point[0];
            var real_y = real_point[1];

            var new_x = real_new_point[0];
            var new_y = real_new_point[1];

            var diff_x = new_x - real_x;
            var diff_y = new_y - real_y;

            var final_x = real_x + (diff_x / max_intervals) * interval;
            var final_y = real_y + (diff_y / max_intervals) * interval;

            drawPoint(ctx, real_x, real_y, '#333130');
            drawPoint(ctx, final_x, final_y, '#61baf9');

            if (interval === max_intervals) {
                drawArrow(ctx, real_x, real_y, final_x, final_y);
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var a = Number.parseFloat($("#t_a").val());
    var b = Number.parseFloat($("#t_b").val());
    var c = Number.parseFloat($("#t_c").val());
    var d = Number.parseFloat($("#t_d").val());
    var e = Number.parseFloat($("#t_e").val());
    var f = Number.parseFloat($("#t_f").val());

    var transform_matrix = [
        [a, b, c],
        [d, e, f]
    ];

    var max_intervals = 150;
    var redraw_count = 0;
    var interval_id = setInterval(function() {
        redraw(redraw_count, transform_matrix, 4, 3, 40, max_intervals);

        if (redraw_count >= max_intervals) {
            clearInterval(interval_id);
        }
        redraw_count++;
    }, 10);
}

$("#t-matrix-form").submit(function (event) {
    draw();
    event.preventDefault();
});

draw();
