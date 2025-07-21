import { useState } from 'react';
import AuthPage from '@/components/AuthPage';
import Dashboard from '@/components/Dashboard';
import GroupPage from '@/components/GroupPage';

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

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const handleAuth = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedGroup(null);
  };

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
  };

  const handleBackToDashboard = () => {
    setSelectedGroup(null);
  };

  // Show authentication page if user is not logged in
  if (!user) {
    return <AuthPage onAuth={handleAuth} />;
  }

  // Show group page if a group is selected
  if (selectedGroup) {
    return (
      <GroupPage 
        group={selectedGroup} 
        onBack={handleBackToDashboard} 
      />
    );
  }

  // Show dashboard as the main page
  return (
    <Dashboard 
      user={user} 
      onLogout={handleLogout}
      onGroupSelect={handleGroupSelect}
    />
  );
};

export default Index;
