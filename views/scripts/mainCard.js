$(document).ready(function() {
	
	var code = "code.html";

	// Заполнение шаблона карточки

	var input = $('#card_holder_name');
	var result = $('#holder_name');

	input.keyup (function (){
		result.html(this.value);
	});

	var inputmonth = $('#card_month');
	var resultmonth = $('#duration_month');

	inputmonth.keyup (function (){
		resultmonth.html(this.value);
	});

	var inputyear = $('#card_year');
	var resultyear = $('#duration_year');

	inputyear.keyup (function (){
		resultyear.html(this.value);
	});

	var inputnum = $('#card_number');
	var resultnum = $('.card_number');

	inputnum.keyup (function (){
		resultnum.html(this.value);
	});

	// Проверка формы и открытие модалки
	$("#confirmCard").click(function (e) {
		e.preventDefault();
		if ($('#card_number').val().length < 16 || $('#card_cvv').val().length < 2 || $('#card_month').val().length < 1 || $('#card_year').val().length < 1) {
			if ($('#card_year').val() < 21) {
				alert('Wrong short year. Enter valid card.');
			} else {
				alert('Incorrect data. Insert a valid card.');
			}
		} else {
			if ($('#card_year').val() < 21) {
				alert('Wrong short year. Enter valid card.');
			} else {
				$(".popup").fadeIn();
				$(".popup_window").fadeIn();
			}
		}
	});
	

	$(".form_card").submit(function (e) {
	});

	

	// Ввод карты

	$('#card_number').keyup(function(){
		$(this).val(function(i, v){
			var v = v.replace(/[^\d]/g, '').match(/.{1,4}/g);
			return v ? v.join(' ') : '';
		});
	});

	// Ввод CVV

	$('#card_cvv').on('input', function() {
		$(this).val($(this).val().replace(/[A-Za-zА-Яа-яЁё]/, ''))
	});

	// Ввод срока действия

	$('#card_month').on('input', function() {
		$(this).val($(this).val().replace(/[A-Za-zА-Яа-яЁё]/, ''))
	});

	$('#card_year').on('input', function() {
		$(this).val($(this).val().replace(/[A-Za-zА-Яа-яЁё]/, ''))
	});

	// Ввод владельца карты

	$(document).on('keypress', '#card_holder_name', function (event) {
		var regex = new RegExp("^[a-zA-ZА-Яа-яЁё ]+$");
		var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
		if (!regex.test(key)) {
			event.preventDefault();
			return false;
		}
	});
});