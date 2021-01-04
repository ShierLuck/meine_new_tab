
$('.btn-change-width').on('click', function(e){
	var t = $('.meine_conf'),
		bw = $('body').css('width'),
		cw = t.css('width'),
		cw = cw.replace('px', ''),
		max = bw.replace('px', ''),
		half = max / 2,
		to = '50vw',
		text = 'Min';

	if(cw >= half){
		to = '22vw';
		text = 'Max';
	}
	t.css('width', to);
	$(this).html(text);
});

$('.change-background').on('change', function(e){
	// var to = prompt('background');
});