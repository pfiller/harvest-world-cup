// Generated by CoffeeScript 1.6.3
(function() {
  var WorldCup, _ref, _ref1, _ref2, _ref3, _ref4,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  WorldCup = {
    Collections: {},
    Models: {},
    Views: {}
  };

  WorldCup.Models.Team = (function(_super) {
    __extends(Team, _super);

    function Team() {
      _ref = Team.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Team.prototype.points = function() {
      var groupPoints, knockoutPoints, points, _ref1;
      if (points = this.get('points')) {
        return points;
      }
      groupPoints = (this.get('groupWins') * 3) + (this.get('groupTies') * 1);
      knockoutPoints = ((_ref1 = this.get('knockoutWins')) != null ? _ref1 : 0) * 5;
      this.set('points', groupPoints + knockoutPoints);
      return groupPoints;
    };

    return Team;

  })(Backbone.Model);

  WorldCup.Collections.Teams = (function(_super) {
    __extends(Teams, _super);

    function Teams() {
      _ref1 = Teams.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Teams.prototype.model = WorldCup.Models.Team;

    return Teams;

  })(Backbone.Collection);

  WorldCup.Models.Pick = (function(_super) {
    __extends(Pick, _super);

    function Pick() {
      _ref2 = Pick.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    Pick.prototype.parse = function(data) {
      var i, points, team, teamModel, teams, _i, _len, _ref3;
      data.total = 0;
      teams = [];
      _ref3 = data.teams;
      for (i = _i = 0, _len = _ref3.length; _i < _len; i = ++_i) {
        team = _ref3[i];
        teamModel = window.teams.findWhere({
          country: team
        });
        points = teamModel.points();
        data.total += teamModel.points();
        teams.push({
          team: team,
          points: points
        });
      }
      data.teams = teams;
      return data;
    };

    return Pick;

  })(Backbone.Model);

  WorldCup.Collections.Picks = (function(_super) {
    __extends(Picks, _super);

    function Picks() {
      _ref3 = Picks.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    Picks.prototype.model = WorldCup.Models.Pick;

    Picks.prototype.comparator = function(a, b) {
      if (a.get('total') === b.get('total')) {
        if (a.get('harvester') < b.get('harvester')) {
          return -1;
        } else {
          return 1;
        }
      } else {
        if (a.get('total') > b.get('total')) {
          return -1;
        } else {
          return 1;
        }
      }
    };

    return Picks;

  })(Backbone.Collection);

  WorldCup.Views.Picks = (function(_super) {
    __extends(Picks, _super);

    function Picks() {
      _ref4 = Picks.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    Picks.prototype.template = "<li>\n  <h2><%- harvester %></h2>\n  <table>\n    <% _.each(teams, function(team) { %>\n      <tr>\n        <td><%= team.team %></td>\n        <td><%= team.points %></td>\n      </tr>\n    <% }); %>\n      <tr>\n        <td></td>\n        <th><%- total %></th>\n  </table>\n</li>";

    Picks.prototype.initialize = function() {
      return this.render();
    };

    Picks.prototype.render = function() {
      var html, pick, _i, _len, _ref5;
      html = '';
      _ref5 = this.collection.models;
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        pick = _ref5[_i];
        html += this.team_row_html(pick);
      }
      return this.$el.html(html);
    };

    Picks.prototype.team_row_html = function(pick) {
      return _.template(this.template, pick.toJSON());
    };

    return Picks;

  })(Backbone.View);

  $(function() {
    var data;
    data = ferry_data_from_island("picks", "teams");
    window.teams = new WorldCup.Collections.Teams(data.teams);
    return new WorldCup.Views.Picks({
      collection: new WorldCup.Collections.Picks(data.picks, {
        parse: true
      }),
      el: $(".js-picks")
    });
  });

}).call(this);
