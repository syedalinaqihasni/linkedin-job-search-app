import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jwtToken, setJwtToken] = useState('eyJhbGciOiJFZERTQSIsImtpZCI6Ijc1MTQxYjcyLTFhZmUtMzRjYS0yZDYzLTI5NmE5NDYzZWI2ZSJ9.eyJhdWQiOiJlc3Bhcmtjb25zdWx0YW50cyIsImV4cCI6MTczMjQwNDUzOSwiaWF0IjoxNzAwODQ3NTg3LCJpc3MiOiJodHRwczovL29wcy5jb3Jlc2lnbmFsLmNvbTo4MzAwL3YxL2lkZW50aXR5L29pZGMiLCJuYW1lc3BhY2UiOiJyb290IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZXNwYXJrY29uc3VsdGFudHMiLCJzdWIiOiJmYTBjNGM5Yy1jMjFjLWZmZGYtYzBiOS00OGFlZDVhZjljMTYiLCJ1c2VyaW5mbyI6eyJzY29wZXMiOiJjZGFwaSJ9fQ.GhoFPK64GLU54fLg5C7pBWCQUkKmNLS4Y5qoTWq3A7ssbDz_S6l_DRSk6QIDH4Dojrw-e5B-FSOSxMSS9Ez2AA');
  const [searchResults, setSearchResults] = useState([]);
  const [collectResults, setCollectResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.coresignal.com/cdapi/v1/linkedin/job/search/filter`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setSearchResults(response.data.items || []);
    } catch (error) {
      console.error('Error searching companies:', error);
    }
  };

  const handleCollect = async () => {
    try {
      const collectPromises = searchResults.map(async (company) => {
        const response = await axios.get(
          `https://api.coresignal.com/cdapi/v1/linkedin/company/collect?id=${company.id}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        return response.data;
      });

      const collectResults = await Promise.all(collectPromises);
      setCollectResults(collectResults);
    } catch (error) {
      console.error('Error collecting company details:', error);
    }
  };

  return (
    <div>
      <label>
        Search Query:
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </label>
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleCollect}>Collect</button>

      <div>
        <h2>Search Results:</h2>
        <ul>
          {searchResults.map((company) => (
            <li key={company.id}>{company.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Collect Results:</h2>
        <ul>
          {collectResults.map((result, index) => (
            <li key={index}>{JSON.stringify(result)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
