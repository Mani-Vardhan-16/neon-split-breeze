import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Users, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JoinGroupModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinedGroup, setJoinedGroup] = useState<string | null>(null);
  const { toast } = useToast();

  const joinGroup = async () => {
    if (!inviteCode.trim()) {
      toast({
        title: "Invite code required",
        description: "Please enter a valid invite code",
        variant: "destructive"
      });
      return;
    }

    if (inviteCode.length < 6) {
      toast({
        title: "Invalid code",
        description: "Invite code must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setIsJoining(true);
    
    // Mock joining group
    setTimeout(() => {
      const mockGroups = ['Goa Trip 2024', 'Office Team', 'Weekend Hangout', 'Study Group'];
      const randomGroup = mockGroups[Math.floor(Math.random() * mockGroups.length)];
      
      setJoinedGroup(randomGroup);
      setIsJoining(false);
      
      toast({
        title: "Successfully joined group! 🎉",
        description: `Welcome to ${randomGroup}`,
      });
    }, 1500);
  };

  const handleClose = () => {
    setInviteCode('');
    setIsJoining(false);
    setJoinedGroup(null);
    onClose();
  };

  if (joinedGroup) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <Check className="w-5 h-5" />
              Successfully Joined!
            </DialogTitle>
            <DialogDescription>
              You're now part of the group
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-br from-success/10 to-accent/5 rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-success to-accent/80 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{joinedGroup}</h3>
              <p className="text-sm text-muted-foreground">
                You can now add expenses and view group balances
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                What you can do now:
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Add and split expenses
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  View group balances and debts
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  Settle up with group members
                </li>
              </ul>
            </div>

            <Button onClick={handleClose} className="w-full">
              View Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Join Group
          </DialogTitle>
          <DialogDescription>
            Enter the invite code shared by your friend
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="invite-code">Invite Code</Label>
            <Input
              id="invite-code"
              placeholder="Enter 6-8 character code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="input-focus text-center text-lg font-mono tracking-wider"
              maxLength={8}
            />
            <p className="text-xs text-muted-foreground">
              Ask your friend for the group invite code
            </p>
          </div>

          <div className="bg-muted/50 rounded-xl p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              How to get an invite code:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Ask a group member for the code</li>
              <li>• Check group chat or messages</li>
              <li>• Group admin can share from group settings</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={joinGroup} 
              className="flex-1" 
              disabled={isJoining || inviteCode.length < 6}
            >
              {isJoining ? 'Joining...' : 'Join Group'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupModal;