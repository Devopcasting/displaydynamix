"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { suggestRelevantAssets, SuggestAssetsOutput } from "@/ai/flows/suggest-assets";
import { Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  templateContent: z.string().min(10, "Please describe the template content in at least 10 characters."),
  assetType: z.enum(["image", "video"]),
});

export default function AiAssetSuggestions() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestAssetsOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateContent: "A corporate presentation about quarterly earnings, with a positive and professional tone.",
      assetType: "image",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      const result = await suggestRelevantAssets({
        ...values,
        numSuggestions: 4,
      });
      setSuggestions(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        // Reset state on close
        form.reset();
        setSuggestions(null);
        setError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 text-accent" />
          Suggest Assets
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>AI-Powered Asset Suggestions</DialogTitle>
          <DialogDescription>
            Describe your template and let AI suggest relevant images or videos.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="templateContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Context</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A promotion for a summer sale at a coffee shop."
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assetType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an asset type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Get Suggestions
                </Button>
              </form>
            </Form>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Results</h3>
            <div className="bg-muted/50 rounded-lg p-4 min-h-[260px] flex items-center justify-center">
              {loading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
              {error && <p className="text-destructive text-sm">{error}</p>}
              {!loading && !error && !suggestions && <p className="text-muted-foreground text-sm">Suggestions will appear here.</p>}
              {suggestions && (
                <div className="grid grid-cols-2 gap-4 w-full">
                  {suggestions.suggestions.map((s, i) => (
                    <Card key={i} className="group">
                        <div className="aspect-video relative bg-muted rounded-t-md overflow-hidden">
                            <Image src="https://placehold.co/400x225.png" alt={s.description} layout="fill" objectFit="cover" data-ai-hint="abstract tech" />
                        </div>
                        <p className="text-xs p-2 text-muted-foreground truncate">{s.description}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
