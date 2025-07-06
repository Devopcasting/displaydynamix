"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";
import { Plus, Edit, Trash2, UserPlus, Shield, Eye, EyeOff } from "lucide-react";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    is_active: boolean;
    permissions: Record<string, any>;
    created_at: string;
    updated_at?: string;
}

interface CreateUserData {
    username: string;
    email: string;
    password: string;
    role: string;
    permissions: Record<string, boolean>;
}

const ROLES = [
    { value: "Admin", label: "Admin", description: "Full system access" },
    { value: "Editor", label: "Editor", description: "Content creation and editing" },
    { value: "Viewer", label: "Viewer", description: "Read-only access" },
    { value: "Client", label: "Client", description: "Limited access for clients" },
];

const PERMISSIONS = [
    { key: "can_create_content", label: "Create Content", description: "Can create new content" },
    { key: "can_edit_content", label: "Edit Content", description: "Can edit existing content" },
    { key: "can_publish_content", label: "Publish Content", description: "Can publish content to screens" },
    { key: "can_schedule_content", label: "Schedule Content", description: "Can schedule content" },
    { key: "can_manage_users", label: "Manage Users", description: "Can manage other users" },
    { key: "can_manage_screens", label: "Manage Screens", description: "Can manage display screens" },
    { key: "can_view_analytics", label: "View Analytics", description: "Can view analytics and reports" },
    { key: "can_manage_settings", label: "Manage Settings", description: "Can manage system settings" },
];

import { apiBaseUrl } from '@/lib/config';
const API_BASE_URL = apiBaseUrl;

export default function UserManagement() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [createUserData, setCreateUserData] = useState<CreateUserData>({
        username: "",
        email: "",
        password: "",
        role: "Viewer",
        permissions: {
            can_create_content: false,
            can_edit_content: false,
            can_publish_content: false,
            can_schedule_content: false,
            can_manage_users: false,
            can_manage_screens: false,
            can_view_analytics: false,
            can_manage_settings: false,
        },
    });
    const { toast } = useToast();

    const getAuthToken = () => localStorage.getItem("auth_token");

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Filter out the current user from the list
                const filteredUsers = currentUser ? data.filter((user: User) => user.id !== currentUser.id) : data;
                setUsers(filteredUsers);
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch users",
                });
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch users",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async () => {
        // Validate required fields
        if (!createUserData.username.trim() || !createUserData.email.trim() || !createUserData.password.trim()) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please fill in all required fields (username, email, password)",
            });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(createUserData.email)) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please enter a valid email address (e.g., user@example.com)",
            });
            return;
        }

        // Validate username (alphanumeric and underscores only)
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(createUserData.username)) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Username can only contain letters, numbers, and underscores",
            });
            return;
        }

        // Validate password length
        if (createUserData.password.length < 6) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Password must be at least 6 characters long",
            });
            return;
        }

        try {
            console.log("Sending user data:", createUserData); // Debug logging
            const response = await fetch(`${API_BASE_URL}/users/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createUserData),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "User created successfully",
                });
                setCreateDialogOpen(false);
                setCreateUserData({
                    username: "",
                    email: "",
                    password: "",
                    role: "Viewer",
                    permissions: {
                        can_create_content: false,
                        can_edit_content: false,
                        can_publish_content: false,
                        can_schedule_content: false,
                        can_manage_users: false,
                        can_manage_screens: false,
                        can_view_analytics: false,
                        can_manage_settings: false,
                    },
                });
                fetchUsers();
            } else {
                const errorData = await response.json();
                console.log("API Error Response:", errorData); // Debug logging

                let errorMessage = "Failed to create user";
                if (typeof errorData.detail === 'string') {
                    errorMessage = errorData.detail;
                } else if (Array.isArray(errorData.detail)) {
                    // Handle validation errors array
                    const validationErrors = errorData.detail.map((err: any) =>
                        `${err.loc?.join('.')}: ${err.msg}`
                    ).join(', ');
                    errorMessage = `Validation errors: ${validationErrors}`;
                } else if (errorData.detail?.message) {
                    errorMessage = errorData.detail.message;
                }

                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorMessage,
                });
            }
        } catch (error) {
            console.error("Error creating user:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to create user",
            });
        }
    };

    const handleUpdateUser = async (userId: number, userData: Partial<User>) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "User updated successfully",
                });
                setEditDialogOpen(false);
                setSelectedUser(null);
                fetchUsers();
            } else {
                const errorData = await response.json();
                const errorMessage = typeof errorData.detail === 'string'
                    ? errorData.detail
                    : errorData.detail?.message || "Failed to update user";
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorMessage,
                });
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update user",
            });
        }
    };

    const handleDeleteUser = async (userId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "User deleted successfully",
                });
                fetchUsers();
            } else {
                const errorData = await response.json();
                const errorMessage = typeof errorData.detail === 'string'
                    ? errorData.detail
                    : errorData.detail?.message || "Failed to delete user";
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorMessage,
                });
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete user",
            });
        }
    };

    const handleToggleUserStatus = async (userId: number, isActive: boolean) => {
        try {
            const endpoint = isActive ? 'activate' : 'deactivate';
            const response = await fetch(`${API_BASE_URL}/users/${userId}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
                });
                fetchUsers();
            } else {
                const errorData = await response.json();
                const errorMessage = typeof errorData.detail === 'string'
                    ? errorData.detail
                    : errorData.detail?.message || "Failed to update user status";
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorMessage,
                });
            }
        } catch (error) {
            console.error("Error updating user status:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update user status",
            });
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "Admin": return "bg-red-100 text-red-800";
            case "Editor": return "bg-blue-100 text-blue-800";
            case "Viewer": return "bg-green-100 text-green-800";
            case "Client": return "bg-purple-100 text-purple-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">User Management</h2>
                    <p className="text-muted-foreground">
                        Manage users, roles, and permissions
                        {currentUser && (
                            <span className="block text-xs text-blue-600 mt-1">
                                Note: You ({currentUser.username}) are not shown in this list
                            </span>
                        )}
                    </p>
                </div>
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                            <DialogDescription>
                                Add a new user to the system with specific roles and permissions.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={createUserData.username}
                                        onChange={(e) => setCreateUserData({ ...createUserData, username: e.target.value })}
                                        placeholder="Enter username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={createUserData.email}
                                        onChange={(e) => setCreateUserData({ ...createUserData, email: e.target.value })}
                                        placeholder="Enter email"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={createUserData.password}
                                    onChange={(e) => setCreateUserData({ ...createUserData, password: e.target.value })}
                                    placeholder="Enter password"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={createUserData.role}
                                    onValueChange={(value) => setCreateUserData({ ...createUserData, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLES.map((role) => (
                                            <SelectItem key={role.value} value={role.value}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{role.label}</span>
                                                    <span className="text-xs text-muted-foreground">{role.description}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Permissions</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {PERMISSIONS.map((permission) => (
                                        <div key={permission.key} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={permission.key}
                                                checked={createUserData.permissions[permission.key] || false}
                                                onCheckedChange={(checked) =>
                                                    setCreateUserData({
                                                        ...createUserData,
                                                        permissions: {
                                                            ...createUserData.permissions,
                                                            [permission.key]: checked,
                                                        },
                                                    })
                                                }
                                            />
                                            <Label htmlFor={permission.key} className="text-sm">
                                                {permission.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateUser}>Create User</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {users.map((user) => (
                    <Card key={user.id}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Shield className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h3 className="font-semibold">{user.username}</h3>
                                            <Badge className={getRoleColor(user.role)}>
                                                {user.role}
                                            </Badge>
                                            {user.is_active ? (
                                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                                    <EyeOff className="h-3 w-3 mr-1" />
                                                    Inactive
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Created: {new Date(user.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setEditDialogOpen(true);
                                        }}
                                        disabled={!!(currentUser && user.id === currentUser.id)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleUserStatus(user.id, !user.is_active)}
                                        disabled={!!(currentUser && user.id === currentUser.id)}
                                    >
                                        {user.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={!!(currentUser && user.id === currentUser.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete {user.username}? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit User Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user information, role, and permissions.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-username">Username</Label>
                                    <Input
                                        id="edit-username"
                                        value={selectedUser.username}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={selectedUser.email}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-role">Role</Label>
                                <Select
                                    value={selectedUser.role}
                                    onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLES.map((role) => (
                                            <SelectItem key={role.value} value={role.value}>
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (selectedUser) {
                                    handleUpdateUser(selectedUser.id, {
                                        username: selectedUser.username,
                                        email: selectedUser.email,
                                        role: selectedUser.role,
                                    });
                                }
                            }}
                        >
                            Update User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 