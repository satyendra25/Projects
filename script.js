
document.addEventListener('DOMContentLoaded', () => {
    // const form = document.getElementById('form');
    const tableBody = document.getElementById('tableBody');
    const totalPriceDisplay = document.getElementById('totalPrice');
    let nameArr = [];
    let totalPrice = 0; 

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let TeaName = document.getElementById('tea').value;
        const Quantity = parseInt(document.getElementById('quantity').value) || 0;
        const Price = parseFloat(document.getElementById('price').value) || 0;
        let itemTotal = (Price * Quantity).toFixed(2);

        let formdata = { tea: TeaName, quantity: Quantity, price: Price, Tamount: itemTotal }

        nameArr.push(formdata);
        totalPrice += parseFloat(itemTotal);
        totalPriceDisplay.textContent = totalPrice;
        displayDataInTable(nameArr);

        //clear form input
        form.reset();
        document.getElementById('tea').value = 'Tea';

        function displayDataInTable(nameArr) {
            tableBody.innerHTML = ''; 
            // Iterate
            nameArr.forEach(item => {
                const row = document.createElement('tr');

                // Create new cell and send data
                const nameCell = document.createElement('td');
                nameCell.textContent = item.tea;
                row.appendChild(nameCell);

                const quantityCell = document.createElement('td');
                quantityCell.textContent = item.quantity;
                row.appendChild(quantityCell);

                const priceCell = document.createElement('td');
                priceCell.textContent = item.price;
                row.appendChild(priceCell);

                const totalCell = document.createElement('td');
                totalCell.textContent = item.Tamount;
                row.appendChild(totalCell);

                // Append the row to the table body
                tableBody.appendChild(row);
            });
        }
    });
})

