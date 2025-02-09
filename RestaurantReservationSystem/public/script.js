let totalSeats = 50000;
let seatsLeft = 50000;
const reservationForm = document.getElementById("reservationForm");
const reservationTable = document.getElementById("reservationTable").getElementsByTagName('tbody')[0];
const seatsLeftDisplay = document.getElementById("seatsLeft");
let reservations = [];

reservationForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const guestCount = parseInt(document.getElementById("guestCount").value.trim());

    if (guestCount > seatsLeft) {
        alert("Not enough seats available!");
        return;
    }

    const duplicate = reservations.find(res => res.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
        alert("A reservation with this name already exists!");
        return;
    }

    const checkInTime = new Date().toLocaleString();
    const reservation = { name, phone, guestCount, checkInTime, checkoutTime: "" };
    reservations.push(reservation);
    seatsLeft -= guestCount;
    updateSeatsLeft();
    addReservationToTable(reservation);
    reservationForm.reset();
});

function updateSeatsLeft() {
    seatsLeftDisplay.textContent = `Seats Left: ${seatsLeft}`;
}

function addReservationToTable(reservation) {
    const row = reservationTable.insertRow();

    row.insertCell(0).textContent = reservation.name;
    row.insertCell(1).textContent = reservation.phone;
    row.insertCell(2).textContent = reservation.guestCount;
    row.insertCell(3).textContent = reservation.checkInTime;
    const checkoutCell = row.insertCell(4);
    checkoutCell.textContent = reservation.checkoutTime;

    const actionCell = row.insertCell(5);
    const checkoutButton = document.createElement("button");
    checkoutButton.textContent = "Checkout";
    checkoutButton.classList.add("action-btn", "checkout-btn");
    checkoutButton.onclick = () => checkout(reservation, checkoutCell);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("action-btn", "delete-btn");
    deleteButton.onclick = () => deleteReservation(reservation, row);

    actionCell.appendChild(checkoutButton);
    actionCell.appendChild(deleteButton);
}

function checkout(reservation, checkoutCell) {
    if (reservation.checkoutTime) {
        alert("Already checked out!");
        return;
    }
    reservation.checkoutTime = new Date().toLocaleString();
    checkoutCell.textContent = reservation.checkoutTime;
    seatsLeft += reservation.guestCount;
    updateSeatsLeft();
}

function deleteReservation(reservation, row) {
    if (!reservation.checkoutTime) {
        seatsLeft += reservation.guestCount;
    }
    reservations = reservations.filter(res => res.name !== reservation.name);
    reservationTable.deleteRow(row.rowIndex - 1);
    updateSeatsLeft();
}
