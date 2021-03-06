var express = require('express');
var path = require('path');
var router = express.Router();
var appRootDir = require('app-root-dir').get();
var bodyParser = require('body-parser');
var url = require('url');
const parser = bodyParser.urlencoded({
    extended: false
})
var urlparser = bodyParser.urlencoded({
    extended: false
})

var Event = require(path.join(appRootDir, '/services/eventservice'));

/* GET Events listing. */
//get all event
router.get('/', function (req, res, next) {
    console.log("get all events");
    let urlObj = url.parse(req.url,true);
    let skip = parseInt(urlObj.query.skip);
    //console.log("skip "+ skip);
    Event.get(null, skip)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.json(err));
});

// get event by ID
router.get('/:id', (req, res) => {

    console.log("Get event byID : " + req.params.id);
    Event.get(req.params.id)
        .then(data => {
            console.log("data length is " + data.length);
            if (data.length) { // if array is not empty
                console.log(JSON.parse(data));
                res.json(data);
            } else {
                console.log("requested user not found " + JSON.parse(data));
                res.json({});
            }
        })
        .catch(err => res.json(err));
});

//Add new event
router.post('/save', (req, res) => {
    console.log("event add " + req.body.data);
    console.log("id " + req.body.id);
    const newEvent = new Event(req.body.data);
    // const newEvent = new Event({
    //     name: 'Event 1',
    //     description: 'best aewsome event ever',
    //     remark: 'reamark here please',
    //     date: Date.now(),
    //     created_at: Date.now(),
    //     //updated_at: Date.now(),
    //     address: {
    //         street: 'street1',
    //         city: 'city123',
    //         State: 'state123',
    //         zipcode: 123456,
    //     },
    //     location: [20,10],
    //     tags: ["Java","PHP"],
    //     isDelete: false,
    //     users: ["1234","2345","866"]
    // });

    console.log("Event being pushed in Database :" + newEvent);

    newEvent.saveEvent(req.body.data,req.body.id).then(data => {
        res.json(data);
        })
        .catch(err => res.json(err));
});

//update user  info
router.post('/update', (req, res) => {
    const newEvent = new Event(req.body);
    newEvent.update().then(() => {
        res.json({
            status: 1
        });
    })
});

//delete event
router.get('/remove/:id', (req, res) => {
    console.log("removing event");
    console.log(req.params.id);
    Event.removeEvent(req.params.id)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.json(err));
});

//search
router.post('/search', function (req, res, next) {
    console.log("post search event");
    //let urlObj = url.parse(req.url,true);
    //console.log(urlObj);

    let keyword = req.body.keyword;
    let skip = parseInt(req.body.skip);

    console.log("skip " + skip + " keyword "+ keyword);
    Event.searchEvents(skip, keyword)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.json(err));
});

//register
router.post('/register', function (req, res, next) {
    console.log("post register event" + req.body);

    let userID = req.body.userID;
    let eventID = req.body.eventID;

    console.log("id " + userID + " event "+ eventID);
    Event.registerUser(userID, eventID)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.json(err));
});

module.exports = router;
