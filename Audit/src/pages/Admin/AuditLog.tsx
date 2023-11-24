import { useState, useEffect } from 'react';
import axios from 'axios';
import BaseTable from '../../components/EditTable/BaseTable';
import PreviewIcon from '@mui/icons-material/Preview';
import PageContainer from '../../components/PageContainer/PageContainer';
import { enqueueSnackbar } from 'notistack';

type APILog = {
  datetime?: string;
  method: string;
  endpoint: string;
  status_code: number;
  user_ip: string;
  user_agent: string;
  user_role: string;
  username: string;
}

/**
 * @todo make the date, time and datetime more specific types (if possible)
 */
type ModifiedAPILog = APILog & {
  [key: string]: string|number|null
  date: string,
  time: string
}

/**
 * 
 * @todo set isLoading to false when there is an error
 */
function getAPIData() {
    return axios.get(`${process.env.REACT_APP_API_URL}/get-all-logs`, {
      headers: { 'Authorization': "Bearer " + sessionStorage.getItem('TOKEN') } 
    })
    .then((response) => {      
      console.log("Response: ", response.data.allData)
      return response.data.allData;
    })
    .catch((error) => {
      enqueueSnackbar("System Error", { variant: 'error' });
    });
}

const auditColumnNameMap = {
  date: "Date",
  time:"Time",
  method: "Method",
  endpoint: "URL",
  status_code: "Status",
  user_ip: "User IP",
  user_agent: "User Agent",
  username: "Username",
  user_role: "User Role"
};

export default function AuditLog() {
    const [auditLogData, setAuditLogData] = useState<ModifiedAPILog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAuditLogData = async () => {
            const data = await getAPIData();
            console.log(data);
            const processedData = data.map((item:APILog) => {
              let processingLog:ModifiedAPILog = {
                ...item,
                date: '',
                time: ''
              };
              if (item.datetime !== undefined) {
                const date = new Date(item.datetime);
                processingLog.date = date.toLocaleDateString('en-GB');
                processingLog.time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              }
              delete processingLog.datetime;

              for (let key in processingLog) {
                if (processingLog[key] === null) {
                  processingLog[key] = "NULL";
                }
              }
              return processingLog;
            });
            setAuditLogData(processedData);
            setIsLoading(false);
        };
        fetchAuditLogData();
    }, []);

    console.log(auditLogData);

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