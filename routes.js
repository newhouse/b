const { Router }                      = require('express');
const Joi                             = require('joi');

const { Provider }                    = require('./models');
const { getProvidersSchema }          = require('./validations');


const router = Router();

// A helper to map API query paramters to some things we need for the DB query.
const getProviderQueryParamMap = {
  max_discharges: { comparator: '<=', dbName: 'Total Discharges'},
  min_discharges: { comparator: '>=', dbName: 'Total Discharges'},
  max_average_covered_charges: { comparator: '<=', dbName: 'Average Covered Charges'},
  min_average_covered_charges: { comparator: '>=', dbName: 'Average Covered Charges'},
  max_average_medicare_payments: { comparator: '<=', dbName: 'Average Medicare Payments'},
  min_average_medicare_payments: { comparator: '>=', dbName: 'Average Medicare Payments'},
  state:  { comparator: '=', dbName: 'Provider State'},
};


// Set the handler for `GET /providers`
router.get('/providers', async (req, res, next) => {

  try {

    // Validate the query parameters - this will throw if there's a problem
    const params = await Joi.validate(req.query, getProvidersSchema);

    // Construct the base of our query. Only selecting the columns that were in the example output.
    const query = Provider.query()
      .select([
        'Provider Name',
        'Provider Street Address',
        'Provider City',
        'Provider State',
        'Provider Zip Code',
        'Hospital Referral Region Description',
        'Total Discharges',
        'Average Covered Charges',
        'Average Total Payments',
        'Average Medicare Payments'
      ]);

    let map;
    // Let's add an appropriate WHERE clause to our DB query for each API query param that was passed
    for (let key in params) {
      map = getProviderQueryParamMap[key];
      query.where(map.dbName, map.comparator, params[key]);
    }

    // Execute the query and get the results
    const providers = await query;

    // Return the results the client
    return res.json(providers);
  }
  catch (e) {
    // Calling next with a value is assumed to mean an error has occurred
    return next(e);
  }

});


module.exports = router;