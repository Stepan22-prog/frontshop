const btn = document.getElementById('btn');
const surname = document.getElementById('surname');
const userName = document.getElementById('name');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const city = document.getElementById('city');
const radio = document.getElementsByName('pay');
formElem.onsubmit = async (e) => {
    e.preventDefault();
    let checkedRadio;
    for (i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            checkedRadio = radio[i].value
        };
    }
    let userData = {
        surname: surname.value,
        name: userName.value,
        phone: Number(phone.value),
        email: email.value,
        city: city.value,
        pay: checkedRadio
    };
    let response = await fetch('/order-buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(userData)
    });
};