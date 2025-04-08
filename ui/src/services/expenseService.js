import axios from "axios";
import { API_URL } from "../config/constants";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API request functions
const fetchGroupExpenses = async ({ token, groupId }) => {
  const response = await axios.get(`${API_URL}/expenses/group/${groupId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

const fetchExpenseById = async ({ token, expenseId }) => {
  const response = await axios.get(`${API_URL}/expenses/${expenseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

const createExpense = async ({ token, expenseData }) => {
  const response = await axios.post(`${API_URL}/expenses`, expenseData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
};

const updateExpense = async ({ token, expenseId, expenseData }) => {
  const response = await axios.put(
    `${API_URL}/expenses/${expenseId}`,
    expenseData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};

const deleteExpense = async ({ token, expenseId }) => {
  const response = await axios.delete(`${API_URL}/expenses/${expenseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// TanStack Query Hooks
export function useGroupExpenses(token, groupId, options = {}) {
  return useQuery({
    queryKey: ["expenses", "group", groupId],
    queryFn: () => fetchGroupExpenses({ token, groupId }),
    enabled: !!token && !!groupId,
    ...options,
  });
}

export function useExpense(token, expenseId, options = {}) {
  return useQuery({
    queryKey: ["expenses", expenseId],
    queryFn: () => fetchExpenseById({ token, expenseId }),
    enabled: !!token && !!expenseId,
    ...options,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: (data) => {
      // Invalidate group expenses queries
      if (data && data.groupId) {
        queryClient.invalidateQueries({
          queryKey: ["expenses", "group", data.groupId],
        });
        // Also invalidate the group data to update balances
        queryClient.invalidateQueries({
          queryKey: ["groups", data.groupId],
        });
      }
      return data;
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExpense,
    onSuccess: (data, variables) => {
      // Invalidate specific expense query
      queryClient.invalidateQueries({
        queryKey: ["expenses", variables.expenseId],
      });

      // Invalidate group expenses if we have groupId
      if (data && data.groupId) {
        queryClient.invalidateQueries({
          queryKey: ["expenses", "group", data.groupId],
        });
        // Also invalidate the group data to update balances
        queryClient.invalidateQueries({
          queryKey: ["groups", data.groupId],
        });
      }
      return data;
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: (_, variables) => {
      // We need to get the expense data before deleting to know which group it belongs to
      const previousData = queryClient.getQueryData([
        "expenses",
        variables.expenseId,
      ]);

      // Remove specific expense query
      queryClient.removeQueries({
        queryKey: ["expenses", variables.expenseId],
      });

      // Invalidate group expenses if we have groupId
      if (previousData && previousData.groupId) {
        queryClient.invalidateQueries({
          queryKey: ["expenses", "group", previousData.groupId],
        });
        // Also invalidate the group data to update balances
        queryClient.invalidateQueries({
          queryKey: ["groups", previousData.groupId],
        });
      }
    },
  });
}
