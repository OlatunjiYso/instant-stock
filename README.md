# instant-stock
A simple stock broker app

###### How to setup
1. Provide the fields stated in `.env.sample`
2. run `npm install`
3. run the `dev` script 

###### How it works.
1. For the first time you are obtaining stock information, the app would fetch from a broker.
2. For subsequent requests, the app would fetch from the database if the record isn't more than 5 minutes old
3. Anytime we fetch a new record, we update the existing old record.

###### Performance.
The `symbol` field has a unique index.
