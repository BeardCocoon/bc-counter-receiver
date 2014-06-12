/*global Counter, Backbone, JST*/

Counter.Views = Counter.Views || {};

(function () {
    'use strict';

    Counter.Views.PersonView = Backbone.View.extend({

        template: JST['app/scripts/templates/person.ejs'],
        initialize: function(){
        	this.model.on('change',this.render,this);
        },
        render: function() {
        	console.log('rendered');
        	this.$el.html(this.template(this.model.toJSON()));
        	return this;
        }

    });

})();
