import React, { useState } from 'react';

const App = () => {
  const [collectionIds, setCollectionIds] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const ids = collectionIds.split('\n').map(id => id.trim());

    const token = `eyJhbGciOiJFZERTQSIsImtpZCI6Ijc1MTQxYjcyLTFhZmUtMzRjYS0yZDYzLTI5NmE5NDYzZWI2ZSJ9.eyJhdWQiOiJlc3Bhcmtjb25zdWx0YW50cyIsImV4cCI6MTczMjQwNDUzOSwiaWF0IjoxNzAwODQ3NTg3LCJpc3MiOiJodHRwczovL29wcy5jb3Jlc2lnbmFsLmNvbTo4MzAwL3YxL2lkZW50aXR5L29pZGMiLCJuYW1lc3BhY2UiOiJyb290IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZXNwYXJrY29uc3VsdGFudHMiLCJzdWIiOiJmYTBjNGM5Yy1jMjFjLWZmZGYtYzBiOS00OGFlZDVhZjljMTYiLCJ1c2VyaW5mbyI6eyJzY29wZXMiOiJjZGFwaSJ9fQ.GhoFPK64GLU54fLg5C7pBWCQUkKmNLS4Y5qoTWq3A7ssbDz_S6l_DRSk6QIDH4Dojrw-e5B-FSOSxMSS9Ez2AA`; // Replace with your JWT token generation logic

    const fetchData = async (id) => {
      try {
        const response = await fetch(`https://api.coresignal.com/cdapi/v1/linkedin/company/collect/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setResults(prevResults => [...prevResults, data]);
      } catch (error) {
        console.error(`Error fetching data for id ${id}:`, error);
      }
    };

    for (const id of ids) {
      await fetchData(id);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Collection IDs (one per line):
          <textarea
            value={collectionIds}
            onChange={(e) => setCollectionIds(e.target.value)}
            rows={6}
            cols={30}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Title</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.id}</td>
              <td>{result.name}</td>
              <td>{result.first_name}</td>
              <td>{result.last_name}</td>
              <td>{result.title}</td>
              <td><a href={result.url} target="_blank" rel="noopener noreferrer">LinkedIn Profile</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
