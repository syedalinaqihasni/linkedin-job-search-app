import React, {useState} from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import DatePicker from '@mui/lab/DatePicker';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { Box, Button, Typography } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/lab';

const CompanyForm = () => {
  const [jwtToken, setJwtToken] = React.useState('eyJhbGciOiJFZERTQSIsImtpZCI6Ijc1MTQxYjcyLTFhZmUtMzRjYS0yZDYzLTI5NmE5NDYzZWI2ZSJ9.eyJhdWQiOiJlc3Bhcmtjb25zdWx0YW50cyIsImV4cCI6MTczMjQwNDUzOSwiaWF0IjoxNzAwODQ3NTg3LCJpc3MiOiJodHRwczovL29wcy5jb3Jlc2lnbmFsLmNvbTo4MzAwL3YxL2lkZW50aXR5L29pZGMiLCJuYW1lc3BhY2UiOiJyb290IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZXNwYXJrY29uc3VsdGFudHMiLCJzdWIiOiJmYTBjNGM5Yy1jMjFjLWZmZGYtYzBiOS00OGFlZDVhZjljMTYiLCJ1c2VyaW5mbyI6eyJzY29wZXMiOiJjZGFwaSJ9fQ.GhoFPK64GLU54fLg5C7pBWCQUkKmNLS4Y5qoTWq3A7ssbDz_S6l_DRSk6QIDH4Dojrw-e5B-FSOSxMSS9Ez2AA');
  const [searchResults, setSearchResults] = React.useState([]);
  const [creditsRemaining, setCreditsRemaining] = React.useState([]);
    const [collectResults, setCollectResults] = React.useState([]);
    
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [searchPayload, setSearchPayload] = React.useState({
    created_at_gte: null,
    application_active: false,
    deleted: false,
    country: '',
    title: '',
  });

 const handleSearch = async () => {
  try {
    console.log('Searching...');
    const response = await axios.post(
      'https://api.coresignal.com/cdapi/v1/linkedin/job/search/filter',
      searchPayload,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    setSearchResults(response.data.items || []);
    console.log('Search results:', response.data.items);

    // Accessing response headers
    const creditsRemaining = response.headers['x-credits-remaining'];
    setCreditsRemaining(creditsRemaining);
    console.log('credits-remaining:', creditsRemaining);
  } catch (error) {
    console.error('Error searching jobs:', error);
  }
};

    

  const handleCollect = async () => {
    try {
      console.log('Collecting data...');
      const collectPromises = searchResults.map(async (job) => {
        const response = await axios.get(
          `https://api.coresignal.com/cdapi/v1/linkedin/company/collect?id=${job.id}`,
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
      console.log('Collect results:', collectResults);
    } catch (error) {
      console.error('Error collecting job details:', error);
    }
  };

  const handleDateChange = (date) => {
    setSearchPayload((prevPayload) => ({
      ...prevPayload,
      created_at_gte: date.toISOString(),
    }));
  };

  const handleToggleChange = (event) => {
    setSearchPayload((prevPayload) => ({
      ...prevPayload,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleCountryChange = (event, value) => {
    setSelectedCountries(value);
    setSearchPayload((prevPayload) => ({
      ...prevPayload,
      country: value ? `(${value.join(') OR (')})` : '',
    }));
  };

  const handleTitleChange = (event, value) => {
    setSelectedTitles(value);
    setSearchPayload((prevPayload) => ({
      ...prevPayload,
      title: value ? `(${value.join(') OR (')})` : '',
    }));
  };
  return (
      <Box> 
          <Typography>Reamining Credit: {creditsRemaining?creditsRemaining:0}</Typography>
      <LocalizationProvider >
        <MobileDatePicker
          label="Created At (gte)"
          value={searchPayload.created_at_gte}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <FormControlLabel
        control={
          <Switch
            checked={searchPayload.application_active}
            onChange={handleToggleChange}
            name="application_active"
          />
        }
        label="Application Active"
      />

      <FormControlLabel
        control={
          <Switch
            checked={searchPayload.deleted}
            onChange={handleToggleChange}
            name="deleted"
          />
        }
        label="Deleted"
      />

      <Autocomplete
        multiple
        id="country-select"
        options={['United States', 'United Kingdom']}
        value={selectedCountries}
        onChange={handleCountryChange}
        renderInput={(params) => (
          <TextField {...params} label="Country" placeholder="Select countries" />
        )}
      />

      <Autocomplete
        multiple
        id="title-select"
        options={[
          'Software Engineer',
          'Associate Software Engineer',
          'Embedded Software Engineer',
          'Embedded Software Developer',
          'Associate Software Developer',
        ]}
        value={selectedTitles}
        onChange={handleTitleChange}
        renderInput={(params) => (
          <TextField {...params} label="Title" placeholder="Select titles" />
        )}
      />
<Button variant='outlined'  onClick={handleSearch}>Search</Button>
          <Button variant='outlined' onClick={handleCollect}>Collect</Button>
          
    <Box>
  <h2>Search Results:</h2>
  {searchResults.length > 0 ? (
    <Typography>{searchResults}</Typography>
  ) : (
    <p>No data available.</p>
  )}
</Box>

          
          <Box>
        <h2>Collect Results:</h2>
        {collectResults.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>LinkedIn Profile</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collectResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{result.id}</TableCell>
                    <TableCell>{result.name}</TableCell>
                    <TableCell>{result.title}</TableCell>
                    <TableCell>
                      <Link href={result.url} target="_blank" rel="noopener noreferrer">
                        LinkedIn Profile
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No collect results available.</p>
        )}
      </Box>
    </Box>
  );
};

export default CompanyForm;
