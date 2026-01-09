import { useState } from 'react';
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from '@/components/ui/textarea';
import { Stakeholder } from '@/types/stakeholder.types';

interface StakeholderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Stakeholder, 'id' | 'addedDate'>) => void;
  initialData?: Stakeholder;
}

export const StakeholderModal = ({ open, onOpenChange, onSubmit, initialData }: StakeholderModalProps) => {
  const [formData, setFormData] = useState<Partial<Stakeholder>>(
      initialData || {
          name: '',
          email: '',
          role: 'Reviewer',
          department: 'Engineering',
          involvementLevel: 'reviewer',
          requiresApproval: false,
          notificationPreferences: { email: true, inApp: true },
          approvalStatus: 'not-required',
          addedBy: 'Current User' // Mock
      }
  );

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name || !formData.email) return;

      onSubmit(formData as any);
      onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Stakeholder' : 'Add New Stakeholder'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update stakeholder details and permissions.' : 'Add a user to this requirement to track their involvement.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                        id="name" 
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@company.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Role</Label>
                    <Select 
                        value={formData.role} 
                        onValueChange={(val) => setFormData({...formData, role: val})}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Product Manager">Product Manager</SelectItem>
                            <SelectItem value="Tech Lead">Tech Lead</SelectItem>
                            <SelectItem value="Senior Developer">Senior Developer</SelectItem>
                            <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                            <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Department</Label>
                    <Select 
                        value={formData.department} 
                        onValueChange={(val) => setFormData({...formData, department: val})}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select dept" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Product">Product</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="QA">Quality Assurance</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Involvement Level</Label>
                <Select 
                    value={formData.involvementLevel} 
                    onValueChange={(val: any) => setFormData({
                        ...formData, 
                        involvementLevel: val,
                        requiresApproval: val === 'approver' // Auto-toggle approval if approver
                    })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="owner">Owner (Accountable)</SelectItem>
                        <SelectItem value="approver">Approver</SelectItem>
                        <SelectItem value="reviewer">Reviewer</SelectItem>
                        <SelectItem value="informed">Informed</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground">
                    {formData.involvementLevel === 'owner' && "Has full edit rights and is accountable for delivery."}
                    {formData.involvementLevel === 'approver' && "Must explicitly approve this requirement before it can proceed."}
                    {formData.involvementLevel === 'reviewer' && "Expected to provide feedback but cannot block."}
                    {formData.involvementLevel === 'informed' && "Receives updates but has no active tasks."}
                </p>
            </div>

            <div className="flex items-center justify-between border p-3 rounded-lg bg-slate-50">
                <div className="space-y-0.5">
                    <Label className="text-sm">Formal Approval Required</Label>
                    <p className="text-xs text-muted-foreground">User must sign-off on stage gates.</p>
                </div>
                <Switch 
                    checked={formData.requiresApproval} 
                    onCheckedChange={(checked) => setFormData({...formData, requiresApproval: checked})} 
                />
            </div>

             <div className="flex items-center justify-between border p-3 rounded-lg bg-slate-50">
                <div className="space-y-0.5">
                    <Label className="text-sm">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive updates via email.</p>
                </div>
                <Switch 
                    checked={formData.notificationPreferences?.email} 
                    onCheckedChange={(checked) => setFormData({
                        ...formData, 
                        notificationPreferences: { ...formData.notificationPreferences!, email: checked }
                    })} 
                />
            </div>

        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{initialData ? 'Update Member' : 'Add Member'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
