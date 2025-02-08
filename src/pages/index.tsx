import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Users from '~/components/Users';
import CompanyInfo from '~/components/CompanyInfo';
import { useState } from 'react';

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
  const [isEligible, setIsEligible] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Users" />
          <Tab label="Company Info" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Users onEligibleChange={setIsEligible} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {isEligible && <CompanyInfo />}
      </CustomTabPanel>
    </Box>
  );
}
