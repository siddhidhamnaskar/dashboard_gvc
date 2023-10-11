// import React from 'react';

import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
import $ from 'jquery';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// import {moment} from "moment"
// components
import Iconify from '../components/iconify';

// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';


// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [data,setData]=useState({data:[],dataAll:[]});
  const [machine,setMachines]=useState()
  const [online,setOnline]=useState();
  const [ofline,setOfline]=useState();
  const [cash,setCash]=useState();
  const theme = useTheme();
 

  const navigate=useNavigate();
  const filterOnline = q => moment().diff(moment.utc((q.lastHeartbeatTime || q.lastOnTime).replace('Z', '')), 'minute') < 5;
  const filterStock = q => moment().diff(moment.utc((q.lastHeartbeatTime || q.lastOnTime).replace('Z', '')), 'minute') < 5;

  const amountText = amt => {
    amt = amt || 0;
    // console.log(amt);
    const cr = (amt / 100000) / 100;
    const l = (amt / 1000) / 100;
    const k = (amt / 10) / 100;
    const result = cr < 1 ?
    (l < 1 ? `${k}K` : `${l}L`) :
    `${cr}Cr`;
      
    // console.log(result);
      return result;
    
   
};
const sum = (a, b) => a + b;
   const LoadData=()=>{
    const apiUrl = 'http://165.232.177.23:8080/api/machine/data?status=Online,Offine & city=Mumbai'; // Replace with your API URL
    const url = `${apiUrl}/me`;

    // Set up the headers
    $.ajaxSetup({
      headers: {
        'x-token':sessionStorage.getItem('token'),
      },
    });

    // Make the AJAX request
    $.ajax({
      url,
      type: 'GET',
      success: (json) => {
       
        setData(json.data);
            setMachines(json.data.dataAll.length)
            setOnline(json.data.data.filter(filterOnline).length);
            setOfline(json.data.data.length-json.data.data.filter(filterOnline).length);
            setCash(json.data.dataAll.length ?amountText(json.data.dataAll.map(q => (q.cashCurrent + q.cashLife)).reduce(sum)):0);
          
        
      },
      error: (_) => {
        // Handle an error here (e.g., redirect to the login page)
        window.location = '/login';
      },
    });

   }
  
    useEffect(() => {
      // Construct the URL
      LoadData();
      setInterval(()=>{
        LoadData();
      },2000)
   
 
    
    }, []); // Empty dependency array ensures this effect runs only once on component mount


    const PostData=()=>{

      const apiUrl = 'http://165.232.177.23:8080/api/machine/data?status=Online,Offine & city=Mumbai'; // Replace with your API URL
      const url = `${apiUrl}/me`;
  
      // Set up the headers
      $.ajaxSetup({
        headers: {
          'x-token':sessionStorage.getItem('token'),
        },
      });
  
      // Make the AJAX request
      $.ajax({
        url,
        type: 'GET',
        success: (json) => {
         
          setData(json.data);
              setMachines(json.data.dataAll.length)
              setOnline(json.data.data.filter(filterOnline).length);
              setOfline(json.data.data.length-json.data.data.filter(filterOnline).length);
              setCash(json.data.dataAll.length ?amountText(json.data.dataAll.map(q => (q.cashCurrent + q.cashLife)).reduce(sum)):0);
              const Data={
                running:json.data.data.filter(filterOnline).length,
                cash:json.data.dataAll.length ?(json.data.dataAll.map(q => (q.cashCurrent + q.cashLife)).reduce(sum)):0,
                 vended:json.data.dataAll.length ?(json.data.dataAll.map(q => (q.qtyCurrent +  q.qtyLife)).reduce(sum)):0
               
        
              }
              console.log(Data);
              fetch('http://localhost:8080/api',{
      
              method:"POST",
              headers:{
                'Content-type':'application/json'
              },
              body:JSON.stringify(Data)
      
            })
            
          
        },
        error: (_) => {
          // Handle an error here (e.g., redirect to the login page)
          window.location = '/login';
        },
      });

      

   

    }
  

    useEffect(()=>{
      // PostData();

  //  setTimeout(()=>{
  //   PostData()
  //  },1000)

  setInterval(()=>{
    PostData();
  },60000)
   
},[])
  

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        {/* <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography> */}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Machines Installed" total={machine} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
          
            <AppWidgetSummary type={String} title="Machines Running" total={online} color="info" icon={'icon-park-outline:gate-machine'} />
          </Grid>
        
          <Grid item xs={12} sm={6} md={3}>
           <AppWidgetSummary title="Total Collection" total={data.dataAll.length ?amountText(data.dataAll.map(q => (q.cashCurrent + q.cashLife)).reduce(sum)).toString():0} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Items Dispends" total={data.dataAll.length ?amountText(data.dataAll.map(q => (q.qtyCurrent +  q.qtyLife)).reduce(sum)).toString():0} color="error" icon={'ant-design:bug-filled'} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid> */}

          <Grid item xs={22} md={6} lg={6} text={20}>
            <AppCurrentVisits
              sx={{
                fontSize:'20px'
              }}
              title="Machines Status"
              chartData={[
             
                { label: 'Online', value:online},
                { label: 'Offline', value:machine-online},
                // { label: 'Europe', value: 1443 },
                // { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.success.dark,
                // theme.palette.info.main,
                // theme.palette.warning.main,
                theme.palette.error.dark,
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentVisits
              title="Stock Status"
              type="donut"
              chartData={[
                { label: 'ok', value:data.data.filter(filterOnline).filter(m => m.spiral_a_status === 3).length },
                { label: 'Low', value:data.data.filter(filterOnline).filter(m => m.spiral_a_status === 1).length },
                { label: 'Empty', value:data.data.filter(filterOnline).filter(m => m.spiral_a_status === 0).length},
                { label: 'Unknown', value: data.data.filter(filterOnline).filter(m => m.spiral_a_status === 2).length },
              ]}
              chartColors={[
                theme.palette.success.dark,
                theme.palette.warning.dark,
                theme.palette.error.dark,
                theme.palette.background.default,
               
                
              ]}
            />
          </Grid>
          {/* <Grid item xs={12} md={6} lg={6}>
            <AppCurrentVisits
              title="Stock Status"
              chartData={[
                { label: 'ok', value: 4344 },
                { label: 'Low', value: 5435 },
                { label: 'Empty', value: 1443 },
                { label: 'Unknown', value: 4443 },
              ]}
              chartColors={[
                theme.palette.success.main,
                theme.palette.warning.main,
                theme.palette.error.main,
                theme.palette.background.default,
               
                
              ]}
            />
          </Grid>
           <Grid item xs={12} md={6} lg={6}>
            <AppCurrentVisits
              title="Stock Status"
              chartData={[
                { label: 'ok', value: 4344 },
                { label: 'Low', value: 5435 },
                { label: 'Empty', value: 1443 },
                { label: 'Unknown', value: 4443 },
              ]}
              chartColors={[
                theme.palette.success.main,
                theme.palette.warning.main,
                theme.palette.error.main,
                theme.palette.background.default,
               
                
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
