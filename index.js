const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS || '';
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE || 'YOUR_CUSTOM_OBJECT_TYPE';
const CUSTOM_PROPERTIES = [
    process.env.CUSTOM_PROPERTY_1 || 'custom_property_1',
    process.env.CUSTOM_PROPERTY_2 || 'custom_property_2',
    process.env.CUSTOM_PROPERTY_3 || 'custom_property_3'
];

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
    const endpoint = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(endpoint, {
            headers,
            params: {
                properties: CUSTOM_PROPERTIES.join(',')
            }
        });

        res.render('homepage', {
            title: 'Custom Objects | HubSpot APIs',
            data: resp.data.results || [],
            propertyNames: CUSTOM_PROPERTIES
        });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Unable to load custom object records.');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Create Custom Object Record',
        propertyNames: CUSTOM_PROPERTIES
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
    const endpoint = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const properties = {};
    CUSTOM_PROPERTIES.forEach((propertyName) => {
        properties[propertyName] = req.body[propertyName] || '';
    });
    const crmRecord = { properties };

    try {
        await axios.post(endpoint, crmRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Unable to create custom object record.');
    }
});



// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));