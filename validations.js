const Joi         = require('joi');
const { STATES }  = require('./consts');

// Validate the query paramters passed to `GET /providers`
module.exports.getProvidersSchema = Joi.object().keys({
  max_discharges: Joi.number().integer().min(0),
  min_discharges: Joi.number().integer().min(0),
  max_average_covered_charges: Joi.number().min(0),
  min_average_covered_charges: Joi.number().min(0),
  max_average_medicare_payments: Joi.number().min(0),
  min_average_medicare_payments: Joi.number().min(0),
  state: Joi.any().valid(STATES)
});
