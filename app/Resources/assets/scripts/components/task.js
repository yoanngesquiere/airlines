(function () {
    'use strict';

    var React = require('react/addons'),
        reqwest = require('reqwest'),
        DragDropMixin = require('react-dnd').DragDropMixin,
        ItemTypes = require('../imports/itemTypes'),
        DateHelper = require('../imports/dateHelper'),
        Numbers = require('./numbers'),
        Editable = require('./editable');

    module.exports = React.createClass({
        mixins: [
            DragDropMixin
        ],

        statics: {
            /**
             * @param {function} registerType
             */
            configureDragDrop: function(registerType) {
                var dateHelper = new DateHelper();

                registerType(
                    ItemTypes.TASK,
                    {
                        dragSource: {
                            beginDrag: function(task) {
                                return {
                                    item: task
                                };
                            }
                        },

                        dropTarget: {
                            acceptDrop: function(target, task) {
                                target.merge(task.props.id);
                            }
                        }

                    }
                );
            }
        },

        /**
         * Removes this Task from the database and triggers reloading for the Member and Day it belongs to
         */
        remove: function() {
            if (!confirm('Are you sure ?')) {
                return;
            }

            reqwest({
                url: this.props.restUrl,
                type: 'json',
                method: 'DELETE',

                success: function(response) {
                    this.props.handleUpdate();
                }.bind(this)
            });
        },

        /**
         * Splits this Task in two and triggers reloading for the Member and Day it belongs to
         */
        split: function() {
            reqwest({
                url: this.props.splitUrl,
                type: 'json',
                method: 'POST',

                success: function(response) {
                    this.props.handleUpdate();
                }.bind(this)
            });
        },

        /**
         * Updates this Task's data and triggers reloading for the Member and Day it belongs to
         *
         * @param {object}   data
         * @param {function} callback
         */
        update: function(data, callback) {
            reqwest({
                url: this.props.restUrl,
                type: 'json',
                method: 'PUT',
                data: data,

                success: function() {
                    ('function' === typeof callback) && callback();
                    this.props.handleUpdate();
                }.bind(this)
            });
        },

        /**
         * Moves this Task to a different Member and/or Day
         *
         * @param {number}   memberId
         * @param {string}   date
         * @param {function} callback
         */
        move: function(memberId, date, callback) {
            var dateHelper = new DateHelper();

            // Only process the change if there actually is one
            if (!dateHelper.compare(this.props.date, date) || (this.props.member != memberId)) {
                this.update({ member: memberId, date: date }, callback);
            }
        },

        /**
         * Merges a Task into this one and triggers reloading for the Member and Day it belongs to
         *
         * @param {number} taskId
         */
        merge: function(taskId) {
            reqwest({
                url: this.props.mergeUrl + taskId,
                type: 'json',
                method: 'POST',

                success: function(response) {
                    this.props.handleUpdate();
                }.bind(this)
            });
        },

        /**
         * @return {object}
         */
        render: function() {
            var style = {},
                nameStyle = { backgroundColor: this.props.color },

                classes = React.addons.classSet({
                    'task': true,
                    'task--dragged': this.getDragState(ItemTypes.TASK).isDragging,
                    'task--hovered': this.getDropState(ItemTypes.TASK).isHovering
                }),

                handleNameInput = function(name) {
                    this.update({ name : name });
                }.bind(this);

            return (
                <div className={classes} style={style} {...this.dragSourceFor(ItemTypes.TASK)} {...this.dropTargetFor(ItemTypes.TASK)}>
                    <div className="task__name" style={nameStyle}>
                        <Editable handleInput={handleNameInput}>{this.props.name}</Editable>
                    </div>
                    <Numbers estimate={this.props.estimate} consumed={this.props.consumed} remaining={this.props.remaining} handleInput={this.update} />
                    <div className="task__action-group">
                        <a className="task__action task__action--split" title="Split" onClick={this.split}></a>
                        <a className="task__action task__action--remove" title="Delete" onClick={this.remove}></a>
                    </div>
                </div>
            );
        }
    });
})();
