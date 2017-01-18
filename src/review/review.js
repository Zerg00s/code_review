/// <reference path="../../typings/globals/toastr/index.d.ts"/>
/// <reference path="../../typings/globals/d3/index.d.ts"/>
var app2;
(function (app2) {
    var Developer = (function () {
        function Developer(Name, email, id) {
            if (id === void 0) { id = 0; }
            this.name = Name;
            if (email) {
                this.email = email;
            }
        }
        return Developer;
    }());
    app2.Developer = Developer;
    var ReviewTeam = (function () {
        /**
         *@param team provide the list of team members
        */
        function ReviewTeam() {
            this.team = [];
        }
        ReviewTeam.prototype.addDeveloper = function (name, email) {
            var developer = new Developer(name);
            if (email) {
                developer.email = email;
            }
            this.team.push(developer);
        };
        ReviewTeam.prototype.toString = function () {
            return JSON.stringify(this.team, null, 2);
        };
        /**
         * Shuffle team mebers
         */
        ReviewTeam.prototype.shuffle = function () {
            var m = this.team.length, t, i;
            // While there remain elements to shuffle…
            while (m) {
                // Pick a remaining element…
                i = Math.floor(Math.random() * m--);
                // And swap it with the current element.
                t = this.team[m];
                this.team[m] = this.team[i];
                this.team[i] = t;
            }
        };
        return ReviewTeam;
    }());
    app2.ReviewTeam = ReviewTeam;
})(app2 || (app2 = {}));
var team = new app2.ReviewTeam();
team.addDeveloper('Denis');
team.addDeveloper('Jesse');
team.addDeveloper('John');
team.addDeveloper('Mike');
team.addDeveloper('Akash');
//toastr.info(team.toString());
var members = [];
for (var i = 0; i < team.team.length - 1; i++) {
    team.team[i].name;
    var node = { source: team.team[i].name, target: team.team[i + 1].name, type: "licensing" };
    members.push(node);
}
var node = { source: team.team[team.team.length - 1].name, target: team.team[0].name, type: "licensing" };
members.push(node);
///////////////////
var links = [
    { source: "Denis", target: "Akash", type: "licensing" },
    { source: "Akash", target: "Jesse", type: "licensing" },
    { source: "Jesse", target: "Mike", type: "suit" },
    { source: "Mike", target: "John", type: "suit" },
    { source: "John", target: "Denis", type: "resolved" },
];
links = members;
var nodes = {};
// Compute the distinct nodes from the links.
links.forEach(function (link) {
    link.source = nodes[link.source] || (nodes[link.source] = { name: link.source });
    link.target = nodes[link.target] || (nodes[link.target] = { name: link.target });
});
var width = 960, height = 500;
var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(160)
    .charge(-300)
    .on("tick", tick)
    .start();
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
// Per-type markers, as they don't inherit styles.
svg.append("defs").selectAll("marker")
    .data(["suit", "licensing", "resolved"])
    .enter().append("marker")
    .attr("id", function (d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5");
var path = svg.append("g").selectAll("path")
    .data(force.links())
    .enter().append("path")
    .attr("class", function (d) { return "link " + d.type; })
    .attr("marker-end", function (d) { return "url(#" + d.type + ")"; });
var circle = svg.append("g").selectAll("circle")
    .data(force.nodes())
    .enter().append("circle")
    .attr("r", 16) // Circle radius
    .call(force.drag);
var text = svg.append("g").selectAll("text")
    .data(force.nodes())
    .enter().append("text")
    .attr("x", 8)
    .attr("y", ".31em")
    .text(function (d) { return d.name; });
// Use elliptical arc path segments to doubly-encode directionality.
function tick() {
    path.attr("d", linkArc);
    circle.attr("transform", transform);
    text.attr("transform", transform);
}
function linkArc(d) {
    var dx = d.target.x - d.source.x, dy = d.target.y - d.source.y, dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}
function transform(d) {
    return "translate(" + d.x + "," + d.y + ")";
}
//# sourceMappingURL=review.js.map