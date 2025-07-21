import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Plus, Users, DollarSign, Calendar, User, Share2, MoreVertical, CreditCard } from 'lucide-react';
import AddExpenseModal from './AddExpenseModal';
import SettleUpModal from './SettleUpModal';

interface Group {
  id: string;
  name: string;
  totalSpent: number;
  members: number;
  yourBalance: number;
  lastActivity: string;
  color: string;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  date: string;
  category: string;
  splitBetween: string[];
  description?: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  balance: number;
}

const GroupPage = ({ group, onBack }: { group: Group; onBack: () => void }) => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showSettleUp, setShowSettleUp] = useState(false);

  // Mock data
  const members: Member[] = [
    { id: '1', name: 'Alex Chen', email: 'alex@example.com', balance: -2300 },
    { id: '2', name: 'Priya Singh', email: 'priya@example.com', balance: 1200 },
    { id: '3', name: 'David Kim', email: 'david@example.com', balance: 800 },
    { id: '4', name: 'Sarah Johnson', email: 'sarah@example.com', balance: -500 },
    { id: '5', name: 'Rahul Sharma', email: 'rahul@example.com', balance: 300 },
    { id: '6', name: 'Emma Wilson', email: 'emma@example.com', balance: 500 }
  ];

  const expenses: Expense[] = [
    {
      id: '1',
      title: 'Beach Resort Stay',
      amount: 18000,
      paidBy: 'Priya Singh',
      date: '2024-01-15',
      category: 'Accommodation',
      splitBetween: ['Alex Chen', 'Priya Singh', 'David Kim', 'Sarah Johnson', 'Rahul Sharma', 'Emma Wilson']
    },
    {
      id: '2',
      title: 'Dinner at Seaside Cafe',
      amount: 4500,
      paidBy: 'David Kim',
      date: '2024-01-15',
      category: 'Food & Dining',
      splitBetween: ['Alex Chen', 'David Kim', 'Sarah Johnson', 'Emma Wilson']
    },
    {
      id: '3',
      title: 'Scuba Diving Experience',
      amount: 9600,
      paidBy: 'Alex Chen',
      date: '2024-01-14',
      category: 'Activities',
      splitBetween: ['Alex Chen', 'Priya Singh', 'Rahul Sharma', 'Emma Wilson']
    },
    {
      id: '4',
      title: 'Taxi from Airport',
      amount: 800,
      paidBy: 'Sarah Johnson',
      date: '2024-01-13',
      category: 'Transportation',
      splitBetween: ['Alex Chen', 'Sarah Johnson', 'David Kim']
    }
  ];

  const balances = [
    { from: 'Alex Chen', to: 'Priya Singh', amount: 1200 },
    { from: 'Alex Chen', to: 'David Kim', amount: 800 },
    { from: 'Sarah Johnson', to: 'Emma Wilson', amount: 300 },
    { from: 'Alex Chen', to: 'Rahul Sharma', amount: 300 }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Dining': return '🍽️';
      case 'Transportation': return '🚗';
      case 'Accommodation': return '🏨';
      case 'Activities': return '🎯';
      default: return '💰';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${group.color} flex items-center justify-center`}>
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">{group.name}</h1>
                  <p className="text-sm text-muted-foreground">{group.members} members</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Invite
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{group.totalSpent.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Across {expenses.length} expenses</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${group.yourBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
                {group.yourBalance >= 0 ? '+' : ''}₹{group.yourBalance.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                {group.yourBalance >= 0 ? 'You are owed' : 'You owe'}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={() => setShowAddExpense(true)} className="w-full" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
              <Button onClick={() => setShowSettleUp(true)} variant="outline" className="w-full" size="sm">
                <CreditCard className="w-4 h-4 mr-2" />
                Settle Up
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="expenses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 glass-card">
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="balances">Balances</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Expenses</h2>
              <Button onClick={() => setShowAddExpense(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </div>

            <div className="space-y-4">
              {expenses.map((expense) => (
                <Card key={expense.id} className="glass-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">{getCategoryIcon(expense.category)}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{expense.title}</h3>
                          <p className="text-muted-foreground text-sm">
                            Paid by {expense.paidBy} • {formatDate(expense.date)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{expense.category}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Split {expense.splitBetween.length} ways
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">₹{expense.amount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          ₹{Math.round(expense.amount / expense.splitBetween.length)} per person
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="balances" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Group Balances</h2>
              <Button onClick={() => setShowSettleUp(true)} variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Settle Up
              </Button>
            </div>

            <div className="grid gap-4">
              {balances.map((balance, index) => (
                <Card key={index} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {balance.from.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{balance.from}</span>
                        <span className="text-muted-foreground">owes</span>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {balance.to.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{balance.to}</span>
                      </div>
                      <Badge variant="destructive" className="text-lg font-bold">
                        ₹{balance.amount.toLocaleString()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Group Members</h2>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>

            <div className="grid gap-4">
              {members.map((member) => (
                <Card key={member.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={member.balance >= 0 ? "default" : "destructive"}
                        className="text-lg font-bold"
                      >
                        {member.balance >= 0 ? '+' : ''}₹{member.balance.toLocaleString()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <Button 
        variant="floating" 
        size="fab"
        className="fixed bottom-6 right-6 shadow-2xl animate-glow-pulse"
        onClick={() => setShowAddExpense(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Modals */}
      <AddExpenseModal 
        isOpen={showAddExpense} 
        onClose={() => setShowAddExpense(false)}
        members={members}
      />
      <SettleUpModal 
        isOpen={showSettleUp} 
        onClose={() => setShowSettleUp(false)}
        balances={balances}
      />
    </div>
  );
};

export default GroupPage;