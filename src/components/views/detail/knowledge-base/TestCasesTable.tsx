import { useState } from 'react';
import { TestCase } from '@/types/knowledgeBase.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, ExternalLink } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';

interface TestCasesTableProps {
  testCases: TestCase[];
  onChange: (testCases: TestCase[]) => void;
  readOnly?: boolean;
}

export const TestCasesTable = ({ testCases, onChange, readOnly = false }: TestCasesTableProps) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newTestCase, setNewTestCase] = useState<Partial<TestCase>>({
        priority: 'medium',
        status: 'not-run'
    });

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'passed': return 'default'; // Using default (black/primary) for passed as shadcn default usually
            case 'failed': return 'destructive';
            case 'pending': return 'secondary';
            default: return 'outline';
        }
    };
    
    // Custom color map for status badges
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'passed': return 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100';
            case 'failed': return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
            default: return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100';
        }
    };

    const handleAdd = () => {
        if (!newTestCase.description) return;

        const tc: TestCase = {
            id: `TC-${Math.floor(Math.random() * 10000)}`,
            description: newTestCase.description,
            priority: newTestCase.priority as any || 'medium',
            status: newTestCase.status as any || 'not-run'
        };

        onChange([...testCases, tc]);
        setNewTestCase({ priority: 'medium', status: 'not-run', description: '' });
        setIsAdding(false);
    };

    const handleDelete = (index: number) => {
        const newCases = [...testCases];
        newCases.splice(index, 1);
        onChange(newCases);
    };

    return (
        <div className="space-y-4">
             {!readOnly && !isAdding && (
                <div className="flex justify-end">
                    <Button size="sm" variant="outline" onClick={() => setIsAdding(true)} className="gap-2">
                        <Plus className="h-3.5 w-3.5" />
                        Add Test Case
                    </Button>
                </div>
            )}

            {isAdding && (
                <div className="p-4 border rounded-lg bg-slate-50 space-y-3 mb-4 animate-in fade-in zoom-in-95 duration-200">
                    <h4 className="text-sm font-medium">New Test Case</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                         <div className="md:col-span-2">
                            <Input 
                                placeholder="Test Description" 
                                value={newTestCase.description || ''}
                                onChange={(e) => setNewTestCase({...newTestCase, description: e.target.value})}
                            />
                         </div>
                         <Select 
                            value={newTestCase.priority} 
                            onValueChange={(v) => setNewTestCase({...newTestCase, priority: v as any})}
                         >
                            <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                         </Select>
                         <Select 
                            value={newTestCase.status} 
                            onValueChange={(v) => setNewTestCase({...newTestCase, status: v as any})}
                         >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="not-run">Not Run</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="passed">Passed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                         </Select>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                        <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                        <Button size="sm" onClick={handleAdd}>Save</Button>
                    </div>
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[100px]">Priority</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                            {!readOnly && <TableHead className="w-[50px]"></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {testCases.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={readOnly ? 4 : 5} className="text-center text-muted-foreground h-24">
                                    No test cases defined.
                                </TableCell>
                            </TableRow>
                        ) : (
                            testCases.map((tc, idx) => (
                                <TableRow key={tc.id}>
                                    <TableCell className="font-mono text-xs font-medium">{tc.id}</TableCell>
                                    <TableCell>{tc.description}</TableCell>
                                    <TableCell>
                                        <Badge variant={tc.priority === 'high' ? 'destructive' : 'secondary'} className="capitalize">
                                            {tc.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`capitalize border-transparent ${getStatusColor(tc.status)}`}>
                                            {tc.status}
                                        </Badge>
                                    </TableCell>
                                    {!readOnly && (
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-black/40 hover:text-red-600" onClick={() => handleDelete(idx)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
