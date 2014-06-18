WorldCup = { Collections: {}, Models: {}, Views: {} }

class WorldCup.Models.Team extends Backbone.Model
  points: () ->
    return points if points = @get('points')

    groupPoints = (@get('groupWins') * 3) + (@get('groupTies') * 1)
    @set('points', groupPoints)
    return groupPoints

class WorldCup.Collections.Teams extends Backbone.Collection
  model: WorldCup.Models.Team

class WorldCup.Models.Pick extends Backbone.Model
  parse: (data) ->
    data.total = 0

    teams = []
    for team, i in data.teams
      teamModel = window.teams.findWhere({country: team})
      points = teamModel.points()
      data.total += teamModel.points()
      teams.push { team, points }
    data.teams = teams
    data

class WorldCup.Collections.Picks extends Backbone.Collection
  model: WorldCup.Models.Pick
  comparator: (a, b) ->
    if a.get('total') is b.get('total')
      return if a.get('harvester') < b.get('harvester') then -1 else 1
    else
      return if a.get('total') > b.get('total') then -1 else 1

class WorldCup.Views.Picks extends Backbone.View
  template: """
    <li>
      <h2><%- harvester %></h2>
      <table>
        <% _.each(teams, function(team) { %>
          <tr>
            <td><%= team.team %></td>
            <td><%= team.points %></td>
          </tr>
        <% }); %>
          <tr>
            <td></td>
            <th><%- total %></th>
      </table>
    </li>
    """

  initialize: () ->
    @render()

  render: () ->
    html = ''
    for pick in @collection.models
      html +=  @team_row_html(pick)
    @$el.html(html)

  team_row_html: (pick) ->
    _.template(@template, pick.toJSON())

$ ->
  data = ferry_data_from_island("picks","teams")

  window.teams = new WorldCup.Collections.Teams(data.teams)
  new WorldCup.Views.Picks
    collection: new WorldCup.Collections.Picks(data.picks, {parse: true})
    el: $(".js-picks")
