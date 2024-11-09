
Welcome to the All-Star Jerseys online shop! This application allows users to browse, search, and purchase official jerseys of their favorite sports teams and players. Built using Node.js and the MVC (Model-View-Controller) architecture, this platform offers an intuitive user experience for both browsing and managing online orders.

The project supports features like user authentication, product management, and order processing, making it ideal for small-to-medium e-commerce projects. If you're shopping for soccer jerseys, you'll find everything you need here!

## Authors

- [@eliadbazak](https://www.github.com/bazakeliad)
- [@arielbaev](https://www.github.com/arielba2002)
- [@itayshabo](https://www.github.com/itay55)
- [@benepstein](https://www.github.com/BenEpstein)




## Features

- 🏆 Product Catalog: Display jerseys by categories (team, price, size, etc.).
- 🔒 User Authentication: Sign up, log in, and manage user through admin console
- 🛒 Shopping Cart: Add, update, and remove products in your cart.
- 💳 Order Checkout: Complete purchases through a secure checkout process.
- 📦 Order Management: View and track your past orders (for logged-in users).
- 🌐 Search and Filters: Search for jerseys and filter by category, size, price, etc.
- 🛠️ Admin Dashboard: Admin panel for managing products, orders, and users.
- 💾 Database Integration: MongoDB for storing user data, products, and orders.


## Tech Stack

**Node.js**: JavaScript runtime for server-side development

**Express.js**: Web framework for handling HTTP requests and middleware

**MongoDB**: NoSQL database for storing products, user data, and orders

**Mongoose**: ODM (Object Data Modeling) library for MongoDB

**EJS**: Template engine for dynamic HTML rendering


## Run Locally

Clone the project

```bash
  git clone https://github.com/bazakeliad/App-Development-Project.git
```

Go to the project directory

```bash
  cd ./App-Development-Project
```

Install dependencies

```bash
  npm install
```
Create a .env file in the root of the project and add the following:
```bash
  # API key for the newsapi.org
  API_KEY =

  # API key for the Google Maps
  GOOGLE_MAPS_API_KEY =

  # Secret for Session Coockie initialization
  SESSION_SECRET =

  # Facebook API keys
  FACEBOOK_TOKEN =
  FACEBOOK_PAGE_ID =

  # Welcome Email
  CLIENT_ID =
  CLIENT_SECRET =
  REDIRECT_URI =
  REFRESH_TOKEN =
  EMAIL_USER =
```

Start the server

```bash
  npm start
```


## Import pre-defined data

You can import pre-defined data to mongodb by importing the 
json files located in the root folder of the project.
