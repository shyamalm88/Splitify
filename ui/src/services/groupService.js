import axios from "axios";
import { API_URL } from "../config/constants";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API request functions
const fetchGroups = async (token) => {
  const response = await axios.get(`${API_URL}/groups`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

const fetchGroupById = async ({ token, groupId }) => {
  const response = await axios.get(`${API_URL}/groups/${groupId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

const createGroup = async ({ token, groupData }) => {
  const response = await axios.post(`${API_URL}/groups`, groupData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
};

const updateGroup = async ({ token, groupId, groupData }) => {
  const response = await axios.put(`${API_URL}/groups/${groupId}`, groupData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
};

const deleteGroup = async ({ token, groupId }) => {
  const response = await axios.delete(`${API_URL}/groups/${groupId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// TanStack Query Hooks
export function useGroups(token, options = {}) {
  return useQuery({
    queryKey: ["groups"],
    queryFn: () => fetchGroups(token),
    enabled: !!token,
    ...options,
  });
}

export function useGroup(token, groupId, options = {}) {
  return useQuery({
    queryKey: ["groups", groupId],
    queryFn: () => fetchGroupById({ token, groupId }),
    enabled: !!token && !!groupId,
    ...options,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      return data;
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGroup,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({
        queryKey: ["groups", variables.groupId],
      });
      return data;
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.removeQueries({ queryKey: ["groups", variables.groupId] });
    },
  });
}
