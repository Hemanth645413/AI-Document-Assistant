import { Card, CardContent, Typography, Chip } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { Order } from '../types';

const STATUS_COLOR: Record<Order['status'], 'success' | 'warning' | 'default'> = {
  Paid: 'success',
  Pending: 'warning',
  Refunded: 'default',
};

const columns: GridColDef<Order>[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'customer', headerName: 'Customer', flex: 1, minWidth: 160 },
  { field: 'product', headerName: 'Product', flex: 1, minWidth: 180 },
  { field: 'category', headerName: 'Category', width: 130 },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 110,
    valueFormatter: (value: number) => `$${value.toLocaleString()}`,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color={STATUS_COLOR[params.value as Order['status']]}
        variant="outlined"
      />
    ),
  },
  { field: 'date', headerName: 'Date', width: 120 },
];

export default function OrdersTable({ orders, loading }: { orders: Order[]; loading?: boolean }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          Recent activity
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Orders
        </Typography>

        <DataGrid
          rows={orders}
          columns={columns}
          loading={loading}
          density="comfortable"
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
          }}
          pageSizeOptions={[10, 25, 50]}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'background.default',
              borderRadius: 1,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
