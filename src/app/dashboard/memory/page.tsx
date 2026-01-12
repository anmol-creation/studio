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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { memories } from '@/lib/data';
import { MoreHorizontal, Lock, Unlock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function MemoryPage() {
  return (
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
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Content</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {memories.map((memory) => (
                            <TableRow key={memory.id}>
                            <TableCell className="font-medium max-w-sm truncate">
                                {memory.content}
                            </TableCell>
                            <TableCell>{memory.projectName}</TableCell>
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
                                {formatDistanceToNow(new Date(memory.createdAt), { addSuffix: true })}
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
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>{memory.isLocked ? 'Unlock' : 'Lock'}</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            </TableRow>
                        ))}
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
  );
}
