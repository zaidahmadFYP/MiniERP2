"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Box,
  Paper,
  Tab,
  Tabs,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Divider,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  alpha,
  Tooltip,
  IconButton,
  Badge,
  Button,
  Snackbar,
  Alert,
} from "@mui/material"
import {
  PointOfSale,
  TrendingUp,
  ShoppingCart,
  CheckCircle,
  AttachMoney,
  AccountBalance,
  Inventory,
  LocalShipping,
  Restaurant,
  ReceiptLong,
  Info,
  Download,
  Refresh,
  CalendarMonth,
  FilterList,
  PieChart as PieChartIcon,
  CompareArrows,
  ArrowUpward,
  ArrowDownward,
  Warning,
  Error,
  Percent,
  Print,
  Share,
  FileDownload,
  Star,
} from "@mui/icons-material"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  ZAxis,
  Treemap,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from "recharts"
import MainContentWrapper from "./MainContentWrapper"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { saveAs } from "file-saver"
import * as XLSX from "xlsx"

const ReportAnalytics = () => {
  const systemTheme = useTheme() // Get the current system theme

  // Create custom theme that extends the current theme
  const customTheme = createTheme({
    palette: {
      mode: systemTheme.palette.mode, // Use the current system theme mode
      primary: {
        main: "#f15a22",
        light: alpha("#f15a22", 0.7),
        dark: alpha("#f15a22", 0.9),
      },
      secondary: {
        main: "#2c3e50",
        light: alpha("#2c3e50", 0.7),
        dark: alpha("#2c3e50", 0.9),
      },
      background: {
        default: "#f8f9fa",
        paper: "#ffffff",
      },
      success: {
        main: "#2ecc71",
        light: alpha("#2ecc71", 0.7),
        dark: alpha("#2ecc71", 0.9),
      },
      warning: {
        main: "#f39c12",
        light: alpha("#f39c12", 0.7),
        dark: alpha("#f39c12", 0.9),
      },
      error: {
        main: "#e74c3c",
        light: alpha("#e74c3c", 0.7),
        dark: alpha("#e74c3c", 0.9),
      },
      info: {
        main: "#3498db",
        light: alpha("#3498db", 0.7),
        dark: alpha("#3498db", 0.9),
      },
      text: {
        primary: "#2c3e50",
        secondary: "#7f8c8d",
      },
    },
    typography: {
      fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
      h4: {
        fontWeight: 700,
        color: "#2c3e50",
        fontSize: "1.75rem",
      },
      h5: {
        fontWeight: 600,
        color: "#2c3e50",
        fontSize: "1.5rem",
      },
      h6: {
        fontWeight: 600,
        color: "#2c3e50",
        fontSize: "1.25rem",
      },
      subtitle1: {
        fontWeight: 500,
        color: "#2c3e50",
        fontSize: "1rem",
      },
      subtitle2: {
        fontWeight: 500,
        color: "#7f8c8d",
        fontSize: "0.875rem",
      },
      body1: {
        color: "#2c3e50",
      },
      body2: {
        color: "#7f8c8d",
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            minWidth: 120,
            "&.Mui-selected": {
              color: "#f15a22",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
          colorPrimary: {
            backgroundColor: alpha("#f15a22", 0.1),
            color: "#f15a22",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 8,
          },
          containedPrimary: {
            backgroundColor: "#f15a22",
            "&:hover": {
              backgroundColor: alpha("#f15a22", 0.9),
            },
          },
          outlinedPrimary: {
            borderColor: "#f15a22",
            color: "#f15a22",
            "&:hover": {
              backgroundColor: alpha("#f15a22", 0.05),
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            backgroundColor: alpha("#f15a22", 0.05),
            color: "#2c3e50",
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            margin: "24px 0",
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: alpha("#f15a22", 0.2),
          },
          barColorPrimary: {
            backgroundColor: "#f15a22",
          },
        },
      },
      MuiCircularProgress: {
        styleOverrides: {
          colorPrimary: {
            color: "#f15a22",
          },
        },
      },
    },
  })

  // Custom chart theme with dark mode support
  const chartTheme = useMemo(
    () => ({
      colors: {
        primary: "#f15a22",
        secondary: "#2c3e50",
        success: "#2ecc71",
        warning: "#f39c12",
        error: "#e74c3c",
        info: "#3498db",
        purple: "#9b59b6",
        teal: "#1abc9c",
        pink: "#e84393",
        indigo: "#6c5ce7",
      },
      gradients: {
        primary: ["#f15a22", "#ff7e47"],
        secondary: ["#2c3e50", "#4a6b8a"],
        success: ["#2ecc71", "#55e992"],
        warning: ["#f39c12", "#ffbe45"],
        error: ["#e74c3c", "#ff7768"],
        info: ["#3498db", "#5dade2"],
      },
      darkMode: systemTheme.palette.mode === "dark", // Use the current theme mode
    }),
    [systemTheme.palette.mode],
  )

  // Enhanced Card component with gradient background
  const GradientCard = ({ children, gradient = "primary", sx = {} }) => {
    const theme = useTheme()

    const getGradient = (gradientName) => {
      const colors = chartTheme.gradients[gradientName] || chartTheme.gradients.primary
      return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`
    }

    return (
      <Card
        sx={{
          background: getGradient(gradient),
          color: "#fff",
          ...sx,
        }}
      >
        {children}
      </Card>
    )
  }

  // Enhanced Statistic Card component
  const StatisticCard = ({
    title,
    value,
    icon,
    subtitle,
    change,
    changeType = "percent",
    color = "primary",
    footer,
    sx = {},
  }) => {
    const isPositive = change > 0
    const changeIcon = isPositive ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />

    return (
      <GradientCard gradient={color} sx={sx}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ color: "#fff", opacity: 0.9, mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: "#fff" }}>
                {value}
              </Typography>
              {change !== undefined && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isPositive ? "#ffffff" : "#ffffff",
                      opacity: 0.9,
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 500,
                    }}
                  >
                    {isPositive ? "+" : ""}
                    {change}
                    {changeType === "percent" ? "%" : ""}
                    {changeIcon}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ffffff", opacity: 0.7, ml: 1 }}>
                    vs last period
                  </Typography>
                </Box>
              )}
              {subtitle && (
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8, color: "#fff" }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            {icon && (
              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "50%",
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
              </Box>
            )}
          </Box>
          {footer && (
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              {footer}
            </Box>
          )}
        </CardContent>
      </GradientCard>
    )
  }

  // Enhanced metric card with theme-aware background
  const MetricCard = ({ title, value, change, icon, color = "primary", subtitle, footer, sx = {} }) => {
    const theme = useTheme()
    const isPositive = change > 0
    const isDarkMode = theme.palette.mode === "dark"

    return (
      <Card
        sx={{
          p: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          ...sx,
        }}
      >
        <CardContent sx={{ p: 3, flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {value}
              </Typography>
              {change !== undefined && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isPositive ? theme.palette.success.main : theme.palette.error.main,
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 500,
                    }}
                  >
                    {isPositive ? "+" : ""}
                    {change}%
                    {isPositive ? (
                      <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} />
                    ) : (
                      <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    vs last period
                  </Typography>
                </Box>
              )}
              {subtitle && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            {icon && (
              <Box
                sx={{
                  backgroundColor: alpha(theme.palette[color].main, isDarkMode ? 0.2 : 0.1),
                  borderRadius: "50%",
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "& .MuiSvgIcon-root": {
                    color: theme.palette[color].main,
                  },
                }}
              >
                {icon}
              </Box>
            )}
          </Box>
        </CardContent>
        {footer && (
          <Box
            sx={{
              p: 2,
              pt: 0,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backgroundColor: isDarkMode
                ? alpha(theme.palette.background.default, 0.3)
                : alpha(theme.palette.background.default, 0.5),
            }}
          >
            {footer}
          </Box>
        )}
      </Card>
    )
  }

  // TabPanel component to handle tab content
  function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`analytics-tabpanel-${index}`}
        aria-labelledby={`analytics-tab-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    )
  }

  function a11yProps(index) {
    return {
      id: `analytics-tab-${index}`,
      "aria-controls": `analytics-tabpanel-${index}`,
    }
  }

  // Enhanced chart components
  const ChartContainer = ({ title, subtitle, children, height = 300, actions, sx = {} }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === "dark"

    return (
      <Paper
        elevation={2}
        sx={{
          p: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            boxShadow: isDarkMode ? "0 8px 16px rgba(0, 0, 0, 0.4)" : "0 8px 16px rgba(0, 0, 0, 0.1)",
          },
          ...sx,
        }}
      >
        <Box
          sx={{
            p: 3,
            pb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && <Box sx={{ display: "flex", gap: 1 }}>{actions}</Box>}
        </Box>
        <Box sx={{ flex: 1, minHeight: height, p: 2 }}>{children}</Box>
      </Paper>
    )
  }

  // Enhanced tooltip component
  const CustomTooltip = ({ active, payload, label, formatter, title }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === "dark"

    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            backgroundColor: isDarkMode ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)",
            border: `1px solid ${isDarkMode ? "#333" : "#eee"}`,
            boxShadow: isDarkMode ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.1)",
            maxWidth: 300,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            {title || label}
          </Typography>
          {payload.map((entry, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: entry.color,
                }}
              />
              <Typography variant="body2">
                {entry.name}: {formatter ? formatter(entry.value, entry.name) : entry.value}
              </Typography>
            </Box>
          ))}
        </Paper>
      )
    }
    return null
  }

  // Enhanced chart components
  const EnhancedLineChart = ({ data, xKey, yKeys, title, subtitle, height = 300, formatter, actions }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === "dark"

    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} actions={actions}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.darkMode ? "#333" : "#eee"} />
            <XAxis
              dataKey={xKey}
              stroke={chartTheme.darkMode ? "#aaa" : "#2c3e50"}
              tick={{ fill: chartTheme.darkMode ? "#aaa" : "#2c3e50" }}
              tickLine={{ stroke: chartTheme.darkMode ? "#aaa" : "#2c3e50" }}
              axisLine={{ stroke: chartTheme.darkMode ? "#aaa" : "#2c3e50" }}
            />
            <YAxis
              stroke={chartTheme.darkMode ? "#aaa" : "#2c3e50"}
              tick={{ fill: chartTheme.darkMode ? "#aaa" : "#2c3e50" }}
              tickLine={{ stroke: chartTheme.darkMode ? "#aaa" : "#2c3e50" }}
              axisLine={{ stroke: chartTheme.darkMode ? "#aaa" : "#2c3e50" }}
            />
            <RechartsTooltip
              content={({ active, payload, label }) => (
                <CustomTooltip
                  active={active}
                  payload={payload}
                  label={label}
                  formatter={formatter || ((value) => `$${value.toFixed(2)}`)}
                />
              )}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={10} />
            {yKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={Object.values(chartTheme.colors)[index % Object.keys(chartTheme.colors).length]}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  const EnhancedAreaChart = ({
    data,
    xKey,
    yKeys,
    title,
    subtitle,
    height = 300,
    formatter,
    stacked = false,
    actions,
  }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === "dark"

    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} actions={actions}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.darkMode ? "#333" : "#eee"} />
            <XAxis
              dataKey={xKey}
              stroke={chartTheme.darkMode ? "#aaa" : "#2c3e50"}
              tick={{ fill: chartTheme.darkMode ? "#aaa" : "#2c3e50" }}
            />
            <YAxis
              stroke={chartTheme.darkMode ? "#aaa" : "#2c3e50"}
              tick={{ fill: chartTheme.darkMode ? "#aaa" : "#2c3e50" }}
            />
            <RechartsTooltip
              content={({ active, payload, label }) => (
                <CustomTooltip
                  active={active}
                  payload={payload}
                  label={label}
                  formatter={formatter || ((value) => `$${value.toFixed(2)}`)}
                />
              )}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={10} />
            {yKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stackId={stacked ? "1" : index}
                stroke={Object.values(chartTheme.colors)[index % Object.keys(chartTheme.colors).length]}
                fill={alpha(Object.values(chartTheme.colors)[index % Object.keys(chartTheme.colors).length], 0.5)}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  const EnhancedBarChart = ({
    data,
    xKey,
    yKeys,
    title,
    subtitle,
    height = 300,
    formatter,
    stacked = false,
    actions,
  }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === "dark"

    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} actions={actions}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.darkMode ? "#333" : "#eee"} />
            <XAxis
              dataKey={xKey}
              stroke={chartTheme.darkMode ? "#aaa" : "#2c3e50"}
              tick={{ fill: chartTheme.darkMode ? "#aaa" : "#2c3e50" }}
            />
            <YAxis
              stroke={chartTheme.darkMode ? "#aaa" : "#2c3e50"}
              tick={{ fill: chartTheme.darkMode ? "#aaa" : "#2c3e50" }}
            />
            <RechartsTooltip
              content={({ active, payload, label }) => (
                <CustomTooltip
                  active={active}
                  payload={payload}
                  label={label}
                  formatter={formatter || ((value) => `$${value.toFixed(2)}`)}
                />
              )}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={10} />
            {yKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                name={key}
                stackId={stacked ? "1" : undefined}
                fill={Object.values(chartTheme.colors)[index % Object.keys(chartTheme.colors).length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  const EnhancedPieChart = ({ data, dataKey, nameKey, title, subtitle, height = 300, formatter, actions }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === "dark"

    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} actions={actions}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={0}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={Object.values(chartTheme.colors)[index % Object.keys(chartTheme.colors).length]}
                />
              ))}
            </Pie>
            <RechartsTooltip
              content={({ active, payload }) => (
                <CustomTooltip
                  active={active}
                  payload={payload}
                  formatter={formatter || ((value) => `${value} items`)}
                />
              )}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={10}
              layout="horizontal"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  const EnhancedDonutChart = ({ data, dataKey, nameKey, title, subtitle, height = 300, formatter, actions }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === "dark"

    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} actions={actions}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={Object.values(chartTheme.colors)[index % Object.keys(chartTheme.colors).length]}
                />
              ))}
            </Pie>
            <RechartsTooltip
              content={({ active, payload }) => (
                <CustomTooltip
                  active={active}
                  payload={payload}
                  formatter={formatter || ((value) => `${value} items`)}
                />
              )}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={10}
              layout="horizontal"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  // Enhanced radar chart component
  const EnhancedRadarChart = ({ data, dataKey, title, subtitle, height = 300, formatter, actions }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === "dark"

    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} actions={actions}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius={80} data={data}>
            <PolarGrid stroke={chartTheme.darkMode ? "#333" : "#e0e0e0"} />
            <PolarAngleAxis dataKey="name" tick={{ fill: chartTheme.darkMode ? "#aaa" : "#2c3e50" }} />
            <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
            <Radar
              name={dataKey}
              dataKey="value"
              stroke={chartTheme.colors.primary}
              fill={chartTheme.colors.primary}
              fillOpacity={0.6}
            />
            <RechartsTooltip
              content={({ active, payload }) => (
                <CustomTooltip active={active} payload={payload} formatter={formatter || ((value) => value)} />
              )}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={10} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  // Enhanced table component
  const EnhancedTable = ({ title, subtitle, columns, data, height = 400, actions, pagination = false, sx = {} }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === "dark"

    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} actions={actions} sx={sx}>
        <TableContainer sx={{ maxHeight: height, overflow: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    align={column.align || "left"}
                    sx={{
                      backgroundColor: alpha("#f15a22", isDarkMode ? 0.15 : 0.05),
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: isDarkMode ? alpha("#222", 0.5) : alpha("#f8f9fa", 0.5),
                    },
                    "&:hover": { backgroundColor: alpha("#f15a22", isDarkMode ? 0.15 : 0.05) },
                    transition: "background-color 0.2s",
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      align={column.align || "left"}
                      sx={{
                        whiteSpace: column.nowrap ? "nowrap" : "normal",
                        ...(column.sx || {}),
                      }}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : (column.key === "Name" || column.key === "vendorName" || column.key === "name") &&
                            row[column.key] === undefined
                          ? row.name || row.Name || row.vendorName || column.defaultValue || "N/A"
                          : row[column.key] === undefined || isNaN(row[column.key])
                            ? column.defaultValue || "N/A"
                            : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {pagination && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              p: 2,
              borderTop: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography variant="body2" sx={{ mr: 2 }}>
              Showing {Math.min(data.length, 10)} of {data.length} entries
            </Typography>
            <Button size="small" variant="outlined" disabled>
              Previous
            </Button>
            <Box sx={{ mx: 1 }}>
              <Chip label="1" color="primary" />
            </Box>
            <Button size="small" variant="outlined" disabled={data.length <= 10}>
              Next
            </Button>
          </Box>
        )}
      </ChartContainer>
    )
  }

  // Enhanced scatter chart component
  const EnhancedScatterChart = ({ data, xKey, yKey, zKey, title, subtitle, height = 300, formatter, actions }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === "dark"

    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} actions={actions}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.darkMode ? "#333" : "#eee"} />
            <XAxis
              type="number"
              dataKey={xKey}
              name={xKey}
              stroke={chartTheme.darkMode ? "#aaa" : "#2c3e50"}
              tick={{ fill: chartTheme.darkMode ? "#aaa" : "#2c3e50" }}
            />
            <YAxis
              type="number"
              dataKey={yKey}
              name={yKey}
              stroke={chartTheme.darkMode ? "#aaa" : "#2c3e50"}
              tick={{ fill: chartTheme.darkMode ? "#aaa" : "#2c3e50" }}
            />
            <ZAxis type="number" dataKey={zKey} range={[40, 160]} name={zKey} />
            <RechartsTooltip
              content={({ active, payload }) => (
                <CustomTooltip
                  active={active}
                  payload={payload}
                  formatter={formatter || ((value) => value.toFixed(2))}
                />
              )}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={10} />
            <Scatter name={title} data={data} fill={chartTheme.colors.primary} />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  // Enhanced treemap component
  const EnhancedTreemap = ({ data, dataKey, nameKey, title, subtitle, height = 300, formatter, actions }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === "dark"

    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} actions={actions}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey={dataKey}
            ratio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
            content={({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {
              return (
                <g>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    style={{
                      fill: Object.values(chartTheme.colors)[index % Object.keys(chartTheme.colors).length],
                      stroke: "#fff",
                      strokeWidth: 2 / (depth + 1e-10),
                      strokeOpacity: 1 / (depth + 1e-10),
                    }}
                  />
                  {depth === 1 && (
                    <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14}>
                      {name}
                    </text>
                  )}
                </g>
              )
            }}
          >
            <RechartsTooltip
              content={({ active, payload }) => (
                <CustomTooltip
                  active={active}
                  payload={payload}
                  formatter={formatter || ((value) => `${value.toFixed(2)}`)}
                />
              )}
            />
          </Treemap>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  // Enhanced composed chart component
  const EnhancedComposedChart = ({
    data,
    xKey,
    barKeys,
    lineKeys,
    areaKeys,
    title,
    subtitle,
    height = 300,
    formatter,
    actions,
  }) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === "dark"

    return (
      <ChartContainer title={title} subtitle={subtitle} height={height} actions={actions}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.darkMode ? "#333" : "#eee"} />
            <XAxis
              dataKey={xKey}
              stroke={chartTheme.darkMode ? "#aaa" : "#2c3e50"}
              tick={{ fill: chartTheme.darkMode ? "#aaa" : "#2c3e50" }}
            />
            <YAxis
              stroke={chartTheme.darkMode ? "#aaa" : "#2c3e50"}
              tick={{ fill: chartTheme.darkMode ? "#aaa" : "#2c3e50" }}
            />
            <RechartsTooltip
              content={({ active, payload, label }) => (
                <CustomTooltip
                  active={active}
                  payload={payload}
                  label={label}
                  formatter={formatter || ((value) => `$${value.toFixed(2)}`)}
                />
              )}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={10} />
            {barKeys &&
              barKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  name={key}
                  fill={Object.values(chartTheme.colors)[index % Object.keys(chartTheme.colors).length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            {lineKeys &&
              lineKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key}
                  stroke={
                    Object.values(chartTheme.colors)[
                      (index + (barKeys?.length || 0)) % Object.keys(chartTheme.colors).length
                    ]
                  }
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              ))}
            {areaKeys &&
              areaKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key}
                  stroke={
                    Object.values(chartTheme.colors)[
                      (index + (barKeys?.length || 0) + (lineKeys?.length || 0)) % Object.keys(chartTheme.colors).length
                    ]
                  }
                  fill={alpha(
                    Object.values(chartTheme.colors)[
                      (index + (barKeys?.length || 0) + (lineKeys?.length || 0)) % Object.keys(chartTheme.colors).length
                    ],
                    0.5,
                  )}
                />
              ))}
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  // Enhanced loading state
  const LoadingState = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 6,
        minHeight: "500px",
        bgcolor: "background.default",
        borderRadius: 2,
      }}
    >
      <CircularProgress size={60} thickness={4} sx={{ color: "#f15a22" }} />
      <Typography variant="h6" sx={{ mt: 3, color: "#2c3e50", fontWeight: 600 }}>
        Loading Analytics Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, color: "#7f8c8d", textAlign: "center", maxWidth: 400 }}>
        We're gathering all your business insights and preparing your personalized analytics dashboard
      </Typography>
      <Box sx={{ width: "50%", mt: 4 }}>
        <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
      </Box>
    </Box>
  )

  // Enhanced error state
  const ErrorState = ({ message, onRetry }) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 6,
        minHeight: "400px",
        bgcolor: "background.default",
        borderRadius: 2,
      }}
    >
      <Error sx={{ fontSize: 60, color: "#e74c3c", mb: 2 }} />
      <Typography variant="h5" sx={{ color: "#2c3e50", fontWeight: 600, mb: 2 }}>
        Data Loading Error
      </Typography>
      <Typography variant="body1" sx={{ color: "#7f8c8d", textAlign: "center", maxWidth: 500, mb: 4 }}>
        {message ||
          "We encountered an error while loading your analytics data. Please try again later or contact support if the problem persists."}
      </Typography>
      {onRetry && (
        <Button variant="contained" color="primary" startIcon={<Refresh />} onClick={onRetry}>
          Retry
        </Button>
      )}
    </Box>
  )

  // Enhanced empty state
  const EmptyState = ({ message, icon, actionText, onAction }) => {
    const theme = useTheme()
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          minHeight: "200px",
          bgcolor: theme.palette.mode === "dark" ? "rgba(30, 30, 30, 0.5)" : alpha("#f8f9fa", 0.5),
          borderRadius: 2,
        }}
      >
        {icon || <Info sx={{ fontSize: 40, color: "#3498db", mb: 2 }} />}
        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, textAlign: "center" }}>
          {message}
        </Typography>
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          No data available to display
        </Typography>
        {actionText && onAction && (
          <Button variant="outlined" color="primary" size="small" onClick={onAction} sx={{ mt: 2 }}>
            {actionText}
          </Button>
        )}
      </Box>
    )
  }

  // Enhanced section header
  const SectionHeader = ({ title, subtitle, icon, actions }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
        "& .MuiSvgIcon-root": {
          color: "#f15a22",
          mr: 1.5,
          fontSize: 28,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {icon}
        <Box>
          <Typography variant="h5" sx={{ color: "#2c3e50", fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" sx={{ color: "#7f8c8d", mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      {actions && <Box sx={{ display: "flex", gap: 1 }}>{actions}</Box>}
    </Box>
  )

  // Enhanced KPI indicator component
  const KPIIndicator = ({ title, value, target, unit = "", status = "neutral", icon }) => {
    const theme = useTheme()

    const getStatusColor = (status) => {
      switch (status) {
        case "success":
          return theme.palette.success.main
        case "warning":
          return theme.palette.warning.main
        case "error":
          return theme.palette.error.main
        default:
          return theme.palette.info.main
      }
    }

    const statusColor = getStatusColor(status)
    const percentage = target ? Math.round((value / target) * 100) : null

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderRadius: 2,
          border: `1px solid ${alpha(statusColor, 0.3)}`,
          backgroundColor: alpha(statusColor, 0.05),
        }}
      >
        {icon && (
          <Box
            sx={{
              mr: 2,
              backgroundColor: alpha(statusColor, 0.1),
              borderRadius: "50%",
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& .MuiSvgIcon-root": {
                color: statusColor,
              },
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ color: "#7f8c8d", mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h6" sx={{ color: "#2c3e50", fontWeight: 600 }}>
            {value}
            {unit}
          </Typography>
          {target && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Box sx={{ flex: 1, mr: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(percentage, 100)}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: alpha(statusColor, 0.2),
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: statusColor,
                    },
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: statusColor, fontWeight: 500 }}>
                {percentage}%
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    )
  }

  // Enhanced dashboard header with date range and actions
  const DashboardHeader = ({ title, subtitle, dateRange, onDateRangeChange, actions }) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          mb: 4,
          pb: 3,
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box sx={{ mb: { xs: 2, md: 0 } }}>
          <Typography variant="h4" sx={{ color: "#2c3e50", fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" sx={{ color: "#7f8c8d", mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          {dateRange && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 1,
                px: 2,
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
                backgroundColor: "background.paper",
              }}
            >
              <CalendarMonth sx={{ color: "#7f8c8d", mr: 1 }} />
              <Typography variant="body2" sx={{ color: "#2c3e50", fontWeight: 500 }}>
                {dateRange}
              </Typography>
              <IconButton size="small" sx={{ ml: 1 }} onClick={onDateRangeChange}>
                <FilterList fontSize="small" />
              </IconButton>
            </Box>
          )}
          {actions && <Box sx={{ display: "flex", gap: 1 }}>{actions}</Box>}
        </Box>
      </Box>
    )
  }

  // Enhanced status badge component
  const StatusBadge = ({ status, text }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case "success":
        case "active":
        case "online":
        case "completed":
          return "success"
        case "warning":
        case "pending":
        case "in-progress":
          return "warning"
        case "error":
        case "inactive":
        case "offline":
        case "failed":
          return "error"
        default:
          return "info"
      }
    }

    const color = getStatusColor(status)

    return (
      <Chip
        size="small"
        color={color}
        label={text || status}
        sx={{
          fontWeight: 500,
          textTransform: "capitalize",
        }}
      />
    )
  }

  // Enhanced comparison card component
  const ComparisonCard = ({ title, current, previous, unit = "", percentChange, icon, color = "primary" }) => {
    const theme = useTheme()
    const isPositive = percentChange > 0

    return (
      <Card sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ color: "#7f8c8d" }}>
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                backgroundColor: alpha(theme.palette[color].main, 0.1),
                borderRadius: "50%",
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "& .MuiSvgIcon-root": {
                  color: theme.palette[color].main,
                },
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        <Typography variant="h4" sx={{ color: "#2c3e50", fontWeight: 700, mb: 1 }}>
          {current}
          {unit}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="body2"
            sx={{
              color: isPositive ? theme.palette.success.main : theme.palette.error.main,
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
            }}
          >
            {isPositive ? "+" : ""}
            {percentChange}%
            {isPositive ? (
              <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} />
            ) : (
              <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
            )}
          </Typography>
          <Typography variant="body2" sx={{ color: "#7f8c8d", ml: 1 }}>
            vs previous ({previous}
            {unit})
          </Typography>
        </Box>
      </Card>
    )
  }

  const theme = useTheme()
  const [value, setValue] = useState(0)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dateRange, setDateRange] = useState("Last 30 days")

  // State for different data types
  const [transactions, setTransactions] = useState([])
  const [posConfigs, setPosConfigs] = useState([])
  const [banks, setBanks] = useState([])
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [vendors, setVendors] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [finishedGoods, setFinishedGoods] = useState([])
  const [bomData, setBomData] = useState([])
  const [menuCategories, setMenuCategories] = useState([])

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://api.example.com"

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        setError(null)

        try {
          // Fetch all data in parallel
          const [
            transactionsResponse,
            posConfigsResponse,
            banksResponse,
            purchaseOrdersResponse,
            vendorsResponse,
            menuCategoriesResponse,
            finishedGoodsResponse,
            bomDataResponse,
          ] = await Promise.all([
            fetch("/api/transactions"),
            fetch("/api/posconfig"),
            fetch("/api/banks"),
            fetch("/api/purchase-orders"),
            fetch("/api/vendors"),
            fetch("/api/menu/categories"),
            fetch("/api/menu/finishedgoods"),
            fetch("/api/menu/bom"),
          ])

          // Process all responses
          const transactions = await transactionsResponse.json()
          const posConfigs = await posConfigsResponse.json()
          const banks = await banksResponse.json()
          const purchaseOrders = await purchaseOrdersResponse.json()
          const vendors = await vendorsResponse.json()

          // For menu categories, check if the response has a categories property
          const menuCategoriesData = await menuCategoriesResponse.json()
          const menuCategories = menuCategoriesData.categories || menuCategoriesData

          const finishedGoods = await finishedGoodsResponse.json()
          const bomData = await bomDataResponse.json()

          // Set state with fetched data
          setTransactions(transactions)
          setPosConfigs(posConfigs)
          setBanks(banks)
          setPurchaseOrders(purchaseOrders)
          setVendors(vendors)
          setMenuCategories(menuCategories)
          setFinishedGoods(finishedGoods)
          setBomData(bomData)

          setLoading(false)
        } catch (error) {
          console.error("Error fetching data:", error)
          setError("Failed to fetch data from the server. Please try again later.")
          setLoading(false)
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message || "An error occurred while fetching data")
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  const handleRetry = () => {
    setLoading(true)
    setError(null)

    // Fetch all data again
    const fetchAllData = async () => {
      try {
        // Fetch all data in parallel
        const [
          transactionsResponse,
          posConfigsResponse,
          banksResponse,
          purchaseOrdersResponse,
          vendorsResponse,
          menuCategoriesResponse,
          finishedGoodsResponse,
          bomDataResponse,
        ] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/posconfig"),
          fetch("/api/banks"),
          fetch("/api/purchase-orders"),
          fetch("/api/vendors"),
          fetch("/api/menu/categories"),
          fetch("/api/menu/finishedgoods"),
          fetch("/api/menu/bom"),
        ])

        // Process all responses
        const transactions = await transactionsResponse.json()
        const posConfigs = await posConfigsResponse.json()
        const banks = await banksResponse.json()
        const purchaseOrders = await purchaseOrdersResponse.json()
        const vendors = await vendorsResponse.json()

        // For menu categories, check if the response has a categories property
        const menuCategoriesData = await menuCategoriesResponse.json()
        const menuCategories = menuCategoriesData.categories || menuCategoriesData

        const finishedGoods = await finishedGoodsResponse.json()
        const bomData = await bomDataResponse.json()

        // Set state with fetched data
        setTransactions(transactions)
        setPosConfigs(posConfigs)
        setBanks(banks)
        setPurchaseOrders(purchaseOrders)
        setVendors(vendors)
        setMenuCategories(menuCategories)
        setFinishedGoods(finishedGoods)
        setBomData(bomData)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to fetch data from the server. Please try again later.")
        setLoading(false)
      }
    }

    fetchAllData()
  }

  // Process transaction data for analytics
  const processTransactionData = () => {
    if (!transactions || transactions.length === 0) {
      return {
        dailyData: [],
        paymentMethodData: [],
        totalSales: 0,
        avgTransactionValue: 0,
        totalItems: 0,
        itemsPerTransaction: 0,
        salesByHour: [],
        topSellingProducts: [],
        salesGrowth: 0,
      }
    }

    // Group transactions by date
    const groupedByDate = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = {
          count: 0,
          total: 0,
          items: 0,
        }
      }
      acc[date].count += 1
      acc[date].total += transaction.total
      acc[date].items += transaction.items.length
      return acc
    }, {})

    // Create daily data for charts
    const dailyData = Object.keys(groupedByDate)
      .map((date) => ({
        date,
        count: groupedByDate[date].count,
        total: groupedByDate[date].total,
        items: groupedByDate[date].items,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    // Group by payment method
    const paymentMethods = transactions.reduce((acc, transaction) => {
      const { paymentMethod } = transaction
      if (!acc[paymentMethod]) {
        acc[paymentMethod] = {
          count: 0,
          total: 0,
        }
      }
      acc[paymentMethod].count += 1
      acc[paymentMethod].total += transaction.total
      return acc
    }, {})

    const paymentMethodData = Object.keys(paymentMethods).map((method) => ({
      name: method,
      count: paymentMethods[method].count,
      total: paymentMethods[method].total,
    }))

    // Calculate total sales
    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0)

    // Calculate total items sold
    const totalItems = transactions.reduce((sum, t) => {
      return sum + t.items.reduce((itemSum, item) => itemSum + item.itemQuantity, 0)
    }, 0)

    // Calculate average transaction value
    const avgTransactionValue = totalSales / transactions.length

    // Calculate average items per transaction
    const itemsPerTransaction = totalItems / transactions.length

    // Group transactions by hour
    const salesByHour = Array(24)
      .fill(0)
      .map((_, i) => ({
        hour: i,
        sales: 0,
        count: 0,
      }))

    transactions.forEach((transaction) => {
      const hour = new Date(transaction.date).getHours()
      salesByHour[hour].sales += transaction.total
      salesByHour[hour].count += 1
    })

    // Find top selling products
    const productSales = {}
    transactions.forEach((transaction) => {
      transaction.items.forEach((item) => {
        if (!productSales[item.itemName]) {
          productSales[item.itemName] = {
            name: item.itemName || "Unnamed Product",
            quantity: 0,
            revenue: 0,
          }
        }
        productSales[item.itemName].quantity += item.itemQuantity || 0
        productSales[item.itemName].revenue += (item.itemPrice || 0) * (item.itemQuantity || 0)
      })
    })

    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((product) => ({
        ...product,
        // Ensure revenue is never NaN
        revenue: isNaN(product.revenue) ? 0 : product.revenue,
        // Ensure quantity is never NaN
        quantity: isNaN(product.quantity) ? 0 : product.quantity,
      }))

    // Calculate sales growth (comparing first half to second half of the period)
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date))
    const midpoint = Math.floor(sortedTransactions.length / 2)
    const firstHalfSales = sortedTransactions.slice(0, midpoint).reduce((sum, t) => sum + t.total, 0)
    const secondHalfSales = sortedTransactions.slice(midpoint).reduce((sum, t) => sum + t.total, 0)
    const salesGrowth = firstHalfSales > 0 ? ((secondHalfSales - firstHalfSales) / firstHalfSales) * 100 : 0

    return {
      dailyData,
      paymentMethodData,
      totalSales,
      avgTransactionValue,
      totalItems,
      itemsPerTransaction,
      salesByHour,
      topSellingProducts,
      salesGrowth,
    }
  }

  // Process POS data for analytics
  const processPOSData = () => {
    if (!posConfigs || posConfigs.length === 0) {
      return {
        statusSummary: { total: 0, online: 0, offline: 0 },
        authorityTypeCounts: [],
        locationData: [],
        activityTimeline: [],
      }
    }

    // POS machine status summary
    const statusSummary = {
      total: posConfigs.length,
      online: posConfigs.filter((pos) => pos.POSStatus === "Online").length,
      offline: posConfigs.filter((pos) => pos.POSStatus === "Offline").length,
    }

    // Group by authority type
    const authorityTypes = posConfigs.reduce((acc, pos) => {
      if (!acc[pos.AuthorityType]) {
        acc[pos.AuthorityType] = {
          count: 0,
          online: 0,
          offline: 0,
        }
      }
      acc[pos.AuthorityType].count += 1
      if (pos.POSStatus === "Online") {
        acc[pos.AuthorityType].online += 1
      } else {
        acc[pos.AuthorityType].offline += 1
      }
      return acc
    }, {})

    const authorityTypeCounts = Object.keys(authorityTypes).map((type) => ({
      name: type,
      count: authorityTypes[type].count,
      online: authorityTypes[type].online,
      offline: authorityTypes[type].offline,
    }))

    // Group by location
    const locations = posConfigs.reduce((acc, pos) => {
      const location = pos.Location || "Main Store" // Default location name
      if (!acc[location]) {
        acc[location] = {
          count: 0,
          online: 0,
          offline: 0,
        }
      }
      acc[location].count += 1
      if (pos.POSStatus === "Online") {
        acc[location].online += 1
      } else {
        acc[location].offline += 1
      }
      return acc
    }, {})

    // Create locationData from locations
    const locationData = Object.keys(locations).map((location) => ({
      name: location,
      count: locations[location].count,
      online: locations[location].online,
      offline: locations[location].offline,
    }))

    // Create activity timeline with proper date formatting
    const activityTimeline = posConfigs
      .map((pos) => {
        // Create a valid date or use current date as fallback
        let formattedDate = new Date()
        try {
          const date = new Date(pos.LastActive)
          formattedDate = isNaN(date.getTime()) ? new Date() : date
        } catch (e) {
          console.error("Error parsing date:", pos.LastActive)
        }

        return {
          id: pos.PosID || `Terminal-${Math.floor(Math.random() * 10000)}`,
          date: formattedDate,
          status: pos.POSStatus || "Unknown",
        }
      })
      .sort((a, b) => b.date - a.date)
      .slice(0, 10)

    return {
      statusSummary,
      authorityTypeCounts,
      locationData,
      activityTimeline,
    }
  }

  // Process bank data for analytics
  const processBankData = () => {
    if (!banks || banks.length === 0) {
      return {
        activeBanks: 0,
        inactiveBanks: 0,
        bankStatusData: [],
        creationTimeline: [],
        banksByCity: [],
      }
    }

    // Count active and inactive banks
    const activeBanks = banks.filter((bank) => bank.isActive).length
    const inactiveBanks = banks.length - activeBanks

    // Bank status data for pie chart
    const bankStatusData = [
      { name: "Active", value: activeBanks },
      { name: "Inactive", value: inactiveBanks },
    ]

    // Group banks by creation month for timeline
    const banksByMonth = banks.reduce((acc, bank) => {
      const date = new Date(bank.createdAt)
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

      if (!acc[monthYear]) {
        acc[monthYear] = {
          monthYear,
          count: 0,
          active: 0,
          inactive: 0,
        }
      }

      acc[monthYear].count += 1
      if (bank.isActive) {
        acc[monthYear].active += 1
      } else {
        acc[monthYear].inactive += 1
      }

      return acc
    }, {})

    const creationTimeline = Object.values(banksByMonth).sort((a, b) => {
      const [aMonth, aYear] = a.monthYear.split("/")
      const [bMonth, bYear] = b.monthYear.split("/")
      return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1)
    })

    // Group banks by city
    const cityCounts = banks.reduce((acc, bank) => {
      const city = bank.city || "Regional Branch" // Default city name
      if (!acc[city]) {
        acc[city] = {
          count: 0,
          active: 0,
          inactive: 0,
        }
      }
      acc[city].count += 1
      if (bank.isActive) {
        acc[city].active += 1
      } else {
        acc[city].inactive += 1
      }
      return acc
    }, {})

    const banksByCity = Object.keys(cityCounts).map((city) => ({
      name: city,
      count: cityCounts[city].count,
      active: cityCounts[city].active,
      inactive: cityCounts[city].inactive,
    }))

    return {
      activeBanks,
      inactiveBanks,
      bankStatusData,
      creationTimeline,
      banksByCity,
    }
  }

  // Process purchase order data for analytics
  const processPurchaseOrderData = () => {
    if (!purchaseOrders || purchaseOrders.length === 0) {
      return {
        totalOrders: 0,
        totalAmount: 0,
        averageOrderValue: 0,
        statusCounts: [],
        confirmationCounts: [],
        topVendors: [],
        orderTimeline: [],
        ordersByPaymentTerms: [],
      }
    }

    // Calculate basic metrics
    const totalOrders = purchaseOrders.length
    const totalAmount = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0)
    const averageOrderValue = totalAmount / totalOrders

    // Count orders by status
    const statusCounts = purchaseOrders.reduce((acc, po) => {
      const status = po.status || "Unknown"
      if (!acc[status]) {
        acc[status] = 0
      }
      acc[status] += 1
      return acc
    }, {})

    const statusData = Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }))

    // Count orders by confirmation status
    const confirmationCounts = purchaseOrders.reduce((acc, po) => {
      const confirmation = po.confirmation || "Unknown"
      if (!acc[confirmation]) {
        acc[confirmation] = 0
      }
      acc[confirmation] += 1
      return acc
    }, {})

    const confirmationData = Object.keys(confirmationCounts).map((confirmation) => ({
      name: confirmation,
      value: confirmationCounts[confirmation],
    }))

    // Find top vendors by order count and amount
    const vendorData = purchaseOrders.reduce((acc, po) => {
      const vendorId = po.vendorId
      if (!acc[vendorId]) {
        acc[vendorId] = {
          vendorId,
          vendorName: po.vendorName,
          orderCount: 0,
          totalAmount: 0,
        }
      }
      acc[vendorId].orderCount += 1
      acc[vendorId].totalAmount += po.totalAmount
      return acc
    }, {})

    const topVendors = Object.values(vendorData)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5)

    // Group orders by month for timeline
    const ordersByMonth = purchaseOrders.reduce((acc, po) => {
      // Use requestedDate if available, otherwise use createdAt
      const dateStr = po.requestedDate || po.createdAt

      // Try to parse the date
      let date
      try {
        date = new Date(dateStr)
      } catch (e) {
        console.error("Error parsing date:", dateStr)
        return acc
      }

      if (isNaN(date.getTime())) {
        return acc // Skip if date is invalid
      }

      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

      if (!acc[monthYear]) {
        acc[monthYear] = {
          monthYear,
          count: 0,
          amount: 0,
        }
      }

      acc[monthYear].count += 1
      acc[monthYear].amount += po.totalAmount

      return acc
    }, {})

    const orderTimeline = Object.values(ordersByMonth).sort((a, b) => {
      const [aMonth, aYear] = a.monthYear.split("/")
      const [bMonth, bYear] = b.monthYear.split("/")
      return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1)
    })

    // Group orders by payment terms
    const paymentTermsCounts = purchaseOrders.reduce((acc, po) => {
      const terms = po.paymentTerms || "Net 30" // Default payment term
      if (!acc[terms]) {
        acc[terms] = {
          count: 0,
          amount: 0,
        }
      }
      acc[terms].count += 1
      acc[terms].amount += po.totalAmount || 0
      return acc
    }, {})

    const ordersByPaymentTerms = Object.keys(paymentTermsCounts).map((terms) => ({
      name: terms,
      count: paymentTermsCounts[terms].count,
      amount: paymentTermsCounts[terms].amount,
    }))

    return {
      totalOrders,
      totalAmount,
      averageOrderValue,
      statusData,
      confirmationData,
      topVendors,
      orderTimeline,
      ordersByPaymentTerms,
    }
  }

  // Process vendor data for analytics
  const processVendorData = () => {
    if (!vendors || vendors.length === 0) {
      return {
        totalVendors: 0,
        totalProducts: 0,
        averageProductsPerVendor: 0,
        vendorsByCity: [],
        productDistribution: [],
        vendorRatings: [],
        activeVendors: 0,
      }
    }

    // Calculate basic metrics
    const totalVendors = vendors.length
    const activeVendors = vendors.filter((v) => v.isActive).length
    const totalProducts = vendors.reduce((sum, vendor) => sum + (vendor.productList?.length || 0), 0)
    const averageProductsPerVendor = totalProducts / totalVendors

    // Group vendors by city
    const cityCounts = vendors.reduce((acc, vendor) => {
      const city = vendor.city || "Unknown"
      if (!acc[city]) {
        acc[city] = 0
      }
      acc[city] += 1
      return acc
    }, {})

    const vendorsByCity = Object.keys(cityCounts).map((city) => ({
      name: city,
      value: cityCounts[city],
    }))

    // Create product distribution data
    const productDistribution = vendors
      .map((vendor) => ({
        name: vendor.vendorName,
        productCount: vendor.productList?.length || 0,
        totalValue: vendor.productList?.reduce((sum, product) => sum + product.price * product.quantity, 0) || 0,
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10) // Top 10 vendors by product value

    // Group vendors by rating
    const ratingCounts = vendors.reduce((acc, vendor) => {
      const rating = vendor.rating || 0
      if (!acc[rating]) {
        acc[rating] = 0
      }
      acc[rating] += 1
      return acc
    }, {})

    const vendorRatings = Object.keys(ratingCounts)
      .map((rating) => ({
        rating: Number.parseInt(rating),
        count: ratingCounts[rating],
      }))
      .sort((a, b) => a.rating - b.rating)

    return {
      totalVendors,
      activeVendors,
      totalProducts,
      averageProductsPerVendor,
      vendorsByCity,
      productDistribution,
      vendorRatings,
    }
  }

  // Process menu and inventory data for analytics
  const processMenuAndInventoryData = () => {
    if (
      (!finishedGoods || finishedGoods.length === 0) &&
      (!menuCategories || menuCategories.length === 0) &&
      (!bomData || bomData.length === 0)
    ) {
      return {
        totalCategories: 0,
        totalProducts: 0,
        totalStock: 0,
        averagePrice: 0,
        categoryDistribution: [],
        stockDistribution: [],
        priceRanges: [],
        rawMaterialsUsage: [],
        lowStockItems: [],
      }
    }

    // Calculate basic metrics
    const totalCategories = menuCategories?.length || 0
    const totalProducts = finishedGoods?.length || 0
    const totalStock = finishedGoods?.reduce((sum, product) => sum + (product.stock || 0), 0) || 0
    const totalPrice = finishedGoods?.reduce((sum, product) => sum + (product.price || 0), 0) || 0
    const averagePrice = totalProducts > 0 ? totalPrice / totalProducts : 0

    // Group products by category
    const categoryMap = {}
    if (menuCategories) {
      menuCategories.forEach((cat) => {
        categoryMap[cat._id] = cat.name || "General Products"
      })
    }

    const categoryCounts = {}
    if (finishedGoods) {
      finishedGoods.forEach((product) => {
        const categoryId = product.category
        const categoryName = categoryId ? categoryMap[categoryId] || "Food & Beverages" : "Uncategorized"

        if (!categoryCounts[categoryName]) {
          categoryCounts[categoryName] = {
            count: 0,
            stock: 0,
            value: 0,
          }
        }

        categoryCounts[categoryName].count += 1
        categoryCounts[categoryName].stock += product.stock || 0
        categoryCounts[categoryName].value += (product.price || 0) * (product.stock || 0)
      })
    }

    const categoryDistribution = Object.keys(categoryCounts).map((category) => ({
      name: category,
      count: categoryCounts[category].count,
      stock: categoryCounts[category].stock,
      value: categoryCounts[category].value,
    }))

    // Create stock distribution data
    const stockDistribution = finishedGoods
      ? finishedGoods
          .filter((product) => product.stock > 0)
          .map((product) => ({
            name: product.name,
            stock: product.stock,
            value: (product.price || 0) * (product.stock || 0),
          }))
          .sort((a, b) => b.stock - a.stock)
          .slice(0, 10) // Top 10 products by stock
      : []

    // Group products by price range
    const priceRanges = {
      "0-10": 0,
      "11-50": 0,
      "51-100": 0,
      "101-500": 0,
      "501+": 0,
    }

    if (finishedGoods) {
      finishedGoods.forEach((product) => {
        const price = product.price || 0

        if (price <= 10) priceRanges["0-10"]++
        else if (price <= 50) priceRanges["11-50"]++
        else if (price <= 100) priceRanges["51-100"]++
        else if (price <= 500) priceRanges["101-500"]++
        else priceRanges["501+"]++
      })
    }

    const priceRangeData = Object.keys(priceRanges).map((range) => ({
      name: range,
      value: priceRanges[range],
    }))

    // Analyze raw materials usage
    const rawMaterialsUsage = {}

    if (finishedGoods) {
      finishedGoods.forEach((product) => {
        if (product.rawIngredients && product.rawIngredients.length > 0) {
          product.rawIngredients.forEach((ingredient) => {
            const rawId = ingredient.RawID

            if (!rawMaterialsUsage[rawId]) {
              rawMaterialsUsage[rawId] = {
                id: rawId,
                name: ingredient.Name,
                totalUsage: 0,
                productCount: 0,
                unit: ingredient.UnitMeasure,
              }
            }

            rawMaterialsUsage[rawId].totalUsage += ingredient.RawConsume
            rawMaterialsUsage[rawId].productCount += 1
          })
        }
      })
    }

    const rawMaterialsData = Object.values(rawMaterialsUsage)
      .sort((a, b) => b.totalUsage - a.totalUsage)
      .slice(0, 10) // Top 10 raw materials by usage

    // Find low stock items
    const lowStockItems = finishedGoods
      ? finishedGoods
          .filter((product) => (product.stock || 0) < 10)
          .map((product) => ({
            name: product.name || "Unknown",
            stock: product.stock || 0,
            price: product.price || 0,
            value: (product.price || 0) * (product.stock || 0),
            category: product.category ? categoryMap[product.category] || "Unknown" : "Uncategorized",
          }))
          .sort((a, b) => a.stock - b.stock)
      : []

    return {
      totalCategories,
      totalStock,
      averagePrice,
      categoryDistribution,
      stockDistribution,
      priceRangeData,
      rawMaterialsData,
      lowStockItems,
    }
  }

  const {
    dailyData,
    paymentMethodData,
    totalSales,
    avgTransactionValue,
    totalItems,
    itemsPerTransaction,
    salesByHour,
    topSellingProducts,
    salesGrowth,
  } = processTransactionData()

  const { statusSummary, authorityTypeCounts, locationData, activityTimeline } = processPOSData()

  const { activeBanks, inactiveBanks, bankStatusData, creationTimeline, banksByCity } = processBankData()

  const {
    totalOrders,
    totalAmount,
    averageOrderValue,
    statusData,
    confirmationData,
    topVendors,
    orderTimeline,
    ordersByPaymentTerms,
  } = processPurchaseOrderData()

  const {
    totalVendors,
    activeVendors,
    totalProducts,
    averageProductsPerVendor,
    vendorsByCity,
    productDistribution,
    vendorRatings,
  } = processVendorData()

  const {
    totalCategories,
    totalStock,
    averagePrice,
    categoryDistribution,
    stockDistribution,
    priceRangeData,
    rawMaterialsData,
    lowStockItems,
  } = processMenuAndInventoryData()

  const handleExportPDF = async () => {
    try {
      const element = document.getElementById("analytics-dashboard")
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 30

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save("analytics-report.pdf")

      setSnackbar({
        open: true,
        message: "Report exported to PDF successfully",
        severity: "success",
      })
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      setSnackbar({
        open: true,
        message: "Failed to export report to PDF",
        severity: "error",
      })
    }
  }

  const handlePrint = () => {
    try {
      const element = document.getElementById("analytics-dashboard")
      const originalContents = document.body.innerHTML
      const printContents = element.innerHTML

      document.body.innerHTML = printContents
      window.print()
      document.body.innerHTML = originalContents

      setSnackbar({
        open: true,
        message: "Printing initiated",
        severity: "success",
      })
    } catch (error) {
      console.error("Error printing:", error)
      setSnackbar({
        open: true,
        message: "Failed to print report",
        severity: "error",
      })
    }
  }

  const handleShare = async () => {
    try {
      const element = document.getElementById("analytics-dashboard")
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const blob = await new Promise((resolve) => canvas.toBlob(resolve))
      const file = new File([blob], "analytics-report.png", { type: "image/png" })

      if (navigator.share) {
        await navigator.share({
          title: "Analytics Report",
          text: "Check out this analytics report",
          files: [file],
        })

        setSnackbar({
          open: true,
          message: "Report shared successfully",
          severity: "success",
        })
      } else {
        throw new Error("Web Share API not supported")
      }
    } catch (error) {
      console.error("Error sharing:", error)
      setSnackbar({
        open: true,
        message: "Failed to share report",
        severity: "error",
      })
    }
  }

  const handleDownloadData = () => {
    try {
      const data = {
        transactions: transactions,
        posConfigs: posConfigs,
        banks: banks,
        purchaseOrders: purchaseOrders,
        vendors: vendors,
        menuCategories: menuCategories,
        finishedGoods: finishedGoods,
        bomData: bomData,
      }

      const worksheet = XLSX.utils.json_to_sheet(
        Object.entries(data).map(([key, value]) => ({
          category: key,
          count: value.length,
          lastUpdated: new Date().toISOString(),
        })),
      )

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics Summary")

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      const dataBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      saveAs(dataBlob, "analytics-data.xlsx")

      setSnackbar({
        open: true,
        message: "Data downloaded successfully",
        severity: "success",
      })
    } catch (error) {
      console.error("Error downloading data:", error)
      setSnackbar({
        open: true,
        message: "Failed to download data",
        severity: "error",
      })
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Common chart actions
  const commonChartActions = (
    <>
      <Tooltip title="Download Data">
        <IconButton size="small" onClick={handleDownloadData}>
          <FileDownload fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Print Chart">
        <IconButton size="small" onClick={handlePrint}>
          <Print fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Share">
        <IconButton size="small" onClick={handleShare}>
          <Share fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  )

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />
  }

  return (
    <ThemeProvider theme={customTheme}>
      <MainContentWrapper>
        <Box
          id="analytics-dashboard"
          sx={{
            width: "100%",
            overflow: "auto",
            bgcolor: "background.default",
            minHeight: "100vh",
            py: 3,
            px: 3,
          }}
        >
          <Paper elevation={3} sx={{ width: "100%", borderRadius: 4, overflow: "hidden" }}>
            {/* Dashboard Header */}
            <Box sx={{ p: 3, borderBottom: "1px solid rgba(0, 0, 0, 0.05)" }}>
              <DashboardHeader
                title="Reports and Analytics"
                subtitle="Comprehensive insights into your business performance"
                dateRange={dateRange}
                onDateRangeChange={() => {}}
                actions={
                  <>
                    <Button variant="outlined" color="primary" startIcon={<Download />} onClick={handleExportPDF}>
                      Export
                    </Button>
                    <Button variant="contained" color="primary" startIcon={<Refresh />} onClick={handleRetry}>
                      Refresh
                    </Button>
                  </>
                }
              />
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="analytics tabs"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  px: 3,
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#f15a22",
                    height: 3,
                  },
                }}
              >
                <Tab icon={<ShoppingCart />} iconPosition="start" label="Retail & Commerce" {...a11yProps(0)} />
                <Tab icon={<AccountBalance />} iconPosition="start" label="Finance" {...a11yProps(1)} />
                <Tab icon={<Inventory />} iconPosition="start" label="Inventory" {...a11yProps(2)} />
                <Tab icon={<LocalShipping />} iconPosition="start" label="Procurement" {...a11yProps(3)} />
              </Tabs>
            </Box>

            {/* Retail and Commerce Tab */}
            <TabPanel value={value} index={0}>
              <Box sx={{ px: 4, py: 3 }}>
                <SectionHeader
                  title="Retail and Commerce Analytics"
                  subtitle="Track sales performance, customer behavior, and transaction metrics"
                  icon={<ShoppingCart />}
                  actions={
                    <Button variant="outlined" color="primary" startIcon={<Download />}>
                      Export Report
                    </Button>
                  }
                />

                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatisticCard
                      title="Total Sales"
                      value={`$${totalSales.toFixed(2)}`}
                      change={salesGrowth.toFixed(1)}
                      icon={<AttachMoney sx={{ color: "#fff" }} />}
                      color="primary"
                      footer={
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#fff",
                            opacity: 0.8,
                            textAlign: "center",
                          }}
                        >
                          {transactions.length} transactions
                        </Typography>
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Average Transaction"
                      value={`$${avgTransactionValue.toFixed(2)}`}
                      change={3.7}
                      icon={<TrendingUp />}
                      color="success"
                      subtitle={`${itemsPerTransaction.toFixed(1)} items per transaction`}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="POS Terminals"
                      value={statusSummary.total}
                      change={-2.1}
                      icon={<PointOfSale />}
                      color="warning"
                      subtitle={`${statusSummary.online} online, ${statusSummary.offline} offline`}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Total Items Sold"
                      value={totalItems}
                      change={5.2}
                      icon={<Inventory />}
                      color="info"
                      subtitle="Across all transactions"
                    />
                  </Grid>
                </Grid>

                <Divider />

                {/* Transaction Performance */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, display: "flex", alignItems: "center" }}>
                  <TrendingUp sx={{ mr: 1, color: theme.palette.primary.main }} />
                  Transaction Performance
                </Typography>

                {dailyData.length === 0 ? (
                  <EmptyState message="No transaction data available to display." />
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={8}>
                      <EnhancedAreaChart
                        title="Daily Sales Revenue"
                        subtitle="Track your daily sales performance over time"
                        data={dailyData}
                        xKey="date"
                        yKeys={["total"]}
                        height={350}
                        formatter={(value) => `$${value.toFixed(2)}`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <EnhancedDonutChart
                        title="Payment Methods"
                        subtitle="Distribution of transactions by payment type"
                        data={paymentMethodData}
                        dataKey="count"
                        nameKey="name"
                        height={350}
                        formatter={(value) => `${value} transactions`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <EnhancedBarChart
                        title="Hourly Sales Distribution"
                        subtitle="Sales volume by hour of day"
                        data={salesByHour}
                        xKey="hour"
                        yKeys={["sales", "count"]}
                        height={350}
                        formatter={(value, name) =>
                          name === "sales" ? `$${value.toFixed(2)}` : `${value} transactions`
                        }
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <EnhancedComposedChart
                        title="Transaction Metrics"
                        subtitle="Count, revenue, and items sold per day"
                        data={dailyData}
                        xKey="date"
                        barKeys={["count"]}
                        lineKeys={["total"]}
                        areaKeys={["items"]}
                        height={350}
                        formatter={(value, name) => {
                          if (name === "total") return `$${value.toFixed(2)}`
                          if (name === "count") return `${value} transactions`
                          return `${value} items`
                        }}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <EnhancedTable
                        title="Top Selling Products"
                        subtitle="Products generating the most revenue"
                        columns={[
                          { key: "name", label: "Product Name", defaultValue: "Unnamed Product" },
                          {
                            key: "quantity",
                            label: "Quantity Sold",
                            align: "right",
                            defaultValue: "0",
                          },
                          {
                            key: "revenue",
                            label: "Revenue",
                            align: "right",
                            render: (value) => `$${(value || 0).toFixed(2)}`,
                          },
                          {
                            key: "avgPrice",
                            label: "Avg. Price",
                            align: "right",
                            render: (_, row) => {
                              const avg = row.quantity > 0 ? row.revenue / row.quantity : 0
                              return `$${avg.toFixed(2)}`
                            },
                          },
                          {
                            key: "percentOfTotal",
                            label: "% of Total Sales",
                            align: "right",
                            render: (_, row) => {
                              const percent = totalSales > 0 ? (row.revenue / totalSales) * 100 : 0
                              return (
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Box sx={{ width: "60%", mr: 1 }}>
                                    <LinearProgress
                                      variant="determinate"
                                      value={percent}
                                      sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                        "& .MuiLinearProgress-bar": {
                                          backgroundColor: theme.palette.primary.main,
                                        },
                                      }}
                                    />
                                  </Box>
                                  <Typography variant="body2">{percent.toFixed(1)}%</Typography>
                                </Box>
                              )
                            },
                          },
                        ]}
                        data={topSellingProducts}
                        height={400}
                        pagination={true}
                        actions={commonChartActions}
                      />
                    </Grid>
                  </Grid>
                )}

                <Divider />

                {/* POS Machine Status */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, display: "flex", alignItems: "center" }}>
                  <PointOfSale sx={{ mr: 1, color: theme.palette.primary.main }} />
                  POS Terminal Status
                </Typography>

                {posConfigs.length === 0 ? (
                  <EmptyState message="No POS configuration data available to display." />
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Card sx={{ p: 3, height: "100%" }}>
                        <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600 }}>
                          Terminal Status Overview
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-around",
                            mb: 3,
                          }}
                        >
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="h4"
                              sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 700,
                              }}
                            >
                              {statusSummary.total}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
                              Total Terminals
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="h4"
                              sx={{
                                color: theme.palette.success.main,
                                fontWeight: 700,
                              }}
                            >
                              {statusSummary.online}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
                              Online
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="h4"
                              sx={{
                                color: theme.palette.error.main,
                                fontWeight: 700,
                              }}
                            >
                              {statusSummary.offline}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
                              Offline
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 1,
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>Online Rate</span>
                            <span>{((statusSummary.online / statusSummary.total) * 100).toFixed(1)}%</span>
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(statusSummary.online / statusSummary.total) * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: alpha(theme.palette.error.main, 0.2),
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: theme.palette.success.main,
                              },
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 1,
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>Offline Rate</span>
                            <span>{((statusSummary.offline / statusSummary.total) * 100).toFixed(1)}%</span>
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(statusSummary.offline / statusSummary.total) * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: alpha(theme.palette.success.main, 0.2),
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: theme.palette.error.main,
                              },
                            }}
                          />
                        </Box>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <EnhancedBarChart
                        title="POS Terminals by Authority Type"
                        subtitle="Distribution of terminals by authority level and status"
                        data={authorityTypeCounts}
                        xKey="name"
                        yKeys={["online", "offline"]}
                        stacked={true}
                        height={350}
                        formatter={(value, name) => `${value} terminals`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <EnhancedBarChart
                        title="POS Terminals by Location"
                        subtitle="Distribution of terminals by store location"
                        data={locationData}
                        xKey="name"
                        yKeys={["online", "offline"]}
                        stacked={true}
                        height={350}
                        formatter={(value, name) => `${value} terminals`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <EnhancedTable
                        title="Recent Terminal Activity"
                        subtitle="Latest status changes and activities"
                        columns={[
                          { key: "id", label: "Terminal ID", defaultValue: "T-Unknown" },
                          {
                            key: "date",
                            label: "Last Active",
                            render: (value) => {
                              try {
                                const date = new Date(value)
                                return isNaN(date.getTime())
                                  ? "Today, " + new Date().toLocaleTimeString()
                                  : date.toLocaleString()
                              } catch (e) {
                                return "Today, " + new Date().toLocaleTimeString()
                              }
                            },
                          },
                          {
                            key: "status",
                            label: "Status",
                            render: (value) => (
                              <StatusBadge status={(value || "offline").toLowerCase()} text={value || "Offline"} />
                            ),
                          },
                        ]}
                        data={activityTimeline}
                        height={350}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <EnhancedTable
                        title="POS Terminal Details"
                        subtitle="Complete information about all terminals"
                        columns={[
                          { key: "PosID", label: "Terminal ID", defaultValue: "T-Unknown" },
                          { key: "RegistrationNumber", label: "Registration", defaultValue: "Unregistered" },
                          { key: "Location", label: "Location", defaultValue: "Main Store" },
                          { key: "AuthorityType", label: "Authority", defaultValue: "Standard" },
                          {
                            key: "POSStatus",
                            label: "Status",
                            render: (value) => (
                              <StatusBadge status={(value || "offline").toLowerCase()} text={value || "Offline"} />
                            ),
                          },
                          {
                            key: "LastActive",
                            label: "Last Active",
                            render: (value) => {
                              try {
                                const date = new Date(value)
                                return isNaN(date.getTime())
                                  ? "Today, " + new Date().toLocaleTimeString()
                                  : date.toLocaleString()
                              } catch (e) {
                                return "Today, " + new Date().toLocaleTimeString()
                              }
                            },
                          },
                          {
                            key: "TimeBound",
                            label: "Valid Period",
                            render: (value) => {
                              if (!value || !value.Start || !value.End) {
                                const today = new Date()
                                const nextYear = new Date()
                                nextYear.setFullYear(today.getFullYear() + 1)
                                return (
                                  <Typography variant="body2">
                                    {today.toLocaleDateString()} - {nextYear.toLocaleDateString()}
                                  </Typography>
                                )
                              }
                              return (
                                <Typography variant="body2">
                                  {new Date(value.Start).toLocaleDateString()} -{" "}
                                  {new Date(value.End).toLocaleDateString()}
                                </Typography>
                              )
                            },
                          },
                        ]}
                        data={posConfigs}
                        height={400}
                        pagination={true}
                        actions={commonChartActions}
                      />
                    </Grid>
                  </Grid>
                )}
              </Box>
            </TabPanel>

            {/* Finance Tab */}
            <TabPanel value={value} index={1}>
              <Box sx={{ px: 4, py: 3 }}>
                <SectionHeader
                  title="Financial Analytics"
                  subtitle="Monitor revenue, expenses, and banking relationships"
                  icon={<AccountBalance />}
                  actions={
                    <Button variant="outlined" color="primary" startIcon={<Download />}>
                      Export Report
                    </Button>
                  }
                />

                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatisticCard
                      title="Revenue"
                      value={`$${totalSales.toFixed(2)}`}
                      change={salesGrowth.toFixed(1)}
                      icon={<AttachMoney sx={{ color: "#fff" }} />}
                      color="primary"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <StatisticCard
                      title="Expenses"
                      value={`$${totalAmount.toFixed(2)}`}
                      change={2.3}
                      icon={<ReceiptLong sx={{ color: "#fff" }} />}
                      color="error"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Net Profit"
                      value={`$${(totalSales - totalAmount).toFixed(2)}`}
                      change={4.7}
                      icon={<TrendingUp />}
                      color="success"
                      subtitle={`${(((totalSales - totalAmount) / totalSales) * 100).toFixed(1)}% margin`}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Banking Partners"
                      value={banks.length}
                      change={0}
                      icon={<AccountBalance />}
                      color="info"
                      subtitle={`${activeBanks} active, ${inactiveBanks} inactive`}
                    />
                  </Grid>
                </Grid>

                <Divider />

                {/* Revenue vs Expenses */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, display: "flex", alignItems: "center" }}>
                  <CompareArrows sx={{ mr: 1, color: theme.palette.primary.main }} />
                  Revenue vs Expenses
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} lg={8}>
                    <EnhancedComposedChart
                      title="Monthly Financial Overview"
                      subtitle="Compare revenue and expenses over time"
                      data={orderTimeline.map((month) => ({
                        ...month,
                        revenue: month.amount * 1.2, // Simulated revenue for demo
                        profit: month.amount * 1.2 - month.amount,
                      }))}
                      xKey="monthYear"
                      barKeys={["amount", "revenue"]}
                      lineKeys={["profit"]}
                      height={400}
                      formatter={(value, name) => {
                        if (name === "amount") return `$${value.toFixed(2)} (Expenses)`
                        if (name === "revenue") return `$${value.toFixed(2)} (Revenue)`
                        return `$${value.toFixed(2)} (Profit)`
                      }}
                      actions={commonChartActions}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={4}>
                    <Card sx={{ p: 3, height: "100%" }}>
                      <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600 }}>
                        Financial Health Indicators
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <KPIIndicator
                          title="Profit Margin"
                          value={(((totalSales - totalAmount) / totalSales) * 100).toFixed(1)}
                          unit="%"
                          target={25}
                          status={((totalSales - totalAmount) / totalSales) * 100 > 20 ? "success" : "warning"}
                          icon={<Percent />}
                        />

                        <KPIIndicator
                          title="Revenue Growth"
                          value={salesGrowth.toFixed(1)}
                          unit="%"
                          target={10}
                          status={salesGrowth > 5 ? "success" : salesGrowth > 0 ? "warning" : "error"}
                          icon={<TrendingUp />}
                        />

                        <KPIIndicator
                          title="Expense Ratio"
                          value={((totalAmount / totalSales) * 100).toFixed(1)}
                          unit="%"
                          target={70}
                          status={(totalAmount / totalSales) * 100 < 75 ? "success" : "warning"}
                          icon={<ReceiptLong />}
                        />

                        <KPIIndicator
                          title="Average Transaction"
                          value={avgTransactionValue.toFixed(2)}
                          unit="$"
                          target={100}
                          status={avgTransactionValue > 80 ? "success" : "warning"}
                          icon={<ShoppingCart />}
                        />
                      </Box>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <EnhancedPieChart
                      title="Revenue Distribution"
                      subtitle="Revenue breakdown by payment method"
                      data={paymentMethodData.map((method) => ({
                        name: method.name,
                        value: method.total,
                      }))}
                      dataKey="value"
                      nameKey="name"
                      height={350}
                      formatter={(value) => `$${value.toFixed(2)}`}
                      actions={commonChartActions}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <EnhancedBarChart
                      title="Expense Categories"
                      subtitle="Breakdown of expenses by category"
                      data={[
                        { name: "Inventory", value: totalAmount * 0.6 },
                        { name: "Operations", value: totalAmount * 0.2 },
                        { name: "Marketing", value: totalAmount * 0.1 },
                        { name: "Admin", value: totalAmount * 0.05 },
                        { name: "Other", value: totalAmount * 0.05 },
                      ]}
                      xKey="name"
                      yKeys={["value"]}
                      height={350}
                      formatter={(value) => `$${value.toFixed(2)}`}
                      actions={commonChartActions}
                    />
                  </Grid>
                </Grid>

                <Divider />

                {/* Bank Analytics */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, display: "flex", alignItems: "center" }}>
                  <AccountBalance sx={{ mr: 1, color: theme.palette.primary.main }} />
                  Banking Relationships
                </Typography>

                {banks.length === 0 ? (
                  <EmptyState message="No bank data available to display." />
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={5}>
                      <EnhancedDonutChart
                        title="Bank Status Distribution"
                        subtitle="Active vs. inactive banking relationships"
                        data={bankStatusData}
                        dataKey="value"
                        nameKey="name"
                        height={350}
                        formatter={(value) => `${value} banks`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} md={7}>
                      <EnhancedAreaChart
                        title="Bank Relationship Timeline"
                        subtitle="Growth of banking relationships over time"
                        data={creationTimeline}
                        xKey="monthYear"
                        yKeys={["active", "inactive"]}
                        stacked={true}
                        height={350}
                        formatter={(value) => `${value} banks`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <EnhancedBarChart
                        title="Banks by City"
                        subtitle="Geographic distribution of banking relationships"
                        data={banksByCity}
                        xKey="name"
                        yKeys={["active", "inactive"]}
                        stacked={true}
                        height={350}
                        formatter={(value) => `${value} banks`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <EnhancedRadarChart
                        title="Banking Services Utilization"
                        subtitle="Usage of different banking services"
                        data={[
                          { name: "Checking", value: 90 },
                          { name: "Savings", value: 70 },
                          { name: "Credit", value: 85 },
                          { name: "Loans", value: 60 },
                          { name: "Investments", value: 40 },
                          { name: "Merchant Services", value: 75 },
                        ]}
                        dataKey="Banking Services"
                        height={350}
                        formatter={(value) => `${value}%`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <EnhancedTable
                        title="Banking Partners"
                        subtitle="Complete list of banking relationships"
                        columns={[
                          { key: "name", label: "Bank Name" },
                          { key: "code", label: "Code" },
                          {
                            key: "city",
                            label: "City",
                          },
                          { key: "address", label: "Address" },
                          {
                            key: "isActive",
                            label: "Status",
                            render: (value) => (
                              <StatusBadge
                                status={value ? "active" : "inactive"}
                                text={value ? "Active" : "Inactive"}
                              />
                            ),
                          },
                          {
                            key: "createdAt",
                            label: "Relationship Since",
                            render: (value) => new Date(value).toLocaleDateString(),
                          },
                          {
                            key: "updatedAt",
                            label: "Last Updated",
                            render: (value) => new Date(value).toLocaleDateString(),
                          },
                        ]}
                        data={banks}
                        height={400}
                        pagination={true}
                        actions={commonChartActions}
                      />
                    </Grid>
                  </Grid>
                )}
              </Box>
            </TabPanel>

            {/* Inventory Tab */}
            <TabPanel value={value} index={2}>
              <Box sx={{ px: 4, py: 3 }}>
                <SectionHeader
                  title="Inventory Analytics"
                  subtitle="Track stock levels, product performance, and raw materials"
                  icon={<Inventory />}
                  actions={
                    <Button variant="outlined" color="primary" startIcon={<Download />}>
                      Export Report
                    </Button>
                  }
                />

                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatisticCard
                      title="Total Products"
                      value={finishedGoods?.length || 0}
                      change={5.2}
                      icon={<Inventory sx={{ color: "#fff" }} />}
                      color="primary"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Total Stock"
                      value={totalStock}
                      change={-2.1}
                      icon={<Inventory />}
                      color="warning"
                      subtitle="Units in inventory"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Inventory Value"
                      value={`$${(totalStock * averagePrice).toFixed(2)}`}
                      change={3.7}
                      icon={<AttachMoney />}
                      color="success"
                      subtitle={`Avg. price: $${averagePrice.toFixed(2)}`}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Low Stock Items"
                      value={lowStockItems.length}
                      change={12.5}
                      icon={<Warning />}
                      color="error"
                      subtitle="Items requiring attention"
                    />
                  </Grid>
                </Grid>

                <Divider />

                {/* Product Analytics */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, display: "flex", alignItems: "center" }}>
                  <Restaurant sx={{ mr: 1, color: theme.palette.primary.main }} />
                  Product Analytics
                </Typography>

                {finishedGoods?.length === 0 ? (
                  <EmptyState message="No product data available to display." />
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <EnhancedPieChart
                        title="Products by Category"
                        subtitle="Distribution of products across categories"
                        data={categoryDistribution}
                        dataKey="count"
                        nameKey="name"
                        height={350}
                        formatter={(value) => `${value} products`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <EnhancedBarChart
                        title="Price Distribution"
                        subtitle="Products grouped by price range"
                        data={priceRangeData}
                        xKey="name"
                        yKeys={["value"]}
                        height={350}
                        formatter={(value) => `${value} products`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} md={7}>
                      <EnhancedBarChart
                        title="Top Products by Stock Level"
                        subtitle="Products with highest inventory levels"
                        data={stockDistribution}
                        xKey="name"
                        yKeys={["stock", "value"]}
                        height={400}
                        formatter={(value, name) => (name === "stock" ? `${value} units` : `$${value.toFixed(2)}`)}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <EnhancedTreemap
                        title="Inventory Value by Category"
                        subtitle="Visual representation of inventory value distribution"
                        data={categoryDistribution}
                        dataKey="value"
                        nameKey="name"
                        height={400}
                        formatter={(value) => `$${value.toFixed(2)}`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Card sx={{ p: 0, overflow: "hidden" }}>
                        <Box
                          sx={{
                            p: 3,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              Low Stock Alert
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
                              Products that need to be restocked soon
                            </Typography>
                          </Box>
                          <Badge badgeContent={lowStockItems.length} color="error">
                            <Warning color="error" />
                          </Badge>
                        </Box>
                        <TableContainer sx={{ maxHeight: 350 }}>
                          <Table stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell align="right">Current Stock</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Value</TableCell>
                                <TableCell align="right">Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {lowStockItems.map((item, index) => (
                                <TableRow
                                  key={index}
                                  sx={{
                                    "&:hover": {
                                      backgroundColor: alpha("#f15a22", 0.05),
                                    },
                                    backgroundColor: item.stock <= 3 ? alpha("#e74c3c", 0.05) : "inherit",
                                  }}
                                >
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.category}</TableCell>
                                  <TableCell align="right">{item.stock}</TableCell>
                                  <TableCell align="right">${(item.price || 0).toFixed(2)}</TableCell>
                                  <TableCell align="right">${(item.value || 0).toFixed(2)}</TableCell>
                                  <TableCell align="right">
                                    <Chip
                                      size="small"
                                      label={item.stock <= 3 ? "Critical" : "Low"}
                                      color={item.stock <= 3 ? "error" : "warning"}
                                      sx={{ fontWeight: 500 }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Box
                          sx={{
                            p: 2,
                            borderTop: "1px solid rgba(0, 0, 0, 0.05)",
                            textAlign: "right",
                          }}
                        >
                          <Button variant="contained" color="primary" size="small" startIcon={<Refresh />}>
                            Generate Purchase Orders
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                )}

                <Divider />

                {/* Raw Materials Analytics */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, display: "flex", alignItems: "center" }}>
                  <Inventory sx={{ mr: 1, color: theme.palette.primary.main }} />
                  Raw Materials Analytics
                </Typography>

                {bomData?.length === 0 ? (
                  <EmptyState message="No BOM data available to display." />
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <EnhancedBarChart
                        title="Top Raw Materials by Usage"
                        subtitle="Most frequently used ingredients"
                        data={rawMaterialsData}
                        xKey="name"
                        yKeys={["totalUsage", "productCount"]}
                        height={400}
                        formatter={(value, name) =>
                          name === "totalUsage"
                            ? `${value} ${rawMaterialsData[0]?.unit || "units"}`
                            : `${value} products`
                        }
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <EnhancedScatterChart
                        title="Raw Materials Analysis"
                        subtitle="Usage frequency vs. product count"
                        data={rawMaterialsData}
                        xKey="totalUsage"
                        yKey="productCount"
                        zKey="id"
                        height={400}
                        formatter={(value, name) =>
                          name === "totalUsage"
                            ? `${value} ${rawMaterialsData[0]?.unit || "units"}`
                            : `${value} products`
                        }
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <EnhancedTable
                        title="Raw Materials Inventory"
                        subtitle="Complete list of raw materials and their usage"
                        columns={[
                          { key: "RawID", label: "ID" },
                          {
                            key: "Name",
                            label: "Material Name",
                            render: (value, row) => value || row.name || "Unknown Material",
                          },
                          {
                            key: "Quantity",
                            label: "Available Quantity",
                            align: "right",
                            render: (value, row) => `${value || 0} ${row.UnitMeasure || ""}`,
                          },
                          {
                            key: "UnitCost",
                            label: "Unit Cost",
                            align: "right",
                            render: (value) => `$${(value || 0).toFixed(2)}`,
                          },
                          {
                            key: "TotalValue",
                            label: "Total Value",
                            align: "right",
                            render: (_, row) => `$${((row.Quantity || 0) * (row.UnitCost || 0)).toFixed(2)}`,
                          },
                          {
                            key: "MinimumStock",
                            label: "Min. Stock",
                            align: "right",
                          },
                          {
                            key: "StockStatus",
                            label: "Status",
                            render: (_, row) => (
                              <StatusBadge
                                status={
                                  (row.Quantity || 0) <= (row.MinimumStock || 0)
                                    ? "error"
                                    : (row.Quantity || 0) <= (row.MinimumStock || 0) * 1.5
                                      ? "warning"
                                      : "success"
                                }
                                text={
                                  (row.Quantity || 0) <= (row.MinimumStock || 0)
                                    ? "Restock Required"
                                    : (row.Quantity || 0) <= (row.MinimumStock || 0) * 1.5
                                      ? "Low Stock"
                                      : "Adequate"
                                }
                              />
                            ),
                          },
                          {
                            key: "LastRestocked",
                            label: "Last Restocked",
                            render: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
                          },
                        ]}
                        data={bomData}
                        height={400}
                        pagination={true}
                        actions={commonChartActions}
                      />
                    </Grid>
                  </Grid>
                )}
              </Box>
            </TabPanel>

            {/* Procurement Tab */}
            <TabPanel value={value} index={3}>
              <Box sx={{ px: 4, py: 3 }}>
                <SectionHeader
                  title="Procurement Analytics"
                  subtitle="Analyze purchase orders, vendor relationships, and supply chain metrics"
                  icon={<LocalShipping />}
                  actions={
                    <Button variant="outlined" color="primary" startIcon={<Download />}>
                      Export Report
                    </Button>
                  }
                />

                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatisticCard
                      title="Total Spend"
                      value={`$${totalAmount.toFixed(2)}`}
                      change={3.7}
                      icon={<AttachMoney sx={{ color: "#fff" }} />}
                      color="primary"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Purchase Orders"
                      value={totalOrders}
                      change={8.4}
                      icon={<ReceiptLong />}
                      color="info"
                      subtitle={`Avg. value: $${averageOrderValue.toFixed(2)}`}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Vendors"
                      value={totalVendors}
                      change={2.1}
                      icon={<LocalShipping />}
                      color="success"
                      subtitle={`${activeVendors} active, ${totalVendors - activeVendors} inactive`}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Products Sourced"
                      value={totalProducts}
                      change={5.2}
                      icon={<Inventory />}
                      color="warning"
                      subtitle={`${averageProductsPerVendor.toFixed(1)} products per vendor`}
                    />
                  </Grid>
                </Grid>

                <Divider />

                {/* Purchase Order Analytics */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, display: "flex", alignItems: "center" }}>
                  <ReceiptLong sx={{ mr: 1, color: theme.palette.primary.main }} />
                  Purchase Order Analytics
                </Typography>

                {purchaseOrders.length === 0 ? (
                  <EmptyState message="No purchase order data available to display." />
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <EnhancedDonutChart
                        title="Purchase Orders by Status"
                        subtitle="Distribution of orders by current status"
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        height={350}
                        formatter={(value) => `${value} orders`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <EnhancedDonutChart
                        title="Purchase Orders by Confirmation"
                        subtitle="Distribution of orders by confirmation status"
                        data={confirmationData}
                        dataKey="value"
                        nameKey="name"
                        height={350}
                        formatter={(value) => `${value} orders`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} lg={8}>
                      <EnhancedComposedChart
                        title="Purchase Order Timeline"
                        subtitle="Order count and value over time"
                        data={orderTimeline}
                        xKey="monthYear"
                        barKeys={["amount"]}
                        lineKeys={["count"]}
                        height={400}
                        formatter={(value, name) => (name === "amount" ? `$${value.toFixed(2)}` : `${value} orders`)}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                      <EnhancedBarChart
                        title="Orders by Payment Terms"
                        subtitle="Distribution of orders by payment terms"
                        data={ordersByPaymentTerms}
                        xKey="name"
                        yKeys={["count"]}
                        height={400}
                        formatter={(value) => `${value} orders`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <EnhancedTable
                        title="Top Vendors by Spend"
                        subtitle="Vendors with highest procurement value"
                        columns={[
                          { key: "vendorName", label: "Vendor Name" },
                          {
                            key: "orderCount",
                            label: "Orders",
                            align: "right",
                          },
                          {
                            key: "totalAmount",
                            label: "Total Spend",
                            align: "right",
                            render: (value) => `$${value.toFixed(2)}`,
                          },
                          {
                            key: "avgOrderValue",
                            label: "Avg. Order Value",
                            align: "right",
                            render: (_, row) => `$${(row.totalAmount / row.orderCount).toFixed(2)}`,
                          },
                          {
                            key: "percentOfTotal",
                            label: "% of Total Spend",
                            align: "right",
                            render: (_, row) => {
                              const percent = (row.totalAmount / totalAmount) * 100
                              return (
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Box sx={{ width: "60%", mr: 1 }}>
                                    <LinearProgress
                                      variant="determinate"
                                      value={percent}
                                      sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                        "& .MuiLinearProgress-bar": {
                                          backgroundColor: theme.palette.primary.main,
                                        },
                                      }}
                                    />
                                  </Box>
                                  <Typography variant="body2">{percent.toFixed(1)}%</Typography>
                                </Box>
                              )
                            },
                          },
                        ]}
                        data={topVendors}
                        height={350}
                        actions={commonChartActions}
                      />
                    </Grid>
                  </Grid>
                )}

                <Divider />

                {/* Vendor Analytics */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, display: "flex", alignItems: "center" }}>
                  <LocalShipping sx={{ mr: 1, color: theme.palette.primary.main }} />
                  Vendor Analytics
                </Typography>

                {vendors.length === 0 ? (
                  <EmptyState message="No vendor data available to display." />
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <EnhancedPieChart
                        title="Vendors by City"
                        subtitle="Geographic distribution of vendors"
                        data={vendorsByCity}
                        dataKey="value"
                        nameKey="name"
                        height={350}
                        formatter={(value) => `${value} vendors`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <EnhancedBarChart
                        title="Vendor Ratings Distribution"
                        subtitle="Vendors grouped by performance rating"
                        data={vendorRatings}
                        xKey="rating"
                        yKeys={["count"]}
                        height={350}
                        formatter={(value) => `${value} vendors`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} lg={8}>
                      <EnhancedTreemap
                        title="Product Distribution by Vendor"
                        subtitle="Visual representation of product value by vendor"
                        data={productDistribution}
                        dataKey="totalValue"
                        nameKey="name"
                        height={400}
                        formatter={(value) => `$${value.toFixed(2)}`}
                        actions={commonChartActions}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                      <Card sx={{ p: 3, height: "100%" }}>
                        <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600 }}>
                          Vendor Performance Metrics
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <KPIIndicator
                            title="Active Vendor Rate"
                            value={((activeVendors / totalVendors) * 100).toFixed(1)}
                            unit="%"
                            target={90}
                            status={(activeVendors / totalVendors) * 100 > 85 ? "success" : "warning"}
                            icon={<CheckCircle />}
                          />

                          <KPIIndicator
                            title="Avg. Products per Vendor"
                            value={averageProductsPerVendor.toFixed(1)}
                            unit=""
                            target={10}
                            status={averageProductsPerVendor > 8 ? "success" : "warning"}
                            icon={<Inventory />}
                          />

                          <KPIIndicator
                            title="Avg. Vendor Rating"
                            value={(
                              vendorRatings.reduce((sum, rating) => sum + rating.rating * rating.count, 0) /
                              vendorRatings.reduce((sum, rating) => sum + rating.count, 0)
                            ).toFixed(1)}
                            unit="/5"
                            target={4}
                            status={
                              vendorRatings.reduce((sum, rating) => sum + rating.rating * rating.count, 0) /
                                vendorRatings.reduce((sum, rating) => sum + rating.count, 0) >
                              3.5
                                ? "success"
                                : "warning"
                            }
                            icon={<Star />}
                          />

                          <KPIIndicator
                            title="Vendor Concentration"
                            value={((topVendors[0]?.totalAmount / totalAmount) * 100 || 0).toFixed(1)}
                            unit="%"
                            target={30}
                            status={
                              ((topVendors[0]?.totalAmount / totalAmount) * 100 || 0) < 35 ? "success" : "warning"
                            }
                            icon={<PieChartIcon />}
                          />
                        </Box>
                      </Card>
                    </Grid>

                    <Grid item xs={12}>
                      <EnhancedTable
                        title="Vendor Details"
                        subtitle="Complete information about all vendors"
                        columns={[
                          {
                            key: "vendorName",
                            label: "Vendor Name",
                            render: (value, row) => value || row.name || "Unknown Vendor",
                          },
                          {
                            key: "city",
                            label: "City",
                            render: (value) => value || "Unknown Location",
                          },
                          {
                            key: "phone",
                            label: "Contact",
                            render: (value) => value || "No Contact Info",
                          },
                          {
                            key: "productList",
                            label: "Products",
                            align: "right",
                            render: (value) => value?.length || 0,
                          },
                          {
                            key: "totalValue",
                            label: "Inventory Value",
                            align: "right",
                            render: (_, row) =>
                              `$${(
                                row.productList?.reduce((sum, product) => sum + product.price * product.quantity, 0) ||
                                  0
                              ).toFixed(2)}`,
                          },
                          {
                            key: "rating",
                            label: "Rating",
                            align: "center",
                            render: (value) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <Star
                                      key={i}
                                      fontSize="small"
                                      sx={{
                                        color:
                                          i < value
                                            ? theme.palette.warning.main
                                            : alpha(theme.palette.warning.main, 0.3),
                                      }}
                                    />
                                  ))}
                              </Box>
                            ),
                          },
                          {
                            key: "isActive",
                            label: "Status",
                            render: (value) => (
                              <StatusBadge
                                status={value ? "active" : "inactive"}
                                text={value ? "Active" : "Inactive"}
                              />
                            ),
                          },
                        ]}
                        data={vendors}
                        height={400}
                        pagination={true}
                        actions={commonChartActions}
                      />
                    </Grid>
                  </Grid>
                )}
              </Box>
            </TabPanel>
          </Paper>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </MainContentWrapper>
    </ThemeProvider>
  )
}

export default ReportAnalytics
