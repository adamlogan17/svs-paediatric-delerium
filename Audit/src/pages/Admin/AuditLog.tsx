import { useState, useEffect } from 'react';
import axios from 'axios';
import BaseTable from '../../components/EditTable/BaseTable';
import PreviewIcon from '@mui/icons-material/Preview';
import PageContainer from '../../components/PageContainer/PageContainer';
import { enqueueSnackbar } from 'notistack';

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
      enqueueSnackbar("System Error", { variant: 'error' });
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
      <PageContainer title="Audit Log" icon={<PreviewIcon />} loading={isLoading}>
        <div style={{width:'90%', margin:'auto', marginTop:'25px'}}>
          {auditLogData.length > 0 && 
          <BaseTable
            title='Audit Log'
            initialData={auditLogData}
            uniqueIdName={"time"}
            columnNameMap={auditColumnNameMap}
          />}
        </div>
      </PageContainer>
    );
}

export default AuditLog;