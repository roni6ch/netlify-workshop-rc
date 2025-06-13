import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Users from '~/components/Users';
import CompanyInfo from '~/components/CompanyInfo';
import { useState } from 'react';
import OnboardingGuide from '~/components/OnboardingGuide';
import { Button, Chip, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ENV } from '~/assets/onboardingGuide.util';
import UiComponents from '~/components/UiComponents';
import { TabStateContext } from '../context/TabStateContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState({ email: '' });
  const [token, setToken] = useState('');
  const [onboardingGuide, setOnboardingGuide] = useState({});
  const [isEligible, setIsEligible] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  const copyToKeyboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };


  const openPrimeUserWindow = async () => {
    try {
      await copyToKeyboard(token);
      window.open(`${ENV}/app/user2`, '_blank');
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      window.open(`${ENV}/app/user2`, '_blank');
    }
  };

  return (
    <TabStateContext.Provider value={{ 
      user, 
      token, 
      setUser, 
      setToken,
      onboardingGuide,
      setOnboardingGuide
    }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Users" />
            <Tab label="Company Info" />
            <Tab label="Onboarding Guide" />
            <Tab label="UI Components" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Users onEligibleChange={setIsEligible} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {isEligible && <CompanyInfo />}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          {isEligible && <OnboardingGuide />}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <UiComponents />
        </CustomTabPanel>
      </Box>

      <hr />
      {user?.email &&
        <Box display="flex" alignItems="center" gap={2}>
          Email <Stack direction="row" spacing={1}>
            <Chip label={user?.email} />
          </Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={() => copyToKeyboard(user?.email)}
            endIcon={<ContentCopyIcon />}
          >
            Copy
          </Button>
        </Box>
      }
      <br />
      {token && <Box display="flex" alignItems="center" gap={2}>
        Token
        <Stack direction="row" spacing={1} sx={() => ({
          borderRadius: 1,
          width: '45%',
        })}>
          <Chip label={token} />
        </Stack>
        <Button
          variant="contained"
          color="primary"
          onClick={() => copyToKeyboard(token)}
          endIcon={<ContentCopyIcon />}
        >
          Copy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => openPrimeUserWindow()}
          endIcon={<SendIcon />}
        >
          Copy + prime!
        </Button>
      </Box>}
    </TabStateContext.Provider>

  );
}
