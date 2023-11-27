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

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData({ ...formData, [field]: Array.isArray(value) ? value : [value] });
  };

  const handleToggle = (field) => () => {
    setFormData({ ...formData, [field]: !formData[field] });
  };

  const jwtToken = "YOUR_JWT_TOKEN_HERE";

  const fetchCompanyData = (collectionId) => {
    const companyUrl = `https://api.coresignal.com/cdapi/v1/linkedin/company/collect/${collectionId}`;

    fetch(companyUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((companyData) => {
        console.info(`Company data for collection ID ${collectionId}:`, companyData);
      })
      .catch((error) => console.error(error));
  };

  const handleSubmit = () => {
    const url = 'https://api.coresignal.com/cdapi/v1/linkedin/job/search/filter';
    const customHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
    };

    const apiData = {
      created_at_gte: formData.created_at_gte,
      experience_title: formData.title.map(title => `(${title})`).join(' OR '),
      experience_deleted: formData.deleted,
      active_experience: formData.application_active,
      country: formData.country.map(country => `(${country})`).join(' OR '),
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

        if (Array.isArray(data)) {
          data.forEach((collectionId) => {
            fetchCompanyData(collectionId);
          });
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <Box>
      <form>
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
            <Switch checked={formData.application_active} onChange={handleToggle('application_active')} />
          </FormControl>

          <FormControl>
            <InputLabel>Deleted</InputLabel>
            <Switch checked={formData.deleted} onChange={handleToggle('deleted')} />
          </FormControl>
        </FormGroup>

        <FormControl fullWidth>
          <InputLabel>Country</InputLabel>
          <Select value={formData.country} onChange={handleChange('country')} multiple>
            {COUNTRIES.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Title</InputLabel>
          <Select multiple value={formData.title} onChange={handleChange('title')}>
            {TITLES.map((title) => (
              <MenuItem key={title} value={title}>
                {title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Search
        </Button>
      </form>

      {collections && (
        <Box>
          <h2>API Response:</h2>
          <pre>{JSON.stringify(collections, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
};

export default App;
