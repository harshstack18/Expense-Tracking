"use client"

import { useState, useMemo } from "react"
import { Plus, DollarSign, TrendingUp, TrendingDown, Calendar, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
  description?: string
}

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Other",
]

const categoryColors: Record<string, string> = {
  "Food & Dining": "bg-red-100 text-red-800",
  Transportation: "bg-blue-100 text-blue-800",
  Shopping: "bg-purple-100 text-purple-800",
  Entertainment: "bg-pink-100 text-pink-800",
  "Bills & Utilities": "bg-orange-100 text-orange-800",
  Healthcare: "bg-green-100 text-green-800",
  Travel: "bg-cyan-100 text-cyan-800",
  Education: "bg-yellow-100 text-yellow-800",
  Other: "bg-gray-100 text-gray-800",
}

export default function ExpenseTracker() {
  const { toast } = useToast()

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      title: "Grocery Shopping",
      amount: 85.5,
      category: "Food & Dining",
      date: "2024-01-15",
      description: "Weekly groceries from supermarket",
    },
    {
      id: "2",
      title: "Gas Station",
      amount: 45.0,
      category: "Transportation",
      date: "2024-01-14",
      description: "Fuel for car",
    },
    {
      id: "3",
      title: "Netflix Subscription",
      amount: 15.99,
      category: "Entertainment",
      date: "2024-01-13",
      description: "Monthly streaming subscription",
    },
    {
      id: "4",
      title: "Coffee Shop",
      amount: 12.5,
      category: "Food & Dining",
      date: "2024-01-12",
      description: "Morning coffee and pastry",
    },
    {
      id: "5",
      title: "Electricity Bill",
      amount: 120.0,
      category: "Bills & Utilities",
      date: "2024-01-10",
      description: "Monthly electricity bill",
    },
    {
      id: "6",
      title: "Lunch at Restaurant",
      amount: 28.75,
      category: "Food & Dining",
      date: "2024-01-09",
      description: "Business lunch meeting",
    },
    {
      id: "7",
      title: "Uber Ride",
      amount: 18.5,
      category: "Transportation",
      date: "2024-01-08",
      description: "Ride to airport",
    },
    {
      id: "8",
      title: "Movie Tickets",
      amount: 24.0,
      category: "Entertainment",
      date: "2024-01-07",
      description: "Weekend movie with friends",
    },
    {
      id: "9",
      title: "Pharmacy",
      amount: 35.2,
      category: "Healthcare",
      date: "2024-01-06",
      description: "Prescription medication",
    },
    {
      id: "10",
      title: "Online Course",
      amount: 99.0,
      category: "Education",
      date: "2024-01-05",
      description: "Web development course",
    },
  ])

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")

  // Form state
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    description: "",
  })

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory
      const matchesMonth = selectedMonth === "all" || expense.date.startsWith(selectedMonth)

      return matchesSearch && matchesCategory && matchesMonth
    })
  }, [expenses, searchTerm, selectedCategory, selectedMonth])

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7)

  const thisMonthExpenses = expenses
    .filter((expense) => expense.date.startsWith(currentMonth))
    .reduce((sum, expense) => sum + expense.amount, 0)
  const lastMonthExpenses = expenses
    .filter((expense) => expense.date.startsWith(lastMonth))
    .reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyChange = thisMonthExpenses - lastMonthExpenses

  // Category breakdown
  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const handleAddExpense = () => {
    if (newExpense.title && newExpense.amount && newExpense.category && newExpense.date) {
      const expense: Expense = {
        id: Date.now().toString(),
        title: newExpense.title,
        amount: Number.parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
        description: newExpense.description,
      }

      setExpenses([expense, ...expenses])
      setNewExpense({ title: "", amount: "", category: "", date: "", description: "" })
      setIsAddExpenseOpen(false)

      toast({
        title: "Success",
        description: "Expense added successfully!",
      })
    }
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
    toast({
      title: "Success",
      description: "Expense deleted successfully!",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
            <p className="text-gray-600">Manage and track your expenses</p>
          </div>
          <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>Enter the details of your new expense below.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    placeholder="Enter expense title"
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newExpense.category}
                    onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="Enter expense description"
                  />
                </div>
                <Button onClick={handleAddExpense} className="w-full">
                  Add Expense
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time expenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${thisMonthExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Change</CardTitle>
              {monthlyChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${monthlyChange >= 0 ? "text-red-500" : "text-green-500"}`}>
                {monthlyChange >= 0 ? "+" : ""}${monthlyChange.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Your expense breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(categoryTotals)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={categoryColors[category] || categoryColors.Other}>{category}</Badge>
                    </div>
                    <span className="font-semibold">${amount.toFixed(2)}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>View and manage your expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full sm:w-48">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  <SelectItem value={currentMonth}>
                    {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </SelectItem>
                  <SelectItem value={lastMonth}>
                    {new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Expenses Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No expenses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{expense.title}</div>
                            {expense.description && (
                              <div className="text-sm text-muted-foreground">{expense.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={categoryColors[expense.category] || categoryColors.Other}>
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right font-medium">${expense.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteExpense(expense.id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
