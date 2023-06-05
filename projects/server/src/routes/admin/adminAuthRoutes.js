const express = require('express')
const { adminAuthController } = require('../../controllers')
const router = express.Router()

router.post('/create', adminAuthController.createBranchAdmin)

module.exports = router