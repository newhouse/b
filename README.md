## API Challenge

### Description/Notes
- I chose a Node/Express API stack with Postgres as the datastore. Node/Express are very well suited for API use, and it's also the stack I've most recently worked closely with. You will need Node 8+ in order to use the `async`/`await` syntax that is leveraged here.
- Postgres seemed like a simple choice for the datastore since this was very structured data.
- I used a Node ORM called [Objection.js](http://vincit.github.io/objection.js/), which is built on top of [Knex.js](https://knexjs.org/). Even though it is perhaps a bit overkill for this assignment, it's very powerful and easy to work with, and would serve as strong foundation for a more complex API.
- I did not add any Authorization to this API (due to time constraints), but typically an API like this would have such a system. Likely passing an API key as a query parameter, or an authorization token in the Headers somewhere. Cookies could also be used, but not typical at all for an API. This is a large topic/assumption. I guess for now we'll assume that this is a private LAN and that anyone who can access the server IP is also allowed to acess the data itself.
- As far as input validation, I only check for the following:
    + If `state` is provided, it must be a valid 2-character, upper-case string value that one would expect.
    + The other `min`/`max` parameters must be parsable into numbers, and they cannot be negative. I allowed the user to input values for them that may make it impossible for any results to be returned (e.g. `max_xxxx=5&min_xxxx=10`) instead of throwing an error.
        * `max_discharges` and `min_discharges` must be parsable into integers.
- When an error is encountered, if the app is not being run in a `development` environment, a basic message is returned rather than a full stack trace.
- I only returned the fields from the DB that were provided in the example documentation, even though there were a few more fields in the table.
- I put the same DB credentials used for "production" in plain-text in the `.env` file in this repo. I would never do that normally, but given the time constraints I did not choose to include a whole development setup scripts/docker/etc.
- I tried to find the right balance of code organization for a project of this size. Didn't want it all in 1 file, but didn't want to get too crazy with folders and things like that at this point since it's pretty simple.
- I did not paginate or limit the output of the responses. Since it's possible to dump out a lot of rows, this would/should be thought through in a real project. Objection.js would make this somewhat easy via [pages](http://vincit.github.io/objection.js/#page).
- I am hosting this on Heroku, and the DB is definitely over its limit, but will be OK for a few days I think!

### Local Installation
- Make sure you have Node 8 or greater installed.
- Make sure you have Heroku CLI installed.
- Run `npm install`
- Run `heroku local web`

### Testing
- Run `npm test`