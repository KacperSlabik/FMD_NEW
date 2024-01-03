const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const User = require('../models/userModel');
const Dj = require('../models/djModel');
const Booking = require('../models/bookingModel');

router.post('/get-dj-info-by-user-id', authMiddleware, async (req, res) => {
  try {
    const dj = await Dj.findOne({ userId: req.body.userId });

    return res.status(200).send({ message: 'Dj istnieje', success: true, data: dj });
  } catch (error) {
    return res.status(500).send({
      message: 'Błąd pobrania informacji DJa',
      success: false,
      error,
    });
  }
});

router.post('/get-dj-info-by-id', authMiddleware, async (req, res) => {
  try {
    const dj = await Dj.findOne({ _id: req.body.djId });

    return res.status(200).send({ message: 'DJ istnieje', success: true, data: dj });
  } catch (error) {
    return res.status(500).send({
      message: 'Błąd pobrania informacji DJa',
      success: false,
      error,
    });
  }
});

router.post('/update-dj', authMiddleware, async (req, res) => {
  try {
    const dj = await Dj.findOneAndUpdate({ userId: req.body.userId }, req.body);

    return res.status(200).send({ message: 'Dane DJ zaktualizowane', success: true, data: dj });
  } catch (error) {
    return res.status(500).send({
      message: 'Błąd aktualizowania informacji Dja',
      success: false,
      error,
    });
  }
});

router.get('/get-bookings-by-dj-id', authMiddleware, async (req, res) => {
  try {
    const dj = await Dj.findOne({ userId: req.body.userId });
    const bookings = await Booking.find({ djId: dj._id });
    userId: req.body.userId;

    return res.status(200).send({
      message: 'Pomyślnie pobrano wszyskie rezerwacje',
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Błąd pobrania rezerwacji',
      success: false,
      error,
    });
  }
});

router.post('/change-booking-status', authMiddleware, async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const booking = await Booking.findByIdAndUpdate(bookingId, { status });

    const user = await User.findOne({ _id: booking.userId });

    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: 'booking-status-change',
      message: `Status rezerwacji został zaaktualizowany na: ${status}`,
      onClickPath: '/bookings',
    });
    await user.save();

    res.status(200).send({
      message: 'Pomyślnie zaaktualizowano status rezerwacji',
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Błąd zmiany statusu rezerwacji',
      success: false,
      error,
    });
  }
});

module.exports = router;