import { useNavigate } from 'react-router-dom';

export default function Dj({ dj }) {
  const navigate = useNavigate();
  return (
    <div className="card p-2 dj-card" onClick={() => navigate(`/app/book-dj/${dj._id}`)}>
      <h1 className="card-title">
        {dj.alias}
        <h1 className="normal-text">
          {dj.firstName} {dj.lastName}
        </h1>
      </h1>

      <p className="card-text ">{dj.djDescription}</p>

      <hr className="mt-0" />

      <p className="card-text">
        <strong>Telefon:</strong> {dj.phoneNumber}
      </p>

      <p className="card-text">
        <strong>Mail:</strong> {dj.email}
      </p>

      <p className="card-text">
        <strong>Miejscowość:</strong> {dj.city}
      </p>
    </div>
  );
}
