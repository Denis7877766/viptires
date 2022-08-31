// currency select script
function defaultCurrency() {
  var currency = localStorage.getItem('currency') || 'GEL';
  setCurrency(currency);
}

function setCurrency(e) {
  var newCurrency = typeof e === 'string' ? e : e.target.value;
  document.documentElement.classList.remove('currency-chf');
  document.documentElement.classList.remove('currency-eur');
  document.documentElement.classList.add("currency-" + newCurrency);
  document.querySelectorAll('select.currencySelect').forEach(el => el.value = newCurrency);
  localStorage.setItem('currency', newCurrency);
}
document.addEventListener('DOMContentLoaded', function(e) {
  document.querySelectorAll('select.currencySelect').forEach(el => el.addEventListener('change', setCurrency));

let currencyAct = localStorage.getItem('currency');
var chosenCurr = $('.custom-option[data-value="'+ currencyAct +'"]').html();
$('.custom-select__trigger span').html( chosenCurr );
$('.custom-option').removeClass('selected');
$('.custom-option[data-value="'+ currencyAct +'"]').addClass('selected');

  defaultCurrency();
});


// custom selector
for (const dropdown of document.querySelectorAll(".custom-select-wrapper")) {
  dropdown.addEventListener('click', function() {
      this.querySelector('.custom-select').classList.toggle('open');
  })
}

for (const option of document.querySelectorAll(".custom-option")) {
  option.addEventListener('click', function() {
      if (!this.classList.contains('selected')) {
          this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
          this.classList.add('selected');
          this.closest('.custom-select').querySelector('.custom-select__trigger span').innerHTML = this.innerHTML;
        
        // trigger real select change
        var $select = $("select.currencySelect");
        $select.val($(this).data("value"));
        $select.find(':selected').prop('selected',true).trigger('change');
        
        newCurrency = $(this).data("value");
        setCurrency(newCurrency);
        localStorage.setItem('currency', newCurrency);
        
        let currencyAct = localStorage.getItem('currency');
        var chosenCurr = $('.custom-option[data-value="'+ newCurrency +'"]').html();
        $('.custom-select__trigger span').html( chosenCurr );
        $('.custom-option').removeClass('selected');
        $('.custom-option[data-value="'+ currencyAct +'"]').addClass('selected');
         
      }
  })
};

window.addEventListener('click', function(e) {
  for (const select of document.querySelectorAll('.custom-select')) {
      if (!select.contains(e.target)) {
          select.classList.remove('open');
      }
  }
});



