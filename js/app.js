'use struct';



$(document).ready(function () {
  $('#list').change(function () {
    if ($(this).val() === 'All Quotes') {
      $('.eachContainerQuote').show();
    } else {
      $('.eachContainerQuote').hide();
      $('.' + $(this).val()).show();
    }
  });

});

$.ajax({
  url: '/addlike',
  method: 'POST',
  data: {
    data: 'Added to DB',
    put: 'Good'
  },
  cashe: true,
  success: function (data) {
    if (data['success']) {
      alert('Good Job');
    }
  },
  error: function () {
    swal('Something wrong');
  }
});

