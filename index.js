// Importing the required modules: axios for making API calls, express for creating the server and config for importing url
const axios = require('axios');
const express = require('express');
const config = require('./config.json');

// Creating the express server and defining the port number
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Core Logic: GET endpoint to fetch the data, process it and send it to another API
app.get('/processData', async (req, res) => {
    try {
        //Calling the GET endpoint to fetch the data
        const getUrl = config.urls.fetchData;
        const getCallResponse = await axios.get(getUrl);

        //Filtering data if status is 'Available'
        const filteredData = getCallResponse.data.data.resultSet.filter(item => item.status === 'Available');

        //Extracting the required data using map
        const liftData = filteredData.map(item => ({
            StationName: item.station.name,
            CRSCode: item.station.crsCode,
            SensorId: item.sensorId
        }));

        const requestBody = {
            LiftData: liftData
        };

        // Calling the POST endpoint to send the processed data
        const postUrl = config.urls.postData;
        const postResponse = await axios.post(postUrl, requestBody);

        // Displaying the response to user
        res.status(postResponse.status).json({
            message: 'Data processed successfully.',
            postResponse: postResponse.data
        });
    } catch (error) {
        // Error handling
        console.error('Error processing data:', error.message);
        res.status(500).json({
            message: 'An error occurred while processing data.',
            error: error.message
        });
    }
});


// Listening on the port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
