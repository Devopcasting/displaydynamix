"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiBaseUrl } from "@/lib/config";
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Calendar,
    User,
    Loader2,
    FileText
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Template {
    id: number;
    name: string;
    description: string | null;
    elements: any[];
    created_by: number;
    created_at: string;
    updated_at: string | null;
    user?: {
        username: string;
    };
}

export default function TemplatesPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingTemplate, setLoadingTemplate] = useState<number | null>(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${apiBaseUrl}/templates/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTemplates(data);
            } else {
                throw new Error('Failed to fetch templates');
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load templates",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTemplate = async (templateId: number) => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${apiBaseUrl}/templates/${templateId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Template deleted successfully",
                });
                fetchTemplates();
            } else {
                throw new Error('Failed to delete template');
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete template",
            });
        }
    };

    const handleLoadTemplate = (template: Template) => {
        // Store template elements in localStorage for the dashboard to load
        // The elements are already serialized from the backend, so we can store them directly
        console.log('Loading template:', template);
        console.log('Template elements:', template.elements);

        setLoadingTemplate(template.id);

        localStorage.setItem('canvasPreviewElements', JSON.stringify(template.elements));
        localStorage.setItem('loadTemplate', JSON.stringify(template));

        // Use router.push for better navigation
        router.push('/dashboard');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <header className="flex items-center justify-between h-14 px-4 sm:px-6 border-b bg-background">
                <h1 className="text-lg font-semibold">Templates</h1>
                <Button onClick={() => window.location.href = '/dashboard'}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Template
                </Button>
            </header>
            <main className="flex-1 overflow-auto p-4 sm:p-6">
                <div className="max-w-6xl mx-auto">
                    {templates.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No templates yet</h3>
                            <p className="mt-2 text-muted-foreground">
                                Create your first template to get started.
                            </p>
                            <Button className="mt-4" onClick={() => window.location.href = '/dashboard'}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Template
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {templates.map((template) => (
                                <Card key={template.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg">{template.name}</CardTitle>
                                                <CardDescription className="mt-2">
                                                    {template.description || "No description"}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="secondary" className="ml-2">
                                                {template.elements.length} elements
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                Created {formatDate(template.created_at)}
                                            </div>
                                            {template.user && (
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <User className="mr-2 h-4 w-4" />
                                                    {template.user.username}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 pt-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleLoadTemplate(template)}
                                                    className="flex-1"
                                                    disabled={loadingTemplate === template.id}
                                                >
                                                    {loadingTemplate === template.id ? (
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Eye className="mr-2 h-4 w-4" />
                                                    )}
                                                    {loadingTemplate === template.id ? 'Loading...' : 'Load'}
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" variant="outline">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Template</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete "{template.name}"? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteTemplate(template.id)}
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
                    )}
                </div>
            </main>
        </div>
    );
} 