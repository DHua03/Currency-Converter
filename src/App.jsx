import { useState, useMemo, useEffect } from 'react';

function CurrencyConverter() {
  const [darkMode, setDarkMode] = useState(false);
  const [amount, setAmount] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function getCurrency(code) {
  return currencies.find((currency) => currency.code === code);
}

  useEffect(() => {
    const getCurrencies = async () => {
      try {
        const response = await fetch(
          'https://api.frankfurter.dev/v2/currencies'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch currencies');
        }

        const data = await response.json();

        setCurrencies(
          data.map((currency) => ({
            code: currency.iso_code,
            name: currency.name,
            symbol: currency.symbol
          }))
        );
      } catch {
        setError('Unable to retrieve currencies.');
      }
    };

    getCurrencies();
  }, []);

  useEffect(() => {
    const getExchangeRate = async () => {
      setLoading(true);
      setError('');


      if (fromCurrency === toCurrency) {
        setExchangeRate(1);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.frankfurter.dev/v2/rate/${fromCurrency}/${toCurrency}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch exchange rate');
        }

        const data = await response.json();

        setExchangeRate(data.rate);
      } catch {
        setError('Unable to retrieve exchange rate.');
        setExchangeRate(null);
      } finally {
        setLoading(false);
      }
    };
    getExchangeRate();
  }, [fromCurrency, toCurrency]);

  const toCurrencyData = getCurrency(toCurrency) || {};
  const fromCurrencyData = getCurrency(fromCurrency) || {};
  console.log('Selected currency:', toCurrencyData);

  const convertedAmount = useMemo(() => {
    const numericAmount = Number(amount);

    if (!amount || Number.isNaN(numericAmount) || numericAmount < 0 || exchangeRate === null) {
      return 0;
    }

    return numericAmount * exchangeRate;
  }, [amount, exchangeRate]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="converter">
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        <h1>Currency Converter</h1>

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

        {loading && <p className="status-message">Loading exchange rate...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && !amount && (
          <p className="conversion-result">
            Enter an amount to convert.
          </p>
        )}

        {!loading && !error && currencies.length > 0 && amount && (
          <p className="converted-result">
            {fromCurrencyData.symbol || ''}{amount} {fromCurrency} = {toCurrencyData.symbol || ''}
            {convertedAmount.toFixed(2)} {toCurrency}
          </p>
        )}
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