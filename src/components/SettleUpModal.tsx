import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Smartphone, QrCode, Copy, Check, ArrowRight, Zap, Minimize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Balance {
  from: string;
  to: string;
  amount: number;
}

const SettleUpModal = ({ 
  isOpen, 
  onClose, 
  balances 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  balances: Balance[];
}) => {
  const [selectedPayment, setSelectedPayment] = useState<Balance | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOptimized, setShowOptimized] = useState(false);
  const { toast } = useToast();

  // Mock UPI ID
  const mockUpiId = "priya.singh@paytm";

  const optimizeTransactions = (balances: Balance[]): Balance[] => {
    // Simple optimization - reduce number of transactions
    const netBalances: { [person: string]: number } = {};
    
    // Calculate net balance for each person
    balances.forEach(balance => {
      netBalances[balance.from] = (netBalances[balance.from] || 0) - balance.amount;
      netBalances[balance.to] = (netBalances[balance.to] || 0) + balance.amount;
    });
    
    // Create optimized transactions
    const optimized: Balance[] = [];
    const creditors = Object.entries(netBalances).filter(([_, amount]) => amount > 0);
    const debtors = Object.entries(netBalances).filter(([_, amount]) => amount < 0);
    
    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
      const [creditor, creditAmount] = creditors[i];
      const [debtor, debtAmount] = debtors[j];
      
      const settleAmount = Math.min(creditAmount, Math.abs(debtAmount));
      
      optimized.push({
        from: debtor,
        to: creditor,
        amount: settleAmount
      });
      
      creditors[i][1] -= settleAmount;
      debtors[j][1] += settleAmount;
      
      if (creditors[i][1] === 0) i++;
      if (debtors[j][1] === 0) j++;
    }
    
    return optimized;
  };

  const optimizedBalances = optimizeTransactions(balances);

  const handlePayment = async () => {
    if (!selectedPayment) return;
    
    setIsProcessing(true);
    
    // Mock payment processing
    setTimeout(() => {
      toast({
        title: "Payment successful! 🎉",
        description: `₹${selectedPayment.amount.toLocaleString()} sent to ${selectedPayment.to}`,
      });
      setIsProcessing(false);
      setSelectedPayment(null);
      onClose();
    }, 2000);
  };

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(mockUpiId);
      toast({
        title: "UPI ID copied!",
        description: "Paste this in your payment app",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the UPI ID manually",
        variant: "destructive"
      });
    }
  };

  const PaymentInterface = ({ balance }: { balance: Balance }) => (
    <div className="space-y-6">
      <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Avatar>
            <AvatarFallback>
              {balance.from.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
          <Avatar>
            <AvatarFallback>
              {balance.to.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        <h3 className="text-lg font-semibold mb-2">
          Pay {balance.to}
        </h3>
        <div className="text-3xl font-bold text-primary">
          ₹{balance.amount.toLocaleString()}
        </div>
      </div>

      <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upi">UPI</TabsTrigger>
          <TabsTrigger value="card">Card</TabsTrigger>
          <TabsTrigger value="cash">Cash</TabsTrigger>
        </TabsList>

        <TabsContent value="upi" className="space-y-4">
          <Card className="glass-card">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="font-semibold">Pay via UPI</p>
                <p className="text-sm text-muted-foreground">Scan QR or use UPI ID</p>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-2">UPI ID</p>
                <div className="flex items-center justify-between bg-background rounded-lg p-3">
                  <code className="text-sm font-mono">{mockUpiId}</code>
                  <Button variant="ghost" size="sm" onClick={copyUpiId}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="card" className="space-y-4">
          <Card className="glass-card">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="font-semibold">Card Payment</p>
                <p className="text-sm text-muted-foreground">Credit or Debit Card</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Redirecting to secure payment gateway...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash" className="space-y-4">
          <Card className="glass-card">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="font-semibold">Cash Payment</p>
                <p className="text-sm text-muted-foreground">Mark as paid in cash</p>
              </div>
              <p className="text-sm text-muted-foreground">
                This will record the payment without processing any transaction
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setSelectedPayment(null)} className="flex-1">
          Back
        </Button>
        <Button onClick={handlePayment} disabled={isProcessing} className="flex-1">
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </Button>
      </div>
    </div>
  );

  if (selectedPayment) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Settle Payment
            </DialogTitle>
          </DialogHeader>
          <PaymentInterface balance={selectedPayment} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Settle Up
          </DialogTitle>
          <DialogDescription>
            Choose a debt to settle or view optimized transactions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Optimization Toggle */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Outstanding Balances</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOptimized(!showOptimized)}
            >
              <Minimize2 className="w-4 h-4 mr-2" />
              {showOptimized ? 'Show All' : 'Optimize'}
            </Button>
          </div>

          {showOptimized && (
            <div className="bg-gradient-to-r from-success/10 to-accent/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-success" />
                <span className="font-medium text-success">Optimized Transactions</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Reduced from {balances.length} to {optimizedBalances.length} transactions
              </p>
            </div>
          )}

          {/* Balances List */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {(showOptimized ? optimizedBalances : balances).map((balance, index) => (
              <Card key={index} className="glass-card hover-lift cursor-pointer transition-all" 
                    onClick={() => setSelectedPayment(balance)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {balance.from.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{balance.from}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {balance.to.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{balance.to}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive" className="text-lg font-bold">
                        ₹{balance.amount.toLocaleString()}
                      </Badge>
                      <Button size="sm">
                        Pay Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {balances.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-success/20 to-accent/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2">All settled up! 🎉</h3>
              <p className="text-muted-foreground">No outstanding balances in this group</p>
            </div>
          )}

          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettleUpModal;