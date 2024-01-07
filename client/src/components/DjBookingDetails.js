import React from 'react';

export default function DjBookingDetails({ booking }) {
  console.log(booking);
  return (
    <div>
      <strong>Lokalizacja:</strong>
      <p>
        {booking?.location} ({booking?.postalCode} {booking?.city}, {booking?.address})
      </p>
      <hr />
      <strong>Informację o imprezie:</strong>
      <p style={{ margin: 0 }}>Liczba gości: {booking?.guests}</p>
      <p>Typ: {booking?.partyType}</p>
    </div>
  );
}
