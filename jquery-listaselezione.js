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
		tipoCheckbox: "checkbox" // oppure "radio"
	}, options || {});


	// Public method - can be called from client code
	this.addRiga = function(elemento)
	{
		var li = $(elemento);
		// Se sto aggiungendo una riga ma non era ancora facente parte la UL,
		// la aggiungo.
		if (li.parent()[0] != ul[0]) {
			console.log("DEBUG: aggiungo la nuova riga alla lista.");
			li.appendTo(ul);
		}

		var text = li.html();
		var id = li.attr("title") || string2title(text);

		li.empty();
		$("<input />")
			.attr("type", options.tipoCheckbox)
			.attr("id", id)
			.appendTo(li);
		$("<label />")
			.html(text)
			.attr("for", id)
			.appendTo(li);


		// TODO: mettere il link grazie al "for"
	};

	// Private method - can only be called from within this object
	var privateMethod = function()
	{
		console.log('private method called!');
	};

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
		var ctrl = $(event.target).filter("input[type='checkbox'], input[type='radio']");
		if (!ctrl.length) return;
		if (ctrl.is(":checked"))
			ctrl.parent().addClass("checked");
		else
			ctrl.parent().removeClass("checked");
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
