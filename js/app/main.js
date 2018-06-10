define(["jquery", "jquery.ui", "app/jquery.ui.selectable"], function($) {
	$('#selectable').selectable({
		filter: 'td',
		tolerance: 'sequential',
		stop: assign_dates.bind( self )
	});
	
	function assign_dates(){
		console.log( this );
	}
});