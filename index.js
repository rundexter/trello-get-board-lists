var trello = require('node-trello'),
    _ = require('lodash'),
    util = require('./util'),
    pickInputs = {
        board_id: { key: 'board_id', validate: { req: true } }
    },
    pickOutputs = {
        '-': {
            keyName: 'data',
            fields: {
                id: 'id',
                name: 'name',
                cards_id: {
                    keyName: 'cards',
                    fields: ['id']
                },
                cards_name: {
                    keyName: 'cards',
                    fields: ['name']
                }
            }
        }
    };

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var credentials = dexter.provider('trello').credentials(),
            t = new trello(_.get(credentials, 'consumer_key'), _.get(credentials, 'access_token'));
        var inputs = util.pickInputs(step, pickInputs),
            validationErrors = util.checkValidateErrors(inputs, pickInputs);

        if (validationErrors)
            return this.fail(validationErrors);

        t.get("1/boards/" + inputs.board_id + "/lists", {cards: 'open', card_fields: "name", fields: "name"}  , function(err, data) {
            if (!err) {
                this.complete(util.pickOutputs({data: data}, pickOutputs));
            } else {
                this.fail(err);
            }
        }.bind(this));
    }
};
