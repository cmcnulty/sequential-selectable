define( [ 'jquery', 'jquery.ui' ], function( $ ) {

	$.ui.selectable.prototype._old_mouseStart = $.ui.selectable.prototype._mouseStart;
	$.ui.selectable.prototype._mouseStart = function( e ) {
		this.firstHit = false;
		return this._old_mouseStart( e );
	};

	$.ui.selectable.prototype._old_mouseDrag = $.ui.selectable.prototype._mouseDrag;
	$.ui.selectable.prototype._mouseDrag = function( e ) {
		if (this.options.tolerance == 'sequential') {
			return _mouseSequentialDrag.call( this, e );	
		} else {
			return this._old_mouseDrag( e );	
		}
	};
	
	var _mouseSequentialDrag = function(event) {

		this.dragged = true;

		if (this.options.disabled) {
			return;
		}

		var tmp,
			that = this,
			options = this.options,
			x1 = this.opos[0],
			y1 = this.opos[1],
			x2 = event.pageX,
			y2 = event.pageY;

		if (x1 > x2) { tmp = x2; x2 = x1; x1 = tmp; }
		if (y1 > y2) { tmp = y2; y2 = y1; y1 = tmp; }
		this.helper.css({left: x1, top: y1, width: x2-x1, height: y2-y1});

		this.selectees.each(function() {
			var selectee = $.data(this, "selectable-item"),
				hit = false,
				offset = {},
				mouseAboveStart,
				mouseOnCandRow,
				mouseBelowStart,
				candAboveStart,
				candOnSameRow,
				candBelowStart;
				
			//prevent helper from being selected if appendTo: selectable
			if (!selectee || selectee.element === that.element[0]) {
				return;
			}

			offset.left   = selectee.left   + that.elementPos.left;
			offset.right  = selectee.right  + that.elementPos.left;
			offset.top    = selectee.top    + that.elementPos.top;
			offset.bottom = selectee.bottom + that.elementPos.top;
			
			if(offset.left < x1 && offset.right > x2 && offset.top < y1 && offset.bottom > y2) {
				that.firstHit = {top: offset.top, bottom: offset.bottom, left: offset.left, right: offset.right};
				hit = 1;
			}

			mouseAboveStart = 	event.pageY 	< 	that.firstHit.top
			mouseOnCandRow =	event.pageY 	< 	offset.bottom; // On or Above!
			mouseBelowStart = 	event.pageY 	> 	that.firstHit.bottom;
			
			candAboveStart = 	offset.bottom <=	that.firstHit.top || Math.abs( offset.bottom - that.firstHit.top ) < 1; // deal with Firefox half-pixel issues
			candOnSameRow = 	offset.top 	== 	that.firstHit.top;
			candBelowStart = 	offset.top >= that.firstHit.bottom || Math.abs( offset.top - that.firstHit.bottom ) < 1; // deal with Firefox half-pixel issues
			
			// when dragging to the next row, select the all cells on the firstHit row that are to the left of firstHit
			hit ^= (mouseBelowStart && candOnSameRow && offset.left >= that.firstHit.left ) ? 2 : 0;
			
			// select start of rows (left of mouse) below firstHit row to the mouse when the mouse is below the firstHit row
			// if mouse is below starting row AND candidate is below starting row AND mouse is below top of candidate AND candidate's left edge is left of the mouse
			hit ^= (mouseBelowStart && candBelowStart && offset.top < event.pageY && offset.left < event.pageX ) ? 4 : 0;
			
			hit ^= (event.pageY > that.firstHit.top && event.pageY < that.firstHit.bottom && candOnSameRow &&  ((offset.right > x1 && offset.right < x2) || (offset.left > x1 && offset.left < x2))) ? 8 : 0; //horizontal selects

			hit ^= (mouseAboveStart && candOnSameRow && offset.left <= that.firstHit.left ) ? 16 : 0;
			
			hit ^= (mouseAboveStart && candAboveStart && mouseOnCandRow && offset.right > event.pageX) ? 32 : 0;
			
			hit ^= (event.pageY > offset.bottom && candBelowStart) || (event.pageY < offset.top && candAboveStart) ? 64 : 0;
				
			if (hit) {
				// SELECT
				if ( selectee.selected ) {
					that._removeClass( selectee.$element, "ui-selected" );
					selectee.selected = false;
				}
				if ( selectee.unselecting ) {
					that._removeClass( selectee.$element, "ui-unselecting" );
					selectee.unselecting = false;
				}
				if ( !selectee.selecting ) {
					that._addClass( selectee.$element, "ui-selecting" );
					selectee.selecting = true;

					// selectable SELECTING callback
					that._trigger( "selecting", event, {
						selecting: selectee.element
					} );
				}
			} else {

				// UNSELECT
				if ( selectee.selecting ) {
					if ( ( event.metaKey || event.ctrlKey ) && selectee.startselected ) {
						that._removeClass( selectee.$element, "ui-selecting" );
						selectee.selecting = false;
						that._addClass( selectee.$element, "ui-selected" );
						selectee.selected = true;
					} else {
						that._removeClass( selectee.$element, "ui-selecting" );
						selectee.selecting = false;
						if ( selectee.startselected ) {
							that._addClass( selectee.$element, "ui-unselecting" );
							selectee.unselecting = true;
						}

						// selectable UNSELECTING callback
						that._trigger( "unselecting", event, {
							unselecting: selectee.element
						} );
					}
				}
				if ( selectee.selected ) {
					if ( !event.metaKey && !event.ctrlKey && !selectee.startselected ) {
						that._removeClass( selectee.$element, "ui-selected" );
						selectee.selected = false;

						that._addClass( selectee.$element, "ui-unselecting" );
						selectee.unselecting = true;

						// selectable UNSELECTING callback
						that._trigger( "unselecting", event, {
							unselecting: selectee.element
						} );
					}
				}
			}
		});

		return false;
	};

	return $.ui.selectable;
});