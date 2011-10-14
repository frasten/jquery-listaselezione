/*
 $('#test').myplugin();
 var myplugin = $('#test').data('myplugin');
 myplugin.publicMethod(); // prints "publicMethod() called!" to console
 */

(function($){
var ListaSelezione = function(element, options)
{
	var ul = $(element);
	var obj = this;
	var options = $.extend({
		cssListClass : "listaselezione",
		cssPari : "pari",
		cssDispari : "dispari",
		cssChecked : "checked",
		tipoCheckbox: "checkbox" // oppure "radio"
	}, options || {});
	var oldSelection = [];


	// Public method - can be called from client code
	this.addRiga = function(elemento, checked)
	{
		var li = $(elemento);
		// Se sto aggiungendo una riga ma non era ancora facente parte la UL,
		// la aggiungo.
		if (li.parent()[0] != ul[0]) {
			li.appendTo(ul);
			if ( ul.find("li").length % 2 != 0)
				li.addClass(options.cssPari);
			else
				li.addClass(options.cssDispari);
		}

		var text = li.html();
		if (li.attr("title") == '')
			li.attr("title", string2title(text));
		var id = "input_" + li.attr("title");

		var name = ul.attr("id");
		if (options.tipoCheckbox == 'checkbox')
			name += "[]";

		li.empty();
		$("<input />")
			.attr("type", options.tipoCheckbox)
			.attr("id", id)
			.attr("name", name)
			.attr("checked", checked == true)
			.appendTo(li);
		$("<label />")
			.html(text)
			.attr("for", id)
			.appendTo(li);
		if (checked == true) {
			li.addClass(options.cssChecked);
		}

	};

	this.getSelectedLIs = function() {
		return ul.find("input:checked").parent();
	}

	this.svuota = function() {
		ul.empty();
	}


	var string2title = function(stringa) {
		stringa = $.trim(stringa);
		return stringa.replace(/[^a-z]/gi, "_").toLowerCase();
	}


	// Costruttore:
	/* IDEA:
	 * Da una UL creare una UL con checklist.
	 */
	// Applichiamolo solo ai tag <ul>
	if ( element.tagName.toLowerCase() != "ul" ) return ul;

	ul.addClass(options.cssListClass);
	ul.find("li:even").addClass(options.cssPari);
	ul.find("li:odd").addClass(options.cssDispari);
	ul.find("li").each(function() {
		obj.addRiga(this);
	});

	ul.change(function(event) {
		// Applico una classe CSS su attivazione/click
		// TODO: al primo load non viene chiamato, ragionarci.
		var ctrl = $(event.target).filter("input[type='checkbox'], input[type='radio']");
		if (!ctrl.length) return;

		if (ctrl.is(":checked"))
			ctrl.parent().addClass(options.cssChecked);
		else
			ctrl.parent().removeClass(options.cssChecked);
		// Nel caso dei radio button, devo togliere la classe checked a tutti
		// gli altri.
		if (options.tipoCheckbox == 'radio') {
			ctrl.parent().parent().find("input[type='radio']:not(:checked)").parent().removeClass(options.cssChecked);
		}
		var sel = obj.getSelectedLIs();
		ul.trigger("cambiaselezione", [sel, obj.oldSelection]);
		obj.oldSelection = sel;

	});






};

$.fn.listaselezione = function(options)
{
	 return this.each(function()
	 {
		var element = $(this);

		// Return early if this element already has a plugin instance
		if (element.data('listaselezione')) return element;

		// pass options to plugin constructor
		var ls = new ListaSelezione(this, options);

		// Store plugin object in this element's data
		element.data('listaselezione', ls);
		return element;
	});
};
})(jQuery);
