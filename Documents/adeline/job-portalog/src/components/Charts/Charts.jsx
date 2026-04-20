import React from "react";
import { Typography, useTheme } from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from "recharts";
import { MONTHLY_POSTINGS, INDUSTRY_DATA, SUCCESS_RATE } from "../../data/mockData";

const COLORS = ["#0057FF", "#FF6B35", "#00C896", "#FFA502", "#9C27B0"];

const ChartCard = ({ title, children }) => {
  const theme = useTheme();
  return (
    <div style={{
      background: theme.palette.background.paper,
      borderRadius: 12,
      padding: 20,
      boxShadow: "0 4px 24px rgba(0,87,255,0.08)"
    }}>
      <Typography fontWeight={700} fontSize={15} mb={2}>{title}</Typography>
      {children}
    </div>
  );
};

export const PostingTrendsChart = () => {
  const theme = useTheme();
  return (
    <ChartCard title="📈 Job Posting Trends">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={MONTHLY_POSTINGS}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="postings" fill="#0057FF" radius={[4, 4, 0, 0]} name="Job Postings" />
          <Bar dataKey="applications" fill="#FF6B35" radius={[4, 4, 0, 0]} name="Applications" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export const IndustryPieChart = () => (
  <ChartCard title="🏢 Top Industries Hiring">
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={INDUSTRY_DATA} cx="50%" cy="50%" outerRadius={80} dataKey="value" >
          {INDUSTRY_DATA.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => `${v}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </ChartCard>
);

export const ApplicantVolumeChart = () => {
  const theme = useTheme();
  return (
    <ChartCard title="👥 Applicant Volume">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={MONTHLY_POSTINGS}>
          <defs>
            <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0057FF" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0057FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Area type="monotone" dataKey="applications" stroke="#0057FF" fill="url(#appGrad)" name="Applications" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export const SuccessRateChart = () => {
  const theme = useTheme();
  const data = SUCCESS_RATE.map((d) => ({
    ...d,
    rate: ((d.hired / d.applied) * 100).toFixed(1),
  }));

  return (
    <ChartCard title="✅ Application Success Rate (%)">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={[0, 25]} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Line type="monotone" dataKey="rate" stroke="#00C896" strokeWidth={2.5} dot={{ r: 4 }} name="Success Rate" />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
