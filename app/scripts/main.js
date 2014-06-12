/*global Counter, $*/


window.Counter = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        'use strict';

        this.initChromecast();

        this.players = [];

        this.updateDisplay();
    },
    updateDisplay: function(){
        $('#app').empty();
        _.each(this.players, function(player){
            var playerView = new Counter.Views.PersonView({model: player});
            $('#app').append(playerView.render().el);
        });

        if (this.players.length === 0) {
          $('#setup').show();
        };
    },
    initChromecast: function(){
      window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
      var appConfig = new cast.receiver.CastReceiverManager.Config();

      this.messageBus = window.castReceiverManager.getCastMessageBus('urn:x-cast:com.beardcocoon.counter.message');


      /**
      * Text that represents the application status. It should meet
      * internationalization rules as may be displayed by the sender application.
      * @type {string|undefined}
      **/
      // appConfig.statusText = 'Nick and Erik are awesome';

      /**
      * Maximum time in seconds before closing an idle
      * sender connection. Setting this value enables a heartbeat message to keep
      * the connection alive. Used to detect unresponsive senders faster than
      * typical TCP timeouts. The minimum value is 5 seconds, there is no upper
      * bound enforced but practically it's minutes before platform TCP timeouts
      * come into play. Default value is 10 seconds.
      * @type {number|undefined}
      **/
      // 100 minutes for testing, use default 10sec in prod by not setting this value
      appConfig.maxInactivity = 6000;
      /**
      * Initializes the system manager. The application should call this method when
      * it is ready to start receiving messages, typically after registering
      * to listen for the events it is interested on.
      */
      window.castReceiverManager.start(appConfig);


      this.messageBus.onMessage = _.bind(function(event){
          this.gotMessage(event);
      }, this);
      window.castReceiverManager.onSenderDisconnected = _.bind(function(event){
          this.senderDisconnected(event);
      }, this);
      window.castReceiverManager.onSenderConnected = _.bind(function(event){
          this.senderConnected(event);
      }, this);
    },
    senderConnected: function(event){
        var senderId = event.data;
        this.addPlayer(senderId);
        console.log('sender id: ' + senderId);
        $('#setup').hide();
    },
    senderDisconnected: function(event){
        var senderId = event.data;
        var player = this.getPlayerForSenderId(senderId);
        var index = this.players.indexOf(player);
        if (index > -1) { 
            this.players.splice(index,1);
        };
        this.updateDisplay();
    },
    gotMessage: function(event){
        var message = jQuery.parseJSON(event.data);
        message.senderId = event.senderId;
        var player = this.getPlayerForSenderId(message.senderId);
        if (message.event === "nameChange") {
            player.set({name: message.name});
        } else if (message.event === "increment"){
            var currentCount = player.get('count');
            currentCount++;
            player.set({count: currentCount});
        }
    },
    addPlayer: function(senderId){
         var newPlayer = new Counter.Models.PersonModel({id:senderId});
        this.players.push(newPlayer);
        this.updateDisplay();
    },
    getPlayerForSenderId: function (senderId){
      
      var returnPlayer;

      _.each(this.players, function (player) {
        if (player.id == senderId) {
          returnPlayer =  player;
        };
      });

      return returnPlayer;
    },
};

$(document).ready(function () {
    'use strict';
    Counter.init();
});
