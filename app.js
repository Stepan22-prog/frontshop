const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(cookieParser())

app.use("/item/:id", function (request, response, next) {
    if (!isNaN(Number.parseInt(request.params.id))) {
        const requestId = Number.parseInt(request.params.id);
        fetchDataForItem(requestId).then(result => {
            response.cookie('laptop_id', result.id, { httpOnly: true })
            response.cookie('laptop_name', result.attributes.Title, { httpOnly: true })
            response.render("item", {
                title: result.attributes.Title,
                main_img: "https://testbackendforshop-stepanigcom.b4a.run" + result.attributes.Image.data[1].attributes.url,
                imgs: result.attributes.Image.data.map(item => { return "https://testbackendforshop-stepanigcom.b4a.run" + item.attributes.url }),
                price: result.attributes.Price,
                description: result.attributes.Description
            });
        });
    } else {
        next();
    }
});
app.use("/order", function (request, response, next) {
    response.render("order", {
        title: request.cookies.laptop_name,
        link: "/item/" + request.cookies.laptop_id,
    });
});
app.use(bodyParser.json());
app.use("/order-buy", function (request, response, next) {
    console.log(request.body);
    writeOrderData(request.body, request.cookies.laptop_id);
    response.sendStatus(200);
});

app.use("/", function (request, response) {
    response.sendFile(__dirname + "/public/index.html");
});
app.listen(process.env.PORT || 3000);

async function fetchDataForItem(id) {
    try {
        const response = await fetch(`https://testbackendforshop-stepanigcom.b4a.run/api/laptops/${id}?fields=title&fields=price&fields=description&populate[Image][fields]=url`);
        if (response.ok) {
            const json = await response.json();
            return json.data;
        } else {
            return "Ошибка HTTP: " + response.status;
        }
    } catch (error) {
        console.error("Произошла ошибка:", error);
    }
}
async function writeOrderData(data, laptopId) {
    let writeData = {
        "data": {
            "Name": data.name,
            "Surname": data.surname,
            "Phone": data.phone,
            "Email": data.email,
            "City": data.city,
            "Payment": data.payment,
            "LaptopId": laptopId,
            "Laptop": laptopId
        }
    };
    let response = await fetch('https://testbackendforshop-stepanigcom.b4a.run/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(writeData)
    });
}