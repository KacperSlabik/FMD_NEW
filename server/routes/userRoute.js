const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const Dj = require('../models/djModel');
const Booking = require('../models/bookingModel');
const MusicGenre = require('../models/musicGenreModel');
const Offer = require('../models/offerModel');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kacpero1407@gmail.com', // Zmień na odpowiedni adres e-mail
    pass: 'meyc bdeq jlek tnmg', // Zmień na odpowiednie hasło
  },
});

router.post('/register', async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(409).send({ message: 'Użytkownik już istnieje', success: false });
    }

    // Haszowanie hasła przed zapisaniem do bazy danych
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newuser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await newuser.save();

    const token = jwt.sign({ userId: newuser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const verificationLink = `http://localhost:3000/verify-email/${token}`;

    const mailOptions = {
      from: 'your.mail@gmail.com',
      to: req.body.email,
      subject: 'Potwierdzenie rejestracji',
      html: `<p>Kliknij <a href="${verificationLink}">tutaj</a> aby potwierdzić rejestrację.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send({
          message: 'Błąd wysyłania linku autoryzacyjnego',
          success: false,
        });
      } else {
        console.log('E-mail sent: ' + info.response);
        res.status(200).send({
          message: 'Link autoryzacyjny został wysłany na podany mail. Na potwierdzenie masz 24h',
          success: true,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Błąd rejestracji',
      success: false,
      error: error.message,
    });
  }
});

router.get('/verify-email/:token', async (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.status(400).send({ message: 'Brak tokenu weryfikacyjnego' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decodedToken); // Dodaj ten log

    const userId = decodedToken.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'Użytkownik nie znaleziony' });
    }

    user.verified = true;
    await user.save();

    res.status(200).send({ message: 'E-mail zweryfikowany pomyślnie' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Błąd weryfikacji e-maila', error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: 'Uzytkownik nie istnieje', success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: 'Nieprawidłowe hasło', success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      res.status(200).send({ message: 'Zalogowano pomyślnie', success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Błąd logowania', success: false, error });
  }
});

router.post('/login/auth', async (req, res) => {
  try {
    const verified_email = req.body.verified_email;

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(200).send({ message: 'Użytkownik nie istnieje', success: false });
    }
    if (!verified_email) {
      return res.status(200).send({ message: 'Email niezweryfikowany', success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).send({ message: 'Zalogowano pomyślnie', success: true, data: token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Błąd logowania', success: false, error });
  }
});

const sendResetPasswordEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kacpero1407@gmail.com',
      pass: 'meyc bdeq jlek tnmg',
    },
  });

  const mailOptions = {
    from: 'your-email@example.com',
    to: email,
    subject: 'Resetowanie hasła',
    html: `<p>Kliknij poniższy link, aby zresetować hasło:</p><a href="http://localhost:3000/reset-password/${token}">Resetuj hasło</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Błąd podczas wysyłania e-maila:', error);
    } else {
      console.log('E-mail został wysłany:', info.response);
    }
  });
};

router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Znajdź użytkownika w bazie danych na podstawie adresu email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Użytkownik o podanym adresie email nie istnieje',
      });
    }

    // Generuj token JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '2m',
    });

    // Wyślij e-mail z linkiem do resetowania hasła
    sendResetPasswordEmail(email, token);

    res.json({
      success: true,
      message: 'Link do resetowania hasła został wysłany na Twój adres email',
      token: encodeURIComponent(token), // Dodaj token do odpowiedzi
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Coś poszło nie tak' });
  }
});

router.post('/set-password', async (req, res) => {
  const { email, token } = req.body;

  try {
    // Znajdź użytkownika w bazie danych na podstawie adresu email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Użytkownik o podanym adresie email nie istnieje',
      });
    }

    // Weryfikuj token JWT
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Nieprawidłowy lub wygasły token',
        });
      }

      // Ustaw nowe hasło
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user.password = hashedPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Hasło zostało zresetowane pomyślnie',
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Coś poszło nie tak' });
  }
});

router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({ message: 'Uzytkownik nie istnieje', success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: 'Błąd pobrania informacji uzytkownika',
      success: false,
      error,
    });
  }
});

router.get('/get-all-djs', authMiddleware, async (req, res) => {
  try {
    const djs = await Dj.find({ status: 'Potwierdzony' });
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

router.get('/get-music-genre', async (req, res) => {
  try {
    const djs = await MusicGenre.findOne({ _id: req.query.genreId });
    res.status(200).send({
      message: 'Pomyślnie pobrano gatunek muzyczny',
      success: true,
      data: djs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Błąd pobrania gatunka muzycznego',
      success: false,
      error,
    });
  }
});

router.get('/get-offer', async (req, res) => {
  try {
    const djs = await Offer.findOne({ _id: req.query.offerId });
    res.status(200).send({
      message: 'Pomyślnie pobrano ofertę',
      success: true,
      data: djs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Błąd pobrania ofery',
      success: false,
      error,
    });
  }
});

router.post('/apply-dj-account', authMiddleware, async (req, res) => {
  try {
    const newDj = new Dj({ ...req.body, status: 'Oczekuje' });
    await newDj.save();
    const adminUser = await User.findOne({ isAdmin: true });

    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: 'new-dj-request',
      message: `${newDj.firstName} ${newDj.lastName} złozył wniosek o utworzenie konta DJa`,
      data: {
        djId: newDj._id,
        name: newDj.firstName + ' ' + newDj.lastName,
      },
      onClickPath: '/app/admin/djslist',
    });
    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    res.status(200).send({
      success: true,
      message: 'Pomyślnie utworzono konto DJa',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Błąd aplikacji o konto dla DJa',
      success: false,
      error,
    });
  }
});

router.post('/mark-all-notifications-as-seen', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    const unseenNotifications = user.unseenNotifications;
    const seenNotifications = user.seenNotifications;
    seenNotifications.push(...unseenNotifications);
    user.unseenNotifications = [];
    user.seenNotifications = seenNotifications;
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: 'Wszystkie powiadomienia zostały odczytane',
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Błąd',
      success: false,
      error,
    });
  }
});

router.post('/delete-all-notifications', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.seenNotifications = [];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: 'Odczytane powiadomienia zostały usunięte',
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Błąd',
      success: false,
      error,
    });
  }
});

router.post('/book-dj', authMiddleware, async (req, res) => {
  try {
    req.body.status = 'Oczekuje';

    const newBooking = new Booking({
      ...req.body,
      startDate: new Date(req.body.startDate).toISOString(),
      endDate: new Date(req.body.endDate).toISOString(),
    });
    await newBooking.save();

    const dj = await Dj.findOne({ _id: req.body.djId });
    const djAsUser = await User.findOne({ _id: dj.userId });

    const user = await User.findOne({ _id: req.body.djInfo.userId });

    djAsUser.unseenNotifications.push({
      type: 'new-booking-request',
      message: `Nowa rezerwacja została utworzona przez: ${req.body.userInfo.name}`,
      onClickPath: '/app/dj/bookings',
    });
    await djAsUser.save();

    return res.status(200).send({ message: 'Zarezerwowano', success: true, data: newBooking });
  } catch (error) {
    return res.status(500).send({
      message: 'Wystąpił błąd w rezerwacji',
      success: false,
      error,
    });
  }
});

router.post('/check-booking-avilability', authMiddleware, async (req, res) => {
  try {
    const newStartDate = new Date(req.body.startDate);
    const newEndDate = new Date(req.body.endDate);
    const djId = req.body.djId;
    const bookings = await Booking.find({
      djId,
      $and: [
        {
          $or: [
            {
              $and: [
                { startDate: { $lte: newStartDate } }, // Existing event starts before or on the new event's start date
                { endDate: { $gte: newStartDate } }, // Existing event ends after or on the new event's start date
              ],
            },
            {
              $and: [
                { startDate: { $lte: newEndDate } }, // Existing event starts before or on the new event's end date
                { endDate: { $gte: newEndDate } }, // Existing event ends after or on the new event's end date
              ],
            },
          ],
        },
      ],
    });
    if (bookings.length > 0) {
      console.log(bookings);
      return res.status(200).send({
        message: 'Brak wolnego terminu',
        success: false,
      });
    } else {
      return res.status(200).send({
        message: 'Termin jest wolny',
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error booking appointment',
      success: false,
      error,
    });
  }
});

router.get('/get-music-genres', authMiddleware, async (req, res) => {
  try {
    const genres = await MusicGenre.find();
    res.status(200).send({
      message: 'Pomyślnie pobrano gatunki muzyczne',
      success: true,
      data: genres,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Błąd pobierania gatunków muzycznych',
      success: false,
      error,
    });
  }
});

router.get('/get-offers', authMiddleware, async (req, res) => {
  try {
    const genres = await Offer.find();
    res.status(200).send({
      message: 'Pomyślnie pobrano oferty',
      success: true,
      data: genres,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Błąd pobierania ofert',
      success: false,
      error,
    });
  }
});

router.get('/get-bookings-by-user-id', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.body.userId,
    });
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

module.exports = router;
