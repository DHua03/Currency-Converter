import { useState, useMemo, useEffect } from 'react';

function CurrencyConverter() {
  // Stores whether dark mode is currently enabled.
  const [darkMode, setDarkMode] = useState(false);

  // Stores the amount entered by the user.
  const [amount, setAmount] = useState('');

  // Stores the list of currencies retrieved from the API.
  const [currencies, setCurrencies] = useState([]);

  // Stores the selected currencies for the conversion.
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  // Stores the current exchange rate between the selected currencies.
  const [exchangeRate, setExchangeRate] = useState(null);

  // Tracks whether the exchange-rate request is still loading.
  const [loading, setLoading] = useState(true);

  // Stores an error message when an API request fails.
  const [error, setError] = useState('');

  // Finds a currency in the API data using its currency code.
  function getCurrency(code) {
    return currencies.find((currency) => currency.code === code);
  }

  // Retrieves the available currencies when the component first loads.
  useEffect(() => {
    const getCurrencies = async () => {
      try {
        // Request currency information from the Frankfurter API.
        const response = await fetch(
          'https://api.frankfurter.dev/v2/currencies'
        );

        // Stop if the API request was unsuccessful.
        if (!response.ok) {
          throw new Error('Failed to fetch currencies');
        }

        const data = await response.json();

        // Convert the API response into the format used by the application.
        setCurrencies(
          data.map((currency) => ({
            code: currency.iso_code,
            name: currency.name,
            symbol: currency.symbol
          }))
        );
      } catch {
        // Display an error if the currency list cannot be retrieved.
        setError('Unable to retrieve currencies.');
      }
    };

    getCurrencies();
  }, []);

  // Retrieves a new exchange rate whenever either selected currency changes.
  useEffect(() => {
    const getExchangeRate = async () => {
      // Show the loading message while retrieving the new rate.
      setLoading(true);
      setError('');

      // If both currencies are the same, no API request is needed.
      if (fromCurrency === toCurrency) {
        setExchangeRate(1);
        setLoading(false);
        return;
      }

      try {
        // Request the exchange rate for the selected currency pair.
        const response = await fetch(
          `https://api.frankfurter.dev/v2/rate/${fromCurrency}/${toCurrency}`
        );

        // Stop if the API request was unsuccessful.
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rate');
        }

        const data = await response.json();

        // Store the exchange rate returned by the API.
        setExchangeRate(data.rate);
      } catch {
        // Clear the rate and display an error if the request fails.
        setError('Unable to retrieve exchange rate.');
        setExchangeRate(null);
      } finally {
        // Hide the loading message after the request finishes.
        setLoading(false);
      }
    };

    getExchangeRate();
  }, [fromCurrency, toCurrency]);

  // Retrieve information about the currently selected currencies.
  // The empty object prevents errors before the API data has loaded.
  const toCurrencyData = getCurrency(toCurrency) || {};
  const fromCurrencyData = getCurrency(fromCurrency) || {};

  // Calculate the converted amount whenever the amount or exchange rate changes.
  const convertedAmount = useMemo(() => {
    const numericAmount = Number(amount);

    // Return 0 if the input is empty, invalid, negative, or the rate is unavailable.
    if (
      !amount ||
      Number.isNaN(numericAmount) ||
      numericAmount < 0 ||
      exchangeRate === null
    ) {
      return 0;
    }

    // Apply the exchange rate to the entered amount.
    return numericAmount * exchangeRate;
  }, [amount, exchangeRate]);

  return (
    // Apply the dark-mode class when dark mode is enabled.
    <div className={darkMode ? 'dark' : ''}>
      <div className="converter">

        {/* Button for switching between light and dark mode. */}
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        <h1>Currency Converter</h1>

        {/* User input for the amount they want to convert. */}
        <label htmlFor="amount">Enter amount:</label>
        <input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="currency-row">

          {/* Dropdown for selecting the currency being converted from. */}
          <div>
            <label htmlFor="fromCurrency">From currency:</label>
            <select
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swaps the selected from and to currencies. */}
          <button
            type="button"
            aria-label="Swap currencies"
            title="Swap currencies"
            onClick={() => {
              setFromCurrency(toCurrency);
              setToCurrency(fromCurrency);
            }}
          >
            ⇄
          </button>

          {/* Dropdown for selecting the currency being converted to. */}
          <div>
            <label htmlFor="toCurrency">To currency:</label>
            <select
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Display a loading message while retrieving the exchange rate. */}
        {loading && (
          <p className="status-message">
            Loading exchange rate...
          </p>
        )}

        {/* Display an error message if an API request fails. */}
        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* Prompt the user to enter an amount when no amount has been entered. */}
        {!loading && !error && !amount && (
          <p className="conversion-result">
            Enter an amount to convert.
          </p>
        )}

        {/* Display the converted amount once the required API data is available. */}
        {!loading && !error && currencies.length > 0 && amount && (
          <p className="converted-result">
            {fromCurrencyData.symbol || ''}{amount} {fromCurrency} = {toCurrencyData.symbol || ''}
            {convertedAmount.toFixed(2)} {toCurrency}
          </p>
        )}

        {/* Display the exchange rate for the selected currency pair. */}
        {!loading && !error && currencies.length > 0 && exchangeRate !== null && (
          <p className="exchange-rate">
            Conversion rate: 1 {fromCurrency} ({fromCurrencyData.symbol || ''}) = {exchangeRate.toFixed(4)} {toCurrency} ({toCurrencyData.symbol || ''})
          </p>
        )}
      </div>
    </div>
  );
}

export default CurrencyConverter;