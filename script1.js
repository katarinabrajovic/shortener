function api_get(url, data, on_success, on_error) {
    api_call(url, data, 'GET', on_success, on_error);
};

function api_post(url, data, on_success, on_error) {
    api_call(url, data, 'POST', on_success, on_error);
};
function api_patch(url, data, on_success, on_error) {
    api_call(url, data, 'PATCH', on_success, on_error);
};
function api_put(url, data, on_success, on_error) {
    api_call(url, data, 'PUT', on_success, on_error);
};

function api_call(url,data, method, on_success, on_error) {

    $.ajax({
        async:false,
        url: url,
        type: method,
//            params: {jdata: data},
        success: function(result) {
            if(on_success !== undefined && typeof on_success === "function") {
                on_success(result);
            }
        },
        error: function(data) {
            if(on_error !== undefined && typeof on_error === "function") {
                on_error(data);
            }

        }
    });
}

var counter = 0;
var broj = 1;
var b=1;
var pagin = '';

function get_ok(response) {
    console.log('GET OK', response);
    var res = response;
    console.log(res);
    console.log(typeof res);

    var res = jQuery.parseJSON(res);
    var link = 'http://min.bz/'+res['short_url'];
    var expiring = res['expiring_date'];
    console.log(res);
     var strana = '<tr class="content1">'+
                 '<td id="short_url"><a href="'+link+'">'+link+'</a></td>'+
                 '<td id="expiring_data">'+expiring+'</td>'+
                 '<td id="num_clicks"></td>'+
               '</tr>';
    var pageSize = 4;
    var klasa = '';
    if(broj==pageSize){klasa = 'current';}else{klasa='';}
    if(broj%pageSize==0){
        pagin += "<li><p class='"+klasa+" klik'>"+b+"</p></li>";
        b++;
    }
    broj++;
    $('#pagin').html(pagin);


    $(".klik").on('click',function() {
        $(".klik").removeClass("current");
        $(this).addClass("current");
        showPage(parseInt($(this).text()))
    });

    $("#preview").append(strana);
    $("#preview").fadeIn();
    $("#pagin").fadeIn();


    showPage = function(page) {
        $(".content1").hide();
        $(".content1").each(function(n) {
            if (n >= pageSize * (page - 1) && n < pageSize * page)
                $(this).show();
        });
    }

    showPage(1);

    // $('.clear').fadeIn();

}

function get_err(response) {
    alert("Error"+ response);


}
$(document).ready(function() {
    $('#preview').hide();
    $('#pagin').hide();

//     // $('.clear').hide();
});
$(document).on('click','#btn_sub',function() {
    console.log('SUBMITUJE');
   var params = {
        long_url: $("#enter_url").val(),
        custom_alias: $("#basic-url").val(),
        exp_days: $(".exp_days:checked").val()

    }
    console.log(params);
    
    var s = "";
    for(var i in params){
        var str = i + '=' + params[i] +'&' ;
        s += str;
    }

    s = s.slice(0, -1);
    api_get("http://localhost:8601/api/create_short?" + s, s, get_ok, get_err);



    
    // $(".clear").click(function(){
    //     $(".clear").fadeOut();
    //     document.getElementById("data").reset();
    //     $("#pdfplaceholder").fadeOut();
    //
    // });

    return false;
});

//login
$(document).on('click', '#login_button', function () {
    var params = {
        username: $("#login_username").val(),
        password: $("#login_password").val()
    }
    console.log(params);

    var s = "";
    for(var i in params){
        var str = i + '=' + params[i] +'&' ;
        s += str;
    }

    s = s.slice(0, -1);

    api_post("http://localhost:8601/api/user/login?" + s, s, get_ok, get_err);
});

//register
$(document).on('click', '#register_button', function () {
    var params = {
        username: $("#login_username").val(),
        email: $("#register_email").val(),
        password: $("#login_password").val()
    }
    console.log(params);

    var s = "";
    for(var i in params){
        var str = i + '=' + params[i] +'&' ;
        s += str;
    }

    s = s.slice(0, -1);

    api_post("http://localhost:8601/api/user/register?" + s, s, get_ok, get_err);
});

//forgot password
$(document).on('click', '#lost_pass_btn', function () {

    var email = $("#lost_email").val();

    api_put("http://localhost:8601/api/user/password/forgot?" + email, email, get_ok, get_err);
});