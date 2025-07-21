import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, X, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateGroupModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [isCreated, setIsCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const addMember = () => {
    if (newMember.trim() && !members.includes(newMember.trim())) {
      setMembers([...members, newMember.trim()]);
      setNewMember('');
    }
  };

  const removeMember = (member: string) => {
    setMembers(members.filter(m => m !== member));
  };

  const generateGroupCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const createGroup = () => {
    if (!groupName.trim()) {
      toast({
        title: "Group name required",
        description: "Please enter a group name",
        variant: "destructive"
      });
      return;
    }

    const code = generateGroupCode();
    setGroupCode(code);
    setIsCreated(true);
    
    toast({
      title: "Group created successfully! 🎉",
      description: `${groupName} is ready for expense splitting`,
    });
  };

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(groupCode);
      setCopied(true);
      toast({
        title: "Invite code copied!",
        description: "Share this code with your friends to join the group",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the code manually",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setGroupName('');
    setMembers([]);
    setNewMember('');
    setGroupCode('');
    setIsCreated(false);
    setCopied(false);
    onClose();
  };

  if (!isCreated) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Create New Group
            </DialogTitle>
            <DialogDescription>
              Start a new group to split expenses with friends
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                placeholder="e.g., Goa Trip 2024, Roommates"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="input-focus"
              />
            </div>

            <div className="space-y-3">
              <Label>Add Members (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addMember()}
                  className="input-focus"
                />
                <Button type="button" onClick={addMember} size="icon" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {members.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Members to invite:</p>
                  <div className="flex flex-wrap gap-2">
                    {members.map((member) => (
                      <Badge key={member} variant="secondary" className="flex items-center gap-1">
                        {member}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeMember(member)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={createGroup} className="flex-1">
                Create Group
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-success">
            <Check className="w-5 h-5" />
            Group Created Successfully!
          </DialogTitle>
          <DialogDescription>
            Share this invite code with your friends
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center p-6 bg-gradient-to-br from-success/10 to-accent/5 rounded-2xl">
            <h3 className="text-lg font-semibold mb-2">{groupName}</h3>
            <p className="text-sm text-muted-foreground mb-4">Invite Code</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <code className="text-2xl font-mono font-bold tracking-wider bg-muted px-4 py-2 rounded-xl">
                {groupCode}
              </code>
            </div>
            <Button 
              onClick={copyInviteCode} 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Friends can join by:
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Using the "Join Group" button
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                Entering the invite code: <code className="bg-muted px-2 py-1 rounded">{groupCode}</code>
              </li>
            </ul>
          </div>

          <Button onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;