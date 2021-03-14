const http = require('http');
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser')
const session = require('express-session');
const { request } = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const MongoStore = require('connect-mongo');

const appPassword = process.env.SHOPIFY_APP_PASSWORD;

const app = express()

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

//Default endpoint. Generates a password for the session if not already created
app.post('/init', function (req, res, next) {
    // Access the session as req.session
    console.log(req.session.userSession);
    const variantID = req.body.id;
    const password = Math.floor(Math.random() * Math.floor(1000));
    // Check validity:
    if (!req.session.userSession) {
        req.session.userSession = [{
            id: variantID,
            attempt: 1,
            password: password,
            url: null // This one is for when the draft order is done
        }];
        req.session.correctAttempt = 0;
        res.status(200).send({ message: 'ok' });
    } else if (req.session.totalAttempt > 2) {
        res.status(422).send({ message: 'You are a good guesser but we are poor :< sorry only two discounts per person :( ' });
    } else {
        const variant = req.session.userSession.find((secret) =>
            JSON.stringify(secret.id) === JSON.stringify(variantID)
        );
        if (!variant) {
            req.session.userSession.push({
                id: variantID,
                attempt: 1,
                password: password,
                url: null
            })
            res.status(200).send({ message: 'ok' });
        } else if (variant.url !== null) {
            res.status(409).send({ message: 'You already guessed this correctly, stop guessing!', data: variant.url });
        } else if (variant.attempt > 10) {
            res.status(422).send({ message: 'You have guessed too many attempts for this variant' });
        } else {
            res.status(200).send({ message: 'keep guessing' });
        }
    }
});

/**Attempt endpoint. 
 * Expects the password attempt in the body. 
 * Returns HIGH, LOW or SUCCESS
 * */
app.post('/attempt', async function (req, res, next) {
    console.log('attempt--');
    console.log(req.session.userSession)
    console.log(req.body);
    const variantID = req.body.id;
    const variant = req.session.userSession.find((secret) =>
        JSON.stringify(secret.id) === JSON.stringify(variantID)
    );
    const attempt = variant.attempt;
    if (variant.url !== null) {
        res.status(409).send({ message: 'You already guessed this correctly, stop guessing!', data: variant.url });
    } else if (attempt > 10) {
        res.status(422).send({ message: 'You have guessed too many attempts for this variant' });
    }

    const answer = parseInt(variant.password);
    const guessed = parseInt(req.body.password);

    if (guessed > answer) {
        // Too High!
        variant.attempt++;
        res.status(200).send({ message: 'high', attempt: attempt })
    } else if (guessed < answer) {
        // Too Low!
        variant.attempt++;
        res.status(200).send({ message: 'low', attempt: attempt })
    } else if (guessed == answer) {
        // Callback for draftorder here!
        const quantity = 1
        try {
            const order = await draftOrder(variantID, quantity);
            variant.url = order.draft_order.invoice_url;
            req.session.totalAttempt += 1;
            console.log(order);
            res.status(200).send({ message: 'correct', attempt: attempt, data: order.draft_order.invoice_url });
        } catch (error) {
            res.status(500).send(error);
        }
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
        const products = await shopifyResult.json();
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
    } catch (error) {
        res.status(500).send(error);
    }
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
        return await result.json();
    } catch (error) {
        throw new Error(error);
    }
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
        const product = await result.json();
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
            "tags": product.product.tags,
            "description": product.product.body_html,
            "variants": variants,
            "images": images
        }

        res.status(200).send(productsResult);
    } catch (error) {
        res.status(500).send(error);
    }

});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });

// error handling
app.use((err, req, res, next) => {
    res.status(err.httpStatusCode || 400).json({ message: err.message })
})

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});