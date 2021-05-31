export const Seat = ({ seat, onClick }) => {
  return (
    <div className="seat-container">
      {seat?.isEmptySpace ? (
        <div className="empty-block" />
      ) : (
        <button
          onClick={onClick}
          disabled={seat.reserved && !seat.reservedByMe}
          className={
            seat.reservedByMe
              ? "seat-content reserved"
              : seat.reserved
              ? "seat-content unavailable"
              : "seat-content"
          }
        />
      )}
    </div>
  );
};
