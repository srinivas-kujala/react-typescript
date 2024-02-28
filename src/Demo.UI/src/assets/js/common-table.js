"use strict";

$(function () {

    // #region Constants

    const $commonTable = $('#commonTable');
    const $commonDelete = $('#delete');
    const $commonStateChange = $('#changeState');

    // #endregion

    // #region Private Variables

    let extendableCollection = [];
    let selections = [];
    let editUrl = '';

    // #endregion

    // #region Initializer

    initialize();

    // #endregion

    // #region Window Functions

    window.setTableData = function (data) {
        console.log(`Data received: ${data}`);
        extendableCollection = data.map((item, index) => ({
            ...item,
            selected: false,
            rowId: index,
            rowState: false
        }));

        setModelData();
    }

    window.getSelectedRows = function () {
        return $.map($commonTable.bootstrapTable('getSelections'), function (row) {
            return row.rowId
        });
    }

    // #endregion

    // #region Functions

    function initialize() {
        initializeTable();
    }

    function setModelData() {
        $commonTable.bootstrapTable('showLoading');
        $commonTable.bootstrapTable('load', extendableCollection ? extendableCollection : []);
        $commonTable.bootstrapTable('hideLoading');
    }

    function initializeTable() {
        $commonTable.bootstrapTable('destroy');

        $commonTable.bootstrapTable({
            multipleSelectRow: true,
            clickToSelect: true,
            columns: [
                {
                    checkbox: true,
                    align: 'center',
                    valign: 'middle',
                    classes: '',
                    sortable: false,
                    clickToSelect: false,
                },
                {
                    title: 'Active',
                    align: 'center',
                    valign: 'middle',
                    classes: '',
                    clickToSelect: false,
                    formatter: activeFormatter
                },
                {
                    title: 'Date',
                    field: 'date',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    formatter: datatimeFormatter
                },
                {
                    title: 'Temp. (C)',
                    field: 'temperatureC',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    title: 'Temp. (F)',
                    field: 'temperatureF',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    title: 'Summary',
                    field: 'summary',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    title: 'Actions',
                    align: 'center',
                    valign: 'middle',
                    classes: '',
                    sortable: false,
                    clickToSelect: false,
                    formatter: rowEditFormatter
                }
            ]
        });
    }

    $commonTable.on('check.bs.table uncheck.bs.table check - all.bs.table uncheck - all.bs.table',
        function () {
            $commonDelete.prop('disabled', !$commonTable.bootstrapTable('getSelections').length);
            $commonStateChange.prop('disabled', !$commonTable.bootstrapTable('getSelections').length);

            // save your data, here just save the current page
            selections = getIdSelections($commonTable);
            // push or splice the selections if you want to save all data selections
        }
    );

    $commonTable.on('all.bs.table', function (e, name, args) {
        //console.log(name, args)
    });

    //$commonDelete.on('click', function () {
    //    $(this).prop('disabled', true);

    //    let response = getFilterdListToDelete();

    //    changeItemState(this, '', response.listOfSelectedItems, () => {
    //        extendableCollection = response.newArrayOfItems;
    //        setModelData();
    //        $(this).prop('disabled', false);
    //    });
    //});

    //$commonStateChange.on('click', function () {
    //    $(this).prop('disabled', true);
    //    let response = {
    //        listOfSelectedItems: [],
    //        newArrayOfItems: []
    //    };

    //    response.newArrayOfItems = extendableCollection.filter(function (obj) {
    //        if (selections.indexOf(obj.rowId) > -1) {
    //            obj.rowState = !obj.rowState;
    //            response.listOfSelectedItems.push(obj);
    //        }

    //        return obj;
    //    });

    //    changeItemState(this, '', response.listOfSelectedItems, () => {
    //        extendableCollection = response.newArrayOfItems;
    //        setModelData();
    //        $(this).prop('disabled', false);
    //    });
    //});

    function activeFormatter(value, row, index) {
        let styleClass = 'text-danger-glow blink';

        if (value && row.active) {
            styleClass = 'text-success-glow';
        }
        return `<div><i class="bi bi-circle-fill ${styleClass}"></i></div>`
    };

    function datatimeFormatter(value, row, index) {
        let date = new Date(value);

        if (date.getYear() === -1899) {
            return "--"
        }

        return date.toLocaleString();
    }

    function detailFormatter(index, row) {
        let html = []
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>')
        })
        return html.join('')
    }

    function getRowEditHtml(url, id) {
        return [
            `<a class="like" href="${url}/${id}" title="Edit" target="_blank">`,
            '<i class="bi bi-pen"></i>',
            '</a>  '
        ].join('')
    }

    function rowEditFormatter(value, row, index) {
        return getRowEditHtml(editUrl, row.rowId);
    }

    function getIdSelections(table) {
        return $.map(table.bootstrapTable('getSelections'), function (row) {
            return row.rowId
        })
    }

    function getFilterdListToUpdate() {
        const result = {
            listOfSelectedItems: [],
            newArrayOfItems: []
        };

        result.newArrayOfItems = extendableCollection.filter(function (obj) {
            if (selections.indexOf(obj.rowId) > -1) {
                obj.rowState = !obj.rowState;
                result.listOfSelectedItems.push(obj);
            }

            return obj;
        });

        return result;
    }

    function getFilterdListToDelete(selectedIds, arrayOfItems) {
        const result = {
            listOfSelectedItems: [],
            newArrayOfItems: []
        };

        result.newArrayOfItems = arrayOfItems.filter(function (obj) {
            if (selectedIds.indexOf(obj.rowId) > -1) {
                result.listOfSelectedItems.push(obj);
            }
            else {
                return obj;
            }
        });

        return result;
    }

    function changeItemState(element, endpoint, selectedItems, updateTableCallback) {
        if (endpoint) {
            $.ajax({
                type: ajaxPostMethodType,
                dataType: ajaxDataType,
                contentType: ajaxContentType,
                timeout: ajaxCallTimeout,
                data: JSON.stringify(selectedItems),
                url: endpoint,
                beforeSend: function () {
                    toastr.clear();

                    toastr.info(`<strong>Processing!</strong> request please wait!`, { timeOut: 2500 });

                    $(element).prop('disabled', true);
                },
                success: function (callback) {
                    toastr.clear();

                    if (callback.success) {
                        toastr.info(`<strong>Saved!</strong> successfully!`);
                        updateTableCallback();
                    }
                    else
                        toastr.error(`<strong>Error!</strong> failed with error </br> message : ${callback.errorMessage}!`);
                },
                failure: function (callback) {
                    toastr.error(`<strong>POST!</strong> failed with error </br> status : ${callback.status} </br> callback : ${callback.responseText}!`);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    ajaxErrorMessageDisplay(updateUrl, '', errorThrown, jqXHR, textStatus);
                },
                complete: function () {
                    $(element).prop('disabled', false);
                }
            });
        }
        else {
            // Invoking callback since endpoint is undefined
            updateTableCallback();
        }
    }

    // #endregion

});