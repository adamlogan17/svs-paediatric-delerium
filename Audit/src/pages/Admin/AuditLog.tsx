import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface AuditLogData {
    date: string;
    time: string;
    method: string;
    url: string;
    status: number;
    userip: string; // Updated to match the response property name
    useragent: string; // Updated to match the response property name
    username: string;
    userrole: string; // Updated to match the response property name
}

function getAPIData() {
    return axios.get(`${process.env.REACT_APP_API_URL}/audit/getall/api_log`, {
        headers: { 'Authorization': "bearer " + sessionStorage.getItem('TOKEN') } 
    })
    .then((response) => {
        return response.data.allData; // Access 'allData' array from the response
    })
    .catch((error) => {
        return [];
    });
}

function AuditLog() {
    const [auditLogData, setAuditLogData] = useState<AuditLogData[]>([]);

    useEffect(() => {
        const fetchAuditLogData = async () => {
            const data = await getAPIData();
            console.log(JSON.stringify(data)); // Add this line to log the data as a string
            setAuditLogData(data);
        };
        fetchAuditLogData();
    }, []);

    return (
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
                    {auditLogData.map((row, index) => (
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
    );
}

export default AuditLog;
