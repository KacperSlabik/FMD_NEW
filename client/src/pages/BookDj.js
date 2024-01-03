import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { Row, Col, Button, DatePicker, Divider, Form, Input, TimePicker } from 'antd';
import { formatDateTime } from '../utils';
import Modal from 'antd/es/modal/Modal';

export default function BookAppointment() {
  const params = useParams();
  const [dj, setDj] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [startDate, setStartDate] = useState();
  const [startTime, setStartTime] = useState();

  const [endDate, setEndDate] = useState();
  const [endTime, setEndTime] = useState();

  const [isAvailable, setIsAvailable] = useState(false);

  const [musicGenres, setMusicGenres] = useState([]);
  const [offer, setOffer] = useState([]);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const showModal = (values) => {
    setConfirmModalOpen(true);
    setFormData(values);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    await bookNow(formData);
    setConfirmModalOpen(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setConfirmModalOpen(false);
  };

  const getDjData = async () => {
    try {
      dispatch(showLoading());
      console.log(localStorage.getItem('token'));
      const response = await axios.post(
        '/api/dj/get-dj-info-by-id',
        { djId: params.djId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      console.log(response.data.data);
      if (response.data.success) {
        setDj(response.data.data);
        getMusicGenres(response.data.data);
        getOffer(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const getMusicGenres = async (djData) => {
    const djMusicGenresId = djData?.musicGenres;

    if (!djMusicGenresId) return;

    djMusicGenresId.forEach(async (id) => {
      const response = await axios.get(
        '/api/user/get-music-genre',

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: { genreId: id },
        }
      );
      if (response.data.success) {
        setMusicGenres((prevState) => [...prevState, response.data.data.name]);
      }
      try {
      } catch (error) {
        console.log(error);
      }
    });
  };

  const getOffer = async (djData) => {
    const offersId = djData?.offers;

    if (!offersId) return;

    offersId.forEach(async (id) => {
      const response = await axios.get(
        '/api/user/get-offer',

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: { offerId: id },
        }
      );
      if (response.data.success) {
        setOffer((prevState) => [...prevState, response.data.data.name]);
      }
      try {
      } catch (error) {
        console.log(error);
      }
    });
  };

  const checkAvailability = async () => {
    if (!startDate || !startTime || !endDate || !endTime) {
      toast.error('Aby sprawdzić dostępność DJ uzupełnij czas rozpoczęcia i zakończenia imprezy');
      return;
    }

    const formattedStartDate = formatDateTime(startDate, startTime);
    const formattedEndDate = formatDateTime(endDate, endTime);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        '/api/user/check-booking-avilability',
        {
          djId: params.djId,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error booking appointment');
      dispatch(hideLoading());
    }
  };

  const bookNow = async (values) => {
    setIsAvailable(false);
    const formattedStartDate = formatDateTime(startDate, startTime);
    const formattedEndDate = formatDateTime(endDate, endTime);

    try {
      dispatch(showLoading());
      const response = await axios.post(
        '/api/user/book-dj',
        {
          djId: params.djId,
          userId: user._id,
          djInfo: dj,
          userInfo: user,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/app/bookings');
      }
    } catch (error) {
      toast.error('Error booking appointment');
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDjData();
  }, []);

  return (
    <Layout>
      {dj && (
        <Form layout="vertical" onFinish={showModal}>
          <header class="book-dj-header">
            {dj?.profileImage && <img src={dj.profileImage} alt={dj.alias} className="rounded" />}
            <div>
              <h1 className="page-title">
                Rezerwacja: {dj.firstName} {dj.lastName}
              </h1>
              <div className="d-flex gap-2 flex-column">
                {dj?.djDescription}
                <span>
                  <strong>Dane kontaktowe: </strong>
                  {dj?.phoneNumber && <span>tel: {dj?.phoneNumber}</span>}, {dj?.email && <span>email: {dj?.email}</span>}
                </span>
                <span>
                  <strong>Grane gatunki muzyczne: </strong> {musicGenres.join(', ')}
                </span>
                <span>
                  <strong>Oferta: </strong> {offer.join(', ')}
                </span>
              </div>
            </div>
          </header>

          <hr />
          <Row gutter={20}>
            {isAvailable && (
              <Col span={12}>
                <Divider orientation="left" orientationMargin="0">
                  <h2 className="mb-2">Lokalizacja</h2>
                </Divider>
                <div className="d-flex flex-wrap" style={{ gap: '20px' }}>
                  <Form.Item label="Nazwa obiektu" name="location" rules={[{ required: true }]}>
                    <Input placeholder="Nazwa obiektu"></Input>
                  </Form.Item>

                  <Form.Item label="Miejscowość" name="city" rules={[{ required: true }]}>
                    <Input placeholder="Miejscowość"></Input>
                  </Form.Item>

                  <Form.Item label="Kod pocztowy" name="postalCode" rules={[{ required: true }]}>
                    <Input placeholder="00-000"></Input>
                  </Form.Item>

                  <Form.Item label="Adres" name="address" rules={[{ required: true }]}>
                    <Input placeholder="Adres"></Input>
                  </Form.Item>
                </div>

                <Divider orientation="left" orientationMargin="0">
                  <h2 className="mb-2">Dodatkowe informacje</h2>
                </Divider>
                <div className="d-flex flex-wrap" style={{ gap: '20px' }}>
                  <Form.Item label="Liczba gości" name="guests" rules={[{ required: true }]}>
                    <Input placeholder="0" type="number"></Input>
                  </Form.Item>

                  <Form.Item label="Typ imprezy" name="partyType" rules={[{ required: true }]}>
                    <Input placeholder="Typ imprezy"></Input>
                  </Form.Item>
                </div>
              </Col>
            )}
            <Col span={12}>
              <Divider orientation="left" orientationMargin="0">
                <h2 className="mb-2">Szczegóły rezerwacji</h2>
              </Divider>

              <div className="d-flex flex-row align-items-center gap-2">
                <p>Rozpoczęcie imprezy:</p>
                <div className="d-flex flex-row gap-2">
                  <DatePicker onChange={(value) => setStartDate(value)} />
                  <TimePicker format="HH:mm" onChange={(value) => setStartTime(value)} />
                </div>
              </div>

              <div className="d-flex flex-row align-items-center gap-2">
                <p>Zakończenie imprezy:</p>
                <div className="d-flex flex-row gap-2">
                  <DatePicker onChange={(value) => setEndDate(value)} />
                  <TimePicker format="HH:mm" onChange={(value) => setEndTime(value)} />
                </div>
              </div>

              {!isAvailable && (
                <Button className="primary-button full-width-button mt-3" onClick={checkAvailability}>
                  Sprawdź termin
                </Button>
              )}
              {isAvailable && (
                <Button className="primary-button full-width-button mt-3" htmlType="submit">
                  Zarezerwuj teraz
                </Button>
              )}
            </Col>
          </Row>

          <Modal title="Potwierdzenie rezerwacji" open={confirmModalOpen} confirmLoading={confirmLoading} onOk={handleOk} onCancel={handleCancel}>
            <p>Czy na pewno chcesz dokonać rezerwacji?</p>
          </Modal>
        </Form>
      )}
    </Layout>
  );
}
