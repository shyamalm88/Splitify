export const countries = [
  { code: "US", name: "United States", flag: "🇺🇸", phoneCode: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", phoneCode: "+44" },
  { code: "CA", name: "Canada", flag: "🇨🇦", phoneCode: "+1" },
  { code: "AU", name: "Australia", flag: "🇦🇺", phoneCode: "+61" },
  { code: "IN", name: "India", flag: "🇮🇳", phoneCode: "+91" },
  { code: "CN", name: "China", flag: "🇨🇳", phoneCode: "+86" },
  { code: "JP", name: "Japan", flag: "🇯🇵", phoneCode: "+81" },
  { code: "DE", name: "Germany", flag: "🇩🇪", phoneCode: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", phoneCode: "+33" },
  { code: "IT", name: "Italy", flag: "🇮🇹", phoneCode: "+39" },
  { code: "ES", name: "Spain", flag: "🇪🇸", phoneCode: "+34" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", phoneCode: "+55" },
  { code: "RU", name: "Russia", flag: "🇷🇺", phoneCode: "+7" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", phoneCode: "+82" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", phoneCode: "+65" },
];

// Function to get country by phone code
export const getCountryByPhoneCode = (phoneCode) => {
  return (
    countries.find((country) => country.phoneCode === phoneCode) || countries[0]
  );
};

// Function to get country by country code
export const getCountryByCode = (code) => {
  return countries.find((country) => country.code === code) || countries[0];
};
