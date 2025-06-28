import { useState } from 'react';
import './index.css';

const banks = [
  { name: 'Meezan Bank', code: 'MEZN', logo: '/src/assets/logos/meezan.png' },
  { name: 'Habib Bank Limited (HBL)', code: 'HABB', logo: '/src/assets/logos/hbl.png' },
  { name: 'Standard Chartered Bank', code: 'SCBL', logo: '/src/assets/logos/scb.png' },
  { name: 'United Bank Limited (UBL)', code: 'UBLB', logo: '/src/assets/logos/ubl.png' },
  { name: 'National Bank of Pakistan (NBP)', code: 'NBPK', logo: '/src/assets/logos/nbp.png' },
  { name: 'Allied Bank Limited (ABL)', code: 'ABPL', logo: '/src/assets/logos/abl.png' },
  { name: 'Bank Alfalah', code: 'ALFH', logo: '/src/assets/logos/alfalah.png' },
  { name: 'MCB Bank Limited', code: 'MUCB', logo: '/src/assets/logos/mcb.png' },
  { name: 'Faysal Bank', code: 'FAYS', logo: '/src/assets/logos/faysal.png' },
  { name: 'Askari Bank', code: 'ASCM', logo: '/src/assets/logos/askari.png' },
  { name: 'Bank Al Habib', code: 'BAHL', logo: '/src/assets/logos/bahl.png' },
  { name: 'Soneri Bank', code: 'SONE', logo: '/src/assets/logos/soneri.png' },
  { name: 'Silkbank', code: 'SAUD', logo: '/src/assets/logos/silkbank.png' },
  { name: 'Summit Bank', code: 'SUMB', logo: '/src/assets/logos/summit.png' },
  { name: 'JS Bank', code: 'JSBL', logo: '/src/assets/logos/js.png' },
].sort((a, b) => a.name.localeCompare(b.name));

function App() {
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const validateAccountNumber = (value) => {
    if (!value) return 'Account number is required.';
    if (!/^\d*$/.test(value)) return 'Account number must contain only digits.';
    if (value.length > 16) return 'Account number cannot exceed 16 digits.';
    return '';
  };

  const handleAccountNumberChange = (e) => {
    const value = e.target.value;
    setAccountNumber(value);
    setError(validateAccountNumber(value));
    setResult('');
    setCopied(false);
  };

  const generateIBAN = () => {
    setIsLoading(true);
    setError('');
    setResult('');
    setCopied(false);

    const accountError = validateAccountNumber(accountNumber);
    if (accountError) {
      setError(accountError);
      setIsLoading(false);
      return;
    }
    if (!bankCode) {
      setError('Please select a bank.');
      setIsLoading(false);
      return;
    }

    const paddedAccount = accountNumber.padStart(16, '0');
    const countryCode = 'PK';
    const bban = bankCode + paddedAccount;

    const checkDigits = calculateCheckDigits(bban, countryCode);
    const iban = countryCode + checkDigits + bban;

    const formattedIBAN = iban.match(/.{1,4}/g).join(' ');
    setResult(formattedIBAN);
    setIsLoading(false);
  };

  const calculateCheckDigits = (bban, countryCode) => {
    const checkString = bban + countryCode + '00';
    const letterMap = {
      A: '10', B: '11', C: '12', D: '13', E: '14', F: '15', G: '16', H: '17', I: '18', J: '19',
      K: '20', L: '21', M: '22', N: '23', O: '24', P: '25', Q: '26', R: '27', S: '28', T: '29',
      U: '30', V: '31', W: '32', X: '33', Y: '34', Z: '35'
    };
    let numericString = '';
    for (let char of checkString) {
      numericString += letterMap[char] || char;
    }

    let remainder = 0;
    for (let i = 0; i < numericString.length; i++) {
      remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
    }

    let checkDigits = (98 - remainder) % 97;
    if (checkDigits === 0) checkDigits = 97;
    return checkDigits.toString().padStart(2, '0');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.replace(/\s/g, '')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const clearForm = () => {
    setAccountNumber('');
    setBankCode('');
    setResult('');
    setError('');
    setCopied(false);
    setIsLoading(false);
  };

  const selectedBank = banks.find(bank => bank.code === bankCode);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center min-h-screen text-white">
      <div className="glass p-8 rounded-xl shadow-2xl w-11/12 max-w-md sm:max-w-lg md:max-w-xl animate-scale">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-4">Pakistan IBAN Generator</h1>
        {bankCode && selectedBank && (
          <div className="flex justify-center mb-4 animate-fade-in">
            <img
              src={selectedBank.logo}
              alt={`${selectedBank.name} logo`}
              className="w-16 h-16 rounded-full border-2 border-teal-500"
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-300 mb-1">
            Bank Account Number
          </label>
          <input
            type="text"
            id="accountNumber"
            value={accountNumber}
            onChange={handleAccountNumberChange}
            placeholder="Enter account number (up to 16 digits)"
            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400 transition"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="bankSelect" className="block text-sm font-medium text-gray-300 mb-1">
            Select Bank
          </label>
          <select
            id="bankSelect"
            value={bankCode}
            onChange={(e) => {
              setBankCode(e.target.value);
              setResult('');
              setCopied(false);
            }}
            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white transition"
          >
            <option value="" disabled className="bg-gray-800">Select your bank</option>
            {banks.map((bank) => (
              <option key={bank.code} value={bank.code} className="bg-gray-800">
                {bank.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={generateIBAN}
          disabled={isLoading}
          className="w-full p-3 rounded-lg text-white font-medium bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
        >
          {isLoading ? 'Generating...' : 'Generate IBAN'}
        </button>
        <button
          onClick={clearForm}
          disabled={isLoading}
          className="w-full p-3 mt-2 rounded-lg text-white font-medium bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
        >
          Clear Form
        </button>
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 text-red-500 rounded-lg text-center animate-slide-in">
            {error}
          </div>
        )}
        {result && (
          <div className="mt-4 p-3 bg-teal-500/20 text-teal-500 rounded-lg text-center animate-slide-in">
            <div className="flex items-center justify-center gap-2">
              <p>Your IBAN: <strong>{result}</strong></p>
              <button
                onClick={copyToClipboard}
                className="p-1 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
                title="Copy to Clipboard"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
        <footer className="mt-6 p-4 bg-gray-800/30 rounded-lg text-gray-300 text-sm text-center animate-fade-in">
          This application is an independent IBAN generator tool designed for user convenience and is not affiliated with any bank. Please verify the generated IBAN before sharing. Bank logos are used for identification purposes only and do not imply endorsement or affiliation.
        </footer>
      </div>
    </div>
  );
}

export default App;