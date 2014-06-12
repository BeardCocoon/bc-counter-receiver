/*global Counter, Backbone*/

Counter.Models = Counter.Models || {};

(function () {
    'use strict';

    Counter.Models.PersonModel = Backbone.Model.extend({

        url: '/',

        initialize: function() {
            console.log('inited');
        },

        defaults: {
            name: 'Set Name',
            count: 0
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        },
        countUp: function(){
            this.set({
                count: this.count++
            })
        }
    });

})();
