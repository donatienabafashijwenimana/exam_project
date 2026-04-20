import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const DEFAULT_COLORS = ['#7c3aed', '#a855f7', '#c084fc', '#7b1fa2', '#00838f', '#558b2f'];

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const radius = outerRadius + 24;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#6b7280"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={11}
      fontWeight={500}
    >
      {`${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PieChartCard({
  title,
  data,
  height = 280,
  innerRadius = 0,
  outerRadius = 100,
  colors = DEFAULT_COLORS,
  showLegend = false,
  labelFormatter,
}) {
  const chartData = data.length > 0 ? data : [{ name: 'No data', value: 1 }];
  const hasData = data.length > 0;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              dataKey="value"
              label={labelFormatter ? labelFormatter : (hasData ? renderCustomLabel : undefined)}
              labelLine={hasData ? { stroke: '#9ca3af', strokeWidth: 1 } : false}
              paddingAngle={hasData ? 2 : 0}
              fontSize={11}
              strokeWidth={2}
              stroke="#fff"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={hasData ? colors[index % colors.length] : '#e0e0e0'}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: 12,
              }}
            />
            {showLegend && (
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12 }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
