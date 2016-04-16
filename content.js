// ########## CONSTANTS ##########

var KEY_ETR = 13;
var KEY_DOT = 46;
var KEY_SLSH = 47;
var KEY_QUES = 63;  // ? ( shift + / )
var KEY_G = 71;     // G ( shift + g )
var KEY_C = 99;
var KEY_H = 104;
var KEY_J = 106;
var KEY_K = 107;
var KEY_L = 108;
var KEY_O = 111;
var KEY_P = 112;
var KEY_R = 114;

var CODE_ESC = 27;

// ########## VARIABLES ##########

var CURSOR = 0;

// ########## FUNCTIONS ##########

function is_list_screen(){
    return location.href.match(/node\/.+/) == null;
}

function is_node_screen(){
    return location.href.match(/node\/.+/) != null;
}

function handle_list_screen(evt){

    // ignore keyboard event if not focus on body
    if(document.activeElement.tagName != 'BODY'){
        return;
    }

    if(evt.which == KEY_J){ // down
        if(CURSOR < $('.node').length-1){ CURSOR += 1; }
    }
    else if(evt.which == KEY_K){ // up
        if(CURSOR > 0){ CURSOR -= 1; }
    }
    else if(evt.which == KEY_H){ // previous page
        var reg = location.href.match(/node\?page=(.+)/);
        if(reg){
            var prev_page = parseInt(reg[1])-1;
            if(prev_page >= 0){
                location.href = "/node?page=" + prev_page;
            }
        }
    }
    else if(evt.which == KEY_L){ // next page
        var reg = location.href.match(/node\?page=(.+)/);
        var next_page = reg ? parseInt(reg[1])+1 : 1;
        location.href = "/node?page=" + next_page;
    }
    else if(evt.which == KEY_R){ // refresh
        location.reload();
    }
    else if(evt.which == KEY_DOT){ // top
        CURSOR = 0;
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
    else if(evt.which == KEY_G){ // bottom
        CURSOR = $('.node').length - 1;
        window.scrollTo({ left: 0, top: $('.node').last().offset().top, behavior: 'smooth' });
    }
    else if(evt.which == KEY_O){ // open link window
        window.open($('.node.active .node-readmore a')[0].href);
    }
    else if(evt.which == KEY_P){ // share g+
        var url = 'https://plus.google.com/share?url=' + $('.node.active .node-readmore a')[0].href;
        window.open(url, 'gplus', "height=500,width=500,left=600,top=200");
    }
    else if(evt.which == KEY_QUES){ // help
        var msg = ''
                + '=== CURSOR ===\n'
                + '\n'
                + 'H - Move Previous page\n'
                + 'L - Move Next page\n'
                + 'K - Move Up\n'
                + 'J - Move Down\n'
                + '. - Move Top\n'
                + 'SHIFT+G - Move Bottom\n'
                + '\n'
                + '=== OTHER ===\n'
                + '\n'
                + 'R - Refresh\n'
                + 'O - Open in new window\n'
                + 'P - Share to Google+\n'
                ;
        alert(msg);
    }

    // update cursor
    $('.node').removeClass('active');
    $('.node').eq(CURSOR).addClass('active');

    // handle scroll
    var win_height = window.innerHeight;
    var abs_offset = $('.node.active').offset().top;
    var rel_offset = abs_offset - window.scrollY;
    //
    // console.log( win_height, rel_offset, abs_offset);
    //
    if((evt.which == KEY_J)&&(rel_offset + 100 > win_height)){ // close to end
        // console.log('down', abs_offset, abs_offset-50, 'x');
        window.scrollTo({ left: 0, top: abs_offset - 50, behavior: 'smooth' });
    }
    else if((evt.which == KEY_K)&&(rel_offset < 50)){ // close to top
        // console.log('up', abs_offset, win_height, abs_offset - (win_height/2), 'x');
        window.scrollTo({ left: 0, top: abs_offset - (win_height/2), behavior: 'smooth' });
    }
}

function handle_node_screen(evt){

    // ignore keyboard event if not focus on body
    if(document.activeElement.tagName != 'BODY'){
        return;
    }

    // gather content + comment
    var items = $.merge( $('.node'), $('.comment')); 

    if(evt.which == KEY_J){ // down
        if(CURSOR < items.length-1){ CURSOR += 1; }
    }
    else if(evt.which == KEY_K){ // up
        if(CURSOR > 0){ CURSOR -= 1; }
    }
    /*
    else if(evt.which == KEY_C){ // add comment
        window.scrollTo({ left: 0, top: $('#comment-area').offset().top, behavior: 'smooth' });
        $('#comment-area textarea').focus();
    }
    */
    else if(evt.which == KEY_R){ // reply
        var reply_link = $(items).eq(CURSOR).find('.comment-links a');
        if(reply_link.length == 1){
            location.href = reply_link.attr('href');
        }
    }
    else if(evt.which == KEY_DOT){ // top
        CURSOR = 0;
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
    else if(evt.which == KEY_G){ // bottom
        CURSOR = items.length - 1;
        window.scrollTo({ left: 0, top: $(items).last().offset().top, behavior: 'smooth' });
    }
    else if(evt.which == KEY_P){ // share g+
        var url = 'https://plus.google.com/share?url=' + location.href;
        window.open(url, 'gplus', "height=500,width=500,left=600,top=200");
    }
    else if(evt.which == KEY_QUES){ // help
        var msg = ''
                + '=== CURSOR ===\n'
                + '\n'
                + 'K - Move Up\n'
                + 'J - Move Down\n'
                + '. - Move Top\n'
                + 'SHIFT+G - Move Bottom\n'
                + '\n'
                + '=== OTHER ===\n'
                + '\n'
                // + 'C - Add new comment\n'
                + 'R - Reply\n'
                + 'P - Share to Google+\n'
                ;
        alert(msg);
    }

    // update cursor
    $(items).removeClass('active');
    $(items).eq(CURSOR).addClass('active');

    // handle scroll
    var win_height = window.innerHeight;
    var abs_offset = $('.active').offset().top;
    var rel_offset = abs_offset - window.scrollY;
    //
    // console.log( win_height, rel_offset, abs_offset);
    //
    if((evt.which == KEY_J)&&(rel_offset + 100 > win_height)){ // close to end
        // console.log('down', abs_offset, abs_offset-50, 'x');
        window.scrollTo({ left: 0, top: abs_offset - 50, behavior: 'smooth' });
    }
    else if((evt.which == KEY_K)&&(rel_offset < 50)){ // close to top
        // console.log('up', abs_offset, win_height, abs_offset - (win_height/2), 'x');
        window.scrollTo({ left: 0, top: abs_offset - (win_height/2), behavior: 'smooth' });
    }
}

// ########## BIND BODY EVENT ##########

$('body').keypress(function(evt){
    //console.log(evt.which);
    //console.log(evt.keyCode);

    // bind event
    if(is_list_screen()){
        handle_list_screen(evt);
    }
    else if(is_node_screen()){
        handle_node_screen(evt);
    }
});
