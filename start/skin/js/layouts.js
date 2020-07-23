var url = '';
var param = {};
var th = "";
var col_def = [];
var columns = [];
var dataTable;

$(document).ready(function(){
    
});


// ndak pake koko made

function loadTable(url, param, th, col_def, columns){
    var table = '<table id="data-table-data" class="table table-bordered table-hover table-striped data-table-data bg-transparent">' +
        '           <thead class="bg-transparent">' +
        '               <tr>';
        table += th +
        '               </tr>' +
        '           </thead>' +
        '           <tbody class="tbody-data-table bg-transparent">';
        table += '      <tr><td colspan="6"><h3 class="el-waiting-message">Hey it is longer than the usual.. Please be a little more patient :)</h3></td></tr>';
        table += '  </tbody>' +
        '       </table>';
    
    load_table = [
            {
                "table": table
            }
        ]
    var wrapper = $("#dataTableRow");
    if(wrapper.length){
    }else{
        card_body = $('.card-body');
        card_body.empty();
        n_wrapper = '<div class="table-responsive dataTableRow" id="dataTableRow">' +
                        '<label class="el-waiting-message">Loading your data. It may take some time..</label>'+
                    '</div>';
        card_body.html(n_wrapper);
    }
    
    wrapper = $("#dataTableRow");
    wrapper.empty();
    wrapper.html('<h3>Loading your data. It may take some time..</h3>');
    
    setData(wrapper, url, param, "data-table-data", table, col_def, columns);
}

function setData(wrapper, url, param, table_id, logos, col_def, columns, table_settings) {
    // var wrapper = $("#dataTableRow");
    // wrapper.empty();
    // wrapper.html('<h3>Loading your data. It may take some time..</h3>');
    if(dataTable) {
        if(typeof(dataTable.destroy) === 'function') {
            dataTable.settings()[0].jqXHR.abort();
            // v.destroy();
        }
    }
    if(!table_settings){
        table_settings = {
            "lengthMenu": [[10, 25, 50, 100, 150, 200, 250, 500], [10, 25, 50, 100, 150, 200, 250, 500]],
            "destroy": true,
            "bDestroy": true,
            "processing": true,
            "serverSide": true,
            "ordering": false,
            "ajax": {
                "url": url,
                "data": param
            },
            "dataSrc": function (result) {
                var json = result.model.rows;
                return json;
            },
            "columns": columns,
            "columnDefs": col_def,
            "bPaginate": false,
            "bLengthChange": false,
            "bFilter": false,
            "bSort": false,
            "bInfo": false,
            "bAutoWidth": true,
            "sDom": '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"pull-left"i><"pull-right"p>>>'+'Br',
            "buttons": [
                'excelHtml5',
                'pdfHtml5'
            ]
        }
    }
    setTimeout(function () {
        wrapper.empty();
        var table_id = table_id;
        var table = $(logos);
        table.appendTo(wrapper);
        
        dataTable = table.DataTable(table_settings);

        var label = $(".el-waiting-message");
        setTimeout(function () {label.html("Hey, we did not expect it would be this long");}, 5000);
        setTimeout(function () {label.html("Oh dear, we are so sorry for waiting this so long");}, 10000);
        setTimeout(function () {label.html("Perhaps you want to grab some coffee first?");}, 15000);
        setTimeout(function () {label.html("Well... don't know what to say anymore..");}, 20000);
        setTimeout(function () {label.html("OK, are you sure still want to be waiting?");}, 25000);
        setTimeout(function () {label.html("I think you may want to press that button back, sorry :(");}, 25000);
    }, 2000);
}
 
 
 
 
 
 