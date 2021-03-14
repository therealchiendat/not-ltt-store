const http = require('http');
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser')
const session = require('express-session');
const { request } = require('express');
const dotenv = require('dotenv').config();
const cookie = require('cookie');
const nonce = require('nonce');

const appPassword = process.env.SHOPIFY_APP_PASSWORD;

const app = express()

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 3000;

app.use(bodyParser.json())

const sessionOptions = {
    secret: 'my-super-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000
    },
}

app.use(session(sessionOptions))

app.get('/kickout', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>OH NO... You have already tried TEN TIMES </p>')
    res.write('<p>Sorry, go to sleep. No discount for you.</p>')
    req.session.destroy()
    console.log('Kicking you out')
    res.end()
})

//Default endpoint. Generates a password for the session if not already created
app.post('/init', function (req, res, next) {
    // Access the session as req.session
    console.log('----')
    const variantID = req.body.id;
    console.log(variantID);
    const password = Math.floor(Math.random() * Math.floor(1000));
    // Check validity:
    if (!req.session.userSession) {
        req.session.userSession = [{
            id: variantID,
            attempt: 1,
            password: password
        }]
        res.status(200).send('yay');
    } else {
        const variant = req.session.userSession.find((secret) =>
            JSON.stringify(secret.id) === JSON.stringify(variantID)
        );
        if (!variant) {
            req.session.userSession.push({
                id: variantID,
                attempt: 1,
                password: password
            })
            res.status(200).send('yay 2');
        } else {
            res.status(200).send(['keep guessing id:', variantID]);
        }
    }
})

/**Attempt endpoint. 
 * Expects the password attempt in the body. 
 * Returns HIGH, LOW or SUCCESS
 * */
app.post('/attempt', async function (req, res, next) {
    console.log(req.session.userSession)
    console.log(req.body);
    const variantID = req.body.id;
    const variant = req.session.userSession.find((secret) =>
        JSON.stringify(secret.id) === JSON.stringify(variantID)
    );
    const attempt = variant.attempt;
    if (attempt > 10) {
        res.status(422).send({ message: 'You have guessed too many attempts for this variant' })
    }

    const answer = parseInt(variant.password);
    const guessed = parseInt(req.body.password);
    console.log(guessed, answer);
    if (guessed > answer) {
        console.log('high')
        variant.attempt++;
        res.status(200).send({ message: 'high', attempt: attempt })
    } else if (guessed < answer) {
        console.log('low')
        variant.attempt++;
        res.status(200).send({ message: 'low', attempt: attempt })
    } else if (guessed == answer) {
        console.log('correct');
        // Callback for draftorder here!
        const quantity = 1
        try {
            const order = await draftOrder(variantID, quantity);
            console.log('draft order:', order);
        } catch (error) {
            console.log(error);
        }
        res.status(200).send(order);
    }

})

app.get("/products", async (req, res) => {

    try {
        const shopifyResult = await fetch(`https://not-ltt-store.myshopify.com/admin/api/2021-01/products.json`, {
            method: "GET",
            headers: {
                "X-Shopify-Access-Token": appPassword
            }
        })
        const products = await shopifyResult.json()
    } catch (error) {
        console.log(error);
    }


    let productsResult = []

    products.products.forEach(product => {
        let variants = []
        product.variants.forEach(variant => {
            variants.push({
                "id": variant.id,
                "title": variant.title,
                "price": variant.price
            })
        })

        let images = []

        product.images.forEach(image => {
            images.push({
                "id": image.id,
                "product_id": image.product_id,
                "src": image.src,
                "alt": image.alt,
                "variant_ids": image.variant_ids
            })
        })
        productsResult.push({
            "id": product.id,
            "title": product.title,
            "variants": variants,
            "images": images
        }
        )
    })


    res.status(200).send(productsResult);
});

async function draftOrder(variantID, quantity) {

    const reqBody = {
        "draft_order": {
            "line_items": [
                {
                    "variant_id": variantID,
                    "quantity": quantity
                }
            ],
            "applied_discount": {
                "value_type": "percentage",
                "value": "20"
            }
        }
    }

    const request = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "X-Shopify-Access-Token": appPassword
        },
        body: JSON.stringify(reqBody)
    };
    try {
        const result = await fetch(`https://not-ltt-store.myshopify.com/admin/api/2021-01/draft_orders.json`, request);
    } catch (error) {
        console.log(error)
    }
    return await result.json();
}

app.get("/products/:id", async (req, res) => {
    // Retrieve the tag from our URL path
    const product_id = req.params.id;
    try {
        const result = await fetch(`https://not-ltt-store.myshopify.com/admin/api/2021-01/products/${product_id}.json`, {
            method: "GET",
            headers: {
                "X-Shopify-Access-Token": appPassword
            }
        })
        const product = await result.json()
    } catch (error) {
        console.log(error);
    }

    let variants = []
    product.product.variants.forEach(variant => {
        variants.push({
            "id": variant.id,
            "title": variant.title,
            "price": variant.price
        })
    })

    let images = []

    product.product.images.forEach(image => {
        images.push({
            "id": image.id,
            "product_id": image.product_id,
            "src": image.src,
            "variant_ids": image.variant_ids
        })
    })
    const productsResult = {
        "id": product.product.id,
        "title": product.product.title,
        "description": product.product.body_html,
        "variants": variants,
        "images": images
    }

    res.status(200).send(productsResult);
});

// app.post("/draftorder", async (req, res) => {

//     const variantId = req.body.variantId;
//     const quantity = req.body.quantity;

//     const reqBody = {
//         "draft_order": {
//             "line_items": [
//                 {
//                     "variant_id": variantId,
//                     "quantity": quantity
//                 }
//             ],
//             "applied_discount": {
//                 "value_type": "percentage",
//                 "value": "20"
//             }
//         }
//     }

//     const request = {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json',
//             "X-Shopify-Access-Token": appPassword
//         },
//         body: JSON.stringify(reqBody)
//     };

//     console.log(request);
//     const result = await fetch(`https://not-ltt-store.myshopify.com/admin/api/2021-01/draft_orders.json`, request)

//     const draftOrder = await result.json()
//     res.status(200).send(draftOrder);
//     console.log(draftOrder);
// });



// error handling
app.use((err, req, res, next) => {
    res.status(err.httpStatusCode || 400).json({ message: err.message })
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});