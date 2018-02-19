function drawCircle(ctx, x, y, radius) {
    ctx.moveTo(x, y);
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#484041';
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

function drawPoint(ctx, x, y) {
    var point = normalizePoint(x, y);
    drawCircle(ctx, point[0],  point[1], 3);
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
    ctx.strokeStyle = "#79AEA3";
    ctx.lineWidth = 0.5;
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
    ctx.strokeStyle = "#434371";
    ctx.lineWidth = 0.25;
    ctx.stroke();
    ctx.fillStyle = "#434371";
    ctx.fill();
}

var canvas = document.getElementById('affine-canvas');
var ctx = canvas.getContext('2d');

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

    // draw an 'image' of points
    var image_height = 4;
    var image_width = 3;
    for (var y = 0; y < image_height; y++) {
        for (var x = 0; x < image_width; x++) {
            var orig_x = x * 20;
            var orig_y = y * 20;

            drawPoint(ctx, orig_x, orig_y);

            var new_point = linearTransform(transform_matrix, orig_x, orig_y);
            var real_new_point = normalizePoint(new_point[0], new_point[1]);

            var real_point = normalizePoint(orig_x, orig_y);
            var real_x = real_point[0];
            var real_y = real_point[1];

            var new_x = real_new_point[0];
            var new_y = real_new_point[1];

            drawArrow(ctx, real_x, real_y, new_x, new_y);
        }
    }
}

$("#t-matrix-form").submit(function (event) {
    draw();
    event.preventDefault();
});

draw();
