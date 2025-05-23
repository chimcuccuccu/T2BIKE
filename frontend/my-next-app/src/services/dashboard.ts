import axios from 'axios';

export interface AdminDashboardResponse {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    totalUsers: number;
}

export const getDashboardData = async (): Promise<AdminDashboardResponse> => {
    const response = await axios.get<AdminDashboardResponse>('http://localhost:8081/api/admin/dashboard');
    return response.data;
}; 