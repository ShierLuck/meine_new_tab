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
    setShigoto(param);

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
          setShigoto(param);
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
        month: month
    };
    setShigoto(param);
    
});

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
                            "<button class='btn btn-remove-shigto' data-id='" +
                                datas[index].id +
                            "'>DEL</button>" +
                        "</td>"+
                    "</tr>";
        });
        t_body.html(naka);
      }
    }).fail();
}