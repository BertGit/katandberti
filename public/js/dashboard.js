$(document).ready(function () {
    $('#table_id').DataTable({
        ajax: "/api/guests",
        paging: false,
        info: false,
        rowCallback: (row, data, index) => {
            $(row).find('td:eq(5)').css('color', data[5] === 'Not visited yet' ? 'red' : 'green')
            let c = '#dedede'
            if (data[3] === 'ACCEPTED') {
                c = '#96ff96'
            } else if (data[3] === 'DECLINED') {
                c = '#ff9696'
            }
            $(row).find('td:eq(3)').css('background-color', c)
        },
        buttons: [
            {
                text: 'Reload',
                action: function (e, dt, node, config) {
                    dt.ajax.reload();
                }
            }
        ]
    });
});