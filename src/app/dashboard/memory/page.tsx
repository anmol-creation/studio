'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUser } from '@/firebase/auth/use-user';
import { getFirestore, collection, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { MoreHorizontal, Lock, Unlock, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { Memory } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MemoryPage() {
  const { db } = useFirestore();
  const { user } = useUser();
  const [projectId, setProjectId] = useState('Personal_Life'); // Default or from context
  const [isMounted, setIsMounted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const memoriesQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, `memory_projects/${projectId}/phases/1/levels/1/entries`);
  }, [db, projectId]);

  const { data: memories, loading, error } = useCollection<Memory>(memoriesQuery);
  
  const getMemoryRef = (memoryId: string) => {
    if (!db) return null;
    return doc(db, `memory_projects/${projectId}/phases/1/levels/1/entries`, memoryId);
  }

  const handleDeleteMemory = async () => {
    if (!showDeleteConfirm) return;
    const memoryRef = getMemoryRef(showDeleteConfirm);
    if (!memoryRef) return;
    
    try {
      await deleteDoc(memoryRef);
      toast({
        title: "Memory Deleted",
        description: "The memory entry has been successfully deleted.",
      });
    } catch (e) {
        console.error("Error deleting memory:", e);
        toast({
            title: "Error",
            description: "Could not delete the memory entry.",
            variant: "destructive"
        });
    } finally {
        setShowDeleteConfirm(null);
    }
  };

  const handleUpdateMemory = async (memoryId: string, updates: Partial<Memory>) => {
    const memoryRef = getMemoryRef(memoryId);
    if (!memoryRef) return;

    try {
        await updateDoc(memoryRef, { ...updates, updated: new Date().toISOString() });
        toast({
            title: "Memory Updated",
            description: "The memory has been successfully updated."
        });
    } catch (e) {
        console.error("Error updating memory:", e);
        toast({
            title: "Update Error",
            description: "Could not update the memory.",
            variant: "destructive"
        });
    }
  }

  const handleSaveEdit = () => {
    if (!editingMemory) return;
    const { id, ...dataToSave } = editingMemory;
    // Don't save the id field inside the document
    const { id: docId, ...restData } = dataToSave;
    handleUpdateMemory(id, restData);
    setEditingMemory(null);
  }

  if (!isMounted) {
    return null;
  }
  
  if (!user) {
    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>You must be logged in to manage memories.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Please log in to continue.</p>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <>
      <div className="container mx-auto py-10">
        <Tabs defaultValue="memory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="phases">Phases</TabsTrigger>
            <TabsTrigger value="levels">Levels</TabsTrigger>
          </TabsList>
          <TabsContent value="memory" className="space-y-4">
              <Card>
                  <CardHeader>
                      <CardTitle>Memory Entries</CardTitle>
                      <CardDescription>View, edit, and manage what Ani AI is allowed to remember.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      {error && <p className="text-destructive">Error loading memories: {error.message}</p>}
                      <Table>
                          <TableHeader>
                          <TableRow>
                              <TableHead>Content</TableHead>
                              <TableHead>Project</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>AI Usage</TableHead>
                              <TableHead>Created</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                          </TableHeader>
                          <TableBody>
                          {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                          ) : memories && memories.length > 0 ? (
                              memories.map((memory) => (
                                  <TableRow key={memory.id}>
                                    <TableCell className="font-medium max-w-sm truncate">
                                        <div className="font-bold">{memory.title}</div>
                                        <div className="text-muted-foreground text-xs">{Array.isArray(memory.content) ? memory.content.join(' ') : memory.content}</div>
                                    </TableCell>
                                    <TableCell>{projectId}</TableCell>
                                    <TableCell>
                                      {memory.isLocked ? (
                                      <Badge variant="secondary" className="text-destructive-foreground bg-destructive hover:bg-destructive/80">
                                          <Lock className="mr-1 h-3 w-3" />
                                          Locked
                                      </Badge>
                                      ) : (
                                      <Badge variant="outline">
                                          <Unlock className="mr-1 h-3 w-3" />
                                          Unlocked
                                      </Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {memory.ownerApproved ? (
                                        <Badge>
                                          <CheckCircle className="mr-1 h-3 w-3" />
                                          Enabled
                                        </Badge>
                                      ) : (
                                        <Badge variant="secondary">
                                          <XCircle className="mr-1 h-3 w-3" />
                                          Disabled
                                        </Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                        {memory.created ? formatDistanceToNow(new Date(memory.created.seconds ? memory.created.toDate() : memory.created), { addSuffix: true }) : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setEditingMemory(memory)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleUpdateMemory(memory.id, { isLocked: !memory.isLocked })}>
                                                {memory.isLocked ? <><Unlock className="mr-2 h-4 w-4"/>Unlock</> : <><Lock className="mr-2 h-4 w-4"/>Lock</>}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleUpdateMemory(memory.id, { ownerApproved: !memory.ownerApproved })}>
                                                {memory.ownerApproved ? <><XCircle className="mr-2 h-4 w-4"/>Disable AI</> : <><CheckCircle className="mr-2 h-4 w-4"/>Enable AI</>}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => setShowDeleteConfirm(memory.id)}>
                                                <Trash2 className="mr-2 h-4 w-4"/>Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                  </TableRow>
                              ))
                          ) : (
                             <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">No memories found.</TableCell>
                             </TableRow>
                          )}
                          </TableBody>
                      </Table>
                  </CardContent>
              </Card>
          </TabsContent>
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Manage your projects here.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Project management UI will be here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={!!showDeleteConfirm} onOpenChange={(open) => !open && setShowDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the memory entry from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMemory} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!editingMemory} onOpenChange={(open) => !open && setEditingMemory(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Memory</DialogTitle>
            <DialogDescription>
              Make changes to your memory here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingMemory && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={editingMemory.title}
                  onChange={(e) => setEditingMemory({ ...editingMemory, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={Array.isArray(editingMemory.content) ? editingMemory.content.join('\n') : editingMemory.content}
                  onChange={(e) => setEditingMemory({ ...editingMemory, content: e.target.value.split('\n') })}
                  className="col-span-3 min-h-[100px]"
                />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="importance" className="text-right">
                  Importance
                </Label>
                 <Select
                    value={editingMemory.importance}
                    onValueChange={(value: 'Low' | 'Medium' | 'High') => setEditingMemory({ ...editingMemory, importance: value })}
                >
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select importance" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMemory(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
