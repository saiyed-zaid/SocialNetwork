$(function () {
  $("#userstable").DataTable({
    responsive: true,
    autoWidth: false,
    lengthMenu: [5, 10, 15, 25, 50, 100],
    pageLength: 5,
    columnDefs: [
      {
        targets: [0, 2, 7, 8, 9, 10],
        orderable: false,
      },
    ],
  });
});

$(function () {
  $("#poststable").DataTable({
    responsive: true,
    lengthMenu: [5, 10, 15, 25, 50, 100],
    pageLength: 5,
    columnDefs: [
      {
        targets: [0, 2, 7, 9, 10, 11],
        orderable: false,
      },
    ],
  });
});
