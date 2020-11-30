var express = require('express');
const comboboxData= require('../data/optionsData');
var router = express.Router();
router.get('/', async (req, res) => {
    res.json(comboboxData);
});
module.exports = router;