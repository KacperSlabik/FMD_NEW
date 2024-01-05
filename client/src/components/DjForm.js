import { Button, Col, Form, Input, Row, Select } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ImagesUpload from './ImagesUpload';
import ProfileImageUpload, { getBase64 } from './ProfileImageUpload';

export default function DjForm({ onFinish, initialValues }) {
  const [musicGenres, setMusicGenres] = useState([]);
  const [offers, setOffers] = useState([]);
  const [profilePicture, setProfilePicture] = useState([]);
  const [selectedMusicGenres, setSelectedMusicGenres] = useState(initialValues?.musicGenres ? initialValues?.musicGenres : []);
  const [selectedOffers, setSelectedOffers] = useState(initialValues?.offers ? initialValues?.offers : []);

  const handleFormSubmit = async (values) => {
    let profileImage = {};

    if (profilePicture.length !== 0) {
      // get Base64 of image
      const profileBase64 = await getBase64(profilePicture[0].originFileObj);
      profileImage = {
        profileImage: profileBase64,
      };
    }

    onFinish({
      ...values,
      musicGenres: selectedMusicGenres,
      offers: selectedOffers,
      ...profileImage,
    });
  };

  const getMusicGenres = async () => {
    try {
      const response = await axios.get('/api/user/get-music-genres', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (response.data.success) {
        setMusicGenres(response.data.data);
      }
    } catch (error) {}
  };

  const getOffers = async () => {
    try {
      const response = await axios.get('/api/user/get-offers', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (response.data.success) {
        setOffers(response.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getMusicGenres();
    getOffers();
  }, []);

  return (
    <Form layout="vertical" onFinish={handleFormSubmit} initialValues={initialValues}>
      <h1 className="card-title mt-3">Informacje osobiste</h1>
      {initialValues?.profileImage && <img src={initialValues.profileImage} alt="" />}
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item label="Imię" name="firstName" rules={[{ required: true }]}>
            <Input placeholder="Imię"></Input>
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item label="Nazwisko" name="lastName" rules={[{ required: true }]}>
            <Input placeholder="Nazwisko"></Input>
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input placeholder="Email"></Input>
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item label="Numer Telefonu" name="phoneNumber" rules={[{ required: true }]}>
            <Input placeholder="Numer Telefonu"></Input>
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item label="Miejscowość" name="city" rules={[{ required: true }]}>
            <Input placeholder="Miejscowość"></Input>
          </Form.Item>
        </Col>
      </Row>
      <hr />
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item label="Ksywka DJ" name="alias" rules={[{ required: true }]}>
            <Input placeholder="Ksywka DJ"></Input>
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item label="Opis" name="djDescription" rules={[{ required: true }]}>
            <Input placeholder="Opis"></Input>
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item label="Facebook" name="facebook" rules={[{ required: true }]}>
            <Input type="url" placeholder="Facebook"></Input>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item label="Gatunki muzyczne">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              onChange={(value) => setSelectedMusicGenres(value)}
              placeholder="Wybierz gatunki muzyczne"
              defaultValue={initialValues?.musicGenres}
              optionLabelProp="label"
            >
              {musicGenres.map((musicGenre) => (
                <Select.Option value={musicGenre._id} key={musicGenre._id} label={musicGenre.name}>
                  {musicGenre.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item label="Oferta">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              onChange={(value) => setSelectedOffers(value)}
              placeholder="Wybierz twoją ofertę"
              defaultValue={initialValues?.offers}
              optionLabelProp="label"
            >
              {offers.map((offer) => (
                <Select.Option value={offer._id} key={offer._id} label={offer.name}>
                  {offer.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item label="Zdjęcia z imprez">
            <ImagesUpload></ImagesUpload>
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item label="Zdjęcie profilowe">
            <ProfileImageUpload handleImageUpload={setProfilePicture}></ProfileImageUpload>
          </Form.Item>
        </Col>
      </Row>
      <div className="d-flex justify-content-end">
        <Button className="primary-button" htmlType="submit">
          ZATWIERDŹ
        </Button>
      </div>
    </Form>
  );
}
