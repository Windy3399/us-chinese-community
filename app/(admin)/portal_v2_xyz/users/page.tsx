"use client";

import { useEffect, useState } from "react";
import type { User } from "./types";
import UserTable from "./components/UserTable";
import SearchBar from "./components/SearchBar";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users);
        setTotal(data.data.total);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: { isBanned?: number; isUnlimited?: number }) => {
    try {
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...updates }),
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">用户管理</h1>
        <div className="text-sm text-gray-500">共 {total} 用户</div>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <UserTable
        users={filteredUsers}
        loading={loading}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  );
}