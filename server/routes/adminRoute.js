const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Dj = require('../models/djModel');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/get-all-djs', authMiddleware, async (req, res) => {
  try {
    const djs = await Dj.find({});
    res.status(200).send({
      message: 'Pomyślnie pobrano DJi',
      success: true,
      data: djs,
    });
    console.log(djs);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Błąd pobrania DJi',
      success: false,
      error,
    });
  }
});

router.get('/get-all-users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: 'Pomyślnie pobrano uzytkowników',
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Błąd pobrania uzytkowników',
      success: false,
      error,
    });
  }
});

router.post('/change-dj-account-status', authMiddleware, async (req, res) => {
  try {
    const { djId, status } = req.body;
    const dj = await Dj.findByIdAndUpdate(djId, { status });

    const user = await User.findOne({ _id: dj.userId });
    console.log(user);

    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: 'new-dj-request-changed',
      message: `Zmieniono status dla twojego konta na: ${status}`,
      onClickPath: '/app/notifications',
    });
    user.isDj = status === 'Potwierdzony' ? true : false;
    await user.save();

    res.status(200).send({
      message: 'Pomyślnie zaaktualizowano status DJa',
      success: true,
      data: dj,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Błąd zmiany statusu DJa',
      success: false,
      error,
    });
  }
});

module.exports = router;
