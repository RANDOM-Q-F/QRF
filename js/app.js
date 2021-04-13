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
