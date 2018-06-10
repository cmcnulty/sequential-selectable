# sequential-selectable
This is a jquery-ui duckpunch of the selectable widget to allow selecting a sequence of records when split over multiple rows, as one might want from a calendar.  It works exactly like the normal selectable, but with a different tolerance, "sequential"


```javascript
	$('#selectable').selectable({
		filter: 'td',
		tolerance: 'sequential',
		stop: assign_dates.bind( self )
});
```
