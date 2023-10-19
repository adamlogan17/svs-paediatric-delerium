import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box } from '@mui/material';
import { CSVLink } from 'react-csv';
import GetAppIcon from '@mui/icons-material/GetApp';

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

function AuditLog() {
    const [auditLogData, setAuditLogData] = useState<AuditLogData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAuditLogData = async () => {
            const data = await getAPIData();
            setAuditLogData(data);
        };
        fetchAuditLogData();
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = auditLogData.filter((row) => {
        const searchFields = [row.date, row.time, row.method, row.url, row.userip, row.useragent, row.username, row.userrole];
        return searchFields.some((field) => field && field.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    const csvData = filteredData.map((row) => {
        return {
            Date: row.date,
            Time: row.time,
            Method: row.method,
            URL: row.url,
            Status: row.status,
            "User IP": row.userip,
            "User Agent": row.useragent,
            Username: row.username,
            "User Role": row.userrole
        };
    });

    return (
        <div>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <TextField label="Search" variant="outlined" value={searchTerm} onChange={handleSearchChange} />
                <CSVLink data={csvData} filename={"audit_log.csv"}>
                    <Button variant="contained" color="primary" startIcon={<GetAppIcon />}>Download CSV</Button>
                </CSVLink>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Method</TableCell>
                            <TableCell>URL</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>User IP</TableCell>
                            <TableCell>User Agent</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>User Role</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.time}</TableCell>
                                <TableCell>{row.method}</TableCell>
                                <TableCell>{row.url}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>{row.userip}</TableCell>
                                <TableCell>{row.useragent}</TableCell>
                                <TableCell>{row.username}</TableCell>
                                <TableCell>{row.userrole}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default AuditLog;