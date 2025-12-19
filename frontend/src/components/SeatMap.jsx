export default function SeatMap({ seats, selected, onToggle }) {
  const rowsMap = seats.reduce((acc, seat) => {
    const row = seat.row_no;
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  const sortedRows = Object.keys(rowsMap)
    .map(Number)
    .sort((a, b) => a - b);

  const maxSeatsInRow = sortedRows.reduce((max, rowNo) => {
    const count = rowsMap[rowNo].length;
    return count > max ? count : max;
  }, 0);

  return (
    <div style={{ textAlign: "center" }}>
      {}
      <div
        style={{
          width: "100%",
          textAlign: "center",
          marginBottom: 16,
          padding: "6px 0",
          borderRadius: 999,
          background: "linear-gradient(90deg, #444, #888, #444)",
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: 2,
          opacity: 0.8
        }}
      >
        Екран
      </div>

      {}
      <div
        style={{
          display: "inline-block",
          padding: 12,
          background: "#050814",
          borderRadius: 8
        }}
      >
        {sortedRows.map((rowNo) => {
          const rowSeats = rowsMap[rowNo].sort(
            (a, b) => a.seat_no - b.seat_no
          );

          const seatsCount = rowSeats.length;
          const emptySlots = maxSeatsInRow - seatsCount;

          const leftPlaceholders = Math.floor(emptySlots / 2);

          return (
            <div
              key={rowNo}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 4
              }}
            >
              {}
              <div
                style={{
                  width: 28,
                  textAlign: "right",
                  marginRight: 8,
                  fontSize: 12,
                  opacity: 0.7
                }}
              >
                {rowNo}
              </div>

              {}
              <div style={{ display: "flex", gap: 4 }}>
                {}
                {Array.from({ length: leftPlaceholders }).map((_, i) => (
                  <div key={`ph-${rowNo}-${i}`} style={{ width: 26, height: 26 }} />
                ))}

                {rowSeats.map((seat) => {
                  const isSelected = selected.includes(seat.seat_id);
                  const isBooked = seat.status === "booked";

                  let bg = "#1b2340";
                  if (isBooked) bg = "#333";
                  else if (isSelected) bg = "#52c41a";

                  return (
                    <button
                      key={seat.seat_id}
                      disabled={isBooked}
                      onClick={() => onToggle(seat.seat_id)}
                      style={{
                        width: 26,
                        height: 26,
                        padding: 0,
                        borderRadius: 4,
                        background: bg,
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#fff",
                        fontSize: 11,
                        cursor: isBooked ? "not-allowed" : "pointer"
                      }}
                    >
                      {seat.seat_no}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {}
      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginRight: 16
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: "#1b2340",
              border: "1px solid rgba(255,255,255,0.4)",
              marginRight: 4
            }}
          />
          Вільні
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginRight: 16
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: "#52c41a",
              marginRight: 4
            }}
          />
          Обрані
        </span>
        <span
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: "#333",
              marginRight: 4
            }}
          />
          Зайняті
        </span>
      </div>
    </div>
  );
}
