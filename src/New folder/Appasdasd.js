import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';

const COUNTRIES = ['United States', 'United Kingdom'];
const TITLES = [
  'Software Engineer',
  'Associate Software Engineer',
  'Embedded Software Engineer',
  'Embedded Software Developer',
  'Associate Software Developer',
];

const App = () => {
  const [formData, setFormData] = useState({
    created_at_gte: '',
    application_active: false,
    deleted: false,
    country: [],
    title: [],
  });

  const [collections, setCollections] = useState(null);

  const [collectionIds, setCollectionIds] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData({ ...formData, [field]: Array.isArray(value) ? value : [value] });
  };

  const handleToggle = (field) => () => {
    setFormData({ ...formData, [field]: !formData[field] });
    };
    

    const jwtToken = 'eyJhbGciOiJFZERTQSIsImtpZCI6Ijc1MTQxYjcyLTFhZmUtMzRjYS0yZDYzLTI5NmE5NDYzZWI2ZSJ9.eyJhdWQiOiJlc3Bhcmtjb25zdWx0YW50cyIsImV4cCI6MTczMjQwNDUzOSwiaWF0IjoxNzAwODQ3NTg3LCJpc3MiOiJodHRwczovL29wcy5jb3Jlc2lnbmFsLmNvbTo4MzAwL3YxL2lkZW50aXR5L29pZGMiLCJuYW1lc3BhY2UiOiJyb290IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZXNwYXJrY29uc3VsdGFudHMiLCJzdWIiOiJmYTBjNGM5Yy1jMjFjLWZmZGYtYzBiOS00OGFlZDVhZjljMTYiLCJ1c2VyaW5mbyI6eyJzY29wZXMiOiJjZGFwaSJ9fQ.GhoFPK64GLU54fLg5C7pBWCQUkKmNLS4Y5qoTWq3A7ssbDz_S6l_DRSk6QIDH4Dojrw-e5B-FSOSxMSS9Ez2AA';

const handleSubmitFilters = () => {
  const url = 'https://api.coresignal.com/cdapi/v1/linkedin/job/search/filter';
  const customHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwtToken}`,
  };

  const apiData = {
    created_at_gte: formData.created_at_gte,
    experience_title: formData.title.map((title) => `(${title})`).join(' OR '),
    experience_deleted: formData.deleted,
    active_experience: formData.application_active,
    country: formData.country.map((country) => `(${country})`).join(' OR '),
  };

  fetch(url, {
    method: 'POST',
    headers: customHeaders,
    body: JSON.stringify(apiData),
  })
    .then((response) => response.json())
    .then((data) => {
      setCollections(data);
      console.info(data);
    })
    .catch((error) => console.error(error));
};

// ... (remaining code)


const handleSubmitCollectionIds = async (e) => {
    e.preventDefault();

    const ids = collectionIds.split('\n').map((id) => id.trim());

    const token = 'YOUR_JWT_TOKEN'; // Replace with your JWT token generation logic

    const fetchData = async (id) => {
      try {
        const response = await fetch(
          `https://api.coresignal.com/cdapi/v1/linkedin/company/collect/${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setResults((prevResults) => [...prevResults, data]);
      } catch (error) {
        console.error(`Error fetching data for id ${id}:`, error);
      }
    };

    // Loop through each ID and fetch data
    for (const id of ids) {
      await fetchData(id);
    }
  };
return (
    <Box>
      <form>
        {/* Filters Section */}
        <TextField
          label="Created At (Date & Time)"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          value={formData.created_at_gte}
          onChange={handleChange('created_at_gte')}
        />

        <FormGroup>
          <FormControl>
            <InputLabel>Application Active</InputLabel>
            <Switch
              checked={formData.application_active}
              onChange={handleToggle('application_active')}
            />
          </FormControl>

          <FormControl>
            <InputLabel>Deleted</InputLabel>
            <Switch checked={formData.deleted} onChange={handleToggle('deleted')} />
          </FormControl>
        </FormGroup>

        <FormControl fullWidth>
          <InputLabel>Country</InputLabel>
          <Select
            value={formData.country}
            onChange={handleChange('country')}
            multiple
          >
            {COUNTRIES.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Title</InputLabel>
          <Select
            multiple
            value={formData.title}
            onChange={handleChange('title')}
          >
            {TITLES.map((title) => (
              <MenuItem key={title} value={title}>
                {title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitFilters}
        >
          Search
        </Button>
        </form>
        
        {/* <form>
             Collection IDs Section
        <TextField
          label="Enter Collection IDs (one per line)"
          multiline
          rows={6}
          variant="outlined"
          value={collectionIds}
          onChange={(e) => setCollectionIds(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitCollectionIds}
        >
          Submit
        </Button>
</form> */}


      <h1>Display API Response</h1>
      {collections && (
        <Box>
          <h2>API Response (Filters):</h2>
          <pre>{JSON.stringify(collections, null, 2)}</pre>
        </Box>
      )}

      {/* Display Results from Collection IDs */}
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
              <td>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn Profile
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default App;