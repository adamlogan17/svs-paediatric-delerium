import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Avatar, Typography } from '@mui/material';
import PageLoad from '../../components/Loading/PageLoad';
import BaseTable from '../../components/EditTable/BaseTable';
import PreviewIcon from '@mui/icons-material/Preview';

interface AuditLogData {
  date: string;
  time: string;
  method: string;
  url: string;
  status: number;
  userip: string;
  useragent: string;
  username: string;
  userrole: string;
}

function getAPIData() {
    return axios.get(`${process.env.REACT_APP_API_URL}/audit/getall/api_log`, {
        headers: { 'Authorization': "bearer " + sessionStorage.getItem('TOKEN') } 
    })
    .then((response) => {
        return response.data.allData;
    })
    .catch((error) => {
        return [];
    });
}

const auditColumnNameMap = {
  date: "Date",
  time: "Time",
  method: "Method",
  url: "URL",
  status: "Status",
  userip: "User IP",
  useragent: "User Agent",
  username: "Username",
  userrole: "User Role"
};

function AuditLog() {
    const [auditLogData, setAuditLogData] = useState<AuditLogData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAuditLogData = async () => {
            const data = await getAPIData();
            const processedData = data.map((item:AuditLogData) => {
              const newItem: { [key: string]: string } = {};
              for (const [key, value] of Object.entries(item)) {
                newItem[key] = value === null ? "NULL" : String(value);
              }
              return newItem;
            });
            setAuditLogData(processedData);
            setIsLoading(false);
        };
        fetchAuditLogData();
    }, []);


    return (
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <PageLoad loading={isLoading} />

        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PreviewIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Audit Log Display
        </Typography>

        <br />

        <div style={{width:'90%', margin:'auto'}}>
          {auditLogData.length > 0 && 
          <BaseTable
            title='Audit Log'
            initialData={auditLogData}
            uniqueIdName={"time"}
            columnNameMap={auditColumnNameMap}
          />}
        </div>

      </Box>
    );
}

export default AuditLog;