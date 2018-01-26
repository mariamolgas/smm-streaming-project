var errorCount = 0;
var serverAddress = "127.0.0.1";
var state = 'stop';

$('.form').find('input, textarea').on('keyup blur focus', function (e) {

    var $this = $(this),
        label = $this.prev('label');

    if (e.type === 'keyup') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
        } else {
            label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
        } else {
            label.removeClass('highlight');
        }
    } else if (e.type === 'focus') {

        if ($this.val() === '') {
            label.removeClass('highlight');
        } else if ($this.val() !== '') {
            label.addClass('highlight');
        }
    }

});

$('.tab a').on('click', function (e) {

    e.preventDefault();

    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');

    target = $(this).attr('href');

    $('.tab-content > div').not(target).hide();

    $(target).fadeIn(600);

});


var reload = function () {
    location.reload();
}

function buttonPlayPress(puerto, ip) {
    console.log(ip);
    if (state == 'stop') {
        state = 'play';
        var button = d3.select("#button_play").classed('btn-success', true);
        button.select("i").attr('class', "fa fa-pause");
        requesthttp("pl_pause", puerto, ip);
    } else if (state == 'play' || state == 'resume') {
        state = 'pause';
        d3.select("#button_play i").attr('class', "fa fa-play");
        requesthttp("pl_pause", puerto, ip);
    } else if (state == 'pause') {
        state = 'resume';
        d3.select("#button_play i").attr('class', "fa fa-pause");
        requesthttp("pl_pause", puerto, ip);
    }
    console.log("button play pressed, play was " + state);

}

function buttonStopPress(puerto, ip) {
    state = 'stop';
    var button = d3.select("#button_play").classed('btn-success', false);
    button.select("i").attr('class', "fa fa-play");
    console.log("button stop invoked.");
    requesthttp("pl_stop", puerto, ip);

}


function buttonBackPress(puerto, ip) {
    requesthttp("seek&val=-30S", puerto, ip);
    console.log("button back invoked.");
}

function buttonForwardPress(puerto, ip) {
    requesthttp("seek&val=+30S", puerto, ip);
    console.log("button forward invoked.");
}

function buttonRewindPress(puerto, ip) {
    requesthttp("seek&val=0S", puerto, ip);

    console.log("button rewind invoked.");
}

function buttonFastforwardPress(puerto, ip) {
    requesthttp("seek&val=+1M", puerto, ip);

    console.log("button fast forward invoked.");
}

function requesthttp(command, serverPort, serverAddress) {
    console.log(serverAddress);
    $.ajax({
        url: "http://" + serverAddress + ":" + serverPort + "/requests/status.xml?command=" + command,
        //data: myData,
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp'
        //success: function() { alert("Success"); },
        //error: function() { alert('Failed!'); }
        //beforeSend: setHeader
    });
}



$('#myTable').on('click', '.clickable-row', function (event) {
    $(this).addClass('active').siblings().removeClass('active');
});