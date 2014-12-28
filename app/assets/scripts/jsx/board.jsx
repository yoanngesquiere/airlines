var React = require('react'),
    Promise = require('promise'),
    reqwest = require('reqwest'),
    Member = require('./member'),
    Task = require('./task'),
    Numbers = require('./numbers');

module.exports = React.createClass({
    getInitialState: function() {
        return { dates: [], members: [] };
    },

    loadDates: function() {
        return new Promise(
            function (resolve, reject) {
                reqwest({
                    url: this.props.weekUrl,
                    type: 'json',
                    method: 'GET',

                    error: function(err) {
                        reject(err);
                    },

                    success: function(dates) {
                        resolve(dates);
                    }
                });
            }.bind(this)
        );
    },

    loadMembers: function() {
        return new Promise(
            function (resolve, reject) {
                reqwest({
                    url: this.props.memberUrl,
                    type: 'json',
                    method: 'GET',

                    error: function(err) {
                        reject(err);
                    },

                    success: function(members) {
                        resolve(members);
                    }
                });
            }.bind(this)
        );
    },

    componentWillMount: function() {
        this.loadDates()
            .then(
                function (dates) {
                    dates = dates.map(
                        function (date) {
                            return new Date(date);
                        }
                    );

                    this.setState({ dates: dates });
                }.bind(this)
            );

        this.loadMembers()
            .then(
                function (members) {
                    this.setState({ members: members });
                }.bind(this)
            );
    },

    render: function() {
        var members = [],
            days = [];

        this.state.dates.forEach(
            function (date) {
                days.push(
                    <div className="board__head-day" key={date.getTime()}>
                        {date.toLocaleString({}, { weekday: 'long', day: 'numeric', month: 'numeric' })}
                    </div>
                );
            }
        );

        this.state.members.forEach(
            function (member) {
                members.push(
                    <Member key={member.id} {...member} weekUrl={this.props.weekUrl} week={this.props.week} dates={this.state.dates} />
                );
            },
            this
        );

        return (
            <div className="board">
                <header className="board__header">
                    <div className="board__head-title">S{this.props.week}</div>
                    {days}
                </header>
                {members}
            </div>
        );
    }
});