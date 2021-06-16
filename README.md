# Ionic Stripe

Basic Stripe elements checkout page in a Ionic 5/Vue 3 application.

> For demonstration purpose only

Demo: 

## Requirements

- Stripe account
- API auth thoken on the [Laravel backend](https://github.com/cba85/teach-laravel8-saas)

## Install

### 1. Install

```bash
$ npm install
$ cp .env.example .env
```

### 2. Update your credentials

Add your database, Stripe and Cloudinary credentials into the .env file.

## Usage

1. Launch [Laravel backend API](https://github.com/cba85/teach-laravel8-saas)
2. Launch Ionic app:
    ```bash
    $ ionic serve
    ```

## Features

The checkout page handles:

- No authentication (default U.S. card): `4242 4242 4242 4242`
- Authentication required: `4000 0027 6000 3184`

## TODO

- Handle authentication inside the app like in [Sanctum Vue App example](https://github.com/cba85/teach-laravel-sanctum-auth-vue-app) instead a static token in `.env` file

## Dependencies

- Ionic 5
- Vue 3
