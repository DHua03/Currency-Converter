# Currency Converter

A responsive currency conversion application built with React and Vite that allows users to convert amounts between supported currencies using current exchange rates retrieved from the Frankfurter API.

## Overview

This application provides a simple currency conversion interface where users can enter an amount, select a source and target currency, and view the converted value and current exchange rate.

The application retrieves supported currencies and exchange rates from the Frankfurter API and updates the conversion whenever the selected currencies change. It also includes light and dark themes and a responsive layout for different screen sizes.

## Features

* Convert amounts between supported currencies
* Select currencies using dropdown menus
* Swap source and target currencies
* Display the current exchange rate
* Automatically update exchange rates when currencies change
* Retrieve supported currencies from the Frankfurter API
* Display loading and error messages for API requests
* Support light and dark themes
* Responsive layout for desktop and mobile screens

## Tech Stack

* React
* Vite
* JavaScript
* CSS
* REST API
* Frankfurter API

## Project Structure

```text
Currency-Converter
│
├── src
│   ├── App.jsx          # Main currency converter component
│   ├── App.css          # Currency converter styling
│   ├── index.css        # Global styling and theme variables
│   └── main.jsx         # React application entry point
│
├── .gitignore
├── eslint.config.js     # ESLint configuration
├── index.html           # Application HTML entry point
├── package.json         # Project dependencies and scripts
├── package-lock.json    # Dependency lock file
├── vite.config.js       # Vite configuration
└── README.md
```

## Installations

Make sure Node.js and npm are installed on your system.

### 1. Clone Repository

```bash
git clone https://github.com/DHua03/Currency-Converter.git
```

### 2. Navigate into Project Directory

```bash
cd Currency-Converter
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Application

```bash
npm run dev
```

Open the local development URL provided by Vite in your browser.

## What I Learned

* Building React components using functional components
* Managing application state with React hooks
* Using `useState` to manage user input and application state
* Using `useEffect` to retrieve data from an external API
* Using `useMemo` to calculate converted currency values
* Working with REST APIs and asynchronous requests
* Handling API loading and error states
* Creating responsive layouts with CSS
* Implementing light and dark themes
* Using Vite to build and run a React application
* Using ESLint to identify potential code issues

## Inspiration

This project was initially based on the FreeCodeCamp Currency Converter exercise.

It was later rebuilt as a standalone React + Vite project and expanded with additional functionality, including dynamic currency retrieval, exchange-rate updates, currency swapping, light and dark themes, error handling, and responsive styling.

## Future Improvements

* Add conversion history
* Allow users to view multiple exchange rates at once
* Add historical exchange-rate information
* Add more detailed currency information
* Improve accessibility and keyboard navigation
* Add automated tests
* Deploy the application as a live web application

## Author

Dylan Hua
Computer Science Graduate | Software Engineer

GitHub: https://github.com/DHua03
