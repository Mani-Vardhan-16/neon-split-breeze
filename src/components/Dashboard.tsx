import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Users, DollarSign, TrendingUp, Settings, LogOut, UserPlus, Copy } from 'lucide-react';
import CreateGroupModal from './CreateGroupModal';
import JoinGroupModal from './JoinGroupModal';

interface User {
  name: string;
  email: string;
  id: string;
}

interface Group {
  id: string;
  name: string;
  totalSpent: number;
  members: number;
  yourBalance: number;
  lastActivity: string;
  color: string;
}

const Dashboard = ({ user, onLogout, onGroupSelect }: { 
  user: User; 
  onLogout: () => void;
  onGroupSelect: (group: Group) => void;
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Mock data
  const groups: Group[] = [
    {
      id: '1',
      name: 'Goa Trip 2024',
      totalSpent: 45600,
      members: 6,
      yourBalance: -2300,
      lastActivity: '2 hours ago',
      color: 'bg-gradient-to-br from-blue-500 to-purple-600'
    },
    {
      id: '2', 
      name: 'Roommates',
      totalSpent: 12400,
      members: 3,
      yourBalance: 800,
      lastActivity: '1 day ago',
      color: 'bg-gradient-to-br from-green-500 to-teal-600'
    },
    {
      id: '3',
      name: 'Office Lunch',
      totalSpent: 8900,
      members: 8,
      yourBalance: -150,
      lastActivity: '3 days ago',
      color: 'bg-gradient-to-br from-orange-500 to-red-600'
    }
  ];

  const totalBalance = groups.reduce((sum, group) => sum + group.yourBalance, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold">SplitEase</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your expenses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{groups.length}</div>
              <p className="text-xs text-muted-foreground">Active groups</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Balance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
                ₹{Math.abs(totalBalance).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalBalance >= 0 ? 'You are owed' : 'You owe'}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{groups.reduce((sum, group) => sum + group.totalSpent, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Across all groups</p>
            </CardContent>
          </Card>
        </div>

        {/* Groups Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Groups</h2>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowJoinModal(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Join Group
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {groups.map((group, index) => (
            <Card 
              key={group.id} 
              className="glass-card hover-lift cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              onClick={() => onGroupSelect(group)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Users className="w-3 h-3" />
                      {group.members} members
                    </CardDescription>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${group.color} flex items-center justify-center`}>
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total spent</span>
                    <span className="font-semibold">₹{group.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Your balance</span>
                    <Badge variant={group.yourBalance >= 0 ? "default" : "destructive"} className="font-semibold">
                      {group.yourBalance >= 0 ? '+' : ''}₹{group.yourBalance.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Last activity: {group.lastActivity}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {groups.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Users className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No groups yet</h3>
            <p className="text-muted-foreground mb-6">Create your first group to start splitting expenses with friends</p>
            <Button onClick={() => setShowCreateModal(true)} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Group
            </Button>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <Button 
        variant="floating" 
        size="fab"
        className="fixed bottom-6 right-6 shadow-2xl animate-glow-pulse"
        onClick={() => setShowCreateModal(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Modals */}
      <CreateGroupModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
      <JoinGroupModal 
        isOpen={showJoinModal} 
        onClose={() => setShowJoinModal(false)} 
      />
    </div>
  );
};

export default Dashboard;