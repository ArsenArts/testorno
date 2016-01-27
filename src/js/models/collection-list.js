var CollectionList = function() {
  this.inbox = {
    title: 'Inbox',
    data: []
  };

  this.completed = {
    title: 'Completed',
    data: []
  };

  this.featured = {
    title: 'Featured',
    data: []
  };
};

CollectionList.prototype = function() {
  var init = function() {
    loadInbox();
  },

  loadInbox = function() {
    datacontext.getCollection(function (data) {
      var tl = new Collection(data);
      app.collections.inbox.data = tl;
      tl.init();
    });
  },

  loadCompleted = function() {},

  loadFeatured = function() {};

  return {
    init: init
  };
}();
