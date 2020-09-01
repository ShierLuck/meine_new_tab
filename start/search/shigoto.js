$(document).ready(function() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth()+1;
    month = (month<10 ? '0' : '') + month;

    $('.sort_date').val(year+'-'+month);

    var user_id = setUser();
    var param = { 
        is_ajax: true, 
        month: $('.sort_date').val(),
        user_id: user_id
    };

    if (!localStorage.getItem("show_shigoto")) {
      // localStorage.setItem("show_shigoto", "no");
    }

    show_shigoto = localStorage.getItem("show_shigoto");
    if(show_shigoto === "yes"){
        // setShigoto(param);
        loadThis(param);
    }else{
        $('.shigoto').addClass('display-none');
    }
    $('.btn-store-shigoto').on('click', function(e){
        e.preventDefault();
        var data = { is_ajax: true, user_id: user_id};
        var url = 'http://djun.indonesiafintechforum.org/meine_note/public/api/store_shigoto';
        $.ajax({
            url: url,
            type: "post",
            data: data
        }).done(function (result) {
          // var param = { is_ajax: true, };
          // setShigoto(param);
          loadThis(param);
        }).fail();
    });
});

$('.btn-remove-shigto').on('click', function(e){
    e.preventDefault();
    var ini = $(this), id = ini.data('id');
    console.log(id);
    var data = { is_ajax: true, user_id: user_id};
    var url = 'http://djun.indonesiafintechforum.org/meine_note/public/api/remove_shigoto/'+id;
    $.ajax({
        url: url,
        type: "post",
        data: data
    }).done(function (result) {
      setShigoto();
    }).fail();
});

$('.sort_date').on('change', function(e){
    e.preventDefault();
    var ini = $(this), month = ini.val();
    
    var param = { 
        is_ajax: true, 
        month: month,
        user_id: setUser()
    };
    // setShigoto(param);
    loadThis(param);
    
});
$(".shigoto").delegate(".shigoto_note", "change", function(e){
// $('.shigoto_note').delegate('change', function(e){
    e.preventDefault();
    var ini = $(this), id = ini.data('id'), note = ini.val();

    var param = { 
        is_ajax: true, 
        id: id,
        note: note
    };
    var url = 'http://djun.indonesiafintechforum.org/meine_note/public/api/shigotoNote';
    $.ajax({
        url: url,
        type: "post",
        data: param
    }).done(function (result) {
      if(result.status){
        
      }
    }).fail(); 
});

var shogoto_parent = $('.shigoto');
var input_token = shogoto_parent.find('input[name=_token]');
var attachment_data = {
    is_ajax: true,
    _token: input_token.val(),
    id_parent: '',
    attachments: ''
}
$(".shigoto").delegate(".add_attachment", "click", function(e){
    e.preventDefault();
    var ini = $(this), id_parent = ini.data('id_parent');
    attachment_data.id_parent = id_parent;
    $('#attachment_file').click();
});
$("#attachment_file").on("change", function(e){
    e.preventDefault();
    var el_image = $('#attachment_file'), image = el_image[0].files[0];
    var rP = new FileReader();
    rP.readAsDataURL(image);
    rP.onloadend = function (e) {
        attachment_data.attachments = e.target.result;
        postAttachment(attachment_data);
    };
});
function postAttachment(data) {
    var url = 'http://djun.indonesiafintechforum.org/meine_note/public/api/new_attachment';
    $.ajax({
        url: url,
        type: "post",
        data: data
    })
    .done(function (result) {
        input_token.val(result.newtoken);
        if (result.status) {
            var message = result.message || 'Success';
            console.log(message);
            var param = { 
                is_ajax: true, 
                month: $('.sort_date').val(),
                user_id: setUser()
            };
            loadThis(param);
        } else {
            var message = result.message || 'Api connection problem';
            alert(message);
        }
        input_token.val(result.newtoken);
    })
    .fail(ajax_fail);
}
function ajax_fail(xhr, err) {
    if (xhr.status == 401) {
        alert('Sorry, No Access');
    } else if (xhr.status == 419) {
        alert('Sorry, CSRF failed. Please refresh this page');
    } else {
        alert('Something went wrong. Please try again.');
    }
}
function setShigoto(data) {
    var t_body = $('.shigoto-tbody');
    var url = 'http://djun.indonesiafintechforum.org/meine_note/public/api/getShigoto';
    $.ajax({
        url: url,
        type: "post",
        data: data
    }).done(function (result) {
      if(result.status){
        datas = result.data;
        var naka = "";
        $.each(datas, function( index, value ) {
            
            naka += "<tr>"+
                        "<td>"+
                            datas[index].id +
                        "</td>"+
                        "<td>"+
                            datas[index].check_in +
                        "</td>"+
                        "<td>"+
                            datas[index].check_out +
                        "</td>"+
                        "<td>"+
                            datas[index].time_diff +
                        "</td>"+
                        "<td>"+
                            "<textarea rows='1' class='shigoto_note' style='color:black !important;' data-id='" +datas[index].id +"'>" +
                            datas[index].note +
                            "</textarea>"+
                        "</td>"+
                    "</tr>";
        });
        t_body.html(naka);
      }
    }).fail();
}

function getTimeDiff(in_t, out) {
    var diffMs = (in_t - out); // milliseconds between now & Christmas
    var diffDays = Math.floor(diffMs / 86400000); // days
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    var time_length = diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes)";

    return time_length;
}

function loadThis(data){
    var datas = loadAsData(data);
    url = datas.url;
    param = datas.param;
    th = datas.th;
    col_def = datas.col_def;
    columns = currency.columns;
    
    loadTable(url, param, th, col_def, columns);
}
function loadAsData(data){
    param = data;
    url = "http://djun.indonesiafintechforum.org/meine_note/public/api/getShigoto";
    th = '<th width="5%">ID</th>' +
         '<th>In</th>'+
         '<th>Out</th>'+
         '<th>Length</th>'+
         '<th width="250px">Note</th>'+
         '<th width="350px">Attachment</th>';
    columns = [
                {"data": "id", className: "bg-transparent"},
                {"data": "check_in", className: "bg-transparent"},
                {"data": "check_out", className: "bg-transparent"},
                {"data": "time_diff", className: "bg-transparent"},
                {"data": "id", className: "bg-transparent"},
                {"data": "id", className: "bg-transparent"}
              ];

    col_def = [
            {
                "targets" : 4,
                "data": "id",
                "render" : function (data, type, row) {
                   return "<textarea rows='2' class='shigoto_note' style='color:white !important; width:300px; background-color: transparent' data-id='" +row.id +"'>" +
                            row.note +
                           "</textarea>";
                }
            },
            {
                "targets" : 5,
                "data": "id",
                "render" : function (data, type, row) {
                    var naka = "<ul>";
                    var datas = row.attachments;
                    $.each(datas, function( index, value ) {
                        naka += "<li style='margin-top:3px'>"+
                                    "<a href='http://djun.indonesiafintechforum.org/meine_note/public/"+value.attachment_link +"' target='new' class='white_bold'>"+
                                        value.attachment
                                    "</a>"+
                                "</li>";
                    });
                        naka += "<li style='margin-top:5px'>"+
                                    "<a href='#' class='add_attachment white_bold' data-id_parent='"+row.id+"'>"+
                                    "+Add_Attachment"+
                                    "</a>"+
                                "</li>";
                    naka += "</ul>";
                    return naka;
                }
            },
    ];   

    currency = {
                "url" : url,
                "param" : param,
                "th" : th,
                "col_def" : col_def,
                "columns" : columns,
               }
    return currency;
}