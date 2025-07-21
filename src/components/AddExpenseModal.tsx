import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Calculator, Users, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Member {
  id: string;
  name: string;
  email: string;
  balance: number;
}

const AddExpenseModal = ({ 
  isOpen, 
  onClose, 
  members 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  members: Member[];
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [customSplits, setCustomSplits] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  const categories = [
    { value: 'food', label: 'Food & Dining', icon: '🍽️' },
    { value: 'transport', label: 'Transportation', icon: '🚗' },
    { value: 'accommodation', label: 'Accommodation', icon: '🏨' },
    { value: 'activities', label: 'Activities', icon: '🎯' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'utilities', label: 'Utilities', icon: '⚡' },
    { value: 'other', label: 'Other', icon: '💰' }
  ];

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const calculateSplit = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || selectedMembers.length === 0) return {};
    
    if (splitType === 'equal') {
      const perPerson = amountNum / selectedMembers.length;
      return selectedMembers.reduce((acc, memberId) => {
        acc[memberId] = perPerson;
        return acc;
      }, {} as { [key: string]: number });
    }
    
    return customSplits;
  };

  const splits = calculateSplit();
  const totalSplit = Object.values(splits).reduce((sum, val) => sum + val, 0);
  const amountNum = parseFloat(amount) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter an expense title",
        variant: "destructive"
      });
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Amount required",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    if (!paidBy) {
      toast({
        title: "Payer required",
        description: "Please select who paid for this expense",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedMembers.length === 0) {
      toast({
        title: "Members required",
        description: "Please select members to split this expense with",
        variant: "destructive"
      });
      return;
    }

    if (splitType === 'custom' && Math.abs(totalSplit - amountNum) > 0.01) {
      toast({
        title: "Split doesn't match",
        description: "Custom split amounts must add up to the total expense",
        variant: "destructive"
      });
      return;
    }

    // Mock expense creation
    toast({
      title: "Expense added successfully! 🎉",
      description: `${title} for ₹${parseFloat(amount).toLocaleString()} has been split`,
    });
    
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setAmount('');
    setDescription('');
    setPaidBy('');
    setCategory('');
    setSelectedMembers([]);
    setSplitType('equal');
    setCustomSplits({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add New Expense
          </DialogTitle>
          <DialogDescription>
            Split a new expense with your group members
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Expense Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Dinner at restaurant"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-focus"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-focus"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any additional details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-focus resize-none"
              rows={2}
            />
          </div>

          {/* Category and Payer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="input-focus">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Paid by *</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger className="input-focus">
                  <SelectValue placeholder="Who paid?" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.name}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Member Selection */}
          <div className="space-y-3">
            <Label>Split between *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-3 rounded-xl border hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={member.id}
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={() => handleMemberToggle(member.id)}
                  />
                  <Label htmlFor={member.id} className="flex-1 cursor-pointer">
                    {member.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Split Type */}
          {selectedMembers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label>Split type:</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={splitType === 'equal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSplitType('equal')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Equal
                  </Button>
                  <Button
                    type="button"
                    variant={splitType === 'custom' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSplitType('custom')}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Custom
                  </Button>
                </div>
              </div>

              {/* Split Preview */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calculator className="w-4 h-4" />
                  Split Preview
                </div>
                
                {selectedMembers.map((memberId) => {
                  const member = members.find(m => m.id === memberId);
                  if (!member) return null;
                  
                  const splitAmount = splits[memberId] || 0;
                  
                  return (
                    <div key={memberId} className="flex items-center justify-between">
                      <span className="text-sm">{member.name}</span>
                      {splitType === 'custom' ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={customSplits[memberId] || ''}
                          onChange={(e) => setCustomSplits(prev => ({
                            ...prev,
                            [memberId]: parseFloat(e.target.value) || 0
                          }))}
                          className="w-24 h-8 text-right"
                          placeholder="0.00"
                        />
                      ) : (
                        <Badge variant="outline">
                          ₹{splitAmount.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                  );
                })}
                
                <div className="border-t pt-2 flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span className={totalSplit === amountNum ? 'text-success' : 'text-destructive'}>
                    ₹{totalSplit.toFixed(2)} / ₹{amountNum.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <CreditCard className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;